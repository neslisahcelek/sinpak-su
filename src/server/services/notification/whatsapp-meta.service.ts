import {
  checkNotificationEligibility,
  recordNotificationSent,
} from "./whatsapp-rate-limiter";

export interface WhatsAppOrderItem {
  productName: string;
  quantity: number;
  emptyBottleQuantity?: number;
}

export interface WhatsAppOrderPayload {
  orderNumber: string;
  customerName: string;
  phone: string;
  addressLine1: string;
  deliveryNotes?: string | null;
  paymentMethod: string;
  total: string | number;
  items: WhatsAppOrderItem[];
}

export interface SendNotificationResult {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH_ON_DELIVERY: "Kapıda Nakit",
  POS: "Kapıda Kredi / Banka Kartı (POS)",
  BANK_TRANSFER: "Banka Havalesi / EFT",
};

/**
 * Normalizes a phone number for Meta Graph API (e.g., 905321234567).
 */
export function formatMetaPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  if (!cleaned.startsWith("90") && cleaned.length === 10) {
    cleaned = `90${cleaned}`;
  }
  return cleaned;
}

/**
 * Builds a readable WhatsApp notification message for the business.
 */
export function buildOrderMessageText(payload: WhatsAppOrderPayload): string {
  const paymentText =
    PAYMENT_METHOD_LABELS[payload.paymentMethod] || payload.paymentMethod;

  const itemsList = payload.items
    .map((item) => {
      const emptyNote =
        item.emptyBottleQuantity && item.emptyBottleQuantity > 0
          ? ` (${item.emptyBottleQuantity} Boş İade)`
          : "";
      return `• ${item.quantity}x ${item.productName}${emptyNote}`;
    })
    .join("\n");

  const lines = [
    `💧 *YENİ SİPARİŞ GELDİ!* (#${payload.orderNumber})`,
    `━━━━━━━━━━━━━━━━━━━`,
    `👤 *Müşteri:* ${payload.customerName}`,
    `📞 *Telefon:* ${payload.phone}`,
    `📍 *Adres:* ${payload.addressLine1}`,
    `💳 *Ödeme:* ${paymentText}`,
    `💰 *Toplam:* ${payload.total} TL`,
    ``,
    `📦 *Sipariş İçeriği:*`,
    itemsList,
  ];

  if (payload.deliveryNotes && payload.deliveryNotes.trim().length > 0) {
    lines.push(``, `📝 *Sipariş Notu:* ${payload.deliveryNotes.trim()}`);
  }

  return lines.join("\n");
}

/**
 * Sends a WhatsApp notification to the business via Meta Cloud API.
 * This function is fail-safe and guaranteed not to throw exceptions to the caller.
 */
export async function sendWhatsAppOrderNotification(
  payload: WhatsAppOrderPayload
): Promise<SendNotificationResult> {
  const isEnabled = process.env.WHATSAPP_ENABLED === "true";
  if (!isEnabled) {
    return { success: true, skipped: true, reason: "WHATSAPP_DISABLED" };
  }

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const recipientPhone = process.env.WHATSAPP_RECIPIENT_PHONE;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v21.0";
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;

  if (!phoneNumberId || !accessToken || !recipientPhone) {
    console.warn(
      "[WhatsAppNotification] Incomplete Meta WhatsApp credentials in environment variables."
    );
    return {
      success: false,
      skipped: true,
      reason: "MISSING_CREDENTIALS",
    };
  }

  // 1. Rate Limiter & Safety Cap Check
  const eligibility = checkNotificationEligibility(payload.phone);
  if (!eligibility.allowed) {
    console.info(
      `[WhatsAppNotification] Notification skipped for order ${payload.orderNumber}: ${eligibility.reason}`
    );
    return {
      success: true,
      skipped: true,
      reason: eligibility.reason,
    };
  }

  const cleanRecipient = formatMetaPhoneNumber(recipientPhone);
  const messageBody = buildOrderMessageText(payload);

  // 2. Prepare Meta Cloud API request body
  let requestBody: Record<string, unknown>;

  if (templateName && templateName.trim().length > 0) {
    // Template format
    requestBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanRecipient,
      type: "template",
      template: {
        name: templateName.trim(),
        language: { code: "tr" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: payload.orderNumber },
              { type: "text", text: payload.customerName },
              { type: "text", text: payload.phone },
              { type: "text", text: payload.addressLine1 },
              { type: "text", text: String(payload.total) },
            ],
          },
        ],
      },
    };
  } else {
    // Freeform text format
    requestBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanRecipient,
      type: "text",
      text: {
        preview_url: false,
        body: messageBody,
      },
    };
  }

  // 3. Dispatch to Meta Cloud API (Fail-Safe)
  try {
    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[WhatsAppNotification] Meta API responded with status ${response.status}:`,
        errorText.substring(0, 300)
      );
      return {
        success: false,
        error: `META_API_STATUS_${response.status}`,
      };
    }

    // Record success in rate limiter
    recordNotificationSent(payload.phone);
    return { success: true };
  } catch (error) {
    console.error(
      "[WhatsAppNotification] Network or execution error while dispatching message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return {
      success: false,
      error: "NETWORK_DISPATCH_ERROR",
    };
  }
}
