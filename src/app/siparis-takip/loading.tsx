export default function OrderTrackingLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Sipariş takip sayfası yükleniyor"
      className="px-4 lg:px-6 py-8 max-w-xl mx-auto space-y-4 animate-page-enter"
    >
      <div className="h-8 w-44 bg-slate-200 rounded-md animate-pulse" />
      <div className="h-4 w-72 bg-slate-200 rounded-md animate-pulse" />

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 mt-6">
        <div className="space-y-1.5">
          <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse mt-2" />
      </div>
    </main>
  );
}
