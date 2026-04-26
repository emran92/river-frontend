"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { searchProducts, fetchCategories } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import type { Product, Category } from "@/types";
import { mediaUrl, formatBDT } from "@/lib/utils";

export default function Header() {
  const { user, isAuthenticated, mutate } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const catDropRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: categories } = useFetch<Category[]>("/v1/categories", fetchCategories);
  const activeCategories = (categories ?? []).filter((c) => c.is_active);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearchOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchProducts(query);
        setResults(res.data ?? []);
        setSearchOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
  }, [query]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (catDropRef.current && !catDropRef.current.contains(e.target as Node)) {
        setCatDropOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logout();
    mutate(null);
    router.push("/");
  }

  return (
    <header className="pt-4">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="bg-[#F4F4F4] rounded-lg shadow-sm px-4 md:px-6 py-3.5 flex items-center gap-3 md:gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-9 w-28 md:h-10 md:w-36">
              <Image
                src="/logo-white.svg"
                alt="River Electronics"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Search bar — desktop/tablet only */}
          <div ref={searchRef} className="hidden md:flex flex-1 items-center gap-2 relative">
            <div className="flex-1 flex h-12 items-center border border-gray-200 rounded-xl bg-white overflow-visible focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-300 transition-all">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-5 py-2.5 text-sm outline-none bg-transparent min-w-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    const params = new URLSearchParams({ q: query.trim() });
                    if (selectedCategory) params.set("category", selectedCategory.slug);
                    router.push(`/search?${params.toString()}`);
                    setSearchOpen(false);
                  }
                }}
              />

              {/* Vertical divider + Category selector */}
              <div ref={catDropRef} className="relative flex-shrink-0 flex items-center">
                <span className="w-px h-5 bg-gray-300 mr-1" />
                <button
                  type="button"
                  onClick={() => setCatDropOpen(!catDropOpen)}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap transition-colors"
                >
                  <span className="max-w-[120px] truncate">
                    {selectedCategory ? selectedCategory.name : "All Categories"}
                  </span>
                  <svg className={`w-3 h-3 flex-shrink-0 transition-transform ${catDropOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {catDropOpen && (
                  <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-river-blue/10 hover:text-blue-700"
                      onClick={() => { setSelectedCategory(null); setCatDropOpen(false); }}
                    >
                      All Categories
                    </button>
                    {activeCategories.map((cat) => (
                      <button
                        key={cat.id}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-river-blue/10 hover:text-blue-700"
                        onClick={() => { setSelectedCategory(cat); setCatDropOpen(false); }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Blue search button */}
            <button
              aria-label="Search"
              className="flex-shrink-0 h-10 w-10 bg-river-blue transition-transform hover:scale-102 duration-200 text-white w-11 h-11 rounded-xl flex items-center justify-center"
              onClick={() => {
                if (query.trim()) {
                  const params = new URLSearchParams({ q: query.trim() });
                  if (selectedCategory) params.set("category", selectedCategory.slug);
                  router.push(`/search?${params.toString()}`);
                  setSearchOpen(false);
                }
              }}
            >
              <svg width="24" height="24" className="p-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.9998 22.5867L17.7378 16.3247C19.3644 14.3353 20.1642 11.7968 19.9716 9.23427C19.7791 6.67174 18.609 4.28124 16.7034 2.55723C14.7977 0.833216 12.3024 -0.0924026 9.73342 -0.0281708C7.16447 0.036061 4.71848 1.08523 2.9014 2.90232C1.08431 4.71941 0.0351378 7.1654 -0.029094 9.73435C-0.0933258 12.3033 0.832292 14.7987 2.5563 16.7043C4.28031 18.6099 6.67081 19.78 9.23334 19.9725C11.7959 20.1651 14.3344 19.3653 16.3238 17.7387L22.5858 24.0007L23.9998 22.5867ZM9.99978 18.0007C8.41753 18.0007 6.87081 17.5315 5.55522 16.6525C4.23963 15.7734 3.21425 14.524 2.60875 13.0622C2.00324 11.6004 1.84482 9.99183 2.1535 8.43998C2.46218 6.88813 3.22411 5.46267 4.34293 4.34385C5.46175 3.22503 6.88721 2.4631 8.43906 2.15442C9.99091 1.84574 11.5994 2.00417 13.0612 2.60967C14.5231 3.21517 15.7725 4.24055 16.6515 5.55614C17.5306 6.87174 17.9998 8.41845 17.9998 10.0007C17.9974 12.1217 17.1538 14.1552 15.654 15.6549C14.1542 17.1547 12.1208 17.9983 9.99978 18.0007Z" fill="white"/>
              </svg>

            </button>

            {/* Search dropdown */}
            {searchOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-12 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    onClick={() => setSearchOpen(false)}
                  >
                    <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 rounded">
                      <Image
                        src={product.thumbnail_url ? mediaUrl(product.thumbnail_url) : "/placeholder/product.jpg"}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-blue-600 font-semibold">
                        {formatBDT(product.sale_price ?? product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-auto md:ml-0">

            {/* Mobile search toggle */}
            <button
              aria-label="Search"
              className="md:hidden text-gray-600 transition-transform hover:scale-105 duration-200 p-1"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-600 transition-transform hover:scale-105 p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 3H4.242L4.2 2.649C4.11405 1.91942 3.76338 1.24673 3.21449 0.758478C2.6656 0.270223 1.95663 0.000341793 1.222 0L0 0V2H1.222C1.46693 2.00003 1.70334 2.08996 1.88637 2.25272C2.06941 2.41547 2.18634 2.63975 2.215 2.883L3.8 16.351C3.88595 17.0806 4.23662 17.7533 4.78551 18.2415C5.3344 18.7298 6.04337 18.9997 6.778 19H20V17H6.778C6.53291 16.9999 6.29638 16.9099 6.11333 16.7469C5.93027 16.5839 5.81343 16.3594 5.785 16.116L5.654 15H21.836L24 3ZM20.164 13H5.419L4.478 5H21.607L20.164 13Z" fill="#050505"/>
                <path d="M7.00024 24.0006C8.10481 24.0006 9.00024 23.1052 9.00024 22.0006C9.00024 20.8961 8.10481 20.0006 7.00024 20.0006C5.89567 20.0006 5.00024 20.8961 5.00024 22.0006C5.00024 23.1052 5.89567 24.0006 7.00024 24.0006Z" fill="#050505"/>
                <path d="M17 24.0006C18.1046 24.0006 19 23.1052 19 22.0006C19 20.8961 18.1046 20.0006 17 20.0006C15.8954 20.0006 15 20.8961 15 22.0006C15 23.1052 15.8954 24.0006 17 24.0006Z" fill="#050505"/>
            </svg>
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-river-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                0
              </span>
            </Link>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-gray-600 transition-transform hover:scale-105 p-1"
                aria-label="User menu"
              >
                <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 24.0006H16V18.9576C15.9992 18.1736 15.6874 17.4219 15.133 16.8676C14.5787 16.3132 13.827 16.0014 13.043 16.0006H4.957C4.173 16.0014 3.42134 16.3132 2.86696 16.8676C2.31259 17.4219 2.00079 18.1736 2 18.9576V24.0006H0V18.9576C0.00158783 17.6434 0.524351 16.3835 1.45363 15.4542C2.3829 14.525 3.64281 14.0022 4.957 14.0006H13.043C14.3572 14.0022 15.6171 14.525 16.5464 15.4542C17.4756 16.3835 17.9984 17.6434 18 18.9576V24.0006Z" fill="#050505"/>
                  <path d="M9 11.9999C7.81332 11.9999 6.65328 11.648 5.66658 10.9888C4.67989 10.3295 3.91085 9.39239 3.45673 8.29603C3.0026 7.19968 2.88378 5.99328 3.11529 4.82939C3.3468 3.66551 3.91825 2.59641 4.75736 1.75729C5.59648 0.918178 6.66558 0.346734 7.82946 0.115222C8.99335 -0.116289 10.1997 0.00253105 11.2961 0.456657C12.3925 0.910783 13.3295 1.67982 13.9888 2.66651C14.6481 3.65321 15 4.81325 15 5.99993C14.9984 7.59075 14.3658 9.11595 13.2409 10.2408C12.116 11.3657 10.5908 11.9983 9 11.9999ZM9 1.99993C8.20888 1.99993 7.43552 2.23453 6.77772 2.67406C6.11993 3.11358 5.60724 3.7383 5.30448 4.4692C5.00173 5.20011 4.92252 6.00437 5.07686 6.7803C5.2312 7.55622 5.61217 8.26895 6.17158 8.82836C6.73099 9.38777 7.44372 9.76873 8.21964 9.92308C8.99557 10.0774 9.79983 9.9982 10.5307 9.69545C11.2616 9.3927 11.8864 8.88001 12.3259 8.22221C12.7654 7.56442 13 6.79106 13 5.99993C13 4.93907 12.5786 3.92165 11.8284 3.17151C11.0783 2.42136 10.0609 1.99993 9 1.99993Z" fill="#050505"/>
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1">
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Orders</Link>
                      <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>
                      <hr className="my-1" />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                      <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar — shown below header when toggled */}
        {mobileSearchOpen && (
          <div ref={mobileSearchRef} className="md:hidden mt-2 relative">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center border border-gray-200 rounded-xl bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-300 transition-all">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && query.trim()) {
                      const params = new URLSearchParams({ q: query.trim() });
                      router.push(`/search?${params.toString()}`);
                      setSearchOpen(false);
                      setMobileSearchOpen(false);
                    }
                  }}
                />
              </div>
              <button
                aria-label="Search"
                className="flex-shrink-0 bg-river-blue text-white w-11 h-11 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                onClick={() => {
                  if (query.trim()) {
                    const params = new URLSearchParams({ q: query.trim() });
                    router.push(`/search?${params.toString()}`);
                    setSearchOpen(false);
                    setMobileSearchOpen(false);
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>

            {/* Mobile search dropdown */}
            {searchOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    onClick={() => { setSearchOpen(false); setMobileSearchOpen(false); }}
                  >
                    <div className="relative w-9 h-9 flex-shrink-0 bg-gray-100 rounded">
                      <Image
                        src={product.thumbnail_url ? mediaUrl(product.thumbnail_url) : "/placeholder/product.jpg"}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="36px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-blue-600 font-semibold">
                        {formatBDT(product.sale_price ?? product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
