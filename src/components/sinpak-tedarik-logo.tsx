import React from "react";
import Image from "next/image";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Pure SVG vector mark representing the official Pamukkale travertine terraces.
 * Cascading white mineral ledges with turquoise thermal pools.
 */
export function SinpakTedarikIcon({ size = 28, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="p-water-top" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="p-water-mid" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="p-water-bot" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      {/* Travertine Pool 1 (Top Tier) */}
      <path d="M13 7C17 5 24 5 28 8.5C28 12 22 14 16 13C13 11 12 9 13 7Z" fill="url(#p-water-top)" />
      <path d="M13 7C17 5 24 5 28 8.5C28 12 22 14 16 13" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* Travertine Pool 2 (Middle Left Tier) */}
      <path d="M5 14C9 10 18 10 22 14.5C22 19 14 21 7 19.5C5 17.5 5 15.5 5 14Z" fill="url(#p-water-mid)" />
      <path d="M5 14C9 10 18 10 22 14.5C22 19 14 21 7 19.5" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />

      {/* Travertine Pool 3 (Lower Front Tier) */}
      <path d="M9 20C15 16 26 16 30 20.5C30 26 19 28.5 10 26.5C8 24 8 21.5 9 20Z" fill="url(#p-water-bot)" />
      <path d="M9 20C15 16 26 16 30 20.5C30 26 19 28.5 10 26.5" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showTagline?: boolean;
  useVector?: boolean;
  className?: string;
}

/**
 * High-end corporate brand lockup for Sinpak Tedarik featuring the authentic Pamukkale symbol.
 */
export function SinpakTedarikLogo({
  size = "md",
  variant = "light",
  showTagline = true,
  useVector = true,
  className = "",
}: LogoProps) {
  const isDark = variant === "dark";

  const sizeMap = {
    sm: {
      iconBox: "w-9 h-9 rounded-xl",
      brandText: "text-lg tracking-tight",
      taglineText: "text-[9px] tracking-wider",
      vectorSize: 22,
    },
    md: {
      iconBox: "w-10 h-10 rounded-xl",
      brandText: "text-lg sm:text-xl tracking-tight",
      taglineText: "text-[10px] tracking-widest",
      vectorSize: 26,
    },
    lg: {
      iconBox: "w-13 h-13 rounded-2xl",
      brandText: "text-2xl sm:text-3xl tracking-tight",
      taglineText: "text-xs tracking-widest",
      vectorSize: 34,
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Pamukkale Travertine Symbol Badge */}
      <div
        className={`${currentSize.iconBox} shrink-0 relative overflow-hidden shadow-xs border border-sky-200/80 bg-sky-50 transition-transform duration-200 group-hover:scale-105 flex items-center justify-center`}
      >
        {useVector ? (
          <SinpakTedarikIcon size={currentSize.vectorSize} />
        ) : (
          <Image
            src="/images/pamukkale-symbol.png"
            alt="Pamukkale Travertenleri Simgesi"
            fill
            priority
            sizes="52px"
            className="object-cover"
          />
        )}
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-black ${currentSize.brandText} ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Sinpak
          </span>
          <span
            className={`font-extrabold ${currentSize.brandText} text-sky-700`}
          >
            Tedarik
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-semibold uppercase ${currentSize.taglineText} mt-1 ${
              isDark ? "text-sky-300/90" : "text-slate-500"
            }`}
          >
            Kurumsal Temizlik Hizmetleri
          </span>
        )}
      </div>
    </div>
  );
}
