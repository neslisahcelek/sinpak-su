import type { Metadata } from "next";
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
    <main className="px-4 lg:px-6 py-8 max-w-xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-slate-950 mb-2">
        Sipariş Takip
      </h1>
      <p className="text-base text-slate-600 mb-8">
        Sipariş numaranızı ve kayıtlı telefon numaranızı girerek siparişinizin
        durumunu öğrenebilirsiniz.
      </p>
      <OrderTrackingView initialOrderNumber={no ?? ""} />
    </main>
  );
}
