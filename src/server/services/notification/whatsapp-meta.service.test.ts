import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  formatMetaPhoneNumber,
  buildOrderMessageText,
  sendWhatsAppOrderNotification,
  type WhatsAppOrderPayload,
} from "./whatsapp-meta.service";
import {
  checkNotificationEligibility,
  recordNotificationSent,
  resetRateLimiter,
} from "./whatsapp-rate-limiter";

describe("formatMetaPhoneNumber", () => {
  it("formats 10-digit Turkish phone without leading zero", () => {
    expect(formatMetaPhoneNumber("5321234567")).toBe("905321234567");
  });

  it("formats 11-digit Turkish phone with leading zero", () => {
    expect(formatMetaPhoneNumber("05321234567")).toBe("905321234567");
  });

  it("handles formatted phone numbers with spaces, dashes, and plus sign", () => {
    expect(formatMetaPhoneNumber("+90 (532) 123-4567")).toBe("905321234567");
  });

  it("leaves already formatted 12-digit international numbers intact", () => {
    expect(formatMetaPhoneNumber("905321234567")).toBe("905321234567");
  });
});

describe("buildOrderMessageText", () => {
  const samplePayload: WhatsAppOrderPayload = {
    orderNumber: "ORD-20260917-ABC",
    customerName: "Ali Yılmaz",
    phone: "05321234567",
    addressLine1: "Tepecik Mah. İnönü Cad. No:12 D:4 İzmit",
    deliveryNotes: "Zile basmayın, bebek uyuyor.",
    paymentMethod: "CASH_ON_DELIVERY",
    total: "250.00",
    items: [
      {
        productName: "19L Damacana Su",
        quantity: 2,
        emptyBottleQuantity: 2,
      },
      {
        productName: "24'lü Kutu Su",
        quantity: 1,
      },
    ],
  };

  it("contains order number, customer name, address, and total", () => {
    const text = buildOrderMessageText(samplePayload);
    expect(text).toContain("ORD-20260917-ABC");
    expect(text).toContain("Ali Yılmaz");
    expect(text).toContain("05321234567");
    expect(text).toContain("Tepecik Mah. İnönü Cad.");
    expect(text).toContain("Kapıda Nakit");
    expect(text).toContain("250.00 TL");
    expect(text).toContain("• 2x 19L Damacana Su (2 Boş İade)");
    expect(text).toContain("• 1x 24'lü Kutu Su");
    expect(text).toContain("Zile basmayın, bebek uyuyor.");
  });

  it("omits delivery notes section when not present", () => {
    const textWithoutNotes = buildOrderMessageText({
      ...samplePayload,
      deliveryNotes: null,
    });
    expect(textWithoutNotes).not.toContain("Sipariş Notu:");
  });
});

describe("whatsapp-rate-limiter", () => {
  beforeEach(() => {
    resetRateLimiter();
    delete process.env.WHATSAPP_COOLDOWN_SECONDS;
    delete process.env.WHATSAPP_MONTHLY_LIMIT;
  });

  it("allows initial notification for a phone number", () => {
    const result = checkNotificationEligibility("05321112233");
    expect(result.allowed).toBe(true);
  });

  it("blocks rapid duplicate notifications within cooldown window", () => {
    process.env.WHATSAPP_COOLDOWN_SECONDS = "180";
    const phone = "05321112233";

    recordNotificationSent(phone);

    const check = checkNotificationEligibility(phone);
    expect(check.allowed).toBe(false);
    expect(check.reason).toBe("COOLDOWN_ACTIVE");

    // Different phone is still allowed
    const differentPhoneCheck = checkNotificationEligibility("05339998877");
    expect(differentPhoneCheck.allowed).toBe(true);
  });

  it("blocks notifications when monthly quota is reached", () => {
    process.env.WHATSAPP_MONTHLY_LIMIT = "2";

    recordNotificationSent("05320000001");
    recordNotificationSent("05320000002");

    const check = checkNotificationEligibility("05320000003");
    expect(check.allowed).toBe(false);
    expect(check.reason).toBe("MONTHLY_QUOTA_EXCEEDED");
  });
});

describe("sendWhatsAppOrderNotification", () => {
  const originalEnv = { ...process.env };
  const mockPayload: WhatsAppOrderPayload = {
    orderNumber: "ORD-TEST-001",
    customerName: "Ayşe Kaya",
    phone: "05329876543",
    addressLine1: "Karabaş Mah. Cumhuriyet Cad. No:10 İzmit",
    paymentMethod: "POS",
    total: "180.00",
    items: [{ productName: "19L Damacana Su", quantity: 1 }],
  };

  beforeEach(() => {
    resetRateLimiter();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("skips notification when WHATSAPP_ENABLED is not set to true", async () => {
    process.env.WHATSAPP_ENABLED = "false";
    const result = await sendWhatsAppOrderNotification(mockPayload);
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("WHATSAPP_DISABLED");
  });

  it("skips notification when credentials are missing", async () => {
    process.env.WHATSAPP_ENABLED = "true";
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WHATSAPP_RECIPIENT_PHONE;

    const result = await sendWhatsAppOrderNotification(mockPayload);
    expect(result.success).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("MISSING_CREDENTIALS");
  });

  it("dispatches HTTP POST request to Meta API and succeeds", async () => {
    process.env.WHATSAPP_ENABLED = "true";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "phone_id_123";
    process.env.WHATSAPP_ACCESS_TOKEN = "access_token_abc";
    process.env.WHATSAPP_RECIPIENT_PHONE = "05321112233";

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ messages: [{ id: "wamid.12345" }] }),
    } as Response);

    const result = await sendWhatsAppOrderNotification(mockPayload);

    expect(result.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain("/phone_id_123/messages");
    expect(calledOptions?.headers).toMatchObject({
      Authorization: "Bearer access_token_abc",
      "Content-Type": "application/json",
    });

    const parsedBody = JSON.parse(calledOptions?.body as string);
    expect(parsedBody.to).toBe("905321112233");
    expect(parsedBody.type).toBe("text");
    expect(parsedBody.text.body).toContain("ORD-TEST-001");
  });

  it("catches fetch error fail-safe and never throws to caller", async () => {
    process.env.WHATSAPP_ENABLED = "true";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "phone_id_123";
    process.env.WHATSAPP_ACCESS_TOKEN = "access_token_abc";
    process.env.WHATSAPP_RECIPIENT_PHONE = "05321112233";

    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("Network connection dropped")
    );

    const result = await sendWhatsAppOrderNotification(mockPayload);
    expect(result.success).toBe(false);
    expect(result.error).toBe("NETWORK_DISPATCH_ERROR");
  });
});
