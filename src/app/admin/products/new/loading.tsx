export default function AdminProductNewLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Yeni ürün formu yükleniyor"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-page-enter"
    >
      <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="h-7 w-48 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-4 w-64 bg-slate-200 rounded-md animate-pulse" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-24 w-full bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </main>
  );
}
