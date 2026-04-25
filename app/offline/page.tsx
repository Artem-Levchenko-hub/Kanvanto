import Link from "next/link";
import { WifiOff, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata = { title: "Нет соединения" };

export default function OfflinePage() {
  return (
    <div className="min-h-dvh bg-obsidian grid place-items-center">
      <Container size="narrow">
        <div className="text-center py-24">
          <div className="size-16 mx-auto rounded-md bg-graphite-700 grid place-items-center">
            <WifiOff className="size-8 text-chrome" />
          </div>
          <h1 className="mt-6 font-display text-h1 text-graphite-50">Нет соединения</h1>
          <p className="mt-4 text-body-lg text-graphite-200 max-w-md mx-auto text-pretty">
            Не удалось загрузить страницу. Проверьте подключение к интернету.
          </p>
          <p className="mt-2 text-body-sm text-graphite-300">
            Документы заказов и предыдущие просмотренные страницы доступны офлайн.
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
