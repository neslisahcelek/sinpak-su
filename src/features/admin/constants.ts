import { OrderStatus, PaymentMethod } from "@prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Beklemede",
  [OrderStatus.CONFIRMED]: "Onaylandı",
  [OrderStatus.PREPARING]: "Hazırlanıyor",
  [OrderStatus.OUT_FOR_DELIVERY]: "Dağıtımda",
  [OrderStatus.DELIVERED]: "Teslim Edildi",
  [OrderStatus.CANCELLED]: "İptal Edildi",
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-200",
  [OrderStatus.CONFIRMED]: "bg-blue-50 text-blue-700 border-blue-200",
  [OrderStatus.PREPARING]: "bg-purple-50 text-purple-700 border-purple-200",
  [OrderStatus.OUT_FOR_DELIVERY]: "bg-indigo-50 text-indigo-700 border-indigo-200",
  [OrderStatus.DELIVERED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [OrderStatus.CANCELLED]: "bg-rose-50 text-rose-700 border-rose-200",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH_ON_DELIVERY]: "Kapıda Nakit",
  [PaymentMethod.POS]: "Kapıda Kredi / Banka Kartı (POS)",
  [PaymentMethod.BANK_TRANSFER]: "Banka Havalesi / EFT",
};

export const STATUS_ACTION_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Beklemeye Al",
  [OrderStatus.CONFIRMED]: "Siparişi Onayla",
  [OrderStatus.PREPARING]: "Hazırlığa Başla",
  [OrderStatus.OUT_FOR_DELIVERY]: "Kuryeye / Dağıtıma Çıkar",
  [OrderStatus.DELIVERED]: "Teslim Edildi Olarak Tamamla",
  [OrderStatus.CANCELLED]: "Siparişi İptal Et",
};
