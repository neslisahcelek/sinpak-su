export default function AdminProductsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Ürünler yükleniyor"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-page-enter"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-7 w-40 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-4 w-48 bg-slate-200 rounded-md animate-pulse mt-1.5" />
        </div>

        <div className="h-10 w-36 bg-slate-200 rounded-lg animate-pulse self-start sm:self-auto" />
      </div>

      {/* Desktop table skeleton */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="h-4 w-12 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-slate-100 bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="px-4 py-3.5 flex items-center justify-between gap-4"
            >
              <div className="h-6 w-6 bg-slate-200 rounded animate-pulse shrink-0" />
              <div className="w-12 h-12 rounded-lg bg-slate-200 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-6 w-14 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile card skeleton */}
      <div className="lg:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-lg bg-slate-200 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-12 bg-slate-50 rounded-lg animate-pulse border border-slate-100" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <div className="h-6 w-14 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
