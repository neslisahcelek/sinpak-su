export default function AdminOrderDetailLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Sipariş detayı yükleniyor"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-page-enter"
    >
      <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />

      {/* Header bar skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-7 w-32 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
          </div>
          <div className="h-4 w-48 bg-slate-200 rounded-md animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="p-4 space-y-4 divide-y divide-slate-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="pt-3 first:pt-0 flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="h-5 w-36 bg-slate-200 rounded animate-pulse border-b border-slate-100 pb-3" />
            <div className="space-y-3">
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="h-5 w-44 bg-slate-200 rounded animate-pulse border-b border-slate-100 pb-3" />
            <div className="space-y-3">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
