"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils/cn";

import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Кастомный Calendar на react-day-picker v9 с тёмной темой Kanavto.
 */
function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <div
      className={cn(
        "rdp-kanavto p-4",
        // Переопределение CSS-переменных RDP под тёмную тему
        "[--rdp-accent-color:#DC2626]",
        "[--rdp-accent-background-color:rgba(220,38,38,0.12)]",
        "[--rdp-day-height:40px]",
        "[--rdp-day-width:40px]",
        "[--rdp-day_button-height:36px]",
        "[--rdp-day_button-width:36px]",
        "[--rdp-day_button-border-radius:8px]",
        "[--rdp-selected-border:2px solid #DC2626]",
        "[--rdp-today-color:#FBBF24]",
        "[--rdp-disabled-opacity:0.3]",
        "[--rdp-outside-opacity:0.4]",
        "[--rdp-weekday-padding:8px 0]",
        "[--rdp-weekday-text-align:center]",
        "[--rdp-weekday-text-transform:uppercase]",
        "[--rdp-weekday-font-size:11px]",
        "[--rdp-weekday-opacity:1]",
        "[--rdp-nav-height:32px]",
        "[--rdp-nav_button-height:32px]",
        "[--rdp-nav_button-width:32px]",
        // Inner styles
        "[&_.rdp-months]:!flex-col",
        "[&_.rdp-month_caption]:!justify-center [&_.rdp-month_caption]:!text-graphite-50 [&_.rdp-month_caption]:!capitalize [&_.rdp-month_caption]:!h-9 [&_.rdp-month_caption]:!flex [&_.rdp-month_caption]:!items-center",
        "[&_.rdp-nav]:!gap-1",
        "[&_.rdp-button_next]:!text-graphite-100 [&_.rdp-button_previous]:!text-graphite-100",
        "[&_.rdp-button_next:hover]:!bg-graphite-700 [&_.rdp-button_previous:hover]:!bg-graphite-700",
        "[&_.rdp-weekday]:!text-chrome [&_.rdp-weekday]:!font-semibold [&_.rdp-weekday]:!tracking-wider",
        "[&_.rdp-day]:!text-graphite-100",
        "[&_.rdp-day:hover_.rdp-day_button:not([disabled])]:!bg-graphite-700 [&_.rdp-day:hover_.rdp-day_button:not([disabled])]:!text-graphite-50",
        "[&_.rdp-day_button]:!font-medium",
        "[&_.rdp-selected_.rdp-day_button]:!bg-red-primary [&_.rdp-selected_.rdp-day_button]:!text-white [&_.rdp-selected_.rdp-day_button]:!font-semibold",
        "[&_.rdp-today_.rdp-day_button]:!bg-graphite-700 [&_.rdp-today_.rdp-day_button]:!text-warning [&_.rdp-today_.rdp-day_button]:!font-bold",
        "[&_.rdp-disabled]:!text-graphite-400 [&_.rdp-disabled]:!opacity-30",
        "[&_.rdp-outside]:!text-graphite-400 [&_.rdp-outside]:!opacity-50",
        className
      )}
    >
      <DayPicker
        locale={ru}
        showOutsideDays={showOutsideDays}
        weekStartsOn={1}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            ),
        }}
        classNames={classNames}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
