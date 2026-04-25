"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setUserRoleAction } from "@/app/admin/customers/actions";

interface Props {
  userId: string;
  currentRole: UserRole;
}

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "Клиент",
  MASTER: "Мастер",
  ADMIN: "Админ",
};

export function UserRoleSelector({ userId, currentRole }: Props) {
  const router = useRouter();
  const [role, setRole] = React.useState<UserRole>(currentRole);
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = async (value: string) => {
    const newRole = value as UserRole;
    if (newRole === role) return;
    if (!confirm(`Сменить роль на «${ROLE_LABELS[newRole]}»?`)) return;
    setSubmitting(true);
    const res = await setUserRoleAction(userId, newRole);
    setSubmitting(false);
    if (!res.ok) {
      toast.error(res.error || "Ошибка");
      return;
    }
    setRole(newRole);
    toast.success("Роль обновлена");
    router.refresh();
  };

  return (
    <Select value={role} onValueChange={handleChange} disabled={submitting}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
          <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
