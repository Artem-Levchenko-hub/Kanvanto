/**
 * Yandex.Metrica events wrapper. Типизированные события для отслеживания воронки.
 *
 * Использование (только client-side):
 *   import { track } from "@/lib/analytics/ym";
 *   track.bookingStarted({ source: "hero" });
 */

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

const YM_ID = process.env.NEXT_PUBLIC_YM_ID ? Number(process.env.NEXT_PUBLIC_YM_ID) : null;

function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!YM_ID || !window.ym) return;
  window.ym(YM_ID, "reachGoal", goal, params);
}

export const track = {
  // Booking funnel
  bookingStarted: (params: { source?: string; service?: string }) =>
    reachGoal("booking_started", params),
  bookingStepCompleted: (params: { step: string; stepIndex: number }) =>
    reachGoal("booking_step_completed", params),
  bookingSubmitted: (params: { service: string; branch: string; isGuest: boolean }) =>
    reachGoal("booking_submitted", params),

  // Auth
  signIn: (params: { method: "phone" | "email" | "yandex" }) => reachGoal("sign_in", params),
  signUp: (params: { method: "phone" | "email" | "yandex" }) => reachGoal("sign_up", params),

  // Cars
  carAdded: (params: { brand: string; viaVin: boolean }) => reachGoal("car_added", params),

  // Maintenance
  reminderClicked: (params: { type: string; status: string }) =>
    reachGoal("reminder_clicked", params),
  bookingFromReminder: () => reachGoal("booking_from_reminder"),

  // CTA
  ctaClicked: (params: { location: string; variant?: string }) => reachGoal("cta_clicked", params),

  // A/B
  abExposure: (params: { experiment: string; variant: string }) =>
    reachGoal("ab_exposure", params),
};

export function isAnalyticsEnabled(): boolean {
  return !!YM_ID;
}
