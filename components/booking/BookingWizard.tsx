"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WizardProgress } from "./WizardProgress";
import { StepService } from "./StepService";
import { StepCar } from "./StepCar";
import { StepBranch } from "./StepBranch";
import { StepSlot } from "./StepSlot";
import { StepContacts } from "./StepContacts";
import { StepConfirm } from "./StepConfirm";
import {
  STEP_ORDER,
  getStepIndex,
  useBookingStore,
  type WizardStep,
} from "@/lib/booking/store";
import { createBooking } from "@/lib/booking/create-booking";
import { isValidPhone } from "@/lib/db/users";

interface BookingWizardProps {
  services: Array<{
    id: string;
    slug: string;
    title: string;
    basePrice: number;
    durationMinutes: number;
    iconName: string | null;
    isFlagship: boolean;
    isExclusive: boolean;
    shortDescription: string;
  }>;
  branches: Array<{
    id: string;
    slug: string;
    name: string;
    address: string;
    hours: string;
    brands: string[];
    isHQ: boolean;
  }>;
  isAuthenticated: boolean;
  userCars?: Array<{ id: string; brand: string; model: string; year: number; licensePlate: string | null }>;
  userInfo?: { name: string | null; phone: string | null; email: string | null };
  presetServiceSlug?: string;
}

const BRAND_LABELS: Record<string, string> = {
  BMW: "BMW",
  MERCEDES: "Mercedes-Benz",
  AUDI: "Audi",
  PORSCHE: "Porsche",
  SKODA: "Škoda",
  VW: "Volkswagen",
  OTHER: "Другая марка",
};

export function BookingWizard({
  services,
  branches,
  isAuthenticated,
  userCars = [],
  userInfo,
  presetServiceSlug,
}: BookingWizardProps) {
  const router = useRouter();
  const currentStep = useBookingStore((s) => s.currentStep);
  const setStep = useBookingStore((s) => s.setStep);
  const goBack = useBookingStore((s) => s.goBack);
  const goNext = useBookingStore((s) => s.goNext);
  const reset = useBookingStore((s) => s.reset);

  const draft = useBookingStore();
  const [submitting, setSubmitting] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
    // Если в URL есть preset service — установим
    if (presetServiceSlug && !draft.serviceId) {
      const found = services.find((s) => s.slug === presetServiceSlug);
      if (found) draft.set("serviceId", found.id);
    }
  }, [presetServiceSlug, services, draft]);

  const selectedService = services.find((s) => s.id === draft.serviceId) || null;
  const selectedBranch = branches.find((b) => b.slug === draft.branchSlug) || null;
  const selectedBrand = (() => {
    if (draft.carId) {
      const car = userCars.find((c) => c.id === draft.carId);
      return car?.brand || null;
    }
    return draft.guestCarBrand;
  })();

  const carLabel = (() => {
    if (draft.carId) {
      const c = userCars.find((c) => c.id === draft.carId);
      if (c) return `${BRAND_LABELS[c.brand] || c.brand} ${c.model} ${c.year}`;
      return null;
    }
    if (draft.guestCarBrand && draft.guestCarModel && draft.guestCarYear) {
      return `${BRAND_LABELS[draft.guestCarBrand]} ${draft.guestCarModel} ${draft.guestCarYear}`;
    }
    return null;
  })();

  const canGoNext = (() => {
    switch (currentStep) {
      case "service":
        return !!draft.serviceId;
      case "car":
        return !!draft.carId || (!!draft.guestCarBrand && !!draft.guestCarModel && !!draft.guestCarYear);
      case "branch":
        return !!draft.branchSlug;
      case "slot":
        return !!draft.scheduledAt;
      case "contacts":
        if (isAuthenticated) return true;
        return (
          !!draft.guestName &&
          draft.guestName.length >= 2 &&
          !!draft.guestPhone &&
          isValidPhone(draft.guestPhone) &&
          draft.consent
        );
      case "confirm":
        return true;
      default:
        return false;
    }
  })();

  const handleSubmit = async () => {
    if (!selectedService || !selectedBranch || !draft.scheduledAt) {
      toast.error("Не все шаги заполнены");
      return;
    }
    setSubmitting(true);
    try {
      const result = await createBooking({
        serviceId: draft.serviceId!,
        carId: draft.carId,
        guestCarBrand: draft.guestCarBrand,
        guestCarModel: draft.guestCarModel,
        guestCarYear: draft.guestCarYear,
        branchSlug: draft.branchSlug!,
        scheduledAt: draft.scheduledAt,
        guestName: isAuthenticated ? null : draft.guestName,
        guestPhone: isAuthenticated ? null : draft.guestPhone,
        guestEmail: isAuthenticated ? null : draft.guestEmail,
        notes: draft.notes,
        notifyMaintenance: draft.notifyMaintenance,
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Запись создана!");
      reset();
      router.push(`/booking/success?id=${result.bookingId}`);
    } catch (e) {
      toast.error("Не удалось создать запись");
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <Loader2 className="size-6 text-chrome animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <WizardProgress current={currentStep} />
      </div>

      <div className="min-h-[400px]">
        {currentStep === "service" && <StepService services={services} />}
        {currentStep === "car" && <StepCar userCars={userCars as never} isAuthenticated={isAuthenticated} />}
        {currentStep === "branch" && <StepBranch branches={branches} selectedBrand={selectedBrand} />}
        {currentStep === "slot" && <StepSlot />}
        {currentStep === "contacts" && <StepContacts isAuthenticated={isAuthenticated} userInfo={userInfo} />}
        {currentStep === "confirm" && (
          <StepConfirm
            service={selectedService}
            branch={selectedBranch}
            carLabel={carLabel}
            onJumpTo={setStep}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>

      {/* Footer with nav buttons */}
      <div className="sticky bottom-0 mt-8 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 border-t border-graphite-500/30 bg-graphite-900/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          {getStepIndex(currentStep) > 0 ? (
            <Button type="button" variant="ghost" onClick={goBack} disabled={submitting}>
              <ArrowLeft className="size-4" />
              Назад
            </Button>
          ) : (
            <span />
          )}
          {currentStep === "confirm" ? (
            <Button onClick={handleSubmit} disabled={submitting} size="lg">
              {submitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Записываем...
                </>
              ) : (
                <>
                  Подтвердить запись
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={goNext} disabled={!canGoNext} size="lg">
              Далее
              <ArrowRight className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
