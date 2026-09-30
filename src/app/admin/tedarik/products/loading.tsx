export default function AdminSupplyProductsLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-60 bg-slate-200 rounded-md" />
          <div className="h-4 w-40 bg-slate-200 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-slate-200 rounded-xl" />
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
        </div>
      </div>

      <div className="h-14 bg-slate-200 rounded-2xl w-full" />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="h-16 bg-slate-50 rounded-xl w-full" />
        <div className="h-16 bg-slate-50 rounded-xl w-full" />
        <div className="h-16 bg-slate-50 rounded-xl w-full" />
      </div>
    </main>
  );
}
