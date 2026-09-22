export default function ProductDetailLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Ürün detayları yükleniyor"
      className="px-4 lg:px-6 py-8 max-w-5xl mx-auto animate-page-enter"
    >
      <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
        {/* Product image skeleton */}
        <div className="w-full lg:w-3/5 shrink-0">
          <div className="aspect-[4/3] w-full bg-slate-200 rounded-xl animate-pulse" />
        </div>

        {/* Product info skeleton */}
        <div className="flex flex-col gap-4 mt-6 lg:mt-0 lg:w-2/5 flex-1">
          <div className="h-8 w-4/5 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-10 w-36 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-6 w-44 bg-slate-200 rounded-full animate-pulse" />
          <div className="space-y-2 mt-2">
            <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse mt-4 hidden lg:block" />
        </div>
      </div>
    </main>
  );
}
