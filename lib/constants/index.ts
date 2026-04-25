export const SITE_NAME = "Kanavto";
export const SITE_TAGLINE = "Сервис уровня дилера. Цены — открыто.";
export const SITE_DESCRIPTION =
  "Премиум-автосервис в Краснодаре. BMW, Mercedes, Audi, Porsche, Skoda, VW. 4 филиала, 50 постов, 30 лет опыта, 71 000 клиентов.";

export const BRANDS = [
  { id: "bmw", label: "BMW", emoji: null },
  { id: "mercedes", label: "Mercedes-Benz", emoji: null },
  { id: "audi", label: "Audi", emoji: null },
  { id: "porsche", label: "Porsche", emoji: null },
  { id: "skoda", label: "Škoda", emoji: null },
  { id: "vw", label: "Volkswagen", emoji: null },
] as const;

export type BrandId = (typeof BRANDS)[number]["id"];

export const NAV_LINKS = [
  { href: "/services", label: "Услуги" },
  { href: "/services/diagnostika", label: "Диагностика" },
  { href: "/pricing", label: "Прайс" },
  { href: "/locations", label: "Филиалы" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const ACCOUNT_NAV = [
  { href: "/account", label: "Главная", icon: "Home" },
  { href: "/account/cars", label: "Мои авто", icon: "Car" },
  { href: "/account/maintenance", label: "ТО-напоминания", icon: "Bell" },
  { href: "/account/orders", label: "История заказов", icon: "ClipboardList" },
  { href: "/account/bonuses", label: "Бонусы", icon: "Sparkles" },
  { href: "/account/documents", label: "Документы", icon: "FileText" },
  { href: "/account/settings", label: "Настройки", icon: "Settings" },
] as const;

export const STATS = [
  { value: 30, suffix: "", label: "лет опыта", description: "С 1995 года" },
  { value: 4, suffix: "", label: "филиала", description: "По всему Краснодару" },
  { value: 50, suffix: "", label: "постов", description: "Одновременное обслуживание" },
  { value: 71000, suffix: "+", label: "клиентов", description: "Доверяют нам свои авто" },
] as const;

export const SOCIAL_LINKS = [
  { href: "https://t.me/kanavto", label: "Telegram", icon: "Send" },
  { href: "https://wa.me/79054051111", label: "WhatsApp", icon: "MessageCircle" },
  { href: "https://yandex.ru/maps/org/kanavto/1094187353/", label: "Яндекс.Карты", icon: "Map" },
  { href: "https://instagram.com/kanavto", label: "Instagram", icon: "Instagram" },
] as const;

export const BRANCHES = [
  {
    id: "budennogo",
    slug: "budennogo",
    name: "Канавто на Будённого",
    address: "ул. Будённого, 356",
    city: "Краснодар",
    phone: "+7 (905) 405-1111",
    email: "company@kanavto.com",
    hours: "Пн–Вс 08:00–19:00",
    brands: ["BMW", "Mercedes", "Porsche", "Audi"],
    isHQ: true,
    lat: 45.0356,
    lng: 38.9753,
  },
  {
    id: "severnaya",
    slug: "severnaya",
    name: "Канавто на Северной",
    address: "ул. Северная / Ломоносова, 471/42",
    city: "Краснодар",
    phone: "+7 (967) 654-54-81",
    isHQ: false,
    hours: "Пн–Сб 08:00–19:00",
    brands: ["BMW", "Mercedes", "Audi"],
    lat: 45.0455,
    lng: 38.9762,
  },
  {
    id: "morskaya",
    slug: "morskaya",
    name: "Канавто на Морской",
    address: "ул. Морская, 29",
    city: "Краснодар",
    phone: "+7 (967) 654-54-83",
    isHQ: false,
    hours: "Пн–Сб 08:00–19:00",
    brands: ["VW", "Skoda", "Audi"],
    lat: 45.0282,
    lng: 38.9912,
  },
  {
    id: "machugi",
    slug: "machugi",
    name: "Канавто на Мачуги",
    address: "ул. Мачуги, 171",
    city: "Краснодар",
    phone: "+7 (967) 654-54-84",
    isHQ: false,
    hours: "Пн–Сб 08:00–19:00",
    brands: ["BMW", "Mercedes", "Porsche", "Audi", "VW", "Skoda"],
    lat: 45.0186,
    lng: 39.0312,
  },
] as const;

export const PHONE_DISPLAY = "+7 (905) 405-11-11";
export const PHONE_LINK = "+79054051111";
