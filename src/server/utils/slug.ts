const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  i: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
  â: "a",
  Â: "a",
  î: "i",
  Î: "i",
  û: "u",
  Û: "u",
};

/**
 * Converts text into a URL-safe, Turkish-aware normalized slug.
 *
 * Examples:
 * - "19L Damacana Su" -> "19l-damacana-su"
 * - "Özlem Su 0.5L (Cam Şişe)" -> "ozlem-su-0-5l-cam-sise"
 * - "Ilık Şalgam & Şıra" -> "ilik-salgam-sira"
 */
export function slugifyTurkish(text: string): string {
  if (!text || typeof text !== "string") {
    return "urun";
  }

  // 1. Replace Turkish characters specifically
  let processed = text.replace(
    /[çÇğĞıIİiöÖşŞüÜâÂîÎûÛ]/g,
    (char) => TURKISH_CHAR_MAP[char] ?? char
  );

  // 2. Convert to lowercase
  processed = processed.toLowerCase();

  // 3. Normalize Unicode (decompose accents/diacritics) and remove remaining marks
  processed = processed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 4. Replace non-alphanumeric characters with hyphens
  processed = processed.replace(/[^a-z0-9]+/g, "-");

  // 5. Replace multiple consecutive hyphens with a single hyphen
  processed = processed.replace(/-+/g, "-");

  // 6. Trim leading and trailing hyphens
  processed = processed.replace(/^-+|-+$/g, "");

  // 7. Fallback if empty after sanitization
  return processed || "urun";
}
