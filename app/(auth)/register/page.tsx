import { redirect } from "next/navigation";

export default function RegisterPage() {
  // Регистрация и вход — один и тот же flow (по телефону/email).
  // Просто редиректим на /login для UX-простоты.
  redirect("/login");
}
