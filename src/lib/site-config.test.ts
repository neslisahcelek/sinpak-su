import { describe, expect, it } from "vitest";
import { siteConfig } from "./site-config";

describe("siteConfig", () => {
  it("provides the application identity", () => {
    expect(siteConfig.name).toBe("Sinpak Su");
  });
});
