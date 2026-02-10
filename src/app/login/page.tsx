"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/listings");
      router.refresh();
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-linen-300 rounded-lg bg-white focus:ring-2 focus:ring-plum-300 focus:border-plum-400 transition-colors";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900 mb-8 text-center">
        Welcome Back
      </h1>

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

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />
          <div className="text-right mt-1.5">
            <Link
              href="/forgot-password"
              className="text-xs text-plum-700 hover:text-plum-800 underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-plum-700 text-white rounded-lg hover:bg-plum-800 disabled:opacity-50 font-medium transition-colors"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-center text-sm text-stone-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-plum-700 hover:text-plum-800 underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
