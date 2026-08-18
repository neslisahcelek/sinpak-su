import { describe, it, expect } from "vitest";
import { isWithinOperatingHours } from "./operating-hours.service";

describe("Operating Hours Service", () => {
  // Istanbul is UTC+3 (no DST since 2016)
  // 09:00 Istanbul = 06:00 UTC
  // 19:00 Istanbul = 16:00 UTC

  it("rejects orders before 09:00 Istanbul time (e.g. 08:59)", () => {
    // 08:59 Istanbul = 05:59 UTC
    const beforeOpen = new Date("2026-08-18T05:59:00.000Z");
    expect(isWithinOperatingHours(beforeOpen)).toBe(false);
  });

  it("accepts orders at exactly 09:00 Istanbul time", () => {
    // 09:00 Istanbul = 06:00 UTC
    const atOpen = new Date("2026-08-18T06:00:00.000Z");
    expect(isWithinOperatingHours(atOpen)).toBe(true);
  });

  it("accepts orders during midday", () => {
    // 14:30 Istanbul = 11:30 UTC
    const midday = new Date("2026-08-18T11:30:00.000Z");
    expect(isWithinOperatingHours(midday)).toBe(true);
  });

  it("accepts orders at 18:59 Istanbul time", () => {
    // 18:59 Istanbul = 15:59 UTC
    const beforeClose = new Date("2026-08-18T15:59:00.000Z");
    expect(isWithinOperatingHours(beforeClose)).toBe(true);
  });

  it("rejects orders at exactly 19:00 Istanbul time", () => {
    // 19:00 Istanbul = 16:00 UTC
    const atClose = new Date("2026-08-18T16:00:00.000Z");
    expect(isWithinOperatingHours(atClose)).toBe(false);
  });

  it("rejects orders after 19:00 Istanbul time (e.g. 19:01, 23:00, midnight)", () => {
    // 19:01 Istanbul = 16:01 UTC
    const afterClose = new Date("2026-08-18T16:01:00.000Z");
    expect(isWithinOperatingHours(afterClose)).toBe(false);

    // Midnight Istanbul = 21:00 UTC (prev day)
    const midnight = new Date("2026-08-18T21:00:00.000Z");
    expect(isWithinOperatingHours(midnight)).toBe(false);
  });
});
