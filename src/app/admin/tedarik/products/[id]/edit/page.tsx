import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { getSupplyProductById } from "@/server/services/admin-supply-product.service";
import { listAllSupplyCategories } from "@/server/services/admin-supply-category.service";
import { AdminSupplyProductForm } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Tedarik Ürününü Düzenle | Yönetim Paneli",
  description: "Kurumsal tedarik ürün bilgilerini güncelleyin",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSupplyProductPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [productResult, categories] = await Promise.all([
    getSupplyProductById(id),
    listAllSupplyCategories(),
  ]);

  if (!productResult.success) {
    notFound();
  }

  const product = productResult.data;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <Link
          href="/admin/tedarik/products"
          className="hover:text-slate-800 transition-colors"
        >
          &larr; Tedarik Ürün Yönetimine Dön
        </Link>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Ürün Düzenle: {product.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kategori, ambalaj detayı, fiyat ve aktiflik durumunu güncelleyin.
        </p>
      </div>

      <AdminSupplyProductForm
        mode="edit"
        categories={categories}
        initialData={product}
      />
    </main>
  );
}
