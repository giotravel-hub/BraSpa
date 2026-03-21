import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Verify your BraSpa account",
    html: `
      <h2>Welcome to BraSpa!</h2>
      <p>Click the link below to verify your email address:</p>
      <p><a href="${verifyUrl}">Verify my email</a></p>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
  });
}

export async function sendNewListingNotification(listing: {
  id: string;
  title: string;
  category: string;
  size: string;
  condition: string;
  userName: string;
}) {
  const listingUrl = `${APP_URL}/listings/${listing.id}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: "braspaadmin@gmail.com",
    subject: `New listing: ${listing.title}`,
    html: `
      <h2>New Listing Posted</h2>
      <p><strong>${listing.userName}</strong> just posted a new listing:</p>
      <ul>
        <li><strong>Title:</strong> ${listing.title}</li>
        <li><strong>Category:</strong> ${listing.category}</li>
        <li><strong>Size:</strong> ${listing.size}</li>
        <li><strong>Condition:</strong> ${listing.condition}</li>
      </ul>
      <p><a href="${listingUrl}">View listing</a></p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your BraSpa password",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">Reset my password</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });
}
