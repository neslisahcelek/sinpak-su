import { describe, it, expect } from "vitest";
import { isHoneypotTriggered } from "./honeypot";

describe("honeypot", () => {
  it("returns false for legitimate human submissions (empty, undefined, null)", () => {
    expect(isHoneypotTriggered(undefined)).toBe(false);
    expect(isHoneypotTriggered(null)).toBe(false);
    expect(isHoneypotTriggered("")).toBe(false);
    expect(isHoneypotTriggered("   ")).toBe(false);
  });

  it("returns true when a bot populates the honeypot field", () => {
    expect(isHoneypotTriggered("http://spam-site.com")).toBe(true);
    expect(isHoneypotTriggered("bot-name")).toBe(true);
    expect(isHoneypotTriggered("123")).toBe(true);
  });
});
