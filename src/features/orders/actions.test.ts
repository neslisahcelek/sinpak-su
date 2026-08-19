import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrderAction } from "./actions";
import * as orderService from "@/server/services/order.service";

describe("createOrderAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("delegates order creation input directly to createOrder service", async () => {
    const mockInput = {
      idempotencyKey: "test-key-123",
      customerName: "Ahmet Yılmaz",
      phone: "05321234567",
      addressLine1: "İzmit Merkez No:5",
      paymentMethod: "CASH_ON_DELIVERY" as const,
      items: [{ productId: "p1", quantity: 2, emptyBottleQuantity: 1 }],
    };

    const spy = vi
      .spyOn(orderService, "createOrder")
      .mockResolvedValueOnce({
        success: true,
        data: { publicId: "ord_pub_abc" },
      });

    const result = await createOrderAction(mockInput);

    expect(spy).toHaveBeenCalledWith(mockInput);
    expect(result).toEqual({
      success: true,
      data: { publicId: "ord_pub_abc" },
    });
  });

  it("returns server errors produced by createOrder service", async () => {
    const mockInput = {
      idempotencyKey: "test-key-123",
      customerName: "Ahmet Yılmaz",
      phone: "05321234567",
      addressLine1: "İzmit Merkez No:5",
      paymentMethod: "CASH_ON_DELIVERY" as const,
      items: [{ productId: "p1", quantity: 2, emptyBottleQuantity: 1 }],
    };

    vi.spyOn(orderService, "createOrder").mockResolvedValueOnce({
      success: false,
      error: {
        code: "OUT_OF_OPERATING_HOURS",
        message: "Orders are accepted only between 09:00 and 19:00.",
      },
    });

    const result = await createOrderAction(mockInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("OUT_OF_OPERATING_HOURS");
    }
  });
});
