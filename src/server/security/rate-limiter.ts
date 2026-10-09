/**
 * In-memory sliding-window rate limiter for protecting sensitive endpoints
 * against brute-force, credential stuffing, and bot/DoS floods.
 *
 * Designed with zero external dependencies and zero cloud cost.
 * Includes automatic periodic eviction to prevent memory bloat.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
}

// Map of key -> RateLimitRecord
const store = new Map<string, RateLimitRecord>();

// Eviction interval: Clean expired entries every 5 minutes
const EVICTION_INTERVAL_MS = 5 * 60 * 1000;
let lastEviction = 0;

function purgeExpiredEntries(now: number): void {
  for (const [key, record] of store.entries()) {
    if (now >= record.resetAt) {
      store.delete(key);
    }
  }
}

/**
 * Checks and increments the rate limit counter for a given identifier key.
 *
 * @param key Unique rate limiting key (e.g. `login:192.168.1.1` or `order:05321234567`)
 * @param limit Maximum allowed requests within the time window
 * @param windowSeconds Duration of the rate limit window in seconds
 * @param nowMs Optional current timestamp in milliseconds (defaults to Date.now())
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  nowMs: number = Date.now()
): RateLimitResult {
  // Perform periodic eviction
  if (nowMs - lastEviction > EVICTION_INTERVAL_MS) {
    purgeExpiredEntries(nowMs);
    lastEviction = nowMs;
  }

  const windowMs = windowSeconds * 1000;
  const existing = store.get(key);

  if (!existing || nowMs >= existing.resetAt) {
    // Brand new window
    const resetAt = nowMs + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      retryAfterSeconds: 0,
      resetAt,
    };
  }

  // Active window
  if (existing.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt - nowMs) / 1000)
    );
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSeconds: 0,
    resetAt: existing.resetAt,
  };
}

/**
 * Clears rate limit state for a specific key (useful after successful login).
 */
export function clearRateLimit(key: string): void {
  store.delete(key);
}

/**
 * Resets all rate limiter stores. Strictly for test isolation.
 */
export function resetRateLimits(initialTimeMs: number = 0): void {
  store.clear();
  lastEviction = initialTimeMs;
}

/**
 * Returns the current number of tracked active keys (useful for metrics).
 */
export function getActiveRateLimitCount(): number {
  return store.size;
}

/**
 * Extracts the real client IP address from request headers, respecting common reverse proxy headers.
 */
export function getClientIp(headers: Headers): string {
  // Cloudflare
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Standard X-Forwarded-For (take the first IP in the chain)
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  // Nginx / Vercel X-Real-IP
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Pre-configured rate limiting rules for Sinpak Su.
 */
export const RATE_LIMIT_CONFIGS = {
  // 5 attempts per 15 minutes per IP for admin login
  ADMIN_LOGIN: {
    limit: 5,
    windowSeconds: 15 * 60,
  },
  // 5 orders per 10 minutes per IP
  ORDER_CREATION_IP: {
    limit: 5,
    windowSeconds: 10 * 60,
  },
  // 5 orders per 10 minutes per Phone
  ORDER_CREATION_PHONE: {
    limit: 5,
    windowSeconds: 10 * 60,
  },
  // 15 lookups per minute per IP for order tracking
  ORDER_TRACKING: {
    limit: 15,
    windowSeconds: 60,
  },
} as const;
