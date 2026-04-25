"use client";

import * as React from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccountAction } from "@/app/(dashboard)/account/settings/actions";

export function DeleteAccountDialog() {
  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await deleteAccountAction({ confirmation });
    if (!res?.ok) {
      setSubmitting(false);
      toast.error(res?.error || "Не удалось удалить аккаунт");
    }
    // При успехе redirect на / выполняется в server-action, ничего не делаем
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-body-sm text-error hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Удалить аккаунт
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="size-12 rounded-md bg-error/15 grid place-items-center mb-3">
            <AlertTriangle className="size-6 text-error" />
          </div>
          <DialogTitle>Удалить аккаунт?</DialogTitle>
          <p className="text-body-sm text-graphite-200 mt-2">
            Действие необратимо. Будут удалены: история заказов, авто, напоминания, бонусы, документы.
            Согласно 152-ФЗ, удаление выполняется в течение 24 часов.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="confirmation">
              Введите <strong className="text-error">«удалить»</strong> для подтверждения
            </Label>
            <Input
              id="confirmation"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="удалить"
              autoFocus
              className="mt-2"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
              Отмена
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={submitting || confirmation.toLowerCase() !== "удалить"}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Удаляем...
                </>
              ) : (
                "Удалить навсегда"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
