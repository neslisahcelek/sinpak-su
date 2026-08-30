import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdminSession } from "@/server/auth/session";
import { AdminLoginForm } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Yönetici Girişi | Sinpak Su",
  description: "Sinpak Su Yetkili Personel Giriş Ekranı",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/orders");
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-100 text-sky-700 rounded-xl mb-1">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Yönetici Girişi</h1>
          <p className="text-xs text-slate-500">
            Lütfen yetkili kullanıcı adı ve şifrenizle giriş yapın.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-40 flex items-center justify-center text-sm text-slate-400">
              Yükleniyor...
            </div>
          }
        >
          <AdminLoginForm />
        </Suspense>
      </div>
    </main>
  );
}
