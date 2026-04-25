import type { CarBrand } from "@prisma/client";

/**
 * Lightweight VIN-декодер на основе WMI (World Manufacturer Identifier — первые 3 символа)
 * и кода года (10-я позиция). Без внешнего API.
 *
 * Покрывает основные бренды Канавто. Для не-немецких — возвращает OTHER.
 *
 * Для production можно заменить на интеграцию с datsu.ru / autodev.ru через `lib/vin/providers.ts`.
 */

const WMI_TO_BRAND: Record<string, CarBrand> = {
  // BMW
  WBA: "BMW", WBS: "BMW", WBV: "BMW", WBX: "BMW", WBY: "BMW",
  "4US": "BMW", "5UM": "BMW", "5UX": "BMW",
  // Mercedes-Benz
  WDD: "MERCEDES", WDB: "MERCEDES", WDC: "MERCEDES", WDF: "MERCEDES",
  WMX: "MERCEDES", "55S": "MERCEDES", "4JG": "MERCEDES",
  // Audi
  WAU: "AUDI", WUA: "AUDI", TRU: "AUDI",
  // Porsche
  WP0: "PORSCHE", WP1: "PORSCHE",
  // Škoda
  TMB: "SKODA",
  // Volkswagen
  WVW: "VW", WV1: "VW", WV2: "VW", "1VW": "VW", "3VW": "VW", XW8: "VW",
};

const YEAR_CODES: Record<string, number> = {
  A: 2010, B: 2011, C: 2012, D: 2013, E: 2014, F: 2015, G: 2016, H: 2017,
  J: 2018, K: 2019, L: 2020, M: 2021, N: 2022, P: 2023, R: 2024, S: 2025,
  T: 2026, V: 2027, W: 2028, X: 2029, Y: 2030,
};

export interface VinDecodeResult {
  isValid: boolean;
  vin: string;
  brand: CarBrand | null;
  year: number | null;
  country: string | null;
  raw: { wmi: string; yearChar: string };
  error?: string;
}

const COUNTRY_BY_FIRST_CHAR: Record<string, string> = {
  W: "Германия",
  T: "Восточная Европа",
  X: "Россия",
  J: "Япония",
  K: "Корея",
  "1": "США",
  "2": "Канада",
  "3": "Мексика",
  "4": "США",
  "5": "США",
};

/**
 * Валидация VIN: 17 символов, только латиница (без I, O, Q), цифры.
 */
export function isValidVin(vin: string): boolean {
  if (!vin || typeof vin !== "string") return false;
  const cleaned = vin.toUpperCase().replace(/\s/g, "");
  if (cleaned.length !== 17) return false;
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(cleaned);
}

export function decodeVin(vinRaw: string): VinDecodeResult {
  const vin = vinRaw.toUpperCase().replace(/\s/g, "");

  if (!isValidVin(vin)) {
    return {
      isValid: false,
      vin,
      brand: null,
      year: null,
      country: null,
      raw: { wmi: vin.slice(0, 3), yearChar: vin[9] || "" },
      error: vin.length !== 17 ? `VIN должен содержать 17 символов (сейчас ${vin.length})` : "Недопустимые символы (запрещены I, O, Q)",
    };
  }

  const wmi = vin.slice(0, 3);
  const yearChar = vin[9];

  return {
    isValid: true,
    vin,
    brand: WMI_TO_BRAND[wmi] ?? null,
    year: YEAR_CODES[yearChar] ?? null,
    country: COUNTRY_BY_FIRST_CHAR[vin[0]] ?? null,
    raw: { wmi, yearChar },
  };
}
