"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, PlayCircle, Loader2, ChevronDown } from "lucide-react";
import { BookingStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { updateBookingStatus } from "@/app/admin/bookings/actions";

interface Props {
  bookingId: string;
  currentStatus: BookingStatus;
  onCompleteClick: () => void;
}

const NEXT_STATUS_OPTIONS: Record<BookingStatus, Array<{ status: BookingStatus; label: string; tone: "primary" | "warning" | "danger" }>> = {
  DRAFT: [{ status: "PENDING", label: "Подтвердить как pending", tone: "primary" }, { status: "CANCELLED", label: "Отменить", tone: "danger" }],
  PENDING: [
    { status: "CONFIRMED", label: "Подтвердить", tone: "primary" },
    { status: "CANCELLED", label: "Отменить", tone: "danger" },
  ],
  CONFIRMED: [
    { status: "ARRIVED", label: "Клиент приехал", tone: "primary" },
    { status: "CANCELLED", label: "Отменить", tone: "danger" },
    { status: "NO_SHOW", label: "Не пришёл", tone: "warning" },
  ],
  ARRIVED: [
    { status: "IN_PROGRESS", label: "В работу", tone: "primary" },
    { status: "CANCELLED", label: "Отменить", tone: "danger" },
  ],
  IN_PROGRESS: [
    { status: "CANCELLED", label: "Отменить", tone: "danger" },
  ],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export function BookingActions({ bookingId, currentStatus, onCompleteClick }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = async (status: BookingStatus) => {
    setSubmitting(true);
    const res = await updateBookingStatus(bookingId, status);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    toast.success("Статус обновлён");
    router.refresh();
  };

  const options = NEXT_STATUS_OPTIONS[currentStatus] ?? [];
  const showComplete = ["IN_PROGRESS", "ARRIVED", "CONFIRMED"].includes(currentStatus);

  if (currentStatus === "COMPLETED") {
    return (
      <div className="rounded-md bg-success/5 border border-success/30 p-4 text-body-sm text-success">
        <CheckCircle2 className="size-4 inline mr-2" />
        Запись завершена. Связанный заказ-наряд можно открыть из ссылки выше.
      </div>
    );
  }

  if (currentStatus === "CANCELLED" || currentStatus === "NO_SHOW") {
    return (
      <div className="rounded-md bg-graphite-900 border border-graphite-500/30 p-4 text-body-sm text-graphite-300">
        Запись закрыта со статусом {currentStatus === "CANCELLED" ? "«Отменена»" : "«Не пришёл»"}.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showComplete && (
        <Button onClick={onCompleteClick} disabled={submitting}>
          <CheckCircle2 className="size-4" />
          Закрыть → создать заказ-наряд
        </Button>
      )}

      {options.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <PlayCircle className="size-4" />}
              Сменить статус
              <ChevronDown className="size-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-60 p-1.5">
            {options.map((opt) => (
              <button
                key={opt.status}
                type="button"
                onClick={() => handleChange(opt.status)}
                disabled={submitting}
                className={`w-full text-left px-3 py-2 rounded-md text-body-sm hover:bg-graphite-700 ${
                  opt.tone === "danger" ? "text-error" : opt.tone === "warning" ? "text-warning" : "text-graphite-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
