"use client";

import Link from "next/link";
import { Chip } from "@heroui/react";
import { Droplets, PhoneCall, Clock } from "lucide-react";
// import { useCart } from "@/features/cart/cart-context";
import { brandConfig, type BrandKey } from "@/lib/site-config";
import { SinpakTedarikLogo } from "@/components/sinpak-tedarik-logo";

interface HeaderProps {
  brand?: BrandKey;
}

export function Header({ brand = "su" }: HeaderProps) {
  const config = brandConfig[brand];
  // const { totalItems, setIsCartOpen } = useCart();

  const isSu = brand === "su";

  return (
    <header className="sticky top-0 z-50 h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2.5">
          <Link
            href={isSu ? "/" : "/kurumsal-tedarik"}
            className="group flex items-center gap-2 transition-transform active:scale-98 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-lg shrink-0"
          >
            {isSu ? (
              <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-sky-700 hover:text-sky-800 transition-colors">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs bg-linear-to-tr from-sky-600 to-sky-400">
                  <Droplets className="w-5 h-5 text-white" />
                </span>
                <span>{config.name}</span>
              </div>
            ) : (
              <SinpakTedarikLogo size="sm" showTagline={false} />
            )}
          </Link>

          <div className="hidden xs:block">
            <Chip
              size="sm"
              variant="soft"
              color="accent"
              className={`font-semibold text-xs border ${
                isSu
                  ? "bg-sky-50 text-sky-800 border-sky-200/80"
                  : "bg-slate-100 text-slate-700 border-slate-200/80"
              }`}
            >
              {config.authorizedDealer}
            </Chip>
          </div>
        </div>

        {/* Action Buttons */}
        <nav className="flex items-center gap-2.5">
          <a
            href={config.phoneHref}
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white active:scale-98 px-3.5 sm:px-4 py-2 rounded-full transition-all shadow-xs hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isSu
                ? "bg-sky-700 hover:bg-sky-800 focus-visible:outline-sky-700"
                : "bg-slate-700 hover:bg-slate-800 focus-visible:outline-slate-700"
            }`}
            aria-label={`Telefonla Sipariş: ${config.phoneFormatted}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSu ? "bg-sky-300" : "bg-slate-400"
                }`}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <PhoneCall className="w-4 h-4 text-white/70" />
            <span className="hidden xs:inline">
              {config.phoneFormatted}
            </span>
            <span className="xs:hidden">Hemen Ara</span>
          </a>

          {/* Su-specific nav */}
          {isSu && (
            <Link
              href="/siparis-takip"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-sky-700 hover:bg-slate-100/70 transition-all px-3 py-2 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Sipariş Takip</span>
            </Link>
          )}

          {/* Cross-link to the other brand */}
          <Link
            href={isSu ? "/kurumsal-tedarik" : "/"}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-sky-700 hover:bg-slate-100/70 transition-all px-3 py-2 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            <span>{isSu ? "Kurumsal" : "Su Siparişi"}</span>
          </Link>

          {/* 
            [GEÇİCİ OLARAK GİZLENDİ - YALNIZCA TELEFONLA SİPARİŞ MODU]
            Sepet Çekmecesi Açma Butonu geçici olarak yorum satırına alınmıştır.
            Geri getirmek için bu yorum bloğunu kaldırmanız yeterlidir.
          */}
          {/*
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Sepeti aç"
            className="relative p-2 text-slate-600 hover:text-sky-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>

            {totalItems > 0 && (
              <span
                aria-live="polite"
                aria-atomic="true"
                className="absolute top-0.5 right-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-sky-700 rounded-full"
              >
                {totalItems}
              </span>
            )}
          </button>
          */}
        </nav>
      </div>
    </header>
  );
}
