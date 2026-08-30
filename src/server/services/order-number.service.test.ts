import { describe, it, expect } from "vitest";
import { generateOrderNumber } from "./order-number.service";

describe("generateOrderNumber", () => {
  it("generates order numbers matching the format SP-YYMMDD-XXXX", () => {
    const fixedDate = new Date("2026-08-30T14:30:00.000Z");
    const num = generateOrderNumber(fixedDate);

    // Format check: SP-260830-XXXX (where XXXX is uppercase alphanumeric)
    expect(num).toMatch(/^SP-260830-[0-9A-Z]{4}$/);
  });

  it("generates distinct order numbers on successive calls", () => {
    const fixedDate = new Date("2026-08-30T14:30:00.000Z");
    const set = new Set<string>();

    for (let i = 0; i < 50; i++) {
      set.add(generateOrderNumber(fixedDate));
    }

    expect(set.size).toBe(50);
  });
});
