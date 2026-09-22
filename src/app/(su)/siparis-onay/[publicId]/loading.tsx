export default function OrderConfirmationLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Sipariş onay bilgisi yükleniyor"
      className="px-4 lg:px-6 py-8 max-w-3xl mx-auto space-y-6 animate-page-enter"
    >
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto animate-pulse" />
        <div className="h-8 w-64 bg-slate-200 rounded-md mx-auto animate-pulse" />
        <div className="h-4 w-80 bg-slate-200 rounded-md mx-auto animate-pulse" />
      </div>

      <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-6 text-center space-y-2">
        <div className="h-4 w-32 bg-slate-200 rounded mx-auto animate-pulse" />
        <div className="h-8 w-44 bg-slate-200 rounded-md mx-auto animate-pulse" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-3 divide-y divide-slate-100">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="pt-3 first:pt-0 flex justify-between">
              <div className="space-y-1">
                <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
