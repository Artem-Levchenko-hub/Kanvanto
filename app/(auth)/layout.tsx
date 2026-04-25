import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-obsidian grid place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="size-10 rounded-md bg-red-primary grid place-items-center">
            <span className="font-display text-h5 font-bold text-white">K</span>
          </div>
          <span className="font-display text-h4 text-graphite-50">Kanavto</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
