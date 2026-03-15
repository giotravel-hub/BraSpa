import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ip = getClientIp(req);
  const { success } = rateLimit(`interest:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "You must be logged in to express interest" }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const interestedUser = session.user as { id: string; name?: string; email?: string };

  if (listing.userId === interestedUser.id) {
    return NextResponse.json({ error: "This is your own listing" }, { status: 400 });
  }

  const ownerFirstName = listing.user.name.split(" ")[0];
  const interestedFirstName = (interestedUser.name || "Someone").split(" ")[0];

  const FROM = "BraSpa <notifications@braspa.org>";

  // Email to the listing owner
  const { error: ownerEmailError } = await resend.emails.send({
    from: FROM,
    to: listing.user.email,
    subject: `Someone is interested in your listing "${listing.title}"`,
    html: `
      <p>Hi ${ownerFirstName},</p>
      <p><strong>${interestedFirstName}</strong> is interested in your listing "<strong>${listing.title}</strong>" on BraSpa.</p>
      <p>You can reach them at <a href="mailto:${interestedUser.email}">${interestedUser.email}</a> to coordinate.</p>
      <br/>
      <p style="color: #666; font-size: 14px;">— BraSpa</p>
    `,
  });

  if (ownerEmailError) {
    console.error("Failed to send interest email to owner:", ownerEmailError);
    return NextResponse.json(
      { error: "Failed to send notification. Please try again." },
      { status: 500 }
    );
  }

  // Confirmation email to the interested user
  if (interestedUser.email) {
    const { error: confirmEmailError } = await resend.emails.send({
      from: FROM,
      to: interestedUser.email,
      subject: `You expressed interest in "${listing.title}"`,
      html: `
        <p>Hi ${interestedFirstName},</p>
        <p>We've let ${ownerFirstName} know you're interested in "<strong>${listing.title}</strong>."</p>
        <p>They'll reach out to you at this email address if they'd like to connect.</p>
        <br/>
        <p style="color: #666; font-size: 14px;">— BraSpa</p>
      `,
    });

    if (confirmEmailError) {
      console.error("Failed to send confirmation email to interested user:", confirmEmailError);
      // Non-fatal — owner was already notified
    }
  }

  return NextResponse.json({
    message: `Your interest has been sent to ${ownerFirstName}. They'll reach out to you at your registered email.`,
  });
}
