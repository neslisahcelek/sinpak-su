import { describe, it, expect } from "vitest";
import manifest from "./manifest";

describe("Web App Manifest (PWA)", () => {
  it("provides valid PWA configuration for Sinpak Su", () => {
    const config = manifest();

    expect(config.name).toContain("Sinpak Su");
    expect(config.short_name).toBe("Sinpak Su");
    expect(config.start_url).toBe("/");
    expect(config.display).toBe("standalone");
    expect(config.theme_color).toBeDefined();
    expect(config.background_color).toBeDefined();
    expect(config.icons?.length).toBeGreaterThan(0);
  });
});
