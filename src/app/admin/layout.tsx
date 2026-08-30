import type { Metadata } from "next";
import { getAdminSession } from "@/server/auth/session";
import { AdminHeader } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Yönetim Paneli | Sinpak Su",
  description: "Sinpak Su Yönetici ve Sipariş Takip Portalı",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {session && <AdminHeader username={session.username} />}
      <div className="flex-1">{children}</div>
    </div>
  );
}
