"use client";

import { siteConfig } from "@/lib/site-config";

export function FloatingContactButtons() {
  /*
  const whatsappUrl = `https://wa.me/90${siteConfig.phone.slice(
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

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
      */}

      {/* Floating Direct Call Button */}
      <a
        href={siteConfig.phoneHref}
        aria-label={`Hemen Telefonla Ara: ${siteConfig.phoneFormatted}`}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        {/* Animated Pulse Ring */}
        <span
          className="absolute -inset-1 rounded-full bg-red-500 opacity-40 animate-ping pointer-events-none"
          aria-hidden="true"
        />

        {/* Tooltip / Direct Label */}
        <span className="absolute right-full mr-3 px-3.5 py-2 rounded-xl bg-slate-900/95 backdrop-blur-xs text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg hidden sm:flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Hemen Ara: {siteConfig.phoneFormatted}</span>
        </span>

        {/* Phone Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 relative z-10"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </aside>
  );
}
