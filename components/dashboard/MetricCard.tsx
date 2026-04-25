import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  description?: string;
  href?: string;
  tone?: "default" | "warning" | "success" | "error";
}

export function MetricCard({ icon: Icon, label, value, description, href, tone = "default" }: Props) {
  const valueClass = {
    default: "text-graphite-50",
    warning: "text-warning",
    success: "text-success",
    error: "text-error",
  }[tone];

  const accentClass = {
    default: "text-chrome",
    warning: "text-warning",
    success: "text-success",
    error: "text-error",
  }[tone];

  const content = (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-caption uppercase tracking-wider text-chrome">{label}</p>
        <Icon className={cn("size-5", accentClass)} />
      </div>
      <p className={cn("font-display text-h2 leading-none font-semibold", valueClass)}>{value}</p>
      {description && <p className="mt-2 text-body-sm text-graphite-300">{description}</p>}
      {href && (
        <span className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="size-4 text-graphite-300" />
        </span>
      )}
    </>
  );

  const className =
    "relative rounded-lg border border-graphite-500/30 bg-graphite-800 p-5 transition-colors duration-base block group hover:border-chrome/30";

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
