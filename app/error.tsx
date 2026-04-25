"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-obsidian grid place-items-center">
      <Container size="narrow">
        <div className="text-center py-24">
          <div className="size-16 mx-auto rounded-md bg-error/10 grid place-items-center">
            <AlertCircle className="size-9 text-error" />
          </div>
          <h1 className="mt-6 font-display text-h1 text-graphite-50">Что-то пошло не так</h1>
          <p className="mt-4 text-body-lg text-graphite-200 max-w-lg mx-auto text-pretty">
            Мы уже знаем об ошибке и работаем над исправлением. Попробуйте обновить страницу.
          </p>
          {error.digest && (
            <p className="mt-3 text-caption text-graphite-400 font-mono tabular-nums">
              ID ошибки: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} size="lg">
              <RotateCcw className="size-5" />
              Попробовать снова
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">
                <Home className="size-5" />
                На главную
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
