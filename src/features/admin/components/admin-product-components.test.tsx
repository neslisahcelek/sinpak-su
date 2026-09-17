import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ProductType } from "@prisma/client";
import { AdminHeader } from "./admin-header";
import { AdminProductList } from "./admin-product-list";
import { AdminProductForm } from "./admin-product-form";
import { AdminProductStatusToggle } from "./admin-product-status-toggle";
import type { AdminProductDto } from "@/server/services/admin-product.service";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/admin/orders",
}));

describe("Admin Product UI Components", () => {
  const mockProducts: AdminProductDto[] = [
    {
      id: "prod_1",
      slug: "19l-damacana-su",
      type: ProductType.DAMACANA_WATER,
      name: "19L Damacana Su",
      description: "Doğal kaynak suyu",
      price: "180",
      depositAmount: "180",
      displayOrder: 1,
      isActive: true,
      imageUrl: "/images/damacana.png",
      createdAt: new Date("2026-08-01T10:00:00.000Z"),
      updatedAt: new Date("2026-08-01T10:00:00.000Z"),
    },
    {
      id: "prod_2",
      slug: "1-5l-fanta",
      type: ProductType.BEVERAGE,
      name: "1.5L Fanta",
      description: "Portakallı gazoz",
      price: "60",
      depositAmount: "0",
      displayOrder: 2,
      isActive: false,
      imageUrl: null,
      createdAt: new Date("2026-08-02T10:00:00.000Z"),
      updatedAt: new Date("2026-08-02T10:00:00.000Z"),
    },
  ];

  describe("AdminHeader Navigation", () => {
    it("renders both Siparişler and Ürünler navigation links", () => {
      const html = renderToString(<AdminHeader username="admin" />);

      expect(html).toContain("Siparişler");
      expect(html).toContain("/admin/orders");
      expect(html).toContain("Ürünler");
      expect(html).toContain("/admin/products");
      expect(html).toContain("admin");
    });

    it("renders mobile navigation bar with accessible touch-friendly tabs", () => {
      const html = renderToString(<AdminHeader username="admin" />);

      expect(html).toContain("Yönetim Mobil Menüsü");
      expect(html).toContain("min-h-[44px]");
      expect(html).toContain("aria-current=\"page\"");
    });
  });

  describe("AdminProductList", () => {
    it("renders product table with names, prices, badges, and edit links", () => {
      const html = renderToString(<AdminProductList products={mockProducts} />);

      expect(html).toContain("19L Damacana Su");
      expect(html).toContain("19l-damacana-su");
      expect(html).toContain("Damacana Su");
      expect(html).toContain("/admin/products/prod_1/edit");

      expect(html).toContain("1.5L Fanta");
      expect(html).toContain("Meşrubat");
      expect(html).toContain("/admin/products/prod_2/edit");
    });

    it("renders empty state when product list is empty with create button", () => {
      const html = renderToString(<AdminProductList products={[]} />);

      expect(html).toContain("Henüz Ürün Bulunmuyor");
      expect(html).toContain("Yeni Ürün Ekle");
      expect(html).toContain("/admin/products/new");
    });
  });

  describe("AdminProductStatusToggle", () => {
    it("renders active toggle badge when currentIsActive is true", () => {
      const html = renderToString(
        <AdminProductStatusToggle
          productId="prod_1"
          currentIsActive={true}
          productName="19L Damacana Su"
        />
      );

      expect(html).toContain("Aktif");
    });

    it("renders inactive toggle badge when currentIsActive is false", () => {
      const html = renderToString(
        <AdminProductStatusToggle
          productId="prod_2"
          currentIsActive={false}
          productName="1.5L Fanta"
        />
      );

      expect(html).toContain("Pasif");
    });
  });

  describe("AdminProductForm", () => {
    it("renders empty create form with required inputs and action buttons", () => {
      const html = renderToString(<AdminProductForm mode="create" />);

      expect(html).toContain("Ürün Adı");
      expect(html).toContain("Ürün Türü");
      expect(html).toContain("Açıklama");
      expect(html).toContain("Birim Fiyat");
      expect(html).toContain("Depozito Tutarı");
      expect(html).toContain("Ürünü Oluştur");
      expect(html).not.toContain("Kalıcı Bağlantı (Slug)");
    });

    it("renders edit form pre-filled with immutable slug display", () => {
      const html = renderToString(
        <AdminProductForm mode="edit" initialData={mockProducts[0]} />
      );

      expect(html).toContain("Değişiklikleri Kaydet");
      expect(html).toContain("Kalıcı Bağlantı (Slug)");
      expect(html).toContain("19l-damacana-su");
      expect(html).toContain("Değiştirilemez");
    });
  });
});
