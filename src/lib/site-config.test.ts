import { describe, expect, it } from "vitest";
import { siteConfig } from "./site-config";

describe("siteConfig", () => {
  it("provides the application identity", () => {
    expect(siteConfig.name).toBe("Sinpak Su");
    expect(siteConfig.authorizedDealer).toBe("Abant Su Yetkili Bayisi");
    expect(siteConfig.phone).toBe("05513634141");
    expect(siteConfig.phoneFormatted).toBe("0 551 363 41 41");
    expect(siteConfig.contactPerson).toBe("Osman Çelek");
    expect(siteConfig.companyName).toContain("Sinpak Tedarik");
    expect(siteConfig.address.full).toContain("İzmit / Kocaeli");
  });
});
