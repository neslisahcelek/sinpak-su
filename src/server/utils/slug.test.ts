import { describe, it, expect } from "vitest";
import { slugifyTurkish } from "./slug";

describe("Turkish-aware Slug Generation (slugifyTurkish)", () => {
  it("converts basic ASCII strings to lowercase hyphenated slugs", () => {
    expect(slugifyTurkish("19L Damacana Su")).toBe("19l-damacana-su");
    expect(slugifyTurkish("Coca Cola 1.5L")).toBe("coca-cola-1-5l");
  });

  it("handles Turkish specific characters correctly", () => {
    // ç -> c, ğ -> g, ı -> i, ö -> o, ş -> s, ü -> u, İ -> i
    expect(slugifyTurkish("Çiçek Suyu")).toBe("cicek-suyu");
    expect(slugifyTurkish("Ilık Su")).toBe("ilik-su");
    expect(slugifyTurkish("İstanbul Doğal Kaynak")).toBe(
      "istanbul-dogal-kaynak"
    );
    expect(slugifyTurkish("Özlem Şişe")).toBe("ozlem-sise");
    expect(slugifyTurkish("Üzüm & Şalgam Suyu")).toBe("uzum-salgam-suyu");
    expect(slugifyTurkish("Ağrı Dağı Suyu")).toBe("agri-dagi-suyu");
  });

  it("handles circumflex vowels (â, î, û)", () => {
    expect(slugifyTurkish("Kâr Amacı")).toBe("kar-amaci");
    expect(slugifyTurkish("Milli Sükûn")).toBe("milli-sukun");
  });

  it("replaces special punctuation and symbols with single hyphens", () => {
    expect(slugifyTurkish("Su %100 Doğal (19L) - Özel")).toBe(
      "su-100-dogal-19l-ozel"
    );
    expect(slugifyTurkish("---Test---Ürün---")).toBe("test-urun");
  });

  it("handles empty, nullish or symbol-only inputs safely", () => {
    expect(slugifyTurkish("")).toBe("urun");
    expect(slugifyTurkish("   ")).toBe("urun");
    expect(slugifyTurkish("!@#$%^&*()")).toBe("urun");
  });
});
