"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction } from "@/features/admin/actions";
import { VALID_STATUS_TRANSITIONS } from "@/server/services/admin-order.service";
import { AdminOrderStatusBadge } from "./admin-order-status-badge";
import { STATUS_ACTION_LABELS } from "@/features/admin/constants";

interface AdminOrderStatusControlProps {
  publicId: string;
  currentStatus: OrderStatus;
  deliveredAt: Date | null;
  cancelledAt: Date | null;
}

export function AdminOrderStatusControl({
  publicId,
  currentStatus,
  deliveredAt,
  cancelledAt,
}: AdminOrderStatusControlProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
  const isTerminal =
    currentStatus === OrderStatus.DELIVERED ||
    currentStatus === OrderStatus.CANCELLED;

  const handleStatusChange = (nextStatus: OrderStatus) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await updateOrderStatusAction({
        publicId,
        nextStatus,
      });

      if (!result.success) {
        setErrorMessage(
          result.error.message || "Durum güncellenirken bir hata oluştu."
        );
        return;
      }

      setSuccessMessage("Sipariş durumu başarıyla güncellendi.");
      router.refresh();
    });
  };

  const getActionButtonStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.OUT_FOR_DELIVERY:
        return "bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:outline-indigo-600";
      case OrderStatus.DELIVERED:
        return "bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:outline-emerald-600";
      case OrderStatus.CANCELLED:
        return "bg-rose-600 hover:bg-rose-700 text-white focus-visible:outline-rose-600";
      default:
        return "bg-slate-700 hover:bg-slate-800 text-white focus-visible:outline-slate-700";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      timeZone: "Europe/Istanbul",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Sipariş Durumu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Siparişin geçerli durumunu yönetin
          </p>
        </div>
        <AdminOrderStatusBadge
          status={currentStatus}
          className="text-sm px-3 py-1"
        />
      </div>

      {deliveredAt && (
        <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
          Teslim Edilme Zamanı:{" "}
          <strong className="font-semibold">{formatDate(deliveredAt)}</strong>
        </div>
      )}

      {cancelledAt && (
        <div className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-2.5">
          İptal Edilme Zamanı:{" "}
          <strong className="font-semibold">{formatDate(cancelledAt)}</strong>
        </div>
      )}

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
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="text-xs font-semibold underline text-rose-900 mt-1 hover:text-rose-950"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-3 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5 text-emerald-600 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      <div>
        <span className="text-xs font-medium text-slate-700 block mb-2">
          Kullanılabilir Durum Geçişleri:
        </span>

        {isTerminal ? (
          <p className="text-xs text-slate-500 italic bg-slate-50 border border-slate-200 rounded-lg p-3">
            Bu sipariş nihai durumdadır ({currentStatus}). Başka bir duruma
            geçirilemez.
          </p>
        ) : allowedTransitions.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            Geçiş yapılabilecek durum bulunmuyor.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.map((nextStatus) => {
              const label = STATUS_ACTION_LABELS[nextStatus] ?? nextStatus;
              const buttonStyle = getActionButtonStyle(nextStatus);

              return (
                <button
                  key={nextStatus}
                  type="button"
                  onClick={() => handleStatusChange(nextStatus)}
                  disabled={isPending}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[38px] ${buttonStyle}`}
                >
                  {isPending ? (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="animate-spin h-3.5 w-3.5 text-white"
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
                      Güncelleniyor...
                    </span>
                  ) : (
                    label
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
