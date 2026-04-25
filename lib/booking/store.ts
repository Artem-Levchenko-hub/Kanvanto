"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CarBrandValue } from "./schema";

export type WizardStep = "service" | "car" | "branch" | "slot" | "contacts" | "confirm";

export const STEP_ORDER: WizardStep[] = ["service", "car", "branch", "slot", "contacts", "confirm"];

interface BookingDraft {
  // Step 1: Service
  serviceId: string | null;

  // Step 2: Car
  carId: string | null; // для авторизованного — id из базы
  guestCarBrand: CarBrandValue | null;
  guestCarModel: string | null;
  guestCarYear: number | null;
  guestCarLicensePlate: string | null;
  guestCarVin: string | null;

  // Step 3: Branch
  branchSlug: string | null;

  // Step 4: Slot
  scheduledAt: string | null; // ISO 8601

  // Step 5: Contacts (для гостей)
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  notes: string | null;
  consent: boolean;
  notifyMaintenance: boolean;
}

interface BookingState extends BookingDraft {
  currentStep: WizardStep;
  setStep: (step: WizardStep) => void;
  goNext: () => void;
  goBack: () => void;
  set: <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => void;
  patch: (partial: Partial<BookingDraft>) => void;
  reset: () => void;
}

const initialDraft: BookingDraft = {
  serviceId: null,
  carId: null,
  guestCarBrand: null,
  guestCarModel: null,
  guestCarYear: null,
  guestCarLicensePlate: null,
  guestCarVin: null,
  branchSlug: null,
  scheduledAt: null,
  guestName: null,
  guestPhone: null,
  guestEmail: null,
  notes: null,
  consent: false,
  notifyMaintenance: true,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialDraft,
      currentStep: "service",
      setStep: (step) => set({ currentStep: step }),
      goNext: () => {
        const idx = STEP_ORDER.indexOf(get().currentStep);
        if (idx < STEP_ORDER.length - 1) set({ currentStep: STEP_ORDER[idx + 1] });
      },
      goBack: () => {
        const idx = STEP_ORDER.indexOf(get().currentStep);
        if (idx > 0) set({ currentStep: STEP_ORDER[idx - 1] });
      },
      set: (key, value) => set({ [key]: value } as Partial<BookingState>),
      patch: (partial) => set(partial as Partial<BookingState>),
      reset: () => set({ ...initialDraft, currentStep: "service" }),
    }),
    {
      name: "kanavto-booking-draft",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined as never)),
      partialize: (s) => {
        const { setStep, goNext, goBack, set, patch, reset, ...rest } = s;
        return rest;
      },
    }
  )
);

export function getStepIndex(step: WizardStep): number {
  return STEP_ORDER.indexOf(step);
}
