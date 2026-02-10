"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    fetch(`/api/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus("error");
          setMessage(data.error);
        } else {
          setStatus("success");
          setMessage(data.message);
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong.");
      });
  }, [token]);

  return (
    <div className="bg-white rounded-xl border border-linen-200 p-6">
      {status === "loading" && (
        <p className="text-stone-500">Verifying your email...</p>
      )}
      {status === "success" && (
        <>
          <p className="text-green-700 mb-4">{message}</p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 bg-plum-700 text-white rounded-lg hover:bg-plum-800 transition-colors"
          >
            Log in to your account
          </Link>
        </>
      )}
      {status === "error" && (
        <p className="text-red-700">{message}</p>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-[var(--font-lora)] font-semibold text-plum-900 mb-4">
        Email Verification
      </h1>
      <Suspense fallback={
        <div className="bg-white rounded-xl border border-linen-200 p-6">
          <p className="text-stone-500">Loading...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
