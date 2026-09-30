import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { listAllSupplyCategories } from "@/server/services/admin-supply-category.service";
import { AdminSupplyCategoryList } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Tedarik Kategorileri | Yönetim Paneli",
  description: "Kurumsal tedarik kategorilerini görüntüleyin ve düzenleyin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminSupplyCategoriesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await listAllSupplyCategories();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <AdminSupplyCategoryList categories={categories} />
    </main>
  );
}
