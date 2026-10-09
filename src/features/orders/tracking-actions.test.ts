import { describe, it, expect, vi, beforeEach } from "vitest";
import { lookupOrderAction } from "./tracking-actions";
import * as trackingService from "@/server/services/order-tracking.service";
import { resetRateLimits } from "@/server/security/rate-limiter";

describe("lookupOrderAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetRateLimits();
  });

  it("returns tracking data when order is found", async () => {
    vi.spyOn(trackingService, "lookupOrderTracking").mockResolvedValueOnce({
      orderNumber: "SP-260830-4F3A",
      status: "OUT_FOR_DELIVERY",
      createdAt: new Date(),
      updatedAt: new Date(),
      deliveredAt: null,
      cancelledAt: null,
      total: "150.00",
      items: [
        {
          productName: "19L Damacana Su",
          productType: "DAMACANA_WATER",
          quantity: 2,
          lineTotal: "150.00",
        },
      ],
    });

    const result = await lookupOrderAction({
      orderNumber: "SP-260830-4F3A",
      phone: "05321234567",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.orderNumber).toBe("SP-260830-4F3A");
    }
  });

  it("enforces rate limit after exceeding 15 queries per minute", async () => {
    vi.spyOn(trackingService, "lookupOrderTracking").mockResolvedValue(null);

    // 15 allowed attempts
    for (let i = 0; i < 15; i++) {
      const res = await lookupOrderAction({
        orderNumber: `SP-${i}`,
        phone: "05321234567",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.code).toBe("ORDER_NOT_FOUND");
      }
    }

    // 16th attempt blocked by rate limiter
    const blockedRes = await lookupOrderAction({
      orderNumber: "SP-99",
      phone: "05321234567",
    });
    expect(blockedRes.success).toBe(false);
    if (!blockedRes.success) {
      expect(blockedRes.error.code).toBe("RATE_LIMIT_EXCEEDED");
    }
  });
});
