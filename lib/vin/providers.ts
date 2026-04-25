import type { CarBrand, FuelType, Transmission } from "@prisma/client";
import { decodeVin as decodeVinLocal, isValidVin } from "@/lib/vin/decode";

/**
 * Расширенный VIN-decode с поддержкой внешних провайдеров.
 *
 * Стратегия:
 *  1. Локальная WMI-декодировка — быстрая, бесплатная, покрывает базовые поля.
 *  2. Если включён datsu.ru / autodev.ru через ENV — обогащаем модель/двигатель/КПП.
 *  3. Если внешний провайдер ошибся — возвращаем локальный результат.
 */

export interface ExtendedVinDecodeResult {
  isValid: boolean;
  vin: string;
  brand: CarBrand | null;
  year: number | null;
  country: string | null;
  // Расширенные поля от внешних провайдеров (могут быть null)
  model: string | null;
  bodyType: string | null;
  engineVolume: number | null;
  enginePower: number | null;
  fuelType: FuelType | null;
  transmission: Transmission | null;
  source: "local" | "datsu" | "autodev" | "vindecoder";
  error?: string;
}

const PROVIDER = (process.env.VIN_DECODER_PROVIDER || "").toLowerCase();
const API_KEY = process.env.VIN_DECODER_API_KEY || "";

export async function decodeVinExtended(vinRaw: string): Promise<ExtendedVinDecodeResult> {
  const local = decodeVinLocal(vinRaw);

  const baseResult: ExtendedVinDecodeResult = {
    isValid: local.isValid,
    vin: local.vin,
    brand: local.brand,
    year: local.year,
    country: local.country,
    model: null,
    bodyType: null,
    engineVolume: null,
    enginePower: null,
    fuelType: null,
    transmission: null,
    source: "local",
    error: local.error,
  };

  if (!local.isValid) return baseResult;

  // Если провайдер не настроен — возвращаем локальный
  if (!PROVIDER || !API_KEY) return baseResult;

  try {
    if (PROVIDER === "datsu") {
      const enriched = await decodeWithDatsu(local.vin);
      if (enriched) return { ...baseResult, ...enriched, source: "datsu" };
    } else if (PROVIDER === "autodev") {
      const enriched = await decodeWithAutoDev(local.vin);
      if (enriched) return { ...baseResult, ...enriched, source: "autodev" };
    } else if (PROVIDER === "vindecoder") {
      const enriched = await decodeWithVinDecoder(local.vin);
      if (enriched) return { ...baseResult, ...enriched, source: "vindecoder" };
    }
  } catch (e) {
    console.warn("[VIN provider failed]", PROVIDER, e instanceof Error ? e.message : e);
  }

  return baseResult;
}

/**
 * datsu.ru — российский VIN-декодер (требует API ключ).
 * Документация: https://datsu.ru/api
 */
async function decodeWithDatsu(vin: string): Promise<Partial<ExtendedVinDecodeResult> | null> {
  const url = `https://api.datsu.ru/v1/decoder?vin=${vin}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    next: { revalidate: 86400 }, // кеш 24 часа
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (!data?.success || !data?.data) return null;

  const d = data.data as {
    brand?: string;
    model?: string;
    year?: number;
    bodyType?: string;
    engineVolume?: number;
    enginePower?: number;
    fuelType?: string;
    transmission?: string;
  };

  return {
    model: d.model || null,
    year: d.year || null,
    bodyType: d.bodyType || null,
    engineVolume: d.engineVolume || null,
    enginePower: d.enginePower || null,
    fuelType: mapFuelType(d.fuelType),
    transmission: mapTransmission(d.transmission),
  };
}

/**
 * autodev.ru — альтернативный российский провайдер.
 */
async function decodeWithAutoDev(vin: string): Promise<Partial<ExtendedVinDecodeResult> | null> {
  const url = `https://api.autodev.ru/v2/vin/${vin}`;
  const response = await fetch(url, {
    headers: { "X-API-KEY": API_KEY },
    next: { revalidate: 86400 },
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (!data?.vehicle) return null;

  return {
    model: data.vehicle.model || null,
    year: data.vehicle.year || null,
    bodyType: data.vehicle.bodyType || null,
    engineVolume: data.vehicle.engineVolume || null,
    enginePower: data.vehicle.enginePower || null,
    fuelType: mapFuelType(data.vehicle.fuelType),
    transmission: mapTransmission(data.vehicle.transmission),
  };
}

/**
 * vindecoder.eu — международный провайдер.
 */
async function decodeWithVinDecoder(vin: string): Promise<Partial<ExtendedVinDecodeResult> | null> {
  const url = `https://api.vindecoder.eu/3.2/${API_KEY}/${process.env.VIN_DECODER_SECRET || ""}/decode/${vin}.json`;
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) return null;
  const data = await response.json();
  if (!data?.decode) return null;

  const get = (label: string) => data.decode.find((d: { label: string; value: string }) => d.label === label)?.value || null;

  const yearStr = get("Model Year");
  return {
    model: get("Model") || null,
    year: yearStr ? Number(yearStr) : null,
    bodyType: get("Body") || null,
    engineVolume: parseFloat(get("Displacement (L)") || "0") || null,
    enginePower: parseFloat(get("Engine Power (kW)") || "0") || null,
    fuelType: mapFuelType(get("Fuel Type")),
    transmission: mapTransmission(get("Transmission")),
  };
}

function mapFuelType(raw: string | null | undefined): FuelType | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("бенз") || lower.includes("gasol") || lower.includes("petrol")) return "GASOLINE";
  if (lower.includes("диз") || lower.includes("diesel")) return "DIESEL";
  if (lower.includes("гибр") || lower.includes("hybrid")) return "HYBRID";
  if (lower.includes("электр") || lower.includes("electric")) return "ELECTRIC";
  return null;
}

function mapTransmission(raw: string | null | undefined): Transmission | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("dsg") || lower.includes("pdk")) return "DSG";
  if (lower.includes("cvt") || lower.includes("вариатор")) return "CVT";
  if (lower.includes("auto") || lower.includes("акпп")) return "AUTOMATIC";
  if (lower.includes("manu") || lower.includes("мкпп")) return "MANUAL";
  return null;
}

export { isValidVin };
