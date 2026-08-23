import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { getAdminSession } from "@/server/auth/session";
import { listOrders } from "@/server/services/admin-order.service";
import { AdminOrderFilter, AdminOrderList } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Siparişler | Yönetim Paneli",
  description: "Müşteri siparişlerini görüntüleyin ve yönetin",
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { status: rawStatus } = await searchParams;
  const statusFilter =
    rawStatus && Object.values(OrderStatus).includes(rawStatus as OrderStatus)
      ? (rawStatus as OrderStatus)
      : undefined;

  const orders = await listOrders({ status: statusFilter });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sipariş Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Toplam <span className="font-semibold text-slate-800">{orders.length}</span> sipariş listeleniyor
          </p>
        </div>
      </div>

      <AdminOrderFilter currentStatus={statusFilter} />

      <AdminOrderList orders={orders} />
    </main>
  );
}
