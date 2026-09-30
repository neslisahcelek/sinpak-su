import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { listAllSupplyCategories } from "@/server/services/admin-supply-category.service";
import { AdminSupplyProductForm } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Yeni Tedarik Ürünü Ekle | Yönetim Paneli",
  description: "Kurumsal tedarik kataloğuna yeni ürün ekleyin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminNewSupplyProductPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await listAllSupplyCategories();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Yeni Tedarik Ürünü Ekle
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kurumsal tedarik kataloğuna yeni ürün bilgileri, ambalaj detayı ve görseli ekleyin.
        </p>
      </div>

      <AdminSupplyProductForm mode="create" categories={categories} />
    </main>
  );
}
