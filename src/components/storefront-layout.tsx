"use client";

import { usePathname } from "next/navigation";
import type { ProductDto } from "@/server/services/product.service";
import { CartProvider } from "@/features/cart/cart-provider";
import { Header } from "@/components/header";
import { CartDrawer } from "@/features/cart/cart-drawer";

interface StorefrontLayoutProps {
  children: React.ReactNode;
  products: ProductDto[];
}

/**
 * Shell component for customer-facing pages.
 * Isolates CartProvider, customer Header, and CartDrawer so they are
 * never mounted on /admin/* routes, ensuring admin views are clean and
 * customer cart state in localStorage is untouched during admin operations.
 */
export function StorefrontLayout({
  children,
  products,
}: StorefrontLayoutProps) {
  const pathname = usePathname();
  const isAdmin =
    pathname === "/admin" || Boolean(pathname?.startsWith("/admin/"));

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider products={products}>
      <Header />
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
