"use client";

import { useState } from "react";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { fetchCategories } from "@/lib/api";
import type { Category } from "@/types";

const NAV_LINKS = [
  { label: "Brands", href: "/brands" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Corporate & Dealer", href: "/corporate" },
  { label: "Service Request", href: "/service" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: categories } = useFetch<Category[]>(
    "/v1/categories",
    fetchCategories
  );

  const activeCategories = (categories ?? []).filter((c) => c.is_active);

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center h-11">
          {/* All Category dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 h-11 px-4 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setCategoryOpen(!categoryOpen)}
              aria-expanded={categoryOpen}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All Category
              <svg className={`w-3 h-3 transition-transform ${categoryOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {categoryOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setCategoryOpen(false)}
                />
                <div className="absolute top-full left-0 w-60 bg-white border border-gray-200 shadow-xl z-40 rounded-b-lg py-1">
                  {activeCategories.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">Loading...</div>
                  ) : (
                    activeCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setCategoryOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))
                  )}
                  <hr className="my-1" />
                  <Link
                    href="/categories"
                    className="block px-4 py-2.5 text-sm text-blue-600 font-medium hover:bg-blue-50"
                    onClick={() => setCategoryOpen(false)}
                  >
                    View All Categories →
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 h-11 flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Customer Support */}
          <div className="hidden md:flex items-center gap-2 ml-auto text-sm text-gray-600">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs text-gray-500">Customer Support</span>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden ml-auto p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
