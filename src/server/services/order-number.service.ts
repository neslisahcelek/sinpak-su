/**
 * Generates a short, human-readable, customer-facing order number.
 *
 * Format: SP-YYMMDD-XXXX
 * - SP:     Brand prefix ("Sinpak")
 * - YYMMDD: Date in Europe/Istanbul timezone (e.g. 260830 for Aug 30, 2026)
 * - XXXX:   4 random uppercase alphanumeric characters (base-36 entropy)
 *
 * This is deliberately short and easy to read/speak. It is NOT used for
 * security — the tracking lookup also requires phone number verification.
 *
 * Collision risk: At 36^4 = ~1.7M combinations per day, the risk is negligible
 * for a small-volume MVP. The DB unique constraint is the final safety net.
 */
export function generateOrderNumber(now: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  // en-CA gives "YY-MM-DD" format, remove dashes
  const dateStr = formatter.format(now).replace(/-/g, "");

  // 4 random base-36 chars, uppercased
  const rand = Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()
    .padEnd(4, "0");

  return `SP-${dateStr}-${rand}`;
}
