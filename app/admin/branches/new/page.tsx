import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BranchForm } from "@/components/admin/BranchForm";

export const metadata = { title: "Admin · Новый филиал" };

export default function NewBranchPage() {
  return (
    <div>
      <Link href="/admin/branches" className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4">
        <ArrowLeft className="size-3.5" />
        Филиалы
      </Link>
      <h1 className="font-display text-h1 text-graphite-50 mb-6">Новый филиал</h1>
      <BranchForm />
    </div>
  );
}
