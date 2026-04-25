import type { LucideIcon } from "lucide-react";

export type ServiceCategory =
  | "DIAGNOSTICS"
  | "MAINTENANCE"
  | "ENGINE"
  | "TRANSMISSION"
  | "BRAKES"
  | "SUSPENSION"
  | "ELECTRICAL"
  | "TUNING"
  | "BODY"
  | "TIRES"
  | "AC";

export type Service = {
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  iconName: string;
  durationMinutes: number;
  basePrice: number;
  isFlagship?: boolean;
  isExclusive?: boolean;
};

export const SERVICES: Service[] = [
  {
    slug: "diagnostika",
    title: "Диагностика автомобиля",
    category: "DIAGNOSTICS",
    shortDescription: "Полная компьютерная и инструментальная диагностика всех систем",
    iconName: "Activity",
    durationMinutes: 60,
    basePrice: 2500,
    isFlagship: true,
  },
  {
    slug: "to-reglamentnoe",
    title: "Регламентное ТО",
    category: "MAINTENANCE",
    shortDescription: "ТО по сервисной книжке производителя — масло, фильтры, жидкости",
    iconName: "Wrench",
    durationMinutes: 120,
    basePrice: 8500,
  },
  {
    slug: "remont-dvigatelya",
    title: "Ремонт двигателя",
    category: "ENGINE",
    shortDescription: "От ремня ГРМ до капитального ремонта — для всех немецких марок",
    iconName: "Cog",
    durationMinutes: 480,
    basePrice: 25000,
  },
  {
    slug: "remont-akpp",
    title: "Ремонт АКПП и DSG",
    category: "TRANSMISSION",
    shortDescription: "Диагностика, замена масла, ремонт мехатроников DSG, ZF, AMT",
    iconName: "GitBranch",
    durationMinutes: 240,
    basePrice: 12000,
  },
  {
    slug: "tormoznaya-sistema",
    title: "Тормозная система",
    category: "BRAKES",
    shortDescription: "Колодки, диски, суппорты, прокачка, ABS, ESP",
    iconName: "DiscAlbum",
    durationMinutes: 90,
    basePrice: 4500,
  },
  {
    slug: "podveska-hodovaya",
    title: "Подвеска и ходовая",
    category: "SUSPENSION",
    shortDescription: "Стойки, рычаги, сайлентблоки, пневмоподвеска BMW и Mercedes",
    iconName: "ArrowDownUp",
    durationMinutes: 180,
    basePrice: 6500,
  },
  {
    slug: "elektrika",
    title: "Электрика и проводка",
    category: "ELECTRICAL",
    shortDescription: "Стартеры, генераторы, аккумуляторы, поиск замыканий",
    iconName: "Zap",
    durationMinutes: 120,
    basePrice: 3500,
  },
  {
    slug: "chip-tuning",
    title: "Чип-тюнинг",
    category: "TUNING",
    shortDescription: "Stage 1/2 для BMW, Mercedes-AMG, Audi RS, Porsche",
    iconName: "Cpu",
    durationMinutes: 180,
    basePrice: 18000,
  },
  {
    slug: "kodirovanie-bmw",
    title: "Кодирование BMW",
    category: "ELECTRICAL",
    shortDescription: "Активация скрытых функций, прошивки, ремонт ECU через ICOM",
    iconName: "KeyRound",
    durationMinutes: 90,
    basePrice: 5500,
    isExclusive: true,
  },
  {
    slug: "kuzovnoy-remont",
    title: "Кузовной ремонт",
    category: "BODY",
    shortDescription: "Беспокрасочное удаление вмятин, покраска, восстановление геометрии",
    iconName: "Palette",
    durationMinutes: 1440,
    basePrice: 8000,
  },
  {
    slug: "shinomontazh",
    title: "Шиномонтаж и развал-схождение",
    category: "TIRES",
    shortDescription: "3D развал-схождение, балансировка, сезонная замена",
    iconName: "CircleDot",
    durationMinutes: 60,
    basePrice: 3500,
  },
  {
    slug: "kondicioner",
    title: "Кондиционеры",
    category: "AC",
    shortDescription: "Заправка, ремонт компрессоров, чистка системы",
    iconName: "Wind",
    durationMinutes: 60,
    basePrice: 2800,
  },
];

export type DiagnosticType = {
  slug: string;
  title: string;
  duration: string;
  priceFrom: number;
  description: string;
};

export const DIAGNOSTIC_TYPES: DiagnosticType[] = [
  {
    slug: "kompleksnaya",
    title: "Комплексная диагностика",
    duration: "60–90 мин",
    priceFrom: 4500,
    description: "Все 12 систем авто: двигатель, КПП, ходовая, тормоза, электрика, климат",
  },
  {
    slug: "kompyuternaya",
    title: "Компьютерная диагностика",
    duration: "30–45 мин",
    priceFrom: 2500,
    description: "Сканирование ошибок, ECU, считывание адаптаций по дилерскому ПО",
  },
  {
    slug: "hodovaya",
    title: "Диагностика ходовой части",
    duration: "45 мин",
    priceFrom: 3000,
    description: "Стойки, рычаги, сайлентблоки, шаровые, рулевая, тормозная система",
  },
  {
    slug: "pered-pokupkoy",
    title: "Диагностика перед покупкой",
    duration: "1.5–2 ч",
    priceFrom: 6500,
    description: "Экспертная проверка авто перед покупкой с фото-отчётом и заключением",
  },
  {
    slug: "dvigatelya",
    title: "Диагностика двигателя",
    duration: "60 мин",
    priceFrom: 4000,
    description: "Эндоскопия, замер компрессии, проверка ГРМ, масла, цепи",
  },
  {
    slug: "akpp",
    title: "Диагностика АКПП / DSG",
    duration: "60 мин",
    priceFrom: 5000,
    description: "Адаптации, мехатроник, давление масла, температурные режимы",
  },
  {
    slug: "tormoznoy",
    title: "Диагностика тормозной системы",
    duration: "30 мин",
    priceFrom: 2000,
    description: "Износ колодок, дисков, состояние тормозной жидкости, ABS",
  },
  {
    slug: "elektriki",
    title: "Диагностика электрики",
    duration: "60 мин",
    priceFrom: 3500,
    description: "Поиск замыканий, проверка проводки, утечки тока, аккумулятор",
  },
];

export const DIAGNOSTIC_INCLUDES = [
  "Подключение к OBD-II через дилерское ПО (ISTA, ODIS, PIWIS, KTS)",
  "Считывание ошибок всех ECU (двигатель, КПП, ABS, SRS, кузов)",
  "Проверка адаптаций и параметров в реальном времени",
  "Визуальный осмотр на подъёмнике",
  "Замер давления компрессии (для двигателя)",
  "Распечатка отчёта с фото и видео",
  "Консультация мастера 15 минут",
];

export const DIAGNOSTIC_NOT_INCLUDES = [
  "Снятие узлов для дефектовки (оплачивается отдельно)",
  "Замена расходников",
  "Сложные кузовные замеры (требуется отдельный стенд)",
];

export const DIAGNOSTIC_STEPS = [
  { step: 1, title: "Приёмка", duration: "5 мин", description: "Опрос клиента, фото-фиксация повреждений" },
  { step: 2, title: "Подключение", duration: "10 мин", description: "Подключаем дилерский сканер по марке авто" },
  { step: 3, title: "Анализ", duration: "30 мин", description: "Считываем ошибки, проверяем системы под нагрузкой" },
  { step: 4, title: "Отчёт", duration: "10 мин", description: "Формируем PDF-отчёт с диагнозом и рекомендациями" },
  { step: 5, title: "Консультация", duration: "15 мин", description: "Объясняем результаты, согласовываем стоимость работ" },
];
