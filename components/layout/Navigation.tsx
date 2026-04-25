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
    <nav className="bg-white sticky top-0 z-50 py-4 border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center h-11">
          {/* All Category dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 h-11 px-4 bg-[#F4F4F4] rounded-lg text-black text-sm font-medium hover:bg-blue-700 hover:text-white transition-colors"
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
          <div className="hidden md:flex items-center flex-1 gap-4 ml-6">
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
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.3874 8.26172H16.3483V7.05078C16.3483 6.07422 16.1595 5.16276 15.7819 4.31641C15.4173 3.45703 14.916 2.70833 14.278 2.07031C13.64 1.43229 12.8913 0.924479 12.0319 0.546875C11.1725 0.182291 10.2546 0 9.27801 0C8.31446 0 7.40301 0.182291 6.54363 0.546875C5.68426 0.924479 4.93556 1.43229 4.29754 2.07031C3.65952 2.70833 3.15821 3.45703 2.79363 4.31641C2.41603 5.16276 2.22722 6.07422 2.22722 7.05078V8.26172H1.93426C1.38738 8.26172 0.928396 8.47005 0.557303 8.88672C0.186209 9.30339 0.000662076 9.79167 0.000662076 10.3516V13.4375C-0.0123588 13.9844 0.166678 14.4531 0.537771 14.8438C0.908865 15.2344 1.36785 15.4362 1.91472 15.4492C1.91472 15.4492 1.91798 15.4492 1.92449 15.4492C1.931 15.4492 1.93426 15.4492 1.93426 15.4492H3.77019C3.9004 15.4362 4.00782 15.3841 4.09246 15.293C4.17709 15.2018 4.21941 15.0911 4.21941 14.9609C4.21941 14.9479 4.21941 14.9414 4.21941 14.9414C4.21941 14.9414 4.21941 14.9349 4.21941 14.9219V8.86719C4.21941 8.71094 4.17709 8.57096 4.09246 8.44727C4.00782 8.32357 3.9004 8.26172 3.77019 8.26172H3.22332V7.05078C3.22332 6.21745 3.37957 5.42969 3.69207 4.6875C4.01759 3.95833 4.45379 3.31706 5.00066 2.76367C5.54754 2.21029 6.18556 1.77734 6.91472 1.46484C7.65691 1.15234 8.44467 0.996094 9.27801 0.996094C10.1244 0.996094 10.9121 1.15234 11.6413 1.46484C12.3835 1.77734 13.028 2.21029 13.5749 2.76367C14.1218 3.31706 14.5514 3.95833 14.8639 4.6875C15.1895 5.42969 15.3522 6.21745 15.3522 7.05078V8.26172H14.8053C14.6751 8.26172 14.5677 8.32357 14.4831 8.44727C14.3984 8.57096 14.3561 8.71094 14.3561 8.86719V14.9219C14.3431 15.0521 14.3789 15.1693 14.4636 15.2734C14.5482 15.3776 14.6556 15.4362 14.7858 15.4492C14.7858 15.4492 14.7891 15.4492 14.7956 15.4492C14.8021 15.4492 14.8053 15.4492 14.8053 15.4492H15.3718L15.3327 15.5273C14.9551 16.0221 14.4896 16.4062 13.9362 16.6797C13.3828 16.9531 12.8001 17.0833 12.1882 17.0703C12.0449 16.4193 11.6934 15.9049 11.1335 15.5273C10.5736 15.1497 9.9616 15.0326 9.29754 15.1758C8.72462 15.2799 8.25587 15.5566 7.89129 16.0059C7.5267 16.4551 7.3379 16.9727 7.32488 17.5586C7.3379 18.2357 7.5853 18.8118 8.06707 19.2871C8.54884 19.7624 9.12827 20 9.80535 20C10.1439 20 10.4662 19.9316 10.7721 19.7949C11.0781 19.6582 11.3483 19.4727 11.5827 19.2383C11.7389 19.069 11.8692 18.8835 11.9733 18.6816C12.0775 18.4798 12.1491 18.2682 12.1882 18.0469C12.9564 18.0469 13.6856 17.8743 14.3757 17.5293C15.0658 17.1842 15.6452 16.7057 16.1139 16.0938L16.5827 15.3906C17.1165 15.3516 17.5397 15.179 17.8522 14.873C18.1647 14.5671 18.321 14.1732 18.321 13.6914V10.5859C18.321 10.0651 18.1419 9.54753 17.7839 9.0332C17.4258 8.51888 16.9603 8.26172 16.3874 8.26172ZM3.22332 14.4531H1.93426C1.66082 14.4531 1.43295 14.3555 1.25066 14.1602C1.06837 13.9648 0.983735 13.737 0.996756 13.4766C0.996756 13.4635 0.996756 13.4538 0.996756 13.4473C0.996756 13.4408 0.996756 13.4375 0.996756 13.4375V10.3516C0.996756 10.0651 1.08465 9.8112 1.26043 9.58984C1.43621 9.36849 1.66082 9.25781 1.93426 9.25781H3.22332V14.4531ZM10.86 18.5352C10.7298 18.6914 10.5736 18.8086 10.3913 18.8867C10.209 18.9648 10.0137 19.0039 9.80535 19.0039C9.4017 19.0039 9.05665 18.8607 8.77019 18.5742C8.48374 18.2878 8.334 17.9492 8.32097 17.5586C8.32097 17.1549 8.4642 16.8099 8.75066 16.5234C9.03712 16.237 9.38217 16.0938 9.78582 16.0938C10.1895 16.0938 10.5313 16.237 10.8112 16.5234C11.0912 16.8099 11.2311 17.1484 11.2311 17.5391C11.2311 17.5391 11.2311 17.5423 11.2311 17.5488C11.2311 17.5553 11.2311 17.5586 11.2311 17.5586C11.2442 17.7409 11.2181 17.9167 11.153 18.0859C11.0879 18.2552 10.9902 18.4049 10.86 18.5352ZM17.3249 13.6914C17.3249 14.0169 17.2044 14.2253 16.9636 14.3164C16.7227 14.4076 16.5306 14.4531 16.3874 14.4531H15.3522V9.25781H16.3874C16.6608 9.25781 16.8854 9.41081 17.0612 9.7168C17.237 10.0228 17.3249 10.3125 17.3249 10.5859V13.6914Z" fill="#757575"/>
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
