"use client";

import * as React from "react";
import { toast } from "sonner";
import { Send, Check, Copy, Unlink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateTelegramLinkAction, unlinkTelegramAction } from "@/app/(dashboard)/account/settings/actions";

interface Props {
  isLinked: boolean;
}

export function TelegramLinkSection({ isLinked }: Props) {
  const router = useRouter();
  const [generating, setGenerating] = React.useState(false);
  const [unlinking, setUnlinking] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    const res = await generateTelegramLinkAction();
    setGenerating(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    setLinkUrl(res.deepLink);
  };

  const handleUnlink = async () => {
    setUnlinking(true);
    const res = await unlinkTelegramAction();
    setUnlinking(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    toast.success("Telegram отвязан");
    router.refresh();
  };

  const handleCopy = async () => {
    if (!linkUrl) return;
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  if (isLinked) {
    return (
      <div className="rounded-md border border-success/30 bg-success/5 p-4">
        <div className="flex items-start gap-3">
          <div className="size-10 shrink-0 rounded-md bg-success/15 grid place-items-center">
            <Check className="size-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-graphite-50">Telegram привязан</p>
            <p className="text-caption text-graphite-200 mt-1">
              Бот @kanavto_bot отправит напоминания и статусы заказов в чат.
            </p>
            <button
              type="button"
              onClick={handleUnlink}
              disabled={unlinking}
              className="mt-3 inline-flex items-center gap-1.5 text-caption text-error hover:underline"
            >
              <Unlink className="size-3" />
              {unlinking ? "Отвязываем..." : "Отвязать"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (linkUrl) {
    return (
      <div className="rounded-md border border-graphite-500/40 bg-graphite-800 p-4">
        <p className="text-body-sm font-medium text-graphite-50 mb-2">Шаг 2 из 2: откройте бота</p>
        <p className="text-caption text-graphite-200 mb-3">
          Перейдите по ссылке и нажмите «Start» в Telegram. Ссылка действует 30 минут.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild size="sm" className="flex-1">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              <Send className="size-4" />
              Открыть в Telegram
            </a>
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
            <Copy className="size-4" />
            Скопировать ссылку
          </Button>
        </div>
        <p className="mt-3 text-caption text-graphite-300 break-all font-mono">
          {linkUrl}
        </p>
      </div>
    );
  }

  return (
    <Button type="button" variant="outline" onClick={handleGenerate} disabled={generating}>
      <Send className="size-4" />
      {generating ? "Генерируем токен..." : "Привязать Telegram"}
    </Button>
  );
}
