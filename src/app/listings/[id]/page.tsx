"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  brand: string;
  size: string;
  condition: string;
  category: string;
  zipCode: string;
  createdAt: string;
  images: { id: string; url: string }[];
  user: { id: string; name: string; email: string };
}

export default function ListingDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [interestStatus, setInterestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [interestMessage, setInterestMessage] = useState("");

  useEffect(() => {
    fetch(`/api/listings/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load listing");
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.id]);

  const handleExpressInterest = async () => {
    setInterestStatus("loading");
    try {
      const res = await fetch(`/api/listings/${params.id}/interest`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setInterestStatus("success");
        setInterestMessage(data.message);
      } else {
        setInterestStatus("error");
        setInterestMessage(data.error || "Something went wrong.");
      }
    } catch {
      setInterestStatus("error");
      setInterestMessage("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-stone-400">
        Loading...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl text-stone-700">
          {error ? "Something went wrong" : "Listing not found"}
        </h1>
        <p className="text-stone-500 mt-2">
          {error ? "We couldn't load this listing. It may not exist or there was a server error." : ""}
        </p>
        <Link href="/listings" className="text-plum-700 hover:text-plum-800 underline underline-offset-2 mt-4 inline-block">
          Back to listings
        </Link>
      </div>
    );
  }

  const currentUserId = (session?.user as { id?: string } | undefined)?.id;
  const isOwnListing = currentUserId === listing.user.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/listings" className="text-plum-700 hover:text-plum-800 text-sm mb-6 inline-flex items-center gap-1 underline-offset-2 hover:underline">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </Link>

      <div className="bg-white rounded-xl border border-linen-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div>
            {listing.images.length > 0 ? (
              <div>
                <div className="aspect-square relative bg-linen-100">
                  <Image
                    src={listing.images[selectedImage].url}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {listing.images.length > 1 && (
                  <div className="flex gap-2 p-3 bg-linen-50">
                    {listing.images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(i)}
                        className={`w-16 h-16 relative rounded-lg overflow-hidden border-2 transition-colors ${
                          i === selectedImage ? "border-plum-500" : "border-transparent hover:border-linen-300"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={`${listing.title} ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-linen-100 flex items-center justify-center text-linen-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div className="p-8">
            <h1 className="text-2xl font-[var(--font-lora)] font-semibold text-stone-900 mb-2">
              {listing.title}
            </h1>
            <p className="text-plum-600 font-medium mb-1">{listing.category}</p>
            {listing.brand && (
              <p className="text-stone-500 text-sm mb-4">{listing.brand}</p>
            )}

            <div className="flex gap-2 mb-5">
              <span className="bg-plum-50 text-plum-700 px-3 py-1 rounded-full text-sm">
                Size: {listing.size}
              </span>
              <span className="bg-linen-100 text-stone-600 px-3 py-1 rounded-full text-sm">
                {listing.condition}
              </span>
            </div>

            <p className="text-stone-600 mb-8 whitespace-pre-wrap leading-relaxed">
              {listing.description}
            </p>

            <div className="border-t border-linen-200 pt-5">
              <p className="text-stone-800 font-medium mb-1">
                {listing.user.name.split(" ")[0]}
              </p>
              <p className="text-xs text-stone-400 mb-4">
                Posted{" "}
                {new Date(listing.createdAt).toLocaleDateString()}
              </p>

              {!session ? (
                <Link
                  href="/login"
                  className="text-plum-700 hover:text-plum-800 underline underline-offset-2 text-sm"
                >
                  Log in to express interest
                </Link>
              ) : isOwnListing ? (
                <p className="text-stone-400 text-sm italic">This is your listing</p>
              ) : interestStatus === "success" ? (
                <p className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                  {interestMessage}
                </p>
              ) : (
                <div>
                  <button
                    onClick={handleExpressInterest}
                    disabled={interestStatus === "loading"}
                    className="px-5 py-2.5 bg-plum-700 text-white rounded-lg hover:bg-plum-800 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {interestStatus === "loading" ? "Sending..." : "I'm Interested"}
                  </button>
                  {interestStatus === "error" && (
                    <p className="text-red-600 text-sm mt-2">{interestMessage}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
