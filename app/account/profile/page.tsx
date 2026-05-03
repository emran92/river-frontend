"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateMe } from "@/lib/auth";
import type { ApiError } from "@/types";

export default function ProfilePage() {
  const { user, mutate } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setForm({ name: user.name, phone: user.phone ?? "" });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await updateMe({
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
      });
      await mutate();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError((err as ApiError).message ?? "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
      </div>

      {/* Account info card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Account Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Email</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.email ?? "—"}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Email Status</p>
            {user?.email_verified_at ? (
              <span className="inline-flex items-center gap-1 text-green-700 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Unverified
              </span>
            )}
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs text-amber-600 mb-1">Loyalty Points</p>
            <p className="text-sm font-bold text-amber-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {(user?.loyalty_points ?? 0).toLocaleString()} pts
            </p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Edit Details</h2>

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-river-blue focus:ring-2 focus:ring-river-blue/20 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+880..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-river-blue focus:ring-2 focus:ring-river-blue/20 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-river-blue text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-river-blue/90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm shadow-river-blue/30"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
