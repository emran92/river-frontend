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
            <div className="flex-1 flex items-center border border-gray-200 rounded-xl bg-white overflow-visible focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-300 transition-all">
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
              className="flex-shrink-0 bg-river-blue text-white w-11 h-11 rounded-xl flex items-center justify-center transition-colors shadow-sm hover:bg-blue-600"
              onClick={() => {
                if (query.trim()) {
                  const params = new URLSearchParams({ q: query.trim() });
                  if (selectedCategory) params.set("category", selectedCategory.slug);
                  router.push(`/search?${params.toString()}`);
                  setSearchOpen(false);
                }
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
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
              className="md:hidden text-gray-600 hover:text-blue-600 transition-colors p-1"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-river-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                0
              </span>
            </Link>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors p-1"
                aria-label="User menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
