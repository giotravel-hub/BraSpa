"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { validatePassword, isPasswordValid } from "@/lib/password-validation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordChecks = validatePassword(password);
  const passwordOk = isPasswordValid(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordOk) {
      setError("Please meet all password requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-linen-300 rounded-lg bg-white focus:ring-2 focus:ring-plum-300 focus:border-plum-400 transition-colors";

  if (!token) {
    return (
      <div className="text-center">
        <div className="bg-white rounded-xl border border-linen-200 p-6">
          <p className="text-red-700">Missing reset token. Please request a new password reset.</p>
        </div>
        <p className="text-sm text-stone-400 mt-4">
          <Link href="/forgot-password" className="text-plum-700 hover:text-plum-800 underline underline-offset-2">
            Request new reset link
          </Link>
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="bg-white rounded-xl border border-linen-200 p-6">
          <p className="text-green-700 mb-4">Your password has been reset successfully.</p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 bg-plum-700 text-white rounded-lg hover:bg-plum-800 transition-colors"
          >
            Log in with your new password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="text-center text-stone-500 mb-8">
        Enter your new password
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-linen-200 p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className={inputClass}
          />
          {password.length > 0 && (
            <ul className="mt-2 space-y-1">
              {passwordChecks.map((check) => (
                <li
                  key={check.label}
                  className={`text-xs flex items-center gap-1.5 ${
                    check.met ? "text-green-600" : "text-stone-400"
                  }`}
                >
                  <span>{check.met ? "\u2713" : "\u2022"}</span>
                  {check.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-plum-700 text-white rounded-lg hover:bg-plum-800 disabled:opacity-50 font-medium transition-colors"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900 mb-2 text-center">
        Reset Password
      </h1>
      <Suspense fallback={
        <div className="bg-white rounded-xl border border-linen-200 p-6 text-center">
          <p className="text-stone-500">Loading...</p>
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
