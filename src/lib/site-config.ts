// ---------------------------------------------------------------------------
// Brand configuration for Sinpak Su (water delivery) and Sinpak Tedarik
// (corporate cleaning / supply).  The two brands share a legal entity,
// address and working hours but differ in phone numbers, taglines, theme
// colours and target audiences.
// ---------------------------------------------------------------------------

const shared = {
  companyName:
    "Sinpak Tedarik Temizlik Kırtasiye ve Gıda Sanayi Ticaret Limited Şirketi",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://sinpaktedarik.com",
  contactPerson: "Osman Çelek",
  address: {
    full: "Yenişehir mah. Asilkent sk. No: 6/A İzmit / Kocaeli",
    street: "Yenişehir mah. Asilkent sk. No: 6/A",
    districtCity: "İzmit / Kocaeli",
  },
  workingHours: "09:00 - 19:00",
} as const;

export const brandConfig = {
  su: {
    ...shared,
    name: "Sinpak Su",
    tagline: "Abant Su Yetkili Bayisi",
    authorizedDealer: "Abant Su Yetkili Bayisi",
    phone: "05513634141",
    phoneFormatted: "0 551 363 41 41",
    phoneHref: "tel:05513634141",
    themeColor: "#0369a1", // sky-700
    description:
      "Abant Su Yetkili Bayisi Sinpak Su - İzmit geneline doğal damacana su, pet su ve soğuk içecek teslimatı.",
  },
  tedarik: {
    ...shared,
    name: "Sinpak Tedarik",
    tagline: "Kurumsal Sarf Malzeme Tedarikçisi",
    authorizedDealer: "Kurumsal Tedarikçi",
    phone: "05454543477",
    phoneFormatted: "0 545 454 34 77",
    phoneHref: "tel:05454543477",
    themeColor: "#1e3a5f", // dark navy
    description:
      "İzmit genelinde kurumsal temizlik, kağıt ürünleri ve sarf malzeme tedariki.",
  },
} as const;

export type BrandKey = keyof typeof brandConfig;
export type BrandConfig = (typeof brandConfig)[BrandKey];

/**
 * Backward-compatible alias.  All existing `siteConfig` references throughout
 * the su-facing codebase continue to work without modification.
 */
export const siteConfig = brandConfig.su;
