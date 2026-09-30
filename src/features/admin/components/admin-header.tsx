"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "./admin-logout-button";

interface AdminHeaderProps {
  username?: string;
}

export function AdminHeader({ username }: AdminHeaderProps) {
  const pathname = usePathname?.() || "";
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Adjust pending state when route settles during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setPendingHref(null);
  }

  const isOrdersActive = pathname.startsWith("/admin/orders");
  const isProductsActive =
    pathname.startsWith("/admin/products") &&
    !pathname.startsWith("/admin/tedarik");
  const isSupplyProductsActive = pathname.startsWith("/admin/tedarik/products");
  const isSupplyCategoriesActive = pathname.startsWith(
    "/admin/tedarik/categories"
  );

  const isOrdersPending = pendingHref === "/admin/orders" && !isOrdersActive;
  const isProductsPending =
    pendingHref === "/admin/products" && !isProductsActive;
  const isSupplyProductsPending =
    pendingHref === "/admin/tedarik/products" && !isSupplyProductsActive;
  const isSupplyCategoriesPending =
    pendingHref === "/admin/tedarik/categories" && !isSupplyCategoriesActive;

  const handleNavClick = (href: string) => {
    if (!pathname.startsWith(href)) {
      setPendingHref(href);
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main topbar row */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/admin/orders"
              onClick={() => handleNavClick("/admin/orders")}
              className="flex items-center gap-2.5 font-bold text-base sm:text-lg text-white hover:text-sky-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 rounded shrink-0"
            >
              <span className="w-7 h-7 rounded-lg relative overflow-hidden shrink-0 border border-slate-700 bg-white flex items-center justify-center">
                <Image
                  src="/images/sinpak-pamukkale-logo.jpg"
                  alt="Sinpak Logo"
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              <span>Sinpak</span>
              <span className="hidden sm:inline-flex text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Yönetim
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden sm:flex items-center gap-1"
              aria-label="Yönetim Menüsü"
            >
              {/* Su Section */}
              <div className="flex items-center bg-slate-800/60 rounded-lg p-1 border border-slate-700/50 gap-1 mr-2">
                <span className="text-[10px] uppercase font-bold text-sky-400 px-1.5 py-0.5 tracking-wider">
                  Su
                </span>
                <Link
                  href="/admin/orders"
                  onClick={() => handleNavClick("/admin/orders")}
                  aria-current={isOrdersActive ? "page" : undefined}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${
                    isOrdersActive
                      ? "bg-sky-600 text-white shadow-xs"
                      : isOrdersPending
                        ? "bg-sky-900/60 text-sky-200 border border-sky-600/50"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/70"
                  }`}
                >
                  {isOrdersPending && (
                    <span
                      aria-hidden="true"
                      className="inline-block w-3 h-3 border-2 border-sky-300 border-t-transparent rounded-full animate-spin shrink-0"
                    />
                  )}
                  <span>Siparişler</span>
                </Link>
                <Link
                  href="/admin/products"
                  onClick={() => handleNavClick("/admin/products")}
                  aria-current={isProductsActive ? "page" : undefined}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${
                    isProductsActive
                      ? "bg-sky-600 text-white shadow-xs"
                      : isProductsPending
                        ? "bg-sky-900/60 text-sky-200 border border-sky-600/50"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/70"
                  }`}
                >
                  {isProductsPending && (
                    <span
                      aria-hidden="true"
                      className="inline-block w-3 h-3 border-2 border-sky-300 border-t-transparent rounded-full animate-spin shrink-0"
                    />
                  )}
                  <span>Ürünler</span>
                </Link>
              </div>

              {/* Kurumsal Tedarik Section */}
              <div className="flex items-center bg-slate-800/60 rounded-lg p-1 border border-slate-700/50 gap-1">
                <span className="text-[10px] uppercase font-bold text-emerald-400 px-1.5 py-0.5 tracking-wider">
                  Tedarik
                </span>
                <Link
                  href="/admin/tedarik/products"
                  onClick={() => handleNavClick("/admin/tedarik/products")}
                  aria-current={isSupplyProductsActive ? "page" : undefined}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${
                    isSupplyProductsActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isSupplyProductsPending
                        ? "bg-emerald-900/60 text-emerald-200 border border-emerald-600/50"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/70"
                  }`}
                >
                  {isSupplyProductsPending && (
                    <span
                      aria-hidden="true"
                      className="inline-block w-3 h-3 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin shrink-0"
                    />
                  )}
                  <span>Ürünler</span>
                </Link>
                <Link
                  href="/admin/tedarik/categories"
                  onClick={() => handleNavClick("/admin/tedarik/categories")}
                  aria-current={isSupplyCategoriesActive ? "page" : undefined}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 flex items-center gap-1.5 ${
                    isSupplyCategoriesActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isSupplyCategoriesPending
                        ? "bg-emerald-900/60 text-emerald-200 border border-emerald-600/50"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/70"
                  }`}
                >
                  {isSupplyCategoriesPending && (
                    <span
                      aria-hidden="true"
                      className="inline-block w-3 h-3 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin shrink-0"
                    />
                  )}
                  <span>Kategoriler</span>
                </Link>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {username && (
              <span className="hidden md:inline-block text-xs text-slate-400">
                Giriş: <strong className="text-slate-200 font-semibold">{username}</strong>
              </span>
            )}
            <AdminLogoutButton />
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <nav
          className="sm:hidden pb-3 pt-1 grid grid-cols-4 gap-1.5 text-center"
          aria-label="Yönetim Mobil Menüsü"
        >
          <Link
            href="/admin/orders"
            onClick={() => handleNavClick("/admin/orders")}
            aria-current={isOrdersActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
              isOrdersActive
                ? "bg-sky-600 text-white font-semibold"
                : "bg-slate-800/90 text-slate-300 border border-slate-700/60"
            }`}
          >
            <span>Su Sipariş</span>
          </Link>

          <Link
            href="/admin/products"
            onClick={() => handleNavClick("/admin/products")}
            aria-current={isProductsActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
              isProductsActive
                ? "bg-sky-600 text-white font-semibold"
                : "bg-slate-800/90 text-slate-300 border border-slate-700/60"
            }`}
          >
            <span>Su Ürün</span>
          </Link>

          <Link
            href="/admin/tedarik/products"
            onClick={() => handleNavClick("/admin/tedarik/products")}
            aria-current={isSupplyProductsActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
              isSupplyProductsActive
                ? "bg-emerald-600 text-white font-semibold"
                : "bg-slate-800/90 text-slate-300 border border-slate-700/60"
            }`}
          >
            <span>Tedarik Ürün</span>
          </Link>

          <Link
            href="/admin/tedarik/categories"
            onClick={() => handleNavClick("/admin/tedarik/categories")}
            aria-current={isSupplyCategoriesActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
              isSupplyCategoriesActive
                ? "bg-emerald-600 text-white font-semibold"
                : "bg-slate-800/90 text-slate-300 border border-slate-700/60"
            }`}
          >
            <span>Kategoriler</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

