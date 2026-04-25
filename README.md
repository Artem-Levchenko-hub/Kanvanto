# Kanavto — премиум-редизайн автосервиса

Полный продукт для kanavto.com (премиум-автосервис в Краснодаре, специализация на BMW/Mercedes/Audi/Porsche/Skoda/VW).

**Все 5 этапов готовы**:
- ✅ **Этап 1** — Marketing MVP (главная, услуги, локации, прайс)
- ✅ **Этап 2** — NextAuth + 6-step Booking Wizard + admin/bookings
- ✅ **Этап 3** — Полный ЛК + maintenance engine + Vercel Cron
- ✅ **Этап 4** — Admin CRUD + MASTER role + Booking→Order + бонусы + Telegram + GDPR-delete
- ✅ **Этап 5** — PDF заказ-наряды + ЮKassa-депозит + SMS-реминды + Real VIN providers + PWA + A/B Hero + Yandex.Metrica

## Стек

- **Next.js 15** (App Router, Server Components)
- **TypeScript** + **Tailwind 3** + **shadcn/ui** (на Radix Primitives)
- **Postgres** + **Prisma** (Neon рекомендуется)
- **NextAuth 5 beta** — phone OTP (custom Credentials) + email magic link + Yandex OAuth
- **Framer Motion** для motion-токенов и scroll-reveal
- **Zustand** для multi-step booking wizard (с persist)
- **React Hook Form** + **Zod** для форм
- **Sonner** для toasts, **next-themes** для тёмной/светлой темы
- **Resend** для email-уведомлений (заявки, ТО-реминды, заказ-наряды)
- **SMSC.ru** для SMS OTP и реминдов

## Дизайн-система

Полная палитра в `tailwind.config.ts` и `app/globals.css`:

- **Графит**: `obsidian #0A0A0B` → `graphite-900/800/700/600/500` → `graphite-50 #F5F5F7`
- **Красный акцент**: `red-primary #DC2626`, `red-hover #EF4444`, `red-pressed #B91C1C`
- **Хром**: `chrome #C0C0C8` для логотипа, hairline-разделителей, иконок брендов
- **Типографика**: Bodoni Moda (display) + Jost (body) + JetBrains Mono (VIN, цены, цифры)
- **Spacing**: 4/8/12/16/24/32/48/64/96/128
- **Radius**: 4 / 8 / 12 / 16 / 24
- **Motion**: 100/150/250/400/600ms с `prefers-reduced-motion` cap до 200ms

## Запуск (локально)

```bash
cd C:\Портфолио\kanavto

# 1. Установка зависимостей
npm install

# 2. Скопировать env и заполнить (минимум DATABASE_URL и NEXTAUTH_SECRET)
cp .env.example .env.local

# Сгенерировать NEXTAUTH_SECRET:
# openssl rand -base64 32

# 3. Postgres (Neon free tier рекомендуется — https://neon.tech)
#    Вставить DATABASE_URL и DIRECT_DATABASE_URL в .env.local

# 4. Применить схему и заполнить тестовыми данными
npm run db:push     # quick start без миграций
# или: npm run db:migrate  для полноценных миграций
npm run db:seed     # 4 филиала, 12 услуг, 18 нормативов ТО

# 5. Запуск
npm run dev         # http://localhost:3000

# Сделать пользователя админом (для /admin):
#   npm run db:studio → User → role: ADMIN

# Дополнительно
npm run typecheck
npm run build       # production build
```

### Опциональные интеграции

**Без них работает в dev-mode**:
- **Resend** (email): без `RESEND_API_KEY` magic-link и подтверждения логируются в console
- **SMSC.ru** (SMS): без `SMSC_LOGIN/PASSWORD` все SMS (OTP, confirmation, reminders) логируются в console
- **Yandex OAuth**: без `YANDEX_CLIENT_*` кнопка скрыта
- **ЮKassa** (платежи): без `YOOKASSA_SHOP_ID/SECRET_KEY` кнопка депозита возвращает «Платежи временно недоступны»
- **Telegram** (бот): без `TELEGRAM_BOT_TOKEN` команды бота логируются в console
- **VIN providers** (datsu/autodev): без `VIN_DECODER_API_KEY` работает только локальный WMI-декодер
- **Yandex.Metrica**: без `NEXT_PUBLIC_YM_ID` events игнорируются
- **A/B-эксперименты**: без `AB_HERO_HEADLINE_ENABLED=true` всегда показывается variant A

## Структура

```
kanavto/
├─ app/
│  ├─ (marketing)/        # / + /services + /services/diagnostika + /locations + /about + /contacts + /pricing
│  ├─ (auth)/             # /login + /register (этап 2)
│  ├─ (dashboard)/        # /account/* — ЛК (этап 3)
│  ├─ (booking)/          # /booking — wizard (этап 2)
│  ├─ api/auth/[...nextauth]   # NextAuth (этап 2)
│  ├─ api/cron/maintenance-check  # Vercel Cron для ТО-напоминаний (этап 3)
│  ├─ api/vin/[vin]       # VIN-decoder proxy (этап 3)
│  ├─ layout.tsx          # root: шрифты + ThemeProvider + Toaster
│  ├─ globals.css         # CSS-переменные + reduced-motion
│  ├─ not-found.tsx, error.tsx, sitemap.ts, robots.ts
├─ components/
│  ├─ ui/                 # Button, Card, Badge, Tabs, Accordion, Input, Separator, Container
│  ├─ marketing/          # Hero, BrandsStrip, UspStats, ServicesGrid, LivePriceSection,
│  │                      #   BeforeAfterCases, EquipmentCarousel, TeamSection, VideoTestimonials,
│  │                      #   BranchesMapSection, AccountPromo, BookingCta, FaqSection
│  ├─ layout/             # SiteHeader (sticky + mobile drawer), SiteFooter
│  ├─ animations/         # FadeIn, StaggerContainer/Item, CountUp
├─ lib/
│  ├─ utils/{cn,format}.ts
│  ├─ constants/{index,services}.ts
│  ├─ db/client.ts        # Prisma singleton
├─ prisma/
│  ├─ schema.prisma       # User, Car, Service, Branch, Booking, Order, MaintenanceRule/Reminder, Bonus, Document
│  └─ seed.ts             # 4 филиала + 12 услуг + 18 нормативов ТО
├─ middleware.ts          # cron-secret + (заглушка для /account, /admin)
└─ конфиги: next, tailwind, postcss, components.json, tsconfig
```

## Что реализовано

### Этап 1 — Marketing MVP

- ✅ **Главная** с 13 секциями: Hero (split с SVG-силуэтом авто), brand strip, USP-цифры с count-up, services bento (12 карточек), **открытый Live-прайс** (KEY DIFFERENTIATOR), before/after slider, equipment carousel, команда, видео-отзывы, карта филиалов, промо ЛК с mockup, CTA, FAQ
- ✅ **Страница диагностики** `/services/diagnostika` с подкатегориями, открытым прайсом, что входит/не входит, 5-step process, гарантией, FAQ, sticky-CTA на mobile
- ✅ Маршруты `/services`, `/services/[slug]`, `/locations`, `/locations/[slug]`, `/pricing`, `/about`, `/contacts`

### Этап 2 — Auth + Booking + Admin

- ✅ **NextAuth 5 (beta)** в двух-файловой конфигурации (`auth.config.ts` Edge-safe + `auth.ts` Node):
  - Phone OTP (custom Credentials провайдер с rate-limit и dev-mode подсказкой кода)
  - Email magic link через Resend (с luxury-дизайн шаблоном письма)
  - Yandex OAuth (опционально, активируется при наличии `YANDEX_CLIENT_*`)
  - JWT-сессии (30 дней)
  - Prisma Adapter
- ✅ **`/login`** — табы Phone/Email + Yandex кнопка, 2-шаговый OTP flow (телефон → код), inline-валидация, Suspense-обёртка для useSearchParams
- ✅ **`/verify-request`** — страница после отправки magic-link
- ✅ **Middleware** — защита `/account`, `/admin` через NextAuth, ADMIN-only для `/admin`, CRON_SECRET для `/api/cron`
- ✅ **6-step Booking Wizard** в `/booking`:
  1. Услуга (12 карточек, флагман выделен)
  2. Авто (для авторизованных — выбор из своих, для гостей — форма марка/модель/год/номер)
  3. Филиал (4 карточки с фильтром по марке, hint «не специализируется на X»)
  4. Дата + время (Calendar на ru-RU + сетка 30-мин слотов с реальным расчётом доступности)
  5. Контакты (для гостей — имя/телефон/email + согласие на ПДн)
  6. Подтверждение (summary с кнопками «изменить» для каждого блока)
  - Zustand + persist в localStorage (черновик не теряется при рефреше)
  - Server Action `createBooking()` с транзакционным capacity check
  - Email-подтверждение через Resend (luxury шаблон)
  - Magic-link для гостей в письме («активировать кабинет»)
- ✅ **`/booking/success`** — анимированный draw-stroke checkmark + детали записи + QR-friendly id
- ✅ **`/admin`** — KPI-дашборд (записи на сегодня, на неделю, ожидают подтверждения, всего клиентов)
- ✅ **`/admin/bookings`** — таблица с фильтрами (поиск, статус, филиал) + пагинация + кликабельные телефоны
- ✅ **`/api/auth/otp-request`** — endpoint для генерации SMS-кода (с rate-limit 60s)
- ✅ **SMSC.ru** интеграция в `lib/auth/sms.ts` (с dev-mode фолбэком в console)
- ✅ **Resend** интеграция в `lib/email/resend.ts` (с dev-mode фолбэком)

### Инфраструктура

- ✅ Полная Prisma schema (12 моделей) и seed-скрипт (4 филиала + 12 услуг + 18 нормативов ТО)
- ✅ Reduced-motion поддержка во всех анимациях
- ✅ SEO: metadata API, sitemap.ts, robots.ts (с disallow для /account, /admin, /api)
- ✅ Темная тема по умолчанию + light theme подготовлена

### Этап 3 — Полный ЛК

- ✅ **Dashboard layout**:
  - Collapsible sidebar (240↔64px) с навигацией и signOut
  - Mobile bottom-tab (5 главных пунктов) + FAB «Записаться»
  - Top-bar с бейджем срочных напоминаний
  - Auth-guard на /account через layout + middleware
- ✅ **Maintenance engine** ([lib/maintenance/engine.ts](C:\Портфолио\kanavto\lib\maintenance\engine.ts)):
  - `computeDue()` — расчёт `dueAt` (по времени) и `dueAtMileage` (по пробегу)
  - `computeStatus()` — PENDING → UPCOMING (≤60 дней / 1500 км) → DUE (≤14 дней / 500 км) → OVERDUE
  - `formatTimeUntilDue()` — выбирает ближайшее: дни или км
  - `seedRemindersForCar()` — при создании авто берёт универсальные + бренд-специфичные правила, дедуплицирует, создаёт reminders
  - `recomputeRemindersForCar()` — пересчёт после обновления пробега
- ✅ **VIN-decoder** ([lib/vin/decode.ts](C:\Портфолио\kanavto\lib\vin\decode.ts)):
  - Lightweight: WMI → бренд (BMW, MB, Audi, Porsche, Škoda, VW), 10-я позиция → год, 1-я позиция → страна
  - Покрывает все марки Канавто без внешнего API
  - Валидация (17 символов, без I/O/Q)
- ✅ **Pages**:
  - **`/account`** — приветствие с marka/модель + 4 metric-карточки (пробег / до ТО / бонусы / в работе) + алерт ближайшего ТО + активные заказы + быстрые действия
  - **`/account/cars`** — grid карточек авто с timeline-индикатором следующего ТО + AddCarDialog (3-step wizard: VIN → детали → пробег)
  - **`/account/cars/[carId]`** — hero-карточка + stats (объём, КПП, цвет) + tabs (ТО / История) + UpdateMileageDialog с пересчётом reminders
  - **`/account/maintenance`** — tabs Срочно / Все / Отложенные. ReminderCard с popover «Отложить на N дней»
  - **`/account/orders`** — список с OrderRow (дата, авто, услуги, сумма, статус)
  - **`/account/orders/[orderId]`** — детальная: хедер с № + сумма, работы, запчасти (оригинал/аналог), гарантия с indicator, начисленные бонусы
  - **`/account/bonuses`** — крупный баланс + BonusLadder (Bronze→Silver→Gold→Platinum) + история транзакций + награды
  - **`/account/documents`** — tabs (все / заказ-наряды / гарантии)
  - **`/account/settings`** — ProfileForm + NotificationsForm (3 канала + chips дней)
- ✅ **Server Actions**:
  - `addCar` — Zod-валидация + createCar + seedReminders → revalidatePath
  - `updateMileage` — апдейт + recomputeReminders
  - `removeCar`, `decodeVinAction`
  - `snoozeReminderAction(reminderId, days)` — установка SNOOZED статуса
  - `markReminderDoneAction(reminderId, mileage)` — закрытие текущего + создание следующего цикла
  - `updateProfile`, `updateNotifications`
- ✅ **Cron** ([app/api/cron/maintenance-check/route.ts](C:\Портфолио\kanavto\app\api\cron\maintenance-check\route.ts)):
  - Защищён `Authorization: Bearer ${CRON_SECRET}`
  - Vercel Cron в [vercel.json](C:\Портфолио\kanavto\vercel.json): `0 6 * * *` UTC = 09:00 МСК
  - Достаёт reminders с `dueAt < now+60d`, пересчитывает статусы
  - Если статус сменился И `notifiedAt > 14 дней` — отправляет email через Resend (luxury-шаблон в [lib/maintenance/notify.ts](C:\Портфолио\kanavto\lib\maintenance\notify.ts))
- ✅ **VIN API** (`/api/vin/[vin]`) — авторизованный proxy для расширения на этапе 4 (datsu/autodev)

### Этап 4 — Admin CRUD + Master + Bonus + Telegram + GDPR

- ✅ **Admin CRUD**:
  - **`/admin/services`** + `/[id]` + `/new` — управление услугами (slug, категория, цена, длительность, флагман/exclusive, активность)
  - **`/admin/branches`** + `/[id]` + `/new` — управление филиалами (адрес, lat/lng, часы работы по дням, поддерживаемые марки, capacity, HQ)
  - **`/admin/customers`** + `/[id]` — список клиентов (поиск + фильтр по роли) + детальная карточка (контакты, бонусы, авто, заказы) + смена роли через UserRoleSelector
  - **`/admin/bookings/[id]`** — детальная запись с workflow-кнопками (подтвердить → приехал → в работу → завершить) + закрепление гостевой записи за пользователем
- ✅ **Booking → Order workflow** ([components/admin/CompleteBookingDialog.tsx](C:\Портфолио\kanavto\components\admin\CompleteBookingDialog.tsx)):
  - Кнопка «Закрыть → создать заказ-наряд» в любом активном статусе
  - Форма: мастер, пробег, гарантия (мес + км), скидка, состав работ/запчастей с типом (LABOR/PART), оригинал/аналог, артикулом
  - **Автоматическое начисление бонусов** через `accrueBonusesForOrder()` ([lib/bonuses/calculate.ts](C:\Портфолио\kanavto\lib\bonuses\calculate.ts)): 1% от total → BonusTransaction (EARN) + обновление `bonusBalance` + пересчёт `bonusLevel` (Bronze→Silver→Gold→Platinum по `totalSpent`)
  - Идемпотентно по `orderId` — повторное начисление невозможно
  - Email уведомление клиенту с total и начисленными бонусами
- ✅ **MASTER role**:
  - Новый layout `/master` с проверкой `role === MASTER || ADMIN`
  - **`/master`** — KPI «В работе» + «Недавно завершённые», фильтрация по `Order.masterName === session.user.name`
  - **`/master/orders/[id]`** — read-only детали заказа (работы, запчасти, гарантия, контакт клиента)
  - Middleware защищает `/master/*`
- ✅ **Telegram-бот** ([lib/telegram/bot.ts](C:\Портфолио\kanavto\lib\telegram\bot.ts)):
  - **Webhook** `/api/webhooks/telegram` защищён `?secret=$TELEGRAM_WEBHOOK_SECRET`
  - **Linking flow**: `generateLinkToken(userId)` → одноразовый токен в `VerificationToken` (TTL 30 мин) → deep-link `t.me/<bot>?start=<token>` → `/start <token>` в боте → `consumeLinkToken()` → запись `telegramId` в User + `notifyTelegram=true`
  - **Команды бота**: `/start`, `/status` (активные заказы), `/to` (следующее ТО)
  - UI: TelegramLinkSection в `/account/settings` — генерация ссылки, отображение статуса, отвязка
  - В dev-mode без `TELEGRAM_BOT_TOKEN` — сообщения логируются в console
- ✅ **GDPR-удаление аккаунта**:
  - `deleteAccountAction` требует ввести «удалить» текстом подтверждения
  - Транзакционно удаляет sessions + accounts + user (cascade delete всех связанных сущностей через Prisma `onDelete: Cascade`)
  - DeleteAccountDialog с предупреждениями + 152-ФЗ
  - После удаления — signOut + redirect на главную с `?deleted=1`

### Этап 5 — Polish & Production-readiness

- ✅ **PDF заказ-наряды** через `@react-pdf/renderer` ([lib/pdf/order-pdf.tsx](C:\Портфолио\kanavto\lib\pdf\order-pdf.tsx)):
  - Фирменный шаблон A4 с шапкой Kanavto, секциями работ/запчастей, итогом, гарантией, реквизитами
  - Endpoint `/api/orders/[id]/pdf` с RBAC (USER если owner, MASTER если masterName совпадает, ADMIN всегда)
  - Кнопка «Скачать PDF» в `/account/orders/[id]` теперь работает реально
- ✅ **ЮKassa депозит** ([lib/payments/yookassa.ts](C:\Портфолио\kanavto\lib\payments\yookassa.ts)):
  - `createPayment()` — создание платежа с idempotence-key + чек 54-ФЗ (receipt)
  - Server action `createBookingDeposit(bookingId, amountRub)` — выставление депозита
  - Webhook `/api/webhooks/yookassa` — подтверждает оплату через API (защита от подделки) → переводит Booking в `depositStatus=PAID, status=CONFIRMED`
- ✅ **SMS extensions** ([lib/sms/notifications.ts](C:\Портфолио\kanavto\lib\sms\notifications.ts)):
  - `sendBookingConfirmationSms()` — после `createBooking()` отправляется клиенту
  - `sendMaintenanceReminderSms()` — в `lib/maintenance/notify.ts` если `user.notifySms === true`
  - `sendBookingReminderSms()` — для будущего cron-напоминания за 24ч до записи
  - В dev-mode без `SMSC_LOGIN/PASSWORD` — логирует в console
- ✅ **Real VIN providers** ([lib/vin/providers.ts](C:\Портфолио\kanavto\lib\vin\providers.ts)):
  - Расширение локального WMI-декодера через datsu.ru / autodev.ru / vindecoder.eu
  - Стратегия: локально определяем brand+year+country, внешние провайдеры обогащают model+engine+КПП
  - Fallback на локальный результат если провайдер недоступен
  - `/api/vin/[vin]` теперь использует extended decode
- ✅ **PWA**:
  - `public/manifest.json` с shortcuts (Записаться / Заказы / ТО)
  - `public/icon-192.svg` + `public/icon-512.svg` (графитово-красный лого)
  - `public/sw.js` — service worker (cache-first для статики и PDF, network-first с fallback на `/offline` для HTML)
  - `app/offline/page.tsx` — премиум-офлайн страница
  - `components/PWARegister.tsx` — регистрация SW в production
  - В `layout.tsx`: `manifest`, `apple-mobile-web-app-*`, иконки
- ✅ **A/B Hero** ([components/marketing/HeroAB.tsx](C:\Портфолио\kanavto\components\marketing\HeroAB.tsx)):
  - Cookie `ab_hero_headline` (a|b) выставляется в middleware при первом визите (если `AB_HERO_HEADLINE_ENABLED=true`)
  - Server-side выбор варианта → рендерит `Hero` (A) или `HeroVariantB` (B)
  - `ABExposureTracker` отправляет событие `ab_exposure` в Yandex.Metrica при показе
- ✅ **Yandex.Metrica** ([lib/analytics/ym.ts](C:\Портфолио\kanavto\lib\analytics\ym.ts)):
  - Типизированные events: `bookingStarted`, `bookingStepCompleted`, `bookingSubmitted`, `signIn`, `carAdded`, `reminderClicked`, `ctaClicked`, `abExposure`
  - YM-tag в `<YandexMetrica />` через `next/script` (lazy-load) с webvisor + clickmap + trackBounce
  - Активируется через `NEXT_PUBLIC_YM_ID`

## Verification

После заполнения `.env.local` и `pnpm db:seed`:

### Маркетинг (этап 1)
1. **Главная**: премиум-дизайн, контрасты, motion. Lighthouse target: Perf ≥90, A11y ≥95
2. **`/services/diagnostika`**: открытые цены, sticky-CTA на mobile, accordion FAQ
3. **`prefers-reduced-motion`**: motion отключается, count-up — instant
4. **Mobile (375)**: hamburger menu, без horizontal scroll
5. **Keyboard nav**: Tab по navbar → focus visible (red ring)

### Auth + Booking (этап 2)
6. **`/login`** → телефон → жмёшь «Получить код» → в dev-режиме код в toast, в проде SMS через SMSC.ru → ввод 4-значного кода → сессия создана, редирект на callbackUrl
7. **`/login`** → Email tab → отправить magic-link → в dev лог в console, в проде письмо от Resend → клик → авто-вход
8. **`/booking`** → 6 шагов гостем:
   - Service (выбрать «Диагностика»)
   - Car (марка BMW + модель X5 + год 2021)
   - Branch (выбрать филиал, поддерживающий BMW)
   - Slot (выбрать дату завтра + слот в 11:00)
   - Contacts (имя, телефон, согласие)
   - Confirm → Подтвердить
9. **Запись создана** → редирект на `/booking/success` с draw-stroke анимацией
10. **`/admin/bookings`** (нужно вручную выставить роль ADMIN в БД для пользователя) → таблица с записью, фильтры работают
11. **Zustand persist**: рефреш страницы /booking на 4-м шаге → черновик восстанавливается с того же шага

### Этап 5 (Polish)
28. **PDF**: на `/account/orders/[id]` → «Скачать PDF» → открывается фирменный заказ-наряд A4 с работами/запчастями/гарантией
29. **ЮKassa** (если `YOOKASSA_*` env): server action `createBookingDeposit({bookingId, amountRub: 1500})` → возвращает `confirmationUrl` → клиент оплачивает → webhook переводит booking в `depositStatus=PAID`
30. **SMS**: после `createBooking` (даже гостем) — клиент получает SMS «Kanavto: Дмитрий, запись подтверждена. Диагностика, 28 апр 11:00, ул. Будённого 356»
31. **VIN**: `WBAGZ4108L0K12345` → если есть `VIN_DECODER_API_KEY` → datsu.ru дополняет brand BMW + model X5 + engine 3.0 + АКПП. Без ключа — локальный fallback
32. **PWA**: production build → SW регистрируется → offline-страница доступна → можно установить как приложение (manifest)
33. **A/B**: с `AB_HERO_HEADLINE_ENABLED=true` → middleware выдаёт `ab_hero_headline=a|b` → главная показывает один из 2 вариантов → событие `ab_exposure` уходит в Yandex.Metrica
34. **Analytics**: с `NEXT_PUBLIC_YM_ID` → YM tag загружается → события воронки трекаются автоматически

### Admin + Master + Telegram + GDPR (этап 4)
20. **`/admin/services`** → создать новую услугу с slug/категорией/ценой → видна на главной и `/services`
21. **`/admin/branches`** → создать филиал с lat/lng + часами работы → виден на `/locations` и в booking
22. **`/admin/customers`** → найти клиента → открыть карточку → сменить роль на MASTER
23. **`/admin/bookings/[id]`** → нажать «Закрыть → создать заказ-наряд» → ввести мастера, работы, запчасти → создан Order → бонусы (1%) автоматически начислены → клиенту email
24. После повышения уровня (например, Gold → Platinum) — toast «повышен уровень» + изменение в `/account/bonuses`
25. **`/master`** (для пользователя с ролью MASTER) → видны заказы где `masterName == name`
26. **`/account/settings`** → «Привязать Telegram» → генерация ссылки `t.me/kanavto_bot?start=<token>` → /start в боте → telegramId записан → `/to`, `/status` команды работают
27. **`/account/settings`** → «Удалить аккаунт» → ввести «удалить» → cascade-удаление + signOut + редирект

### ЛК (этап 3)
12. **`/account/cars`** → «Добавить авто» → wizard:
    - Шаг 1: ввести VIN (например `WBAGZ4108L0K12345`) → автозаполнение марки/года
    - Шаг 2: подтвердить детали + указать модель и гос.номер
    - Шаг 3: текущий пробег + дата покупки → «Добавить»
    - Toast: «Авто добавлено · создано N напоминаний о ТО»
13. **`/account`** → автоматически появилось приветствие, метрика «До ТО», ближайшее напоминание
14. **`/account/maintenance`** → видны все напоминания (масло, фильтры, ГРМ для BMW LongLife и т.д.) с правильным `dueAt`/`dueAtMileage`
15. **Кнопка «Отложить на 30 дней»** → reminder уходит в Snoozed
16. **`/account/cars/[id]`** → «Обновить пробег» (увеличить на 5000 км) → reminders пересчитываются
17. **Cron**: `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/maintenance-check` → JSON с количеством обработанных и отправленных уведомлений
18. **`/account/bonuses`** → видна BonusLadder с текущим уровнем
19. **`/account/settings`** → переключение каналов уведомлений + выбор дней (1/3/7/14/30/60)

## Anti-patterns исходного kanavto.com → решения здесь

| Было | Стало |
|---|---|
| Цены закрыты | Открытый Live-прайс на главной + `/services/diagnostika` + `/pricing` |
| 5+ форм заявки на странице | Один global CTA «Записаться» (этап 2 — 6-step wizard) |
| 4 филиала в подвале | Полная секция «Сеть» + `/locations` + `/locations/[slug]` |
| Нет ЛК | Полноценный ЛК (этап 3) с напоминаниями, бонусами, документами |
| Иконки соцсетей без подписей | В footer **с подписями** (Telegram, WhatsApp, Яндекс.Карты, Instagram) |
| Weak typography | Bodoni Moda + Jost, выдержанная typo-scale, generous whitespace |

## Деплой

Vercel + Neon Postgres + Vercel Blob:

```bash
# Vercel CLI
vercel link
vercel env pull
vercel deploy --prod
```

Vercel Cron в `vercel.json` (создаётся на этапе 3):

```json
{
  "crons": [
    { "path": "/api/cron/maintenance-check", "schedule": "0 6 * * *" }
  ]
}
```
