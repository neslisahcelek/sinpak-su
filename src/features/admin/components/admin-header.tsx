import Link from "next/link";
import { AdminLogoutButton } from "./admin-logout-button";

interface AdminHeaderProps {
  username?: string;
}

export function AdminHeader({ username }: AdminHeaderProps) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 font-bold text-base sm:text-lg text-white hover:text-sky-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 rounded"
            >
              <span>Sinpak Su</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                Yönetim Paneli
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/admin/orders"
                className="px-3 py-1.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Siparişler
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {username && (
              <span className="hidden md:inline-block text-xs text-slate-400">
                Giriş yapan: <strong className="text-slate-200 font-semibold">{username}</strong>
              </span>
            )}
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
