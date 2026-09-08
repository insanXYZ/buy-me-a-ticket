"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const fieldClass =
    "h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20";

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 3) {
      nextErrors.name = "Nama minimal 3 huruf.";
    }
    if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Format email belum benar.";
    }
    if (password.length < 6) {
      nextErrors.password = "Kata sandi minimal 6 karakter.";
    }
    if (confirm !== password) {
      nextErrors.confirm = "Kata sandi tidak sama.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-10 text-orange-600" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
          Akun demo dibuat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Mode demo: akun tidak benar-benar disimpan di server.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Lanjut ke halaman masuk
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor="nama" className="mb-1.5 block text-sm font-medium">
            Nama lengkap
          </label>
          <input
            id="nama"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            placeholder="Contoh: Ayu Lestari"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "err-nama" : undefined}
            className={cn(fieldClass, errors.name && "border-red-600")}
          />
          {errors.name && (
            <p id="err-nama" className="mt-1.5 text-xs text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            placeholder="kamu@email.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
            className={cn(fieldClass, errors.email && "border-red-600")}
          />
          {errors.email && (
            <p id="err-email" className="mt-1.5 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Kata sandi
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "err-password" : undefined}
              className={cn(fieldClass, "pr-12", errors.password && "border-red-600")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((show) => !show)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-600"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="err-password" className="mt-1.5 text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="konfirmasi" className="mb-1.5 block text-sm font-medium">
            Ulangi kata sandi
          </label>
          <input
            id="konfirmasi"
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: "" }));
            }}
            placeholder="Ketik ulang kata sandi"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirm)}
            aria-describedby={errors.confirm ? "err-konfirmasi" : undefined}
            className={cn(fieldClass, errors.confirm && "border-red-600")}
          />
          {errors.confirm && (
            <p id="err-konfirmasi" className="mt-1.5 text-xs text-red-600">
              {errors.confirm}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        Buat akun
      </button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-orange-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}