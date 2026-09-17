"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "./admin-logout-button";

interface AdminHeaderProps {
  username?: string;
}

export function AdminHeader({ username }: AdminHeaderProps) {
  const pathname = usePathname?.() || "";

  const isOrdersActive = pathname.startsWith("/admin/orders");
  const isProductsActive = pathname.startsWith("/admin/products");

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main topbar row */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 font-bold text-base sm:text-lg text-white hover:text-sky-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 rounded shrink-0"
            >
              <span>Sinpak Su</span>
              <span className="hidden sm:inline-flex text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                Yönetim Paneli
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center gap-1.5" aria-label="Yönetim Menüsü">
              <Link
                href="/admin/orders"
                aria-current={isOrdersActive ? "page" : undefined}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[36px] flex items-center ${
                  isOrdersActive
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                Siparişler
              </Link>
              <Link
                href="/admin/products"
                aria-current={isProductsActive ? "page" : undefined}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[36px] flex items-center ${
                  isProductsActive
                    ? "bg-sky-600 text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                Ürünler
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {username && (
              <span className="hidden md:inline-block text-xs text-slate-400">
                Giriş yapan:{" "}
                <strong className="text-slate-200 font-semibold">
                  {username}
                </strong>
              </span>
            )}
            <AdminLogoutButton />
          </div>
        </div>

        {/* Mobile Navigation Bar with large touch targets */}
        <nav
          className="sm:hidden pb-3 pt-1 flex items-center gap-2"
          aria-label="Yönetim Mobil Menüsü"
        >
          <Link
            href="/admin/orders"
            aria-current={isOrdersActive ? "page" : undefined}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              isOrdersActive
                ? "bg-sky-600 text-white shadow-xs font-semibold"
                : "bg-slate-800/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
            }`}
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span>Siparişler</span>
          </Link>

          <Link
            href="/admin/products"
            aria-current={isProductsActive ? "page" : undefined}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              isProductsActive
                ? "bg-sky-600 text-white shadow-xs font-semibold"
                : "bg-slate-800/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60"
            }`}
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span>Ürünler</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
