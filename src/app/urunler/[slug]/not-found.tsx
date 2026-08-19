import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="px-4 lg:px-6 py-16 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[40vh] gap-6 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-300"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-950">
          Ürün Bulunamadı
        </h1>
        <p className="text-base text-slate-600">
          Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
        </p>
      </div>
      <Link
        href="/"
        className="bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-semibold text-base rounded-lg px-5 py-3 min-h-[44px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 inline-flex items-center"
      >
        Ürünlere Dön
      </Link>
    </main>
  );
}
