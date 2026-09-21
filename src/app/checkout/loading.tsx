export default function CheckoutLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Ödeme sayfası yükleniyor"
      className="px-4 lg:px-6 py-8 max-w-5xl mx-auto space-y-6 animate-page-enter"
    >
      <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form fields skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="h-5 w-36 bg-slate-200 rounded animate-pulse border-b border-slate-100 pb-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="h-20 w-full bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Order summary skeleton */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
