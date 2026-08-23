import Link from "next/link";

export default function AdminNotFound() {
  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        Sayfa Bulunamadı
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        Yönetim panelinde aradığınız sayfa mevcut değil.
      </p>
      <Link
        href="/admin/orders"
        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-sm"
      >
        &larr; Siparişler Ekranına Dön
      </Link>
    </main>
  );
}
