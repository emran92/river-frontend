import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Illustration */}
      <div className="relative w-64 h-48 mb-8 select-none">
        {/* Large 404 text as background */}
        <p className="text-[120px] font-extrabold text-gray-100 leading-none select-none absolute inset-0 flex items-center justify-center">
          404
        </p>
        {/* Icon on top */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <svg
            className="w-24 h-24 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-gray-500 text-sm max-w-sm mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-river-blue hover:bg-river-blue text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Go to Homepage
        </Link>
        <Link
          href="/categories"
          className="bg-[#F4F4F4] hover:bg-gray-200 text-gray-800 text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-200 transition-colors"
        >
          Browse Categories
        </Link>
      </div>
    </div>
  );
}
