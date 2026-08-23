"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdminAction } from "@/features/admin/actions";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = await loginAdminAction({
        username: username.trim(),
        password,
      });

      if (!result.success) {
        setErrorMessage(
          result.error.message || "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin."
        );
        return;
      }

      const callbackUrl = searchParams.get("callbackUrl") || "/admin/orders";
      router.push(callbackUrl);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div
          role="alert"
          className="p-3 text-sm text-rose-800 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2"
        >
          <svg
            className="w-5 h-5 text-rose-600 shrink-0 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="admin-username"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Kullanıcı Adı
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isPending}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 disabled:bg-slate-100 disabled:cursor-not-allowed"
          placeholder="admin"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Şifre
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 disabled:bg-slate-100 disabled:cursor-not-allowed"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !username.trim() || !password}
        className="w-full mt-2 py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white text-sm font-semibold rounded-lg shadow transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px]"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Giriş Yapılıyor...
          </span>
        ) : (
          "Giriş Yap"
        )}
      </button>
    </form>
  );
}
