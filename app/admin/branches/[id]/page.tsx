import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBranchById } from "@/lib/db/branches";
import { BranchForm } from "@/components/admin/BranchForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBranchPage({ params }: Props) {
  const { id } = await params;
  const branch = await getBranchById(id);
  if (!branch) notFound();

  return (
    <div>
      <Link href="/admin/branches" className="inline-flex items-center gap-1.5 text-caption text-graphite-300 hover:text-red-primary mb-4">
        <ArrowLeft className="size-3.5" />
        Филиалы
      </Link>
      <h1 className="font-display text-h1 text-graphite-50 mb-1">{branch.name}</h1>
      <p className="text-caption text-graphite-300 font-mono mb-6">/{branch.slug}</p>
      <BranchForm branch={branch} />
    </div>
  );
}
