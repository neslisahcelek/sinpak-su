"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number>(0);

  const startProgress = () => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!containerRef.current || !barRef.current) return;

    progressRef.current = 25;
    containerRef.current.style.opacity = "1";
    barRef.current.style.transitionDuration = "200ms";
    barRef.current.style.width = "25%";

    timerRef.current = setInterval(() => {
      if (progressRef.current >= 88) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }
      const remaining = 90 - progressRef.current;
      const step = Math.max(1, Math.floor(remaining * 0.15));
      progressRef.current = Math.min(88, progressRef.current + step);

      if (barRef.current) {
        barRef.current.style.width = `${progressRef.current}%`;
      }
    }, 120);
  };

  const completeProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!containerRef.current || !barRef.current) return;

    progressRef.current = 100;
    barRef.current.style.transitionDuration = "150ms";
    barRef.current.style.width = "100%";

    fadeTimerRef.current = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = "0";
      }
      fadeTimerRef.current = setTimeout(() => {
        if (barRef.current) {
          barRef.current.style.transitionDuration = "0ms";
          barRef.current.style.width = "0%";
          progressRef.current = 0;
        }
      }, 200);
    }, 180);
  };

  // Complete progress on pathname or searchParams change via DOM
  useEffect(() => {
    completeProgress();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [pathname, searchParams]);

  // Intercept link clicks and popstate
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (targetUrl.origin !== currentUrl.origin) return;

        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          return;
        }

        startProgress();
      } catch {
        // Fallback for unexpected URL formats
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-200"
      style={{ opacity: 0 }}
    >
      <div
        ref={barRef}
        className="h-[3px] bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 transition-all ease-out"
        style={{
          width: "0%",
          boxShadow:
            "0 0 10px rgba(2, 132, 199, 0.8), 0 0 4px rgba(56, 189, 248, 0.6)",
        }}
      />
    </div>
  );
}

export function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
