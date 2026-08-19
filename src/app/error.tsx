"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
      <p className="text-red-600 text-base">
        Bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <button
        onClick={reset}
        className="bg-sky-700 hover:bg-sky-800 text-white font-semibold text-base rounded-lg px-5 py-3 min-h-[44px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
      >
        Tekrar Dene
      </button>
    </main>
  );
}
