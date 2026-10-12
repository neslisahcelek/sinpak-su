"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Dispatches a custom GA4 event if Google Analytics is loaded.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!gaId) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        trackEvent("contact_phone", {
          phone_number: href.replace("tel:", ""),
          link_text: (
            target.textContent ||
            target.getAttribute("aria-label") ||
            ""
          ).trim(),
          page_location: window.location.pathname,
        });
      } else if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        trackEvent("contact_whatsapp", {
          link_url: href,
          link_text: (
            target.textContent ||
            target.getAttribute("aria-label") ||
            ""
          ).trim(),
          page_location: window.location.pathname,
        });
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, [gaId]);

  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
