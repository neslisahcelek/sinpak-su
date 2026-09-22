import { listActiveProducts } from "@/server/services/product.service";
import { StorefrontLayout } from "@/components/storefront-layout";

/**
 * Layout for the Sinpak Su (water delivery) route group.
 * Wraps all su-facing pages with the su-branded header, footer,
 * floating contact buttons and cart provider.
 */
export default async function SuLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const products = await listActiveProducts().catch(() => []);

  return (
    <StorefrontLayout products={products} brand="su">
      {children}
    </StorefrontLayout>
  );
}
