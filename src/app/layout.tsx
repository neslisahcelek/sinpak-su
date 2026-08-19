import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { listActiveProducts } from "@/server/services/product.service";
import { CartProvider } from "@/features/cart/cart-provider";
import { Header } from "@/components/header";
import { CartDrawer } from "@/features/cart/cart-drawer";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /**
   * Fetch the active product catalog once per request in this Server Component.
   * The list is passed to CartProvider so the client-side cart can display
   * up-to-date product names and prices without persisting them to localStorage.
   * Prices stored in localStorage would be stale; only productId + quantity
   * are persisted per the architecture spec.
   */
  const products = await listActiveProducts().catch(() => []);

  return (
    <html lang="tr">
      <body className="bg-slate-50 min-h-screen">
        <CartProvider products={products}>
          <Header />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
