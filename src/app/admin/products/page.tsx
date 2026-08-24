import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { listAllAdminProducts } from "@/server/services/admin-product.service";
import { AdminProductList } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Ürünler | Yönetim Paneli",
  description: "Ürün kataloğunu görüntüleyin, düzenleyin ve yeni ürün ekleyin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const products = await listAllAdminProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Ürün Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Toplam <span className="font-semibold text-slate-800">{products.length}</span> ürün listeleniyor (Aktif ve Pasif)
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          + Yeni Ürün Ekle
        </Link>
      </div>

      <AdminProductList products={products} />
    </main>
  );
}
