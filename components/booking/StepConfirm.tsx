"use client";

import { useBookingStore, type WizardStep } from "@/lib/booking/store";
import { Button } from "@/components/ui/button";
import { Pencil, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";

interface Service {
  id: string;
  title: string;
  durationMinutes: number;
  basePrice: number;
}

interface Branch {
  slug: string;
  name: string;
  address: string;
}

interface Props {
  service: Service | null;
  branch: Branch | null;
  carLabel: string | null;
  onJumpTo: (step: WizardStep) => void;
  isAuthenticated: boolean;
}

export function StepConfirm({ service, branch, carLabel, onJumpTo, isAuthenticated }: Props) {
  const scheduledAt = useBookingStore((s) => s.scheduledAt);
  const guestName = useBookingStore((s) => s.guestName);
  const guestPhone = useBookingStore((s) => s.guestPhone);
  const guestEmail = useBookingStore((s) => s.guestEmail);
  const notes = useBookingStore((s) => s.notes);

  const dateStr = scheduledAt
    ? new Intl.DateTimeFormat("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(scheduledAt))
    : "—";

  return (
    <div>
      <h2 className="font-display text-h3 text-graphite-50">Подтвердите запись</h2>
      <p className="text-body-base text-graphite-200 mt-2 mb-6">
        Проверьте, всё ли верно. Цена за работу будет окончательно зафиксирована после первичного
        осмотра в день записи.
      </p>

      <div className="rounded-lg border border-graphite-500/30 bg-graphite-800 divide-y divide-graphite-500/30">
        <SummaryRow
          label="Услуга"
          value={service ? service.title : "—"}
          extra={service ? `~${Math.round(service.durationMinutes / 60 * 10) / 10} ч · от ${formatPrice(service.basePrice)}` : null}
          onEdit={() => onJumpTo("service")}
        />
        <SummaryRow
          label="Авто"
          value={carLabel || "—"}
          onEdit={() => onJumpTo("car")}
        />
        <SummaryRow
          label="Филиал"
          value={branch ? branch.name : "—"}
          extra={branch ? branch.address : null}
          onEdit={() => onJumpTo("branch")}
        />
        <SummaryRow
          label="Дата и время"
          value={dateStr}
          onEdit={() => onJumpTo("slot")}
        />
        {!isAuthenticated && (
          <SummaryRow
            label="Контакты"
            value={guestName || "—"}
            extra={`${guestPhone ?? ""}${guestEmail ? " · " + guestEmail : ""}`}
            onEdit={() => onJumpTo("contacts")}
          />
        )}
        {notes && (
          <SummaryRow
            label="Комментарий"
            value={notes}
            onEdit={() => onJumpTo("contacts")}
          />
        )}
      </div>

      <div className="mt-6 rounded-lg border border-warning/30 bg-warning/5 p-4">
        <p className="text-body-sm text-graphite-100 leading-relaxed">
          <Check className="inline size-4 text-warning mr-1.5 -mt-0.5" />
          Стоимость работ фиксируется после первичной диагностики и согласовывается с вами до начала
          работ. Никаких сюрпризов в финальном счёте.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  extra,
  onEdit,
}: {
  label: string;
  value: string;
  extra?: string | null;
  onEdit: () => void;
}) {
  return (
    <div className="px-5 py-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-caption uppercase tracking-wider text-chrome">{label}</p>
        <p className="mt-1 text-body-base text-graphite-50 font-medium">{value}</p>
        {extra && <p className="mt-0.5 text-body-sm text-graphite-200">{extra}</p>}
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-caption text-graphite-300 hover:text-red-primary inline-flex items-center gap-1.5 shrink-0"
      >
        <Pencil className="size-3.5" />
        Изменить
      </button>
    </div>
  );
}
