import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrderAction } from "./actions";
import * as orderService from "@/server/services/order.service";
import { resetRateLimits } from "@/server/security/rate-limiter";

describe("createOrderAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetRateLimits();
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

    const spy = vi.spyOn(orderService, "createOrder").mockResolvedValueOnce({
      success: true,
      data: { publicId: "ord_pub_abc", orderNumber: "SP-260830-1234" },
    });

    const result = await createOrderAction(mockInput);

    expect(spy).toHaveBeenCalledWith(mockInput);
    expect(result).toEqual({
      success: true,
      data: { publicId: "ord_pub_abc", orderNumber: "SP-260830-1234" },
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

  it("blocks bot submission when honeypot field is populated", async () => {
    const spy = vi.spyOn(orderService, "createOrder");

    const mockBotInput = {
      idempotencyKey: "bot-key-123",
      customerName: "Bot Spammer",
      phone: "05321234567",
      addressLine1: "Bot Address",
      paymentMethod: "CASH_ON_DELIVERY" as const,
      website: "https://spamlink.ru",
      items: [{ productId: "p1", quantity: 1, emptyBottleQuantity: 0 }],
    };

    const result = await createOrderAction(mockBotInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("BOT_DETECTED");
    }
    expect(spy).not.toHaveBeenCalled();
  });

  it("enforces rate limit on rapid successive orders", async () => {
    vi.spyOn(orderService, "createOrder").mockResolvedValue({
      success: true,
      data: { publicId: "ord_1", orderNumber: "SP-1" },
    });

    const mockInput = {
      idempotencyKey: "key-1",
      customerName: "Ahmet",
      phone: "05321234567",
      addressLine1: "Address",
      paymentMethod: "CASH_ON_DELIVERY" as const,
      items: [{ productId: "p1", quantity: 1, emptyBottleQuantity: 0 }],
    };

    // 5 allowed
    for (let i = 0; i < 5; i++) {
      const res = await createOrderAction({
        ...mockInput,
        idempotencyKey: `key-${i}`,
      });
      expect(res.success).toBe(true);
    }

    // 6th blocked
    const blockedRes = await createOrderAction({
      ...mockInput,
      idempotencyKey: "key-6",
    });
    expect(blockedRes.success).toBe(false);
    if (!blockedRes.success) {
      expect(blockedRes.error.code).toBe("RATE_LIMIT_EXCEEDED");
    }
  });
});
