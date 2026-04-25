import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServiceById } from "@/lib/db/services";
import { ServiceForm } from "@/components/admin/ServiceForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div>
      <Link href="/admin/services" className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4">
        <ArrowLeft className="size-3.5" />
        Услуги
      </Link>
      <h1 className="font-display text-h1 text-graphite-50 mb-1">{service.title}</h1>
      <p className="text-caption text-graphite-300 font-mono mb-6">/{service.slug}</p>
      <ServiceForm service={{
        id: service.id,
        slug: service.slug,
        title: service.title,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        category: service.category,
        durationMinutes: service.durationMinutes,
        basePrice: service.basePrice,
        iconName: service.iconName,
        isFlagship: service.isFlagship,
        isExclusive: service.isExclusive,
        sortOrder: service.sortOrder,
        isActive: service.isActive,
      }} />
    </div>
  );
}
