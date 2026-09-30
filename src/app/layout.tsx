import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { NavigationProgressBar } from "@/components/navigation-progress-bar";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const viewport: Viewport = {
  themeColor: "#0369a1",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Sinpak Su | İzmit Abant Su Yetkili Bayisi & Damacana Su Siparişi",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "İzmit su siparişi",
    "damacana su İzmit",
    "Abant Su İzmit bayisi",
    "Sinpak Su",
    "Sinpak Tedarik",
    "Kocaeli su siparişi",
    "Yahyakaptan su siparişi",
    "damacana su",
    "kurumsal su tedariki",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Sinpak Su | İzmit Abant Su Yetkili Bayisi",
    description: siteConfig.description,
    images: [
      {
        url: "/images/sinpak-tedarik-banner-clean.jpg",
        width: 1200,
        height: 630,
        alt: "Sinpak Su - Abant Su Yetkili Bayisi İzmit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinpak Su | İzmit Abant Su Yetkili Bayisi",
    description: siteConfig.description,
    images: ["/images/sinpak-tedarik-banner-clean.jpg"],
  },
  verification: {
    google: "google2246d9a51b58da92",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} bg-slate-50 min-h-screen antialiased`}>
        <GoogleAnalytics />
        <NavigationProgressBar />
        {children}
      </body>
    </html>
  );
}
