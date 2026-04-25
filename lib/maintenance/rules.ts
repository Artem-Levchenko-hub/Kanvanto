import type { CarBrand, MaintenanceType, MaintenanceSeverity } from "@prisma/client";

export interface MaintenanceRuleSeed {
  type: MaintenanceType;
  brand: CarBrand | null;
  intervalKm: number | null;
  intervalMonths: number | null;
  severity: MaintenanceSeverity;
  description: string;
  estimatedPrice: number;
}

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  OIL_ENGINE: "Замена масла двигателя",
  OIL_TRANSMISSION: "Замена масла АКПП",
  FILTER_AIR: "Воздушный фильтр",
  FILTER_FUEL: "Топливный фильтр",
  FILTER_CABIN: "Салонный фильтр",
  FILTER_OIL: "Масляный фильтр",
  TIMING_BELT: "Ремень ГРМ",
  TIMING_CHAIN: "Цепь ГРМ",
  COOLANT: "Антифриз",
  BRAKE_FLUID: "Тормозная жидкость",
  POWER_STEERING_FLUID: "Жидкость ГУР",
  SPARK_PLUGS: "Свечи зажигания",
  BRAKE_PADS_FRONT: "Передние тормозные колодки",
  BRAKE_PADS_REAR: "Задние тормозные колодки",
  BRAKE_DISCS: "Тормозные диски",
  TIRE_SEASON: "Сезонная замена шин",
  WHEEL_ALIGNMENT: "Развал-схождение",
  FULL_SERVICE_1: "ТО-1 (комплексное)",
  FULL_SERVICE_2: "ТО-2 (расширенное)",
  AC_REFILL: "Заправка кондиционера",
};

export const MAINTENANCE_TYPE_ICONS: Record<MaintenanceType, string> = {
  OIL_ENGINE: "Droplet",
  OIL_TRANSMISSION: "Droplets",
  FILTER_AIR: "Wind",
  FILTER_FUEL: "Filter",
  FILTER_CABIN: "Filter",
  FILTER_OIL: "Filter",
  TIMING_BELT: "GitBranch",
  TIMING_CHAIN: "Link",
  COOLANT: "Snowflake",
  BRAKE_FLUID: "DiscAlbum",
  POWER_STEERING_FLUID: "RotateCw",
  SPARK_PLUGS: "Zap",
  BRAKE_PADS_FRONT: "DiscAlbum",
  BRAKE_PADS_REAR: "DiscAlbum",
  BRAKE_DISCS: "DiscAlbum",
  TIRE_SEASON: "CircleDot",
  WHEEL_ALIGNMENT: "Crosshair",
  FULL_SERVICE_1: "Wrench",
  FULL_SERVICE_2: "Wrench",
  AC_REFILL: "Wind",
};

export const SEVERITY_LABELS: Record<MaintenanceSeverity, string> = {
  CRITICAL: "Критично",
  RECOMMENDED: "Рекомендуется",
  OPTIONAL: "Опционально",
};
