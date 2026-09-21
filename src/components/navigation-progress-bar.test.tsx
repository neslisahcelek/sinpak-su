import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { NavigationProgressBar } from "./navigation-progress-bar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/orders",
  useSearchParams: () => new URLSearchParams(),
}));

describe("NavigationProgressBar", () => {
  it("renders into hidden container initially during SSR without throwing error", () => {
    const html = renderToString(<NavigationProgressBar />);
    expect(html).toContain("z-[9999]");
    expect(html).toContain("opacity:0");
  });
});
