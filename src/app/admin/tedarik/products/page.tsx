import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { listAllSupplyProducts } from "@/server/services/admin-supply-product.service";
import { listAllSupplyCategories } from "@/server/services/admin-supply-category.service";
import {
  AdminSupplyProductList,
  AdminExcelImportButton,
} from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Tedarik Ürünleri | Yönetim Paneli",
  description: "Kurumsal tedarik ürün kataloğunu görüntüleyin ve düzenleyin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminSupplyProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [products, categories] = await Promise.all([
    listAllSupplyProducts(),
    listAllSupplyCategories(),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Kurumsal Tedarik Ürünleri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Toplam{" "}
            <span className="font-semibold text-slate-800">
              {products.length}
            </span>{" "}
            ürün ve{" "}
            <span className="font-semibold text-slate-800">
              {categories.length}
            </span>{" "}
            kategori listeleniyor
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <AdminExcelImportButton mode="supply" categories={categories} />
          <Link
            href="/admin/tedarik/categories"
            className="inline-flex items-center justify-center px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors"
          >
            Kategorileri Yönet
          </Link>
          <Link
            href="/admin/tedarik/products/new"
            className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
          >
            + Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      <AdminSupplyProductList products={products} categories={categories} />
    </main>
  );
}
