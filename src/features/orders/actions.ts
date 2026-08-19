"use server";

import {
  createOrder,
  type CreateOrderResult,
} from "@/server/services/order.service";
import type { CreateOrderInput } from "@/server/validation/order.schema";
import type { Result } from "@/server/types/result";

/**
 * Server action adapter for creating a customer order.
 * Delegates directly to the authoritative domain order service.
 */
export async function createOrderAction(
  input: CreateOrderInput
): Promise<Result<CreateOrderResult>> {
  return await createOrder(input);
}
