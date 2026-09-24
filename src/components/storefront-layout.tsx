"use client";

import { usePathname } from "next/navigation";
import type { ProductDto } from "@/server/services/product.service";
import type { BrandKey } from "@/lib/site-config";
import { CartProvider } from "@/features/cart/cart-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { FloatingContactButtons } from "@/components/floating-contact-buttons";

interface StorefrontLayoutProps {
  children: React.ReactNode;
  products: ProductDto[];
  brand?: BrandKey;
}

/**
 * Shell component for customer-facing pages.
 * Isolates CartProvider, customer Header, Footer, and CartDrawer so they are
 * never mounted on /admin/* routes, ensuring admin views are clean and
 * customer cart state in localStorage is untouched during admin operations.
 *
 * The `brand` prop controls which brand identity (Sinpak Su vs Sinpak Tedarik)
 * is used for the header, footer and floating contact buttons.
 */
export function StorefrontLayout({
  children,
  products,
  brand = "su",
}: StorefrontLayoutProps) {
  const pathname = usePathname();
  const isAdmin =
    pathname === "/admin" || Boolean(pathname?.startsWith("/admin/"));

  if (isAdmin) {
    return <>{children}</>;
  }

  const isProductDetail = Boolean(pathname?.startsWith("/urunler/"));

  return (
    <CartProvider products={products}>
      <div className="min-h-screen flex flex-col">
        <Header brand={brand} />
        <div className="flex-1">{children}</div>
        <Footer brand={brand} />
      </div>
      <CartDrawer />
      <FloatingContactButtons brand={brand} hasBottomBar={isProductDetail} />
    </CartProvider>
  );
}
