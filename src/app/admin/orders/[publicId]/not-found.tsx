import Link from "next/link";

export default function AdminOrderNotFound() {
  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-slate-900 mb-2">
        Sipariş Bulunamadı
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        İstediğiniz sipariş kaydı veritabanında bulunamadı veya silinmiş olabilir.
      </p>

      <Link
        href="/admin/orders"
        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-sm"
      >
        &larr; Sipariş Listesine Dön
      </Link>
    </main>
  );
}
