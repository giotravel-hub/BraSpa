"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ZipCode {
  id: string;
  zipCode: string;
}

export default function AdminZipCodesPage() {
  const { data: session, status } = useSession();
  const [zipCodes, setZipCodes] = useState<ZipCode[]>([]);
  const [newZip, setNewZip] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;

  useEffect(() => {
    if (isAdmin) {
      fetch("/api/admin/zip-codes")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setZipCodes(data);
          setLoading(false);
        });
    }
  }, [isAdmin]);

  if (status === "loading") {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>;
  }

  if (!session || !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
        <Link href="/" className="text-rose-600 hover:underline">Go home</Link>
      </div>
    );
  }

  const addZip = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/zip-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zipCode: newZip }),
    });

    if (res.ok) {
      const created = await res.json();
      setZipCodes([...zipCodes, created].sort((a, b) => a.zipCode.localeCompare(b.zipCode)));
      setNewZip("");
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  const removeZip = async (zipCode: string) => {
    if (!confirm(`Remove zip code ${zipCode}?`)) return;

    const res = await fetch(`/api/admin/zip-codes?zipCode=${zipCode}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setZipCodes(zipCodes.filter((z) => z.zipCode !== zipCode));
    }
  };

  const filtered = search
    ? zipCodes.filter((z) => z.zipCode.includes(search))
    : zipCodes;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-rose-800 mb-6">
        Manage Allowed Zip Codes
      </h1>

      <form onSubmit={addZip} className="bg-white rounded-xl shadow-sm border border-rose-100 p-4 mb-6 flex gap-3">
        <input
          type="text"
          value={newZip}
          onChange={(e) => setNewZip(e.target.value)}
          placeholder="Enter 5-digit zip code"
          pattern="[0-9]{5}"
          maxLength={5}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium"
        >
          Add
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search zip codes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-rose-100">
          <div className="p-3 border-b border-rose-100 text-sm text-gray-500">
            {filtered.length} zip code{filtered.length !== 1 ? "s" : ""} {search ? "matching" : "total"}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filtered.map((z) => (
              <div
                key={z.id}
                className="flex items-center justify-between px-4 py-2 border-b border-gray-50 hover:bg-rose-50/50"
              >
                <span className="font-mono text-gray-800">{z.zipCode}</span>
                <button
                  onClick={() => removeZip(z.zipCode)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
