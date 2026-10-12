/* eslint-disable @next/next/no-sync-scripts */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { GoogleAnalytics, trackEvent } from "./google-analytics";

vi.mock("next/script", () => ({
  default: ({
    src,
    id,
    dangerouslySetInnerHTML,
  }: {
    src?: string;
    id?: string;
    dangerouslySetInnerHTML?: { __html: string };
  }) => (
    <script
      src={src}
      id={id}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  ),
}));

describe("GoogleAnalytics Component & Event Tracking", () => {
  const originalEnv = process.env.NEXT_PUBLIC_GA_ID;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA_ID = originalEnv;
    delete (globalThis as unknown as { window?: { gtag?: unknown } }).window;
  });

  it("renders empty when NEXT_PUBLIC_GA_ID is not configured", () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    const html = renderToString(<GoogleAnalytics />);
    expect(html).toBe("");
  });

  it("renders script tags when NEXT_PUBLIC_GA_ID is configured", () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST123456";
    const html = renderToString(<GoogleAnalytics />);
    expect(html).toContain("G-TEST123456");
    expect(html).toContain("googletagmanager.com/gtag/js?id=G-TEST123456");
  });

  it("trackEvent safely dispatches gtag event when window.gtag is available", () => {
    const mockGtag = vi.fn();
    (globalThis as unknown as { window: { gtag: typeof mockGtag } }).window = {
      gtag: mockGtag,
    };

    trackEvent("contact_phone", { phone_number: "05513634141" });
    expect(mockGtag).toHaveBeenCalledWith("event", "contact_phone", {
      phone_number: "05513634141",
    });
  });

  it("trackEvent does not throw when window or gtag is undefined", () => {
    expect(() => trackEvent("contact_phone")).not.toThrow();
  });
});
