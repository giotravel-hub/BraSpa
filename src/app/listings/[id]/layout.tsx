import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { images: { take: 1 } },
  });

  if (!listing) {
    return { title: "Listing Not Found" };
  }

  const title = `${listing.title} — Size ${listing.size}`;
  const description = listing.description.slice(0, 155);
  const image = listing.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://braspa.org/listings/${listing.id}`,
      ...(image && { images: [{ url: image, width: 800, height: 800 }] }),
    },
  };
}

export default function ListingLayout({ children }: Props) {
  return <>{children}</>;
}
