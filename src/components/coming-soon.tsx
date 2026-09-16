export function ComingSoon() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Decorative Water Icon & Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
        </span>
        Hazırlıklarımız Sürüyor
      </div>

      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-200 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>

      {/* Main Headings */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 max-w-2xl mb-4">
        Sitemiz Çok Yakında <span className="text-sky-600">Hizmetinizde!</span>
      </h1>

      <p className="text-base sm:text-lg text-slate-600 max-w-xl mb-10 leading-relaxed">
        Doğal ve taze su siparişlerinizi kapınıza kadar ulaştıracak online sipariş
        sistemimiz çok yakında açılıyor. Sizlere en iyi deneyimi sunmak için
        hazırlıklarımızı tamamlamak üzereyiz.
      </p>

      {/* Highlights / Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full text-left mb-12">
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19" />
              <line x1="23" x2="23" y1="13" y2="13" />
              <line x1="1" x2="1" y1="13" y2="13" />
              <circle cx="7" cy="18" r="2" />
              <circle cx="17" cy="18" r="2" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Hızlı Teslimat
          </h2>
          <p className="text-sm text-slate-500">
            Siparişleriniz en kısa sürede adresinize ulaştırılacak.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Sağlıklı & Güvenilir
          </h2>
          <p className="text-sm text-slate-500">
            Hijyenik standartlara uygun, taze ve kaliteli içme suyu.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-3 font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <line x1="12" x2="12.01" y1="18" y2="18" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Kolay Sipariş
          </h2>
          <p className="text-sm text-slate-500">
            Web sitemiz üzerinden tek tıkla kolay ve hızlı sipariş.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 max-w-md w-full text-center text-sm text-sky-900">
        <p className="font-medium">Sinpak Su</p>
        <p className="text-sky-700/80 text-xs mt-0.5">
          Göstermiş olduğunuz ilgi ve anlayışınız için teşekkür ederiz.
        </p>
      </div>
    </div>
  );
}
