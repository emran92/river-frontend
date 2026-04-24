"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { searchProducts } from "@/lib/api";
import type { Product } from "@/types";
import { mediaUrl, formatBDT } from "@/lib/utils";

export default function Header() {
  const { user, isAuthenticated, mutate } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="relative h-10 w-36">
            <Image
              src="/logo.svg"
              alt="River Electronics"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Search bar */}
        <div ref={searchRef} className="flex-1 relative max-w-2xl">
          <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  setSearchOpen(false);
                }
              }}
            />
            <button
              aria-label="Search"
              className="bg-blue-600 hover:bg-blue-700 px-4 text-white flex items-center transition-colors"
              onClick={() => {
                if (query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  setSearchOpen(false);
                }
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </div>

          {/* Search dropdown */}
          {searchOpen && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-50 max-h-80 overflow-y-auto">
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
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Cart */}
          <Link href="/cart" className="relative flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] mt-0.5">Cart</span>
          </Link>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="User menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] mt-0.5">
                {isAuthenticated ? user?.name?.split(" ")[0] : "Account"}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
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
    </header>
  );
}
