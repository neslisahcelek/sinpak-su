import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { AdminProductForm } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Yeni Ürün Ekle | Yönetim Paneli",
  description: "Kataloğa yeni ürün ekleyin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewAdminProductPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link
          href="/admin/products"
          className="hover:text-slate-800 transition-colors"
        >
          &larr; Ürün Yönetimine Dön
        </Link>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Yeni Ürün Ekle
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kataloğa yeni su veya meşrubat ürünü ekleyin. Kalıcı bağlantı (slug)
          ürün adından otomatik üretilecektir.
        </p>
      </div>

      <AdminProductForm mode="create" />
    </main>
  );
}
