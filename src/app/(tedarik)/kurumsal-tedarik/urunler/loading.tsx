export default function KurumsalUrunlerLoading() {
  return (
    <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded-md" />
      <div className="h-44 bg-slate-900 rounded-3xl w-full" />
      <div className="h-20 bg-white rounded-2xl border border-slate-200" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    </main>
  );
}
