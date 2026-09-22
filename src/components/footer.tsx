import Link from "next/link";
import { brandConfig, type BrandKey } from "@/lib/site-config";

interface FooterProps {
  brand?: BrandKey;
}

export function Footer({ brand = "su" }: FooterProps) {
  const config = brandConfig[brand];
  const isSu = brand === "su";

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Company identity */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">
                {config.name}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  isSu
                    ? "bg-sky-900/60 text-sky-300 border-sky-700/50"
                    : "bg-slate-800 text-slate-200 border-slate-600"
                }`}
              >
                {config.authorizedDealer}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-medium px-2 py-0.5 rounded border border-slate-700">
                İzmit
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
              {config.companyName}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isSu
                ? "Abant Su yetkili bayisi olarak İzmit geneline doğal kaynak suyu ve içecek teslimatı. Kapıda nakit veya temassız POS cihazı ile güvenle ödeme yapabilirsiniz."
                : "İzmit genelinde kurumsal temizlik ürünleri, rulo havlu, kağıt ürünleri ve sarf malzeme tedariki. Kapıda nakit veya POS ile ödeme."}
            </p>
          </div>

          {/* Contact & Address */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              İletişim & Adres
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-sky-400 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{config.address.full}</span>
              </li>

              <li className="flex items-center gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-sky-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>
                  Yetkili:{" "}
                  <strong className="text-white font-medium">
                    {config.contactPerson}
                  </strong>
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-sky-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={config.phoneHref}
                  className="text-sky-300 hover:text-white font-semibold underline underline-offset-2 transition-colors"
                >
                  {config.phoneFormatted}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links & Direct Call CTA */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Hızlı Sipariş & Bilgi
            </h3>
            <p className="text-xs text-slate-300">
              Çalışma Saatleri:{" "}
              <strong className="text-white">{config.workingHours}</strong>
            </p>
            <div className="pt-1">
              <a
                href={config.phoneHref}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs sm:text-sm font-medium transition-colors shadow-sm ${
                  isSu
                    ? "bg-sky-600 hover:bg-sky-500"
                    : "bg-slate-600 hover:bg-slate-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Telefonla Sipariş: {config.phoneFormatted}</span>
              </a>
            </div>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              {isSu ? (
                <>
                  <Link
                    href="/siparis-takip"
                    className="hover:text-white transition-colors underline underline-offset-2"
                  >
                    Sipariş Takip
                  </Link>
                  <Link
                    href="/#catalog-heading"
                    className="hover:text-white transition-colors underline underline-offset-2"
                  >
                    Ürünler
                  </Link>
                  <Link
                    href="/kurumsal-tedarik"
                    className="hover:text-white transition-colors underline underline-offset-2"
                  >
                    Kurumsal Tedarik
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="hover:text-white transition-colors underline underline-offset-2"
                  >
                    Su Siparişi
                  </Link>
                  <Link
                    href="/kurumsal-tedarik"
                    className="hover:text-white transition-colors underline underline-offset-2"
                  >
                    Ürün Grupları
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sub-footer copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {config.companyName}. Tüm hakları
            saklıdır.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <span className="text-sky-300 font-medium">
              {config.authorizedDealer}
            </span>
            <span>•</span>
            <span>Kapıda Nakit / POS</span>
            <span>•</span>
            <span>Hızlı Teslimat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
