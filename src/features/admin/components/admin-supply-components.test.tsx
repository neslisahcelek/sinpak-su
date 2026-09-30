import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { AdminHeader } from "./admin-header";
import { AdminSupplyCategoryList } from "./admin-supply-category-list";
import { AdminSupplyProductList } from "./admin-supply-product-list";
import { AdminSupplyProductForm } from "./admin-supply-product-form";
import type { SupplyCategoryDto } from "@/server/services/admin-supply-category.service";
import type { SupplyProductDto } from "@/server/services/admin-supply-product.service";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/admin/tedarik/products",
}));

describe("Admin Supply UI Components", () => {
  const mockCategories: SupplyCategoryDto[] = [
    {
      id: "cat_1",
      slug: "kagit-hijyen",
      name: "Kağıt & Hijyen",
      description: "Kağıt ürünleri",
      displayOrder: 1,
      isActive: true,
      productCount: 2,
      createdAt: new Date("2026-08-01T10:00:00.000Z"),
      updatedAt: new Date("2026-08-01T10:00:00.000Z"),
    },
    {
      id: "cat_2",
      slug: "temizlik-kimyasallari",
      name: "Temizlik Kimyasalları",
      description: null,
      displayOrder: 2,
      isActive: false,
      productCount: 0,
      createdAt: new Date("2026-08-02T10:00:00.000Z"),
      updatedAt: new Date("2026-08-02T10:00:00.000Z"),
    },
  ];

  const mockProducts: SupplyProductDto[] = [
    {
      id: "prod_1",
      slug: "z-katlama-havlu",
      categoryId: "cat_1",
      categoryName: "Kağıt & Hijyen",
      categorySlug: "kagit-hijyen",
      name: "Z Katlama Havlu 200'lü",
      description: "Dispenser uyumlu",
      unit: "12'li Koli",
      price: "320",
      displayOrder: 1,
      isActive: true,
      imageUrl: "/images/havlu.jpg",
      createdAt: new Date("2026-08-01T10:00:00.000Z"),
      updatedAt: new Date("2026-08-01T10:00:00.000Z"),
    },
    {
      id: "prod_2",
      slug: "endustriyel-sivi-sabun-5l",
      categoryId: "cat_1",
      categoryName: "Kağıt & Hijyen",
      categorySlug: "kagit-hijyen",
      name: "Endüstriyel Sıvı Sabun 5L",
      description: null,
      unit: "5L Bidon",
      price: null,
      displayOrder: 2,
      isActive: false,
      imageUrl: null,
      createdAt: new Date("2026-08-02T10:00:00.000Z"),
      updatedAt: new Date("2026-08-02T10:00:00.000Z"),
    },
  ];

  describe("AdminHeader Navigation for Supply", () => {
    it("renders both Su and Kurumsal Tedarik navigation links", () => {
      const html = renderToString(<AdminHeader username="admin" />);

      expect(html).toContain("Su");
      expect(html).toContain("Tedarik");
      expect(html).toContain("/admin/orders");
      expect(html).toContain("/admin/products");
      expect(html).toContain("/admin/tedarik/products");
      expect(html).toContain("/admin/tedarik/categories");
    });
  });

  describe("AdminSupplyCategoryList", () => {
    it("renders category rows with product counts", () => {
      const html = renderToString(
        <AdminSupplyCategoryList categories={mockCategories} />
      );

      expect(html).toContain("Kağıt &amp; Hijyen");
      expect(html).toContain("Temizlik Kimyasalları");
      expect(html).toContain("ürün");
      expect(html).toContain("Aktif");
      expect(html).toContain("Pasif");
    });

    it("renders empty state when no categories exist", () => {
      const html = renderToString(<AdminSupplyCategoryList categories={[]} />);

      expect(html).toContain(
        "Henüz eklenmiş bir tedarik kategorisi bulunmuyor."
      );
    });
  });

  describe("AdminSupplyProductList", () => {
    it("renders products with packaging unit and price or quote badge", () => {
      const html = renderToString(
        <AdminSupplyProductList
          products={mockProducts}
          categories={mockCategories}
        />
      );

      expect(html).toContain("Z Katlama Havlu 200&#x27;lü");
      expect(html).toContain("12&#x27;li Koli");
      expect(html).toContain("320.00");
      expect(html).toContain("Endüstriyel Sıvı Sabun 5L");
      expect(html).toContain("5L Bidon");
      expect(html).toContain("Teklif Alınız");
    });


    it("renders empty state when no products exist", () => {
      const html = renderToString(
        <AdminSupplyProductList products={[]} categories={mockCategories} />
      );

      expect(html).toContain("Henüz kurumsal tedarik ürünü eklenmemiş.");
    });
  });

  describe("AdminSupplyProductForm", () => {
    it("renders create form with category options", () => {
      const html = renderToString(
        <AdminSupplyProductForm mode="create" categories={mockCategories} />
      );

      expect(html).toContain("Ürün Bilgileri");
      expect(html).toContain("Kağıt &amp; Hijyen");
      expect(html).toContain("Temizlik Kimyasalları");
      expect(html).toContain("Birim / Ambalaj");
      expect(html).toContain("Ürünü Kaydet");
    });

    it("renders edit form prefilled with initialData", () => {
      const html = renderToString(
        <AdminSupplyProductForm
          mode="edit"
          categories={mockCategories}
          initialData={mockProducts[0]}
        />
      );

      expect(html).toContain("Değişiklikleri Güncelle");
      expect(html).toContain("Z Katlama Havlu 200&#x27;lü");
    });
  });
});
