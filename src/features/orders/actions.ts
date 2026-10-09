"use server";

import {
  createOrder,
  type CreateOrderResult,
} from "@/server/services/order.service";
import type { CreateOrderInput } from "@/server/validation/order.schema";
import type { Result } from "@/server/types/result";
import { err, makeSafeError } from "@/server/types/result";
import { headers } from "next/headers";
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_CONFIGS,
} from "@/server/security/rate-limiter";
import { isHoneypotTriggered } from "@/server/security/honeypot";

/**
 * Server action adapter for creating a customer order.
 * Enforces honeypot bot detection, IP rate limiting, and delegates to the order service.
 */
export async function createOrderAction(
  input: CreateOrderInput
): Promise<Result<CreateOrderResult>> {
  // 1. Passive bot detection (honeypot)
  if (isHoneypotTriggered(input.website)) {
    return err(
      makeSafeError(
        "BOT_DETECTED",
        "İsteğiniz güvenlik denetimini geçemedi. Lütfen tekrar deneyiniz."
      )
    );
  }

  // 2. IP Rate Limiting
  let clientIp = "127.0.0.1";
  try {
    const headersList = await headers();
    clientIp = getClientIp(headersList);
  } catch {
    // Test environments or contexts without headers
  }

  const ipRateLimitKey = `order-create-ip:${clientIp}`;
  const ipRateLimit = checkRateLimit(
    ipRateLimitKey,
    RATE_LIMIT_CONFIGS.ORDER_CREATION_IP.limit,
    RATE_LIMIT_CONFIGS.ORDER_CREATION_IP.windowSeconds
  );

  if (!ipRateLimit.allowed) {
    return err(
      makeSafeError(
        "RATE_LIMIT_EXCEEDED",
        `Kısa sürede çok fazla sipariş denemesi yapıldı. Lütfen ${ipRateLimit.retryAfterSeconds} saniye sonra tekrar deneyiniz.`
      )
    );
  }

  return await createOrder(input);
}
