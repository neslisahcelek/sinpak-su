import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { ORDER_STATUS_LABELS } from "@/features/admin/constants";

interface AdminOrderFilterProps {
  currentStatus?: OrderStatus;
}

export function AdminOrderFilter({ currentStatus }: AdminOrderFilterProps) {
  const filterOptions: { label: string; value?: OrderStatus }[] = [
    { label: "Tümü", value: undefined },
    {
      label: ORDER_STATUS_LABELS[OrderStatus.PENDING],
      value: OrderStatus.PENDING,
    },
    {
      label: ORDER_STATUS_LABELS[OrderStatus.OUT_FOR_DELIVERY],
      value: OrderStatus.OUT_FOR_DELIVERY,
    },
    {
      label: ORDER_STATUS_LABELS[OrderStatus.DELIVERED],
      value: OrderStatus.DELIVERED,
    },
    {
      label: ORDER_STATUS_LABELS[OrderStatus.CANCELLED],
      value: OrderStatus.CANCELLED,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
      {filterOptions.map((opt) => {
        const isActive = currentStatus === opt.value;
        const href = opt.value
          ? `/admin/orders?status=${opt.value}`
          : "/admin/orders";

        return (
          <Link
            key={opt.label}
            href={href}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors min-h-[36px] flex items-center justify-center border ${
              isActive
                ? "bg-sky-700 text-white border-sky-700 shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
