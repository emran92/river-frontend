"use client";

import { useState } from "react";
import Link from "next/link";
import { resendVerification } from "@/lib/auth";

const COOLDOWN_SECONDS = 60;

export default function VerifyEmailPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  async function handleResend() {
    if (cooldown > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      await resendVerification();
      setSent(true);
      setCooldown(COOLDOWN_SECONDS);
      const interval = setInterval(() => {
        setCooldown((s) => {
          if (s <= 1) { clearInterval(interval); return 0; }
          return s - 1;
        });
      }, 1000);
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message;
      setError(msg ?? "Failed to resend. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-280px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-river-blue/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-river-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-sm text-gray-500 mb-6">
            We&apos;ve sent a verification link to your email address. Click the link to activate your account.
          </p>

          {sent && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              Verification email resent!
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={cooldown > 0 || loading}
            className="w-full rounded-lg border border-river-blue text-river-blue text-sm font-semibold px-4 py-2.5 hover:bg-river-blue/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? "Sending…"
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : "Resend verification email"}
          </button>

          <p className="mt-6 text-sm text-gray-500">
            Already verified?{" "}
            <Link href="/login" className="font-semibold text-river-blue hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
