/**
 * Rate Limiter and Quota Guard for WhatsApp Order Notifications.
 *
 * Protects against:
 * 1. Rapid successive orders by the same customer/phone number (cooldown).
 * 2. Exceeding Meta's free tier conversation limit (monthly safety cap / circuit breaker).
 */

interface RateLimiterState {
  phoneLastSent: Map<string, number>;
  monthlyCount: number;
  currentMonthKey: string;
}

const state: RateLimiterState = {
  phoneLastSent: new Map<string, number>(),
  monthlyCount: 0,
  currentMonthKey: getCurrentMonthKey(),
};

function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function normalizePhoneKey(phone: string): string {
  // Strip all non-digit characters for consistent matching
  return phone.replace(/\D/g, "");
}

function ensureCurrentMonth(): void {
  const nowKey = getCurrentMonthKey();
  if (state.currentMonthKey !== nowKey) {
    state.currentMonthKey = nowKey;
    state.monthlyCount = 0;
    state.phoneLastSent.clear();
  }
}

/**
 * Checks whether a notification can be sent to WhatsApp.
 */
export function checkNotificationEligibility(phone: string): {
  allowed: boolean;
  reason?: "COOLDOWN_ACTIVE" | "MONTHLY_QUOTA_EXCEEDED";
} {
  ensureCurrentMonth();

  const monthlyLimit = parseInt(
    process.env.WHATSAPP_MONTHLY_LIMIT || "850",
    10
  );
  if (state.monthlyCount >= monthlyLimit) {
    return {
      allowed: false,
      reason: "MONTHLY_QUOTA_EXCEEDED",
    };
  }

  const cooldownSeconds = parseInt(
    process.env.WHATSAPP_COOLDOWN_SECONDS || "180",
    10
  );
  const cleanPhone = normalizePhoneKey(phone);
  const lastSentTime = state.phoneLastSent.get(cleanPhone);

  if (lastSentTime) {
    const elapsedSeconds = (Date.now() - lastSentTime) / 1000;
    if (elapsedSeconds < cooldownSeconds) {
      return {
        allowed: false,
        reason: "COOLDOWN_ACTIVE",
      };
    }
  }

  return { allowed: true };
}

/**
 * Records that a notification was successfully sent.
 */
export function recordNotificationSent(phone: string): void {
  ensureCurrentMonth();
  const cleanPhone = normalizePhoneKey(phone);
  state.phoneLastSent.set(cleanPhone, Date.now());
  state.monthlyCount += 1;
}

/**
 * Resets the in-memory state. Strictly for testing purposes.
 */
export function resetRateLimiter(): void {
  state.phoneLastSent.clear();
  state.monthlyCount = 0;
  state.currentMonthKey = getCurrentMonthKey();
}

/**
 * Returns current statistics for monitoring.
 */
export function getRateLimiterStats(): {
  monthlyCount: number;
  currentMonthKey: string;
  trackedPhonesCount: number;
} {
  ensureCurrentMonth();
  return {
    monthlyCount: state.monthlyCount,
    currentMonthKey: state.currentMonthKey,
    trackedPhonesCount: state.phoneLastSent.size,
  };
}
