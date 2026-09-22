import type { Metadata } from "next";
import Link from "next/link";
import { OrderTrackingView } from "@/features/orders/order-tracking-view";

export const metadata: Metadata = {
  title: "Sipariş Takip | Sinpak Su",
  description:
    "Sipariş numaranız ve telefon numaranızla siparişinizi takip edin.",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  searchParams: Promise<{ no?: string }>;
}

export default async function OrderTrackingPage({ searchParams }: Props) {
  const { no } = await searchParams;

  return (
    <main className="px-4 lg:px-6 py-8 lg:py-12 max-w-xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>

      <div className="space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
          Sipariş Takip
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Sipariş numaranızı ve kayıtlı telefon numaranızı girerek anlık sipariş ve teslimat durumunuzu öğrenebilirsiniz.
        </p>
      </div>

      <OrderTrackingView initialOrderNumber={no ?? ""} />
    </main>
  );
}

