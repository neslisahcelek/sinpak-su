import { listActiveProducts } from "@/server/services/product.service";
import { StorefrontLayout } from "@/components/storefront-layout";

/**
 * Layout for the Sinpak Tedarik (corporate supply) route group.
 * Wraps all tedarik-facing pages with the tedarik-branded header, footer,
 * floating contact buttons and cart provider.
 */
export default async function TedarikLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Products still fetched for CartProvider compatibility, even though
  // the tedarik section doesn't show the water product catalog.
  const products = await listActiveProducts().catch(() => []);

  return (
    <StorefrontLayout products={products} brand="tedarik">
      {children}
    </StorefrontLayout>
  );
}
