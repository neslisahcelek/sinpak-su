export default function AdminOrdersLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Siparişler yükleniyor"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-page-enter"
    >
      <div>
        <div className="h-7 w-48 bg-slate-200 rounded-md animate-pulse" />
        <div className="h-4 w-36 bg-slate-200 rounded-md animate-pulse mt-1.5" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["w-16", "w-20", "w-24", "w-28", "w-24"].map((width, i) => (
          <div
            key={i}
            className={`h-9 ${width} bg-slate-200 rounded-lg animate-pulse shrink-0`}
          />
        ))}
      </div>

      {/* Orders list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-28 bg-slate-200 rounded-md animate-pulse" />
                <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse" />
              </div>
              <div className="h-4 w-48 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-3.5 w-64 bg-slate-200 rounded-md animate-pulse" />
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <div className="h-6 w-24 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
