import Link from "next/link";
import Image from "next/image";

interface ListingCardProps {
  id: string;
  title: string;
  brand?: string;
  size: string;
  condition: string;
  category: string;
  images: { url: string }[];
  user: { name: string };
}

export default function ListingCard({
  id,
  title,
  brand,
  size,
  condition,
  category,
  images,
  user,
}: ListingCardProps) {
  return (
    <Link href={`/listings/${id}`} className="block group">
      <div className="bg-white rounded-xl border border-linen-200 overflow-hidden hover:shadow-md transition-all duration-200">
        <div className="aspect-square relative bg-linen-100">
          {images.length > 0 ? (
            <Image
              src={images[0].url}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-linen-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-stone-800 truncate">{title}</h3>
          <p className="text-sm text-plum-600 mt-1">{category}{brand ? ` · ${brand}` : ""}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-plum-50 text-plum-700 px-2.5 py-1 rounded-full">
              {size}
            </span>
            <span className="text-xs bg-linen-100 text-stone-600 px-2.5 py-1 rounded-full">
              {condition}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-3">Posted by {user.name.split(" ")[0]}</p>
        </div>
      </div>
    </Link>
  );
}
