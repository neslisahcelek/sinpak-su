import { OrderStatus, PaymentMethod, ProductType } from "@prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Beklemede",
  [OrderStatus.OUT_FOR_DELIVERY]: "Dağıtımda",
  [OrderStatus.DELIVERED]: "Teslim Edildi",
  [OrderStatus.CANCELLED]: "İptal Edildi",
};

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-200",
  [OrderStatus.OUT_FOR_DELIVERY]:
    "bg-indigo-50 text-indigo-700 border-indigo-200",
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
  [OrderStatus.OUT_FOR_DELIVERY]: "Kuryeye / Dağıtıma Çıkar",
  [OrderStatus.DELIVERED]: "Teslim Edildi Olarak Tamamla",
  [OrderStatus.CANCELLED]: "Siparişi İptal Et",
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  [ProductType.DAMACANA_WATER]: "Damacana Su",
  [ProductType.BOTTLED_WATER]: "Şişe Su",
  [ProductType.BEVERAGE]: "Meşrubat",
};

export const PRODUCT_TYPE_BADGE_CLASSES: Record<ProductType, string> = {
  [ProductType.DAMACANA_WATER]: "bg-sky-50 text-sky-700 border-sky-200",
  [ProductType.BOTTLED_WATER]: "bg-teal-50 text-teal-700 border-teal-200",
  [ProductType.BEVERAGE]: "bg-amber-50 text-amber-700 border-amber-200",
};
