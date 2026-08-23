import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { listActiveProducts } from "@/server/services/product.service";
import { StorefrontLayout } from "@/components/storefront-layout";
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
   * The list is passed to StorefrontLayout so the customer-facing CartProvider
   * can display up-to-date product names and prices without persisting them
   * to localStorage.
   */
  const products = await listActiveProducts().catch(() => []);

  return (
    <html lang="tr">
      <body className="bg-slate-50 min-h-screen">
        <StorefrontLayout products={products}>{children}</StorefrontLayout>
      </body>
    </html>
  );
}
