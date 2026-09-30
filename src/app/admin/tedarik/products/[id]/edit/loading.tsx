export default function EditSupplyProductLoading() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded-md" />
      <div className="space-y-2">
        <div className="h-7 w-64 bg-slate-200 rounded-md" />
        <div className="h-4 w-96 bg-slate-200 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-24 bg-slate-100 rounded-xl" />
        </div>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-48" />
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-32" />
        </div>
      </div>
    </main>
  );
}
