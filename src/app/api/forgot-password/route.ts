import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { generateToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { success } = rateLimit(`forgot:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { email } = await req.json();
    const trimmedEmail = String(email || "").trim().toLowerCase();

    // Always return success to prevent email enumeration
    const genericResponse = NextResponse.json({
      message: "If an account with that email exists, we sent a password reset link.",
    });

    if (!trimmedEmail) return genericResponse;

    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (!user) return genericResponse;

    // Invalidate any existing unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = generateToken();
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail(trimmedEmail, token);

    return genericResponse;
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
