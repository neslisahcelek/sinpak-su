import { z } from "zod";

/**
 * Normalizes user-entered Turkish mobile phone numbers.
 * Accepts formats like:
 * - "+90 532 123 45 67"
 * - "0532 123 4567"
 * - "5321234567"
 * - "+905321234567"
 *
 * Normalizes to standard E.164 format: "+905XXXXXXXXX".
 * Returns null if the phone number is invalid.
 */
export function normalizeTurkishPhone(input: string): string | null {
  if (!input || typeof input !== "string") return null;

  // Strip all non-digit and non-plus characters
  const sanitized = input.replace(/[\s\-\(\)\.]/g, "");

  let digits = sanitized;
  if (digits.startsWith("+90")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("0090")) {
    digits = digits.slice(4);
  } else if (digits.startsWith("90") && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  // Must be 10 digits starting with 5 (Turkish mobile number)
  if (/^5[0-9]{9}$/.test(digits)) {
    return `+90${digits}`;
  }

  return null;
}

export const orderItemInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number({ error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),
  emptyBottleQuantity: z
    .number({ error: "Empty bottle quantity must be a number" })
    .int("Empty bottle quantity must be an integer")
    .nonnegative("Empty bottle quantity cannot be negative")
    .default(0),
});

export const paymentMethodEnum = z.enum([
  "CASH_ON_DELIVERY",
  "POS",
  "BANK_TRANSFER",
]);

export const createOrderInputSchema = z.object({
  idempotencyKey: z.string().min(1, "Idempotency key is required").max(100),
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name cannot exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .refine((val) => normalizeTurkishPhone(val) !== null, {
      message: "Please enter a valid Turkish mobile phone number",
    })
    .transform((val) => normalizeTurkishPhone(val)!),
  addressLine1: z
    .string()
    .trim()
    .min(5, "Delivery address must be at least 5 characters")
    .max(300, "Delivery address cannot exceed 300 characters"),
  deliveryNotes: z
    .string()
    .trim()
    .max(500, "Delivery notes cannot exceed 500 characters")
    .optional()
    .nullable()
    .transform((val) => (val && val.length > 0 ? val : null)),
  paymentMethod: paymentMethodEnum,
  items: z
    .array(orderItemInputSchema)
    .min(1, "At least one item is required in the order"),
});

export type CreateOrderInput = z.input<typeof createOrderInputSchema>;
export type ValidatedCreateOrderInput = z.output<typeof createOrderInputSchema>;
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
