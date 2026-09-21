export default function AdminLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Yükleniyor"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-page-enter"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-4 w-32 bg-slate-200 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-lg animate-pulse" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-3">
          <div className="h-9 w-28 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-9 w-28 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-9 w-28 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="h-5 w-44 bg-slate-200 rounded-md animate-pulse" />
                <div className="h-3.5 w-28 bg-slate-200 rounded-md animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
