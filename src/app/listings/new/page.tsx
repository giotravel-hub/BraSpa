"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/ImageUpload";
import { CATEGORIES, CONDITIONS, SIZES } from "@/lib/categories";
import Link from "next/link";

const inputClass =
  "w-full px-3 py-2.5 border border-linen-300 rounded-lg bg-white focus:ring-2 focus:ring-plum-300 focus:border-plum-400 transition-colors text-stone-800 placeholder:text-stone-400";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [newListingId, setNewListingId] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-stone-400">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-600 mb-4">You need to be logged in to post a listing.</p>
        <Link href="/login" className="text-plum-700 hover:text-plum-800 underline underline-offset-2">Log in</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, brand, size, condition, category, imageUrls }),
      });

      if (res.ok) {
        const listing = await res.json();
        setSuccess(true);
        setNewListingId(listing.id);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create listing");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl border border-linen-200 p-10">
          <h2 className="text-2xl font-semibold text-plum-800 mb-3">Listing posted!</h2>
          <p className="text-stone-600 mb-6">Your listing is now live and visible to others in the community.</p>
          <div className="flex gap-4 justify-center">
            <Link
              href={`/listings/${newListingId}`}
              className="px-6 py-2.5 bg-plum-700 text-white rounded-full font-medium hover:bg-plum-800 transition-colors"
            >
              View Listing
            </Link>
            <Link
              href="/listings"
              className="px-6 py-2.5 border border-plum-300 text-plum-800 rounded-full font-medium hover:bg-plum-50 transition-colors"
            >
              Browse All
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900 mb-8">
        Post a Listing
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-linen-200 p-6 space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Photos</label>
          <ImageUpload images={imageUrls} onChange={setImageUrls} />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
            maxLength={150}
            placeholder="e.g. Gently used mastectomy bra"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            maxLength={100}
            placeholder="e.g. Amoena, Anita, Wacoal"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select size</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            minLength={10}
            maxLength={2000}
            placeholder="Describe the item, including brand, color, and any other details..."
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-plum-700 text-white rounded-lg hover:bg-plum-800 disabled:opacity-50 font-medium transition-colors"
        >
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}
