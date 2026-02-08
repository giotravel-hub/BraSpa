import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;
  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.isAdmin === true;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const zipCodes = await prisma.allowedZipCode.findMany({
    orderBy: { zipCode: "asc" },
  });

  return NextResponse.json(zipCodes);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { zipCode } = await req.json();

  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    return NextResponse.json(
      { error: "Invalid zip code. Must be 5 digits." },
      { status: 400 }
    );
  }

  const existing = await prisma.allowedZipCode.findUnique({
    where: { zipCode },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Zip code already exists" },
      { status: 400 }
    );
  }

  const created = await prisma.allowedZipCode.create({
    data: { zipCode },
  });

  return NextResponse.json(created);
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const zipCode = searchParams.get("zipCode");

  if (!zipCode) {
    return NextResponse.json({ error: "Zip code required" }, { status: 400 });
  }

  await prisma.allowedZipCode.delete({
    where: { zipCode },
  });

  return NextResponse.json({ message: "Deleted" });
}
