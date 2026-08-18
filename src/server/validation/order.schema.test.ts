import { describe, it, expect } from "vitest";
import { normalizeTurkishPhone, createOrderInputSchema } from "./order.schema";

describe("Phone Normalization", () => {
  it("normalizes various valid Turkish mobile phone formats to standard E.164 (+905XXXXXXXXX)", () => {
    expect(normalizeTurkishPhone("05321234567")).toBe("+905321234567");
    expect(normalizeTurkishPhone("5321234567")).toBe("+905321234567");
    expect(normalizeTurkishPhone("+905321234567")).toBe("+905321234567");
    expect(normalizeTurkishPhone("00905321234567")).toBe("+905321234567");
    expect(normalizeTurkishPhone("905321234567")).toBe("+905321234567");
    expect(normalizeTurkishPhone("0 (532) 123 45 67")).toBe("+905321234567");
    expect(normalizeTurkishPhone("+90 532 123-45-67")).toBe("+905321234567");
    expect(normalizeTurkishPhone("532.123.4567")).toBe("+905321234567");
  });

  it("rejects invalid phone numbers", () => {
    expect(normalizeTurkishPhone("")).toBeNull();
    expect(normalizeTurkishPhone("12345")).toBeNull();
    expect(normalizeTurkishPhone("02121234567")).toBeNull(); // Landline
    expect(normalizeTurkishPhone("+447911123456")).toBeNull(); // Non-TR
    expect(normalizeTurkishPhone("532123456")).toBeNull(); // Too short
    expect(normalizeTurkishPhone("53212345678")).toBeNull(); // Too long
    expect(normalizeTurkishPhone("abcd5321234567")).toBeNull();
  });
});

describe("Order Input Schema Validation", () => {
  const validPayload = {
    idempotencyKey: "123e4567-e89b-12d3-a456-426614174000",
    customerName: "Ahmet Yılmaz",
    phone: "0532 123 45 67",
    addressLine1: "Yahya Kaptan Mah. Akasyalar Cad. No:4 D:8 İzmit",
    deliveryNotes: "Zili çalmayın lütfen",
    paymentMethod: "CASH_ON_DELIVERY" as const,
    items: [
      {
        productId: "prod_damacana_1",
        quantity: 2,
        emptyBottleQuantity: 1,
      },
    ],
  };

  it("successfully validates and transforms a complete valid payload", () => {
    const result = createOrderInputSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("+905321234567");
      expect(result.data.customerName).toBe("Ahmet Yılmaz");
      expect(result.data.deliveryNotes).toBe("Zili çalmayın lütfen");
    }
  });

  it("handles optional / empty delivery notes gracefully", () => {
    const withoutNotes = { ...validPayload, deliveryNotes: undefined };
    const result = createOrderInputSchema.safeParse(withoutNotes);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.deliveryNotes).toBeNull();
    }

    const withEmptyNotes = { ...validPayload, deliveryNotes: "   " };
    const result2 = createOrderInputSchema.safeParse(withEmptyNotes);
    expect(result2.success).toBe(true);
    if (result2.success) {
      expect(result2.data.deliveryNotes).toBeNull();
    }
  });

  it("rejects delivery notes exceeding 500 characters", () => {
    const longNotes = { ...validPayload, deliveryNotes: "a".repeat(501) };
    const result = createOrderInputSchema.safeParse(longNotes);
    expect(result.success).toBe(false);
  });

  it("rejects customer names that are too short", () => {
    const shortName = { ...validPayload, customerName: "A" };
    const result = createOrderInputSchema.safeParse(shortName);
    expect(result.success).toBe(false);
  });

  it("rejects address lines that are too short", () => {
    const shortAddress = { ...validPayload, addressLine1: "Ev" };
    const result = createOrderInputSchema.safeParse(shortAddress);
    expect(result.success).toBe(false);
  });

  it("rejects empty items array", () => {
    const emptyItems = { ...validPayload, items: [] };
    const result = createOrderInputSchema.safeParse(emptyItems);
    expect(result.success).toBe(false);
  });

  it("rejects invalid item quantity (<= 0 or non-integer)", () => {
    const zeroQty = {
      ...validPayload,
      items: [{ productId: "p1", quantity: 0, emptyBottleQuantity: 0 }],
    };
    expect(createOrderInputSchema.safeParse(zeroQty).success).toBe(false);

    const negativeQty = {
      ...validPayload,
      items: [{ productId: "p1", quantity: -1, emptyBottleQuantity: 0 }],
    };
    expect(createOrderInputSchema.safeParse(negativeQty).success).toBe(false);

    const floatQty = {
      ...validPayload,
      items: [{ productId: "p1", quantity: 1.5, emptyBottleQuantity: 0 }],
    };
    expect(createOrderInputSchema.safeParse(floatQty).success).toBe(false);
  });

  it("rejects invalid empty bottle quantity (< 0 or non-integer)", () => {
    const negativeEmpty = {
      ...validPayload,
      items: [{ productId: "p1", quantity: 2, emptyBottleQuantity: -1 }],
    };
    expect(createOrderInputSchema.safeParse(negativeEmpty).success).toBe(false);
  });
});
