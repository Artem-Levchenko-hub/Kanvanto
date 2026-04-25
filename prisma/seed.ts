import { PrismaClient, CarBrand, ServiceCategory, MaintenanceType, MaintenanceSeverity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============ BRANCHES ============
  await prisma.branch.upsert({
    where: { slug: "budennogo" },
    update: {},
    create: {
      slug: "budennogo",
      name: "Канавто на Будённого",
      address: "ул. Будённого, 356",
      latitude: 45.0356,
      longitude: 38.9753,
      phone: "+7 (905) 405-1111",
      email: "company@kanavto.com",
      openHours: { mon: "08:00-19:00", tue: "08:00-19:00", wed: "08:00-19:00", thu: "08:00-19:00", fri: "08:00-19:00", sat: "08:00-19:00", sun: "08:00-19:00" },
      brandsSupported: [CarBrand.BMW, CarBrand.MERCEDES, CarBrand.PORSCHE, CarBrand.AUDI],
      capacity: 15,
      isHQ: true,
      sortOrder: 1,
    },
  });

  await prisma.branch.upsert({
    where: { slug: "severnaya" },
    update: {},
    create: {
      slug: "severnaya",
      name: "Канавто на Северной",
      address: "ул. Северная / Ломоносова, 471/42",
      latitude: 45.0455,
      longitude: 38.9762,
      phone: "+7 (967) 654-54-81",
      openHours: { mon: "08:00-19:00", tue: "08:00-19:00", wed: "08:00-19:00", thu: "08:00-19:00", fri: "08:00-19:00", sat: "08:00-19:00" },
      brandsSupported: [CarBrand.BMW, CarBrand.MERCEDES, CarBrand.AUDI],
      capacity: 12,
      sortOrder: 2,
    },
  });

  await prisma.branch.upsert({
    where: { slug: "morskaya" },
    update: {},
    create: {
      slug: "morskaya",
      name: "Канавто на Морской",
      address: "ул. Морская, 29",
      latitude: 45.0282,
      longitude: 38.9912,
      phone: "+7 (967) 654-54-83",
      openHours: { mon: "08:00-19:00", tue: "08:00-19:00", wed: "08:00-19:00", thu: "08:00-19:00", fri: "08:00-19:00", sat: "08:00-19:00" },
      brandsSupported: [CarBrand.VW, CarBrand.SKODA, CarBrand.AUDI],
      capacity: 10,
      sortOrder: 3,
    },
  });

  await prisma.branch.upsert({
    where: { slug: "machugi" },
    update: {},
    create: {
      slug: "machugi",
      name: "Канавто на Мачуги",
      address: "ул. Мачуги, 171",
      latitude: 45.0186,
      longitude: 39.0312,
      phone: "+7 (967) 654-54-84",
      openHours: { mon: "08:00-19:00", tue: "08:00-19:00", wed: "08:00-19:00", thu: "08:00-19:00", fri: "08:00-19:00", sat: "08:00-19:00" },
      brandsSupported: [CarBrand.BMW, CarBrand.MERCEDES, CarBrand.PORSCHE, CarBrand.AUDI, CarBrand.VW, CarBrand.SKODA],
      capacity: 13,
      sortOrder: 4,
    },
  });

  console.log("✅ Branches seeded");

  // ============ SERVICES ============
  const services = [
    { slug: "diagnostika", title: "Диагностика автомобиля", category: ServiceCategory.DIAGNOSTICS, basePrice: 2500, durationMinutes: 60, isFlagship: true, iconName: "Activity", shortDescription: "Полная компьютерная и инструментальная диагностика всех систем" },
    { slug: "to-reglamentnoe", title: "Регламентное ТО", category: ServiceCategory.MAINTENANCE, basePrice: 8500, durationMinutes: 120, iconName: "Wrench", shortDescription: "ТО по сервисной книжке производителя" },
    { slug: "remont-dvigatelya", title: "Ремонт двигателя", category: ServiceCategory.ENGINE, basePrice: 25000, durationMinutes: 480, iconName: "Cog", shortDescription: "От ремня ГРМ до капитального ремонта" },
    { slug: "remont-akpp", title: "Ремонт АКПП и DSG", category: ServiceCategory.TRANSMISSION, basePrice: 12000, durationMinutes: 240, iconName: "GitBranch", shortDescription: "Диагностика, замена масла, ремонт мехатроников" },
    { slug: "tormoznaya-sistema", title: "Тормозная система", category: ServiceCategory.BRAKES, basePrice: 4500, durationMinutes: 90, iconName: "DiscAlbum", shortDescription: "Колодки, диски, суппорты, прокачка, ABS, ESP" },
    { slug: "podveska-hodovaya", title: "Подвеска и ходовая", category: ServiceCategory.SUSPENSION, basePrice: 6500, durationMinutes: 180, iconName: "ArrowDownUp", shortDescription: "Стойки, рычаги, сайлентблоки, пневмоподвеска" },
    { slug: "elektrika", title: "Электрика и проводка", category: ServiceCategory.ELECTRICAL, basePrice: 3500, durationMinutes: 120, iconName: "Zap", shortDescription: "Стартеры, генераторы, аккумуляторы, поиск замыканий" },
    { slug: "chip-tuning", title: "Чип-тюнинг", category: ServiceCategory.TUNING, basePrice: 18000, durationMinutes: 180, iconName: "Cpu", shortDescription: "Stage 1/2 для BMW, Mercedes-AMG, Audi RS, Porsche" },
    { slug: "kodirovanie-bmw", title: "Кодирование BMW", category: ServiceCategory.ELECTRICAL, basePrice: 5500, durationMinutes: 90, iconName: "KeyRound", isExclusive: true, shortDescription: "Активация скрытых функций, прошивки, ремонт ECU через ICOM" },
    { slug: "kuzovnoy-remont", title: "Кузовной ремонт", category: ServiceCategory.BODY, basePrice: 8000, durationMinutes: 1440, iconName: "Palette", shortDescription: "Беспокрасочное удаление вмятин, покраска, восстановление геометрии" },
    { slug: "shinomontazh", title: "Шиномонтаж и развал-схождение", category: ServiceCategory.TIRES, basePrice: 3500, durationMinutes: 60, iconName: "CircleDot", shortDescription: "3D развал-схождение, балансировка, сезонная замена" },
    { slug: "kondicioner", title: "Кондиционеры", category: ServiceCategory.AC, basePrice: 2800, durationMinutes: 60, iconName: "Wind", shortDescription: "Заправка, ремонт компрессоров, чистка системы" },
  ];

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, sortOrder: i + 1, isActive: true },
    });
  }

  console.log("✅ Services seeded");

  // ============ MAINTENANCE RULES ============
  const rules: Array<{
    type: MaintenanceType;
    brand?: CarBrand;
    intervalKm?: number;
    intervalMonths?: number;
    severity: MaintenanceSeverity;
    description: string;
    estimatedPrice?: number;
  }> = [
    { type: MaintenanceType.OIL_ENGINE, intervalKm: 10000, intervalMonths: 12, severity: MaintenanceSeverity.CRITICAL, description: "Замена моторного масла и масляного фильтра", estimatedPrice: 5500 },
    { type: MaintenanceType.OIL_ENGINE, brand: CarBrand.BMW, intervalKm: 15000, intervalMonths: 12, severity: MaintenanceSeverity.CRITICAL, description: "BMW LongLife — замена масла", estimatedPrice: 6500 },
    { type: MaintenanceType.FILTER_AIR, intervalKm: 20000, intervalMonths: 24, severity: MaintenanceSeverity.RECOMMENDED, description: "Замена воздушного фильтра двигателя", estimatedPrice: 1500 },
    { type: MaintenanceType.FILTER_CABIN, intervalKm: 15000, intervalMonths: 12, severity: MaintenanceSeverity.RECOMMENDED, description: "Замена салонного фильтра", estimatedPrice: 1200 },
    { type: MaintenanceType.FILTER_FUEL, intervalKm: 30000, intervalMonths: 36, severity: MaintenanceSeverity.RECOMMENDED, description: "Замена топливного фильтра", estimatedPrice: 2500 },
    { type: MaintenanceType.BRAKE_FLUID, intervalKm: 60000, intervalMonths: 24, severity: MaintenanceSeverity.CRITICAL, description: "Замена тормозной жидкости с прокачкой", estimatedPrice: 3500 },
    { type: MaintenanceType.COOLANT, intervalKm: 90000, intervalMonths: 60, severity: MaintenanceSeverity.CRITICAL, description: "Замена антифриза", estimatedPrice: 4000 },
    { type: MaintenanceType.SPARK_PLUGS, intervalKm: 30000, intervalMonths: 36, severity: MaintenanceSeverity.RECOMMENDED, description: "Замена свечей зажигания (бензин)", estimatedPrice: 3500 },
    { type: MaintenanceType.BRAKE_PADS_FRONT, intervalKm: 40000, intervalMonths: 36, severity: MaintenanceSeverity.RECOMMENDED, description: "Замена передних тормозных колодок", estimatedPrice: 4500 },
    { type: MaintenanceType.BRAKE_PADS_REAR, intervalKm: 60000, intervalMonths: 48, severity: MaintenanceSeverity.RECOMMENDED, description: "Замена задних тормозных колодок", estimatedPrice: 4000 },
    { type: MaintenanceType.OIL_TRANSMISSION, intervalKm: 60000, intervalMonths: 60, severity: MaintenanceSeverity.RECOMMENDED, description: "Замена масла в АКПП с фильтром", estimatedPrice: 9500 },
    { type: MaintenanceType.TIMING_BELT, intervalKm: 80000, intervalMonths: 60, severity: MaintenanceSeverity.CRITICAL, description: "Замена ремня ГРМ с роликами и помпой", estimatedPrice: 18000 },
    { type: MaintenanceType.WHEEL_ALIGNMENT, intervalKm: 20000, intervalMonths: 12, severity: MaintenanceSeverity.OPTIONAL, description: "Развал-схождение 3D", estimatedPrice: 3500 },
    { type: MaintenanceType.TIRE_SEASON, intervalMonths: 6, severity: MaintenanceSeverity.RECOMMENDED, description: "Сезонная замена шин (апрель / октябрь)", estimatedPrice: 2500 },
    { type: MaintenanceType.FULL_SERVICE_1, intervalKm: 15000, intervalMonths: 12, severity: MaintenanceSeverity.CRITICAL, description: "ТО-1 — комплексное обслуживание", estimatedPrice: 12500 },
    { type: MaintenanceType.FULL_SERVICE_2, intervalKm: 30000, intervalMonths: 24, severity: MaintenanceSeverity.CRITICAL, description: "ТО-2 — расширенное обслуживание", estimatedPrice: 22500 },
    { type: MaintenanceType.AC_REFILL, intervalMonths: 24, severity: MaintenanceSeverity.OPTIONAL, description: "Заправка кондиционера и проверка системы", estimatedPrice: 2800 },
    { type: MaintenanceType.POWER_STEERING_FLUID, intervalKm: 60000, intervalMonths: 60, severity: MaintenanceSeverity.OPTIONAL, description: "Замена жидкости ГУР", estimatedPrice: 2200 },
  ];

  for (const rule of rules) {
    await prisma.maintenanceRule.create({ data: rule });
  }

  console.log(`✅ ${rules.length} maintenance rules seeded`);
  console.log("🎉 Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
