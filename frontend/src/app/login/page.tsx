import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Buy Me a Ticket untuk melihat tiket yang sudah dibeli.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Masuk</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Masuk untuk melihat dan mengelola tiket kamu.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Mode demo: akun tidak benar-benar diverifikasi.
        </p>
      </div>
    </div>
  );
}