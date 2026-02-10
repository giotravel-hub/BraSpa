"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validatePassword, isPasswordValid } from "@/lib/password-validation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = validatePassword(password);
  const passwordOk = isPasswordValid(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordOk) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, zipCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/listings");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-linen-300 rounded-lg bg-white focus:ring-2 focus:ring-plum-300 focus:border-plum-400 transition-colors";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900 mb-2 text-center">
        Join BraSpa
      </h1>
      <p className="text-center text-stone-500 mb-8">
        Become part of your local sharing community
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-linen-200 p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>

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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass + " pr-20"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-plum-700 hover:text-plum-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
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
            Zip Code
          </label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
            pattern="[0-9]{5}"
            placeholder="e.g. 94598"
            className={inputClass}
          />
          <p className="text-xs text-stone-400 mt-1.5">
            Must be in our service area
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-plum-700 text-white rounded-lg hover:bg-plum-800 disabled:opacity-50 font-medium transition-colors"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="text-plum-700 hover:text-plum-800 underline underline-offset-2">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
