import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { getAdminProductById } from "@/server/services/admin-product.service";
import { AdminProductForm } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Ürün Düzenle | Yönetim Paneli",
  description: "Ürün bilgilerini güncelleyin",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAdminProductPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const productResult = await getAdminProductById(id);

  if (!productResult.success) {
    notFound();
  }

  const product = productResult.data;

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
          Ürün Düzenle: {product.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Fiyat, açıklama, depozito tutarı ve aktiflik durumunu güncelleyin.
        </p>
      </div>

      <AdminProductForm mode="edit" initialData={product} />
    </main>
  );
}
