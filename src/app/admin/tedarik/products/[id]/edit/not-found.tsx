import Link from "next/link";

export default function SupplyProductNotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
        🔍
      </div>
      <h1 className="text-xl font-bold text-slate-900">
        Ürün Bulunamadı
      </h1>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">
        Düzenlemek istediğiniz kurumsal tedarik ürünü bulunamadı veya silinmiş olabilir.
      </p>
      <Link
        href="/admin/tedarik/products"
        className="inline-block px-4 py-2 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
      >
        ← Ürün Listesine Dön
      </Link>
    </main>
  );
}
