import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { isPasswordValid } from "@/lib/password-validation";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { success } = rateLimit(`signup:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { name, email, password, zipCode } = await req.json();

    if (!name || !email || !password || !zipCode) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const trimmedName = String(name).trim().slice(0, 100);
    const trimmedEmail = String(email).trim().toLowerCase().slice(0, 200);
    const trimmedZip = String(zipCode).trim();

    if (trimmedName.length < 1) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (String(password).length > 128) {
      return NextResponse.json({ error: "Password is too long" }, { status: 400 });
    }

    if (!isPasswordValid(String(password))) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters with uppercase, lowercase, and a number" },
        { status: 400 }
      );
    }

    if (!/^\d{5}$/.test(trimmedZip)) {
      return NextResponse.json({ error: "Invalid zip code format" }, { status: 400 });
    }

    const allowed = await prisma.allowedZipCode.findUnique({
      where: { zipCode: trimmedZip },
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Your zip code is not in our service area" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 12);
    await prisma.user.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        passwordHash,
        zipCode: trimmedZip,
        emailVerified: true,
      },
    });

    return NextResponse.json({ message: "Account created successfully" });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
