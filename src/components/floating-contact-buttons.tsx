"use client";

import { PhoneCall } from "lucide-react";
import { brandConfig, type BrandKey } from "@/lib/site-config";

interface FloatingContactButtonsProps {
  brand?: BrandKey;
}

export function FloatingContactButtons({
  brand = "su",
}: FloatingContactButtonsProps) {
  const config = brandConfig[brand];
  const isSu = brand === "su";

  /*
  const whatsappUrl = `https://wa.me/90${config.phone.slice(
    1
  )}?text=${encodeURIComponent(
    "Merhaba, Sinpak Su siparişi vermek istiyorum."
  )}`;
  */

  return (
    <aside
      aria-label="Hızlı İletişim ve Arama"
      className="fixed right-4 bottom-6 z-40 flex flex-col items-end gap-3 pointer-events-auto"
    >
      {/* 
        [GEÇİCİ OLARAK GİZLENDİ - YALNIZCA TELEFONLA SİPARİŞ MODU]
        WhatsApp butonu geliştiricinin talebiyle geçici olarak yorum satırına alınmıştır.
        Geri getirmek için bu yorum bloğunu kaldırmanız yeterlidir.
      */}
      {/* 
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile Sipariş Ver"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        <span className="absolute right-full mr-3 px-3.5 py-2 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg hidden sm:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>WhatsApp ile Sipariş</span>
        </span>
      </a>
      */}

      {/* Floating Direct Call Button */}
      <a
        href={config.phoneHref}
        aria-label={`Hemen Telefonla Ara: ${config.phoneFormatted}`}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full text-white shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isSu
            ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600"
            : "bg-slate-700 hover:bg-slate-800 focus-visible:outline-slate-700"
        }`}
      >
        {/* Animated Pulse Ring */}
        <span
          className={`absolute -inset-1 rounded-full opacity-40 animate-ping pointer-events-none ${
            isSu ? "bg-red-500" : "bg-slate-500"
          }`}
          aria-hidden="true"
        />

        {/* Tooltip / Direct Label */}
        <span
          className={`absolute right-full mr-3 px-3.5 py-2 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg hidden sm:flex items-center gap-1.5`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              isSu ? "bg-red-500" : "bg-slate-400"
            }`}
          />
          <span>Hemen Ara: {config.phoneFormatted}</span>
        </span>

        {/* Phone Icon */}
        <PhoneCall className="w-6 h-6 relative z-10 text-white animate-pulse" />
      </a>
    </aside>
  );
}
