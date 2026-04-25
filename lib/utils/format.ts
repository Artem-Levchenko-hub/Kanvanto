export function formatPrice(value: number, options?: { compact?: boolean }) {
  const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
    notation: options?.compact ? "compact" : "standard",
  });
  return formatter.format(value);
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("ru-RU", options).format(value);
}

export function formatDate(date: Date | string, style: "short" | "long" = "short") {
  const d = typeof date === "string" ? new Date(date) : date;
  if (style === "long") {
    return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(d);
  }
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}

export function formatRelativeDays(days: number) {
  if (days < 0) return `${Math.abs(days)} дн. назад`;
  if (days === 0) return "сегодня";
  if (days === 1) return "завтра";
  const last = days % 10;
  const lastTwo = days % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return `через ${days} дней`;
  if (last === 1) return `через ${days} день`;
  if (last >= 2 && last <= 4) return `через ${days} дня`;
  return `через ${days} дней`;
}

export function maskVin(vin: string) {
  if (vin.length < 17) return vin;
  return `${vin.slice(0, 4)} ${vin.slice(4, 11)} ${vin.slice(11, 17)}`;
}

export function pluralRu(n: number, forms: [string, string, string]) {
  const lastTwo = n % 100;
  const last = n % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return forms[2];
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}
