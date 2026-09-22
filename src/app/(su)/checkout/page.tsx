import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Siparişi Tamamla | Sinpak Su",
  description: "Sinpak Su sipariş ve teslimat formu",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <main className="px-4 lg:px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-slate-950 mb-6">
        Siparişi Tamamla
      </h1>
      <CheckoutView />
    </main>
  );
}
