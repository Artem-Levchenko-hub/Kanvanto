import { auth } from "@/auth";
import { prisma } from "@/lib/db/client";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Онлайн-запись",
  description: "Запишитесь на обслуживание авто за 90 секунд. Без звонков, без \"оставьте заявку\".",
};

interface PageProps {
  searchParams: Promise<{ service?: string; branch?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth();

  const [services, branches, userCars] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ isFlagship: "desc" }, { sortOrder: "asc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        basePrice: true,
        durationMinutes: true,
        iconName: true,
        isFlagship: true,
        isExclusive: true,
        shortDescription: true,
      },
    }),
    prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        address: true,
        openHours: true,
        brandsSupported: true,
        isHQ: true,
      },
    }),
    session?.user
      ? prisma.car.findMany({
          where: { userId: session.user.id, isActive: true },
          select: { id: true, brand: true, model: true, year: true, licensePlate: true },
        })
      : Promise.resolve([]),
  ]);

  const branchesData = branches.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    address: b.address,
    hours: formatOpenHours(b.openHours as Record<string, string>),
    brands: b.brandsSupported,
    isHQ: b.isHQ,
  }));

  const userInfo = session?.user
    ? {
        name: session.user.name ?? null,
        phone: (session.user as { phone?: string | null }).phone ?? null,
        email: session.user.email ?? null,
      }
    : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 lg:py-12">
      <BookingWizard
        services={services}
        branches={branchesData}
        isAuthenticated={!!session?.user}
        userCars={userCars as never}
        userInfo={userInfo}
        presetServiceSlug={params.service}
      />
    </div>
  );
}

function formatOpenHours(oh: Record<string, string>): string {
  const monFri = oh.mon || "08:00-19:00";
  const sat = oh.sat;
  const sun = oh.sun;
  if (sun) return `Пн–Вс ${monFri}`;
  if (sat) return `Пн–Сб ${monFri}`;
  return `Пн–Пт ${monFri}`;
}
