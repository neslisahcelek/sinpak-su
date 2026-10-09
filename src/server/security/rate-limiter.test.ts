import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  clearRateLimit,
  resetRateLimits,
  getClientIp,
  getActiveRateLimitCount,
} from "./rate-limiter";

describe("rate-limiter", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests within the limit", () => {
    const key = "test-user-1";
    const res1 = checkRateLimit(key, 3, 60, 1000);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);
    expect(res1.retryAfterSeconds).toBe(0);

    const res2 = checkRateLimit(key, 3, 60, 1500);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = checkRateLimit(key, 3, 60, 2000);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests that exceed the limit", () => {
    const key = "test-user-2";
    checkRateLimit(key, 2, 60, 1000);
    checkRateLimit(key, 2, 60, 2000);

    const blocked = checkRateLimit(key, 2, 60, 3000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBe(58); // resetAt is 1000 + 60000 = 61000; (61000 - 3000)/1000 = 58
  });

  it("resets limit once window expires", () => {
    const key = "test-user-3";
    checkRateLimit(key, 1, 10, 1000); // Window expires at 11000

    const blocked = checkRateLimit(key, 1, 10, 5000);
    expect(blocked.allowed).toBe(false);

    // After 10s window
    const allowedAfterWindow = checkRateLimit(key, 1, 10, 11001);
    expect(allowedAfterWindow.allowed).toBe(true);
    expect(allowedAfterWindow.remaining).toBe(0);
  });

  it("clears rate limit key manually", () => {
    const key = "test-user-4";
    checkRateLimit(key, 1, 60, 1000);
    expect(checkRateLimit(key, 1, 60, 2000).allowed).toBe(false);

    clearRateLimit(key);
    expect(checkRateLimit(key, 1, 60, 3000).allowed).toBe(true);
  });

  it("purges expired entries after eviction interval", () => {
    checkRateLimit("short-lived-1", 1, 1, 1000); // expires at 2000
    checkRateLimit("short-lived-2", 1, 1, 1000); // expires at 2000
    expect(getActiveRateLimitCount()).toBe(2);

    // Call after EVICTION_INTERVAL_MS (5 min = 300,000ms)
    checkRateLimit("new-key", 1, 60, 350000);
    // Old expired entries should be removed
    expect(getActiveRateLimitCount()).toBe(1);
  });

  describe("getClientIp", () => {
    it("extracts cf-connecting-ip first", () => {
      const headers = new Headers({
        "cf-connecting-ip": "203.0.113.195",
        "x-forwarded-for": "198.51.100.1, 192.0.2.1",
        "x-real-ip": "198.51.100.2",
      });
      expect(getClientIp(headers)).toBe("203.0.113.195");
    });

    it("extracts first ip from x-forwarded-for", () => {
      const headers = new Headers({
        "x-forwarded-for": "198.51.100.42, 192.0.2.1",
        "x-real-ip": "198.51.100.2",
      });
      expect(getClientIp(headers)).toBe("198.51.100.42");
    });

    it("extracts x-real-ip when x-forwarded-for is missing", () => {
      const headers = new Headers({
        "x-real-ip": "198.51.100.99",
      });
      expect(getClientIp(headers)).toBe("198.51.100.99");
    });

    it("defaults to 127.0.0.1 when no headers provided", () => {
      const headers = new Headers();
      expect(getClientIp(headers)).toBe("127.0.0.1");
    });
  });
});
