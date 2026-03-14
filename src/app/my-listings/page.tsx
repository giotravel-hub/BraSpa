"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CONDITIONS, SIZES } from "@/lib/categories";

const inputClass =
  "w-full px-3 py-2 border border-linen-300 rounded-lg bg-white focus:ring-2 focus:ring-plum-300 focus:border-plum-400 transition-colors";

interface Listing {
  id: string;
  title: string;
  description: string;
  brand: string;
  size: string;
  condition: string;
  category: string;
  images: { id: string; url: string }[];
  createdAt: string;
}

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    brand: "",
    size: "",
    condition: "",
    category: "",
  });

  useEffect(() => {
    if (session) {
      const userId = (session.user as { id: string }).id;
      fetch(`/api/listings?userId=${userId}&limit=100`)
        .then((res) => res.json())
        .then((data) => {
          setListings(data.listings || data);
          setLoading(false);
        });
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-stone-400">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-stone-600 mb-4">You need to be logged in to view your listings.</p>
        <Link href="/login" className="text-plum-700 hover:text-plum-800 underline underline-offset-2">Log in</Link>
      </div>
    );
  }

  const startEdit = (listing: Listing) => {
    setEditingId(listing.id);
    setEditForm({
      title: listing.title,
      description: listing.description,
      brand: listing.brand,
      size: listing.size,
      condition: listing.condition,
      category: listing.category,
    });
  };

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      const updated = await res.json();
      setListings(listings.map((l) => (l.id === id ? { ...l, ...updated } : l)));
      setEditingId(null);
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setListings(listings.filter((l) => l.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900">My Listings</h1>
        <Link
          href="/listings/new"
          className="px-4 py-2 bg-plum-700 text-white rounded-lg hover:bg-plum-800 text-sm font-medium transition-colors"
        >
          Post New
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-xl border border-linen-200 p-12 text-center">
          <p className="text-stone-500 mb-4">You haven&apos;t posted any listings yet.</p>
          <Link href="/listings/new" className="text-plum-700 hover:text-plum-800 underline underline-offset-2">
            Post your first listing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-xl border border-linen-200 p-4"
            >
              {editingId === listing.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={editForm.brand}
                    onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                    placeholder="Brand"
                    className={inputClass}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className={inputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <select
                      value={editForm.size}
                      onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                      className={inputClass}
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      value={editForm.condition}
                      onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                      className={inputClass}
                    >
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(listing.id)}
                      className="px-4 py-1.5 bg-plum-700 text-white rounded-lg hover:bg-plum-800 text-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-1.5 border border-linen-300 rounded-lg hover:bg-linen-50 text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="w-20 h-20 relative flex-shrink-0 bg-linen-100 rounded-lg overflow-hidden">
                    {listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0].url}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-linen-400 text-xs">
                        No photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/listings/${listing.id}`} className="font-semibold text-stone-800 hover:text-plum-700 transition-colors">
                      {listing.title}
                    </Link>
                    <p className="text-sm text-stone-500">
                      {listing.category} &middot; {listing.size} &middot; {listing.condition}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Posted {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(listing)}
                      className="px-3 py-1.5 text-sm border border-linen-300 rounded-lg hover:bg-linen-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="px-3 py-1.5 text-sm border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
