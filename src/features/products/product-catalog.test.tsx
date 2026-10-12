import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ProductCard } from "./product-card";
import { ProductCatalogSection } from "./product-catalog-section";
import { FloatingContactButtons } from "@/components/floating-contact-buttons";
import {
  CartContext,
  type CartContextType,
} from "@/features/cart/cart-context";
import type { ProductDto } from "@/server/services/product.service";

const now = new Date();

const sampleProducts: ProductDto[] = [
  {
    id: "p-damacana-1",
    slug: "damacana-19l",
    name: "19L Damacana Su",
    description: "Doğal kaynak suyu",
    type: "DAMACANA_WATER",
    price: "180.00",
    depositAmount: "180.00",
    imageUrl: null,
    displayOrder: 1,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-pet-1",
    slug: "pet-su-0-5l",
    name: "0.5L Pet Su (12li)",
    description: "Doğal pet su",
    type: "BOTTLED_WATER",
    price: "75.00",
    depositAmount: "0.00",
    imageUrl: null,
    displayOrder: 2,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-cola-1",
    slug: "cola-1-5l",
    name: "1.5L Coca-Cola",
    description: "Soğuk meşrubat",
    type: "BEVERAGE",
    price: "60.00",
    depositAmount: "0.00",
    imageUrl: null,
    displayOrder: 3,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

const mockCartContext: CartContextType = {
  items: [],
  products: sampleProducts,
  addToCart: () => {},
  updateQuantity: () => {},
  updateEmptyBottles: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  totalItems: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
};

function renderWithCart(ui: React.ReactElement) {
  return renderToString(
    <CartContext.Provider value={mockCartContext}>{ui}</CartContext.Provider>
  );
}

describe("ProductCard", () => {
  it("renders product name, price, and phone order button uniformly", () => {
    const html = renderWithCart(<ProductCard product={sampleProducts[0]} />);

    expect(html).toContain("19L Damacana Su");
    expect(html).toContain("180,00");
    expect(html).toContain("Hemen Ara");
    expect(html).toContain("tel:05513634141");
    // [ORİJİNAL SEPET MODU BEKLENTİSİ]: expect(html).toContain("Sepete Ekle");
    expect(html).not.toContain("depozito");
  });

  it("renders non-damacana products with identical clean structure", () => {
    const html = renderWithCart(<ProductCard product={sampleProducts[1]} />);

    expect(html).toContain("0.5L Pet Su (12li)");
    expect(html).toContain("75,00");
    expect(html).toContain("Hemen Ara");
    expect(html).toContain("tel:05513634141");
    // [ORİJİNAL SEPET MODU BEKLENTİSİ]: expect(html).toContain("Sepete Ekle");
    expect(html).not.toContain("depozito");
  });
});

describe("ProductCatalogSection", () => {
  it("renders category filter tabs with product counts", () => {
    const html = renderWithCart(
      <ProductCatalogSection products={sampleProducts} />
    );

    expect(html).toContain("Tüm Ürünler");
    expect(html).toContain("Damacana");
    expect(html).toContain("Pet Şişe");
    expect(html).toContain("İçecekler");
    expect(html).toContain("19L Damacana Su");
    expect(html).toContain("0.5L Pet Su (12li)");
    expect(html).toContain("1.5L Coca-Cola");
  });
});

describe("FloatingContactButtons", () => {
  it("renders direct call link with phone number (WhatsApp temporarily hidden)", () => {
    const html = renderToString(<FloatingContactButtons />);

    expect(html).toContain("tel:05513634141");
    expect(html).toContain("0 551 363 41 41");
    // [ORİJİNAL WHATSAPP BEKLENTİSİ - GERİ AÇILDIĞINDA AKTİF EDİLECEK]:
    // expect(html).toContain("wa.me/905513634141");
    // expect(html).toContain("WhatsApp ile Sipariş");
  });
});
