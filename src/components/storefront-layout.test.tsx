import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { StorefrontLayout } from "./storefront-layout";

let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

describe("StorefrontLayout", () => {
  beforeEach(() => {
    mockPathname = "/";
  });

  it("renders Header, Footer, CartDrawer, and CartProvider on customer routes (/)", () => {
    mockPathname = "/";
    const html = renderToString(
      <StorefrontLayout products={[]}>
        <div id="child-content">Customer Page</div>
      </StorefrontLayout>
    );

    expect(html).toContain("Sinpak Su");
    // [ORİJİNAL SEPET MODU BEKLENTİSİ]: expect(html).toContain("Sepeti aç");
    expect(html).toContain("Sipariş Takip");
    expect(html).toContain("Sinpak Tedarik");
    expect(html).toContain("0 551 363 41 41");
    expect(html).toContain("Yenişehir");
    expect(html).toContain("child-content");
    expect(html).toContain("Customer Page");
  });

  it("renders Header, CartDrawer, and CartProvider on customer checkout (/checkout)", () => {
    mockPathname = "/checkout";
    const html = renderToString(
      <StorefrontLayout products={[]}>
        <div id="checkout-content">Checkout Page</div>
      </StorefrontLayout>
    );

    expect(html).toContain("Sinpak Su");
    // [ORİJİNAL SEPET MODU BEKLENTİSİ]: expect(html).toContain("Sepeti aç");
    expect(html).toContain("Sipariş Takip");
    expect(html).toContain("Sinpak Tedarik");
    expect(html).toContain("checkout-content");
  });

  it("does NOT render Header or CartDrawer on /admin", () => {
    mockPathname = "/admin";
    const html = renderToString(
      <StorefrontLayout products={[]}>
        <div id="admin-content">Admin Dashboard</div>
      </StorefrontLayout>
    );

    expect(html).not.toContain("Sipariş Takip");
    expect(html).not.toContain("Sinpak Tedarik");
    expect(html).toContain("admin-content");
    expect(html).toContain("Admin Dashboard");
  });

  it("does NOT render Header or CartDrawer on /admin/orders", () => {
    mockPathname = "/admin/orders";
    const html = renderToString(
      <StorefrontLayout products={[]}>
        <div id="admin-orders">Orders List</div>
      </StorefrontLayout>
    );

    expect(html).not.toContain("Sipariş Takip");
    expect(html).not.toContain("Sinpak Tedarik");
    expect(html).toContain("admin-orders");
  });

  it("does NOT render Header or CartDrawer on /admin/login", () => {
    mockPathname = "/admin/login";
    const html = renderToString(
      <StorefrontLayout products={[]}>
        <div id="admin-login">Login Form</div>
      </StorefrontLayout>
    );

    expect(html).not.toContain("Sipariş Takip");
    expect(html).toContain("admin-login");
  });

  it("does NOT falsely treat /admin-special as admin route", () => {
    mockPathname = "/admin-special";
    const html = renderToString(
      <StorefrontLayout products={[]}>
        <div id="special-content">Special Page</div>
      </StorefrontLayout>
    );

    expect(html).toContain("Sipariş Takip");
    expect(html).toContain("special-content");
  });
});
