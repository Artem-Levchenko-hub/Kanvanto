import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata = { title: "Admin · Создать услугу" };

export default function NewServicePage() {
  return (
    <div>
      <Link href="/admin/services" className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4">
        <ArrowLeft className="size-3.5" />
        Услуги
      </Link>
      <h1 className="font-display text-h1 text-graphite-50 mb-6">Новая услуга</h1>
      <ServiceForm />
    </div>
  );
}
