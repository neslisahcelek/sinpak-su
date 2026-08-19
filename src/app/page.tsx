import { listActiveProducts, type ProductDto } from "@/server/services/product.service";
import { ProductGrid } from "@/features/products/product-grid";

export default async function HomePage() {
  let products: ProductDto[] = [];
  let fetchError = false;

  try {
    products = await listActiveProducts();
  } catch {
    fetchError = true;
  }

  return (
    <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 mb-6">
        Ürünlerimiz
      </h1>
      {fetchError ? (
        <p className="text-red-600 text-base">
          Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
