"use client";

import { useState, useEffect, useCallback } from "react";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/SearchFilters";

interface Listing {
  id: string;
  title: string;
  size: string;
  condition: string;
  category: string;
  images: { url: string }[];
  user: { name: string };
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (size) params.set("size", size);
    if (condition) params.set("condition", condition);
    params.set("page", page.toString());

    const res = await fetch(`/api/listings?${params}`);
    const data = await res.json();
    setListings(data.listings);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setLoading(false);
  }, [query, category, size, condition, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchListings, 300);
    return () => clearTimeout(timeout);
  }, [fetchListings]);

  useEffect(() => {
    setPage(1);
  }, [query, category, size, condition]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900 mb-6">
        Browse Listings
      </h1>

      <SearchFilters
        query={query}
        category={category}
        size={size}
        condition={condition}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onSizeChange={setSize}
        onConditionChange={setCondition}
      />

      {loading ? (
        <p className="text-center text-stone-400 py-12">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-stone-500 py-12">
          No listings found. Try adjusting your filters.
        </p>
      ) : (
        <>
          <p className="text-sm text-stone-400 mb-4">
            {total} listing{total !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-linen-300 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-stone-500 px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-linen-300 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
