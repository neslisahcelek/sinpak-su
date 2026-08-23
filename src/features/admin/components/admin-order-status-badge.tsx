import { OrderStatus } from "@prisma/client";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_BADGE_CLASSES,
} from "@/features/admin/constants";

interface AdminOrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function AdminOrderStatusBadge({
  status,
  className = "",
}: AdminOrderStatusBadgeProps) {
  const label = ORDER_STATUS_LABELS[status] ?? status;
  const badgeClass =
    ORDER_STATUS_BADGE_CLASSES[status] ??
    "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass} ${className}`}
    >
      {label}
    </span>
  );
}
