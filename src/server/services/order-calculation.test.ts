import { describe, it, expect } from "vitest";
import { Prisma, type Product } from "@prisma/client";
import {
  calculateOrderPricing,
  consolidateOrderItems,
  type ConsolidatedItem,
} from "./order.service";

describe("Order Calculation Engine", () => {
  const damacanaProduct: Product = {
    id: "prod_damacana_19l",
    slug: "damacana-su-19l",
    type: "DAMACANA_WATER",
    name: "19L Damacana Su",
    description: "Doğal kaynak suyu",
    price: new Prisma.Decimal(50),
    depositAmount: new Prisma.Decimal(50),
    isActive: true,
    imageUrl: "/damacana.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const bottledWaterProduct: Product = {
    id: "prod_pet_5l",
    slug: "pet-su-5l",
    type: "BOTTLED_WATER",
    name: "5L Pet Su",
    description: "5L pet şişe",
    price: new Prisma.Decimal(25),
    depositAmount: new Prisma.Decimal(0),
    isActive: true,
    imageUrl: "/pet5l.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const beverageProduct: Product = {
    id: "prod_madensuyu_6li",
    slug: "maden-suyu-6li",
    type: "BEVERAGE",
    name: "Maden Suyu 6'lı",
    description: "Doğal maden suyu",
    price: new Prisma.Decimal(40),
    depositAmount: new Prisma.Decimal(0),
    isActive: true,
    imageUrl: "/soda.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const productsMap = new Map<string, Product>([
    [damacanaProduct.id, damacanaProduct],
    [bottledWaterProduct.id, bottledWaterProduct],
    [beverageProduct.id, beverageProduct],
  ]);

  it("calculates damacana with all empty bottles returned (0 deposit charged)", () => {
    // 3 damacanas, 3 empty bottles -> 3 * 50 TL + 0 deposit = 150 TL
    const items: ConsolidatedItem[] = [
      {
        productId: damacanaProduct.id,
        quantity: 3,
        emptyBottleQuantity: 3,
      },
    ];

    const result = calculateOrderPricing(items, productsMap);
    expect(result.success).toBe(true);
    if (result.success) {
      const {
        items: calculatedItems,
        subtotal,
        deliveryFee,
        total,
      } = result.data;
      expect(calculatedItems).toHaveLength(1);
      expect(calculatedItems[0].baseUnitPrice.toString()).toBe("50");
      expect(calculatedItems[0].depositUnitAmount.toString()).toBe("50");
      expect(calculatedItems[0].emptyBottleQuantity).toBe(3);
      expect(calculatedItems[0].depositTotal.toString()).toBe("0");
      expect(calculatedItems[0].lineTotal.toString()).toBe("150");
      expect(subtotal.toString()).toBe("150");
      expect(deliveryFee.toString()).toBe("0");
      expect(total.toString()).toBe("150");
    }
  });

  it("calculates damacana with no empty bottles returned (full deposit charged)", () => {
    // 3 damacanas, 0 empty bottles -> 3 * 50 TL base + 3 * 50 TL deposit = 300 TL
    const items: ConsolidatedItem[] = [
      {
        productId: damacanaProduct.id,
        quantity: 3,
        emptyBottleQuantity: 0,
      },
    ];

    const result = calculateOrderPricing(items, productsMap);
    expect(result.success).toBe(true);
    if (result.success) {
      const { items: calculatedItems, subtotal, total } = result.data;
      expect(calculatedItems[0].depositTotal.toString()).toBe("150");
      expect(calculatedItems[0].lineTotal.toString()).toBe("300");
      expect(subtotal.toString()).toBe("300");
      expect(total.toString()).toBe("300");
    }
  });

  it("calculates partial empty bottle return per documented business example (3 damacana, 2 empty -> 200 TL)", () => {
    // Documented example: 3 damacanas with 2 empties -> (3 * 50) + (1 * 50) = 200 TL
    const items: ConsolidatedItem[] = [
      {
        productId: damacanaProduct.id,
        quantity: 3,
        emptyBottleQuantity: 2,
      },
    ];

    const result = calculateOrderPricing(items, productsMap);
    expect(result.success).toBe(true);
    if (result.success) {
      const { items: calculatedItems, total } = result.data;
      expect(calculatedItems[0].depositTotal.toString()).toBe("50");
      expect(calculatedItems[0].lineTotal.toString()).toBe("200");
      expect(total.toString()).toBe("200");
    }
  });

  it("calculates multi-product order accurately (damacana + bottled water + beverage)", () => {
    const items: ConsolidatedItem[] = [
      {
        productId: damacanaProduct.id,
        quantity: 2,
        emptyBottleQuantity: 1, // (2 * 50) + (1 * 50) = 150 TL
      },
      {
        productId: bottledWaterProduct.id,
        quantity: 4,
        emptyBottleQuantity: 0, // 4 * 25 = 100 TL
      },
      {
        productId: beverageProduct.id,
        quantity: 2,
        emptyBottleQuantity: 0, // 2 * 40 = 80 TL
      },
    ];

    const result = calculateOrderPricing(items, productsMap);
    expect(result.success).toBe(true);
    if (result.success) {
      const {
        items: calculatedItems,
        subtotal,
        deliveryFee,
        total,
      } = result.data;
      expect(calculatedItems).toHaveLength(3);
      expect(calculatedItems[0].lineTotal.toString()).toBe("150");
      expect(calculatedItems[1].lineTotal.toString()).toBe("100");
      expect(calculatedItems[2].lineTotal.toString()).toBe("80");
      expect(subtotal.toString()).toBe("330");
      expect(deliveryFee.toString()).toBe("0");
      expect(total.toString()).toBe("330");
    }
  });

  it("rejects emptyBottleQuantity > 0 for non-damacana products", () => {
    const items: ConsolidatedItem[] = [
      {
        productId: beverageProduct.id,
        quantity: 2,
        emptyBottleQuantity: 1,
      },
    ];

    const result = calculateOrderPricing(items, productsMap);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("INVALID_EMPTY_BOTTLE_QUANTITY");
    }
  });

  it("rejects emptyBottleQuantity > quantity for damacana", () => {
    const items: ConsolidatedItem[] = [
      {
        productId: damacanaProduct.id,
        quantity: 2,
        emptyBottleQuantity: 3,
      },
    ];

    const result = calculateOrderPricing(items, productsMap);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("INVALID_EMPTY_BOTTLE_QUANTITY");
    }
  });

  it("rejects inactive products with PRODUCT_UNAVAILABLE", () => {
    const inactiveMap = new Map(productsMap);
    inactiveMap.set(damacanaProduct.id, {
      ...damacanaProduct,
      isActive: false,
    });

    const items: ConsolidatedItem[] = [
      {
        productId: damacanaProduct.id,
        quantity: 1,
        emptyBottleQuantity: 1,
      },
    ];

    const result = calculateOrderPricing(items, inactiveMap);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("PRODUCT_UNAVAILABLE");
    }
  });

  it("consolidates duplicate product entries in raw item input", () => {
    const rawItems = [
      { productId: "p1", quantity: 2, emptyBottleQuantity: 1 },
      { productId: "p2", quantity: 1, emptyBottleQuantity: 0 },
      { productId: "p1", quantity: 3, emptyBottleQuantity: 2 },
    ];

    const consolidated = consolidateOrderItems(rawItems);
    expect(consolidated).toHaveLength(2);

    const p1 = consolidated.find((c) => c.productId === "p1");
    expect(p1).toBeDefined();
    expect(p1?.quantity).toBe(5);
    expect(p1?.emptyBottleQuantity).toBe(3);

    const p2 = consolidated.find((c) => c.productId === "p2");
    expect(p2).toBeDefined();
    expect(p2?.quantity).toBe(1);
    expect(p2?.emptyBottleQuantity).toBe(0);
  });
});
