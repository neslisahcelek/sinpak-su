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
