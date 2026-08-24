import { describe, it, expect } from "vitest";
import { OrderStatus, PaymentMethod, ProductType } from "@prisma/client";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BADGE_CLASSES,
  PAYMENT_METHOD_LABELS,
  STATUS_ACTION_LABELS,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_BADGE_CLASSES,
} from "./constants";

describe("Admin Constants & Mappings", () => {
  it("should have human-readable labels for all OrderStatus enum values", () => {
    for (const status of Object.values(OrderStatus)) {
      expect(ORDER_STATUS_LABELS[status]).toBeDefined();
      expect(typeof ORDER_STATUS_LABELS[status]).toBe("string");
      expect(ORDER_STATUS_LABELS[status].length).toBeGreaterThan(0);
    }
  });

  it("should have badge CSS classes for all OrderStatus enum values", () => {
    for (const status of Object.values(OrderStatus)) {
      expect(ORDER_STATUS_BADGE_CLASSES[status]).toBeDefined();
      expect(typeof ORDER_STATUS_BADGE_CLASSES[status]).toBe("string");
      expect(ORDER_STATUS_BADGE_CLASSES[status].length).toBeGreaterThan(0);
    }
  });

  it("should have human-readable labels for all PaymentMethod enum values", () => {
    for (const method of Object.values(PaymentMethod)) {
      expect(PAYMENT_METHOD_LABELS[method]).toBeDefined();
      expect(typeof PAYMENT_METHOD_LABELS[method]).toBe("string");
    }
  });

  it("should have action button labels for all OrderStatus enum values", () => {
    for (const status of Object.values(OrderStatus)) {
      expect(STATUS_ACTION_LABELS[status]).toBeDefined();
      expect(typeof STATUS_ACTION_LABELS[status]).toBe("string");
    }
  });

  it("should have human-readable labels for all ProductType enum values", () => {
    for (const type of Object.values(ProductType)) {
      expect(PRODUCT_TYPE_LABELS[type]).toBeDefined();
      expect(typeof PRODUCT_TYPE_LABELS[type]).toBe("string");
      expect(PRODUCT_TYPE_LABELS[type].length).toBeGreaterThan(0);
    }
  });

  it("should have badge CSS classes for all ProductType enum values", () => {
    for (const type of Object.values(ProductType)) {
      expect(PRODUCT_TYPE_BADGE_CLASSES[type]).toBeDefined();
      expect(typeof PRODUCT_TYPE_BADGE_CLASSES[type]).toBe("string");
      expect(PRODUCT_TYPE_BADGE_CLASSES[type].length).toBeGreaterThan(0);
    }
  });
});

