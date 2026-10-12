import { describe, expect, it } from "vitest";
import { siteConfig } from "./site-config";

describe("siteConfig", () => {
  it("provides the application identity", () => {
    expect(siteConfig.name).toBe("Sinpak Su");
    expect(siteConfig.authorizedDealer).toBe("Abant Su Yetkili Bayisi");
    expect(siteConfig.phone).toBe("05454543477");
    expect(siteConfig.phoneFormatted).toBe("0 545 454 34 77");
    expect(siteConfig.contactPerson).toBe("Osman Çelek");
    expect(siteConfig.companyName).toContain("Sinpak Tedarik");
    expect(siteConfig.address.full).toContain("İzmit / Kocaeli");
  });
});
