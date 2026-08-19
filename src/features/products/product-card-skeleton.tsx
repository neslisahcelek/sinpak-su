export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl shadow-sm border border-slate-200 bg-white flex flex-col overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-slate-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="mt-auto pt-2 h-12 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}
