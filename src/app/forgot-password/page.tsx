"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-linen-300 rounded-lg bg-white focus:ring-2 focus:ring-plum-300 focus:border-plum-400 transition-colors";

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900 mb-4">
          Check Your Email
        </h1>
        <div className="bg-white rounded-xl border border-linen-200 p-6">
          <p className="text-stone-600 mb-2">
            If an account with that email exists, we sent a password reset link.
          </p>
          <p className="text-stone-500 text-sm">
            The link expires in 1 hour.
          </p>
        </div>
        <p className="text-sm text-stone-400 mt-4">
          <Link href="/login" className="text-plum-700 hover:text-plum-800 underline underline-offset-2">
            Back to login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900 mb-2 text-center">
        Forgot Password
      </h1>
      <p className="text-center text-stone-500 mb-8">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-linen-200 p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-plum-700 text-white rounded-lg hover:bg-plum-800 disabled:opacity-50 font-medium transition-colors"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center text-sm text-stone-500">
          <Link href="/login" className="text-plum-700 hover:text-plum-800 underline underline-offset-2">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}
