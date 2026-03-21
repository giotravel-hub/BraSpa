import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendNewListingNotification } from "@/lib/email";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const size = searchParams.get("size") || "";
  const condition = searchParams.get("condition") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const skip = (page - 1) * limit;

  const allowedZips = await prisma.allowedZipCode.findMany();
  const allowedZipCodes = allowedZips.map((z) => z.zipCode);

  const userId = searchParams.get("userId") || "";

  const where = {
    zipCode: { in: allowedZipCodes },
    ...(userId && { userId }),
    ...(query && {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    }),
    ...(category && { category }),
    ...(size && { size }),
    ...(condition && { condition }),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { images: true, user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(req);
  const { success } = rateLimit(`listings:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { title, description, brand, size, condition, category, imageUrls } =
      await req.json();

    if (!title || !description || !size || !condition || !category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const trimmedTitle = String(title).trim().slice(0, 150);
    const trimmedDesc = String(description).trim().slice(0, 2000);
    const trimmedSize = String(size).trim().slice(0, 20);
    const trimmedCondition = String(condition).trim().slice(0, 20);
    const trimmedBrand = String(brand || "").trim().slice(0, 100);
    const trimmedCategory = String(category).trim().slice(0, 50);

    if (trimmedTitle.length < 3) {
      return NextResponse.json({ error: "Title must be at least 3 characters" }, { status: 400 });
    }

    if (trimmedDesc.length < 10) {
      return NextResponse.json({ error: "Description must be at least 10 characters" }, { status: 400 });
    }

    if (imageUrls && (!Array.isArray(imageUrls) || imageUrls.length > 3)) {
      return NextResponse.json({ error: "Maximum 3 images allowed" }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const listing = await prisma.listing.create({
      data: {
        title: trimmedTitle,
        description: trimmedDesc,
        brand: trimmedBrand,
        size: trimmedSize,
        condition: trimmedCondition,
        category: trimmedCategory,
        zipCode: user.zipCode,
        userId,
        images: {
          create: (imageUrls || []).map((url: string) => ({ url: String(url).slice(0, 500) })),
        },
      },
      include: { images: true },
    });

    sendNewListingNotification({
      id: listing.id,
      title: listing.title,
      category: listing.category,
      size: listing.size,
      condition: listing.condition,
      userName: user.name || "Unknown",
    }).catch((err) => console.error("Failed to send new listing notification:", err));

    return NextResponse.json(listing);
  } catch (err) {
    console.error("Failed to create listing:", err);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
