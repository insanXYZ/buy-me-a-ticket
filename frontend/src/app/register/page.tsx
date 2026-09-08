import type { Metadata } from "next";
import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Buy Me a Ticket untuk pembeli atau event organizer.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">Buat akun</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Daftar sebagai pembeli atau event organizer.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Mode demo: akun tidak benar-benar disimpan di server.
        </p>
      </div>
    </div>
  );
}