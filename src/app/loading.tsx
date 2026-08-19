import { ProductCardSkeleton } from "@/features/products/product-card-skeleton";

export default function Loading() {
  return (
    <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto">
      <div className="h-9 w-48 bg-slate-200 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
