import Link from "next/link";

export default function OrderNotFound() {
  return (
    <main className="px-4 lg:px-6 py-16 max-w-xl mx-auto text-center flex flex-col items-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-950 mb-2">
        Sipariş Bulunamadı
      </h1>
      <p className="text-base text-slate-600 mb-6">
        Aradığınız sipariş numarası bulunamadı veya geçersiz.
      </p>
      <Link
        href="/"
        className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base rounded-lg px-6 py-3 min-h-[44px] inline-flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        Ana Sayfaya Dön
      </Link>
    </main>
  );
}
