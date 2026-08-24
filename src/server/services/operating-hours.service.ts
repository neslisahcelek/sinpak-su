const BUSINESS_TIMEZONE = "Europe/Istanbul";
const OPENING_HOUR = 9;
const CLOSING_HOUR = 19;

/**
 * Checks whether a given Date is within the business operating hours.
 * Operating hours: 09:00 (inclusive) to 19:00 (exclusive) in Europe/Istanbul.
 */
export function isWithinOperatingHours(date: Date = new Date()): boolean {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(
    parts.find((p) => p.type === "minute")?.value ?? "0",
    10
  );

  const totalMinutes = hour * 60 + minute;
  const openingMinutes = OPENING_HOUR * 60; // 09:00 -> 540 min
  const closingMinutes = CLOSING_HOUR * 60; // 19:00 -> 1140 min

  return totalMinutes >= openingMinutes && totalMinutes < closingMinutes;
}

/**
 * Determines whether operating hours restriction is bypassed for order creation.
 * Safe by default: Never bypassed in production environment.
 * Can only be bypassed in non-production test environments when explicitly configured
 * (e.g., APP_ENV=test, NEXT_PUBLIC_APP_ENV=test, or DISABLE_OPERATING_HOURS=true).
 */
export function isOperatingHoursBypassed(): boolean {
  if (typeof process === "undefined" || !process.env) {
    return false;
  }

  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return (
    process.env.APP_ENV === "test" ||
    process.env.NEXT_PUBLIC_APP_ENV === "test" ||
    process.env.DISABLE_OPERATING_HOURS === "true"
  );
}
