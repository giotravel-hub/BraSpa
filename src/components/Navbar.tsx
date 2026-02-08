"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = "block py-1.5 text-stone-700 hover:text-plum-700 transition-colors";

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-linen-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-5xl font-serif font-bold text-plum-800 tracking-tight">
          BraSpa
        </Link>

        <button
          className="md:hidden text-stone-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`${menuOpen ? "block" : "hidden"} md:flex items-center gap-6 absolute md:static top-16 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 border-b md:border-0 border-linen-200 z-50`}>
          <Link href="/listings" className={linkClass}>
            Browse
          </Link>
          {session ? (
            <>
              <Link href="/listings/new" className={linkClass}>
                Post Listing
              </Link>
              <Link href="/my-listings" className={linkClass}>
                My Listings
              </Link>
              {isAdmin && (
                <Link href="/admin/zip-codes" className={linkClass}>
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={linkClass}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                Log In
              </Link>
              <Link
                href="/signup"
                className="block py-2 px-5 bg-plum-700 text-white rounded-full hover:bg-plum-800 transition-colors text-sm font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
