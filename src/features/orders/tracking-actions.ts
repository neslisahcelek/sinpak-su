"use server";

import {
  lookupOrderTracking,
  type OrderTrackingDto,
} from "@/server/services/order-tracking.service";
import type { Result } from "@/server/types/result";
import { err, makeSafeError, ok } from "@/server/types/result";
import { z } from "zod";

const lookupSchema = z.object({
  orderNumber: z.string().trim().min(1, "Sipariş numarası zorunludur.").max(30),
  phone: z.string().trim().min(1, "Telefon numarası zorunludur.").max(20),
});

export type OrderTrackingActionInput = z.infer<typeof lookupSchema>;

/**
 * Server action for customer order tracking.
 * Requires BOTH orderNumber and phone — does not support phone-only lookup.
 */
export async function lookupOrderAction(
  rawInput: OrderTrackingActionInput
): Promise<Result<OrderTrackingDto>> {
  const parsed = lookupSchema.safeParse(rawInput);
  if (!parsed.success) {
    return err(
      makeSafeError(
        "VALIDATION_ERROR",
        "Sipariş numarası ve telefon numarası zorunludur.",
        parsed.error.flatten()
      )
    );
  }

  const { orderNumber, phone } = parsed.data;
  const result = await lookupOrderTracking(orderNumber, phone);

  if (!result) {
    // Return generic "not found" — don't distinguish between wrong number vs wrong phone
    return err(
      makeSafeError(
        "ORDER_NOT_FOUND",
        "Girilen bilgilere ait sipariş bulunamadı. Lütfen sipariş numaranızı ve telefon numaranızı kontrol ediniz."
      )
    );
  }

  return ok(result);
}
