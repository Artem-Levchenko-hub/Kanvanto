import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-obsidian grid place-items-center">
      <Container size="narrow">
        <div className="text-center py-24">
          <p className="font-display text-[10rem] leading-none font-semibold text-red-primary">
            404
          </p>
          <h1 className="mt-4 font-display text-h1 text-graphite-50">Страница не найдена</h1>
          <p className="mt-4 text-body-lg text-graphite-200">
            Возможно, вы перешли по устаревшей ссылке или ошиблись в адресе.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/">
              <Home className="size-5" />
              На главную
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
