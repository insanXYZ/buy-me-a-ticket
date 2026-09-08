"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import { TicketStub } from "@/components/ticket-stub";
import {
  tierRemaining,
  tierStatus,
  type Event,
} from "@/lib/data";
import { cn, formatEventDate, formatRupiah } from "@/lib/utils";

const FEE_PER_TICKET = 4000;
const MAX_PER_ORDER = 10;

type CheckoutFormProps = {
  event: Event;
  initialTierId: string;
};

type OrderData = {
  id: string;
  tierName: string;
  qty: number;
  email: string;
  total: number;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutForm({ event, initialTierId }: CheckoutFormProps) {
  const onSaleTiers = useMemo(
    () => event.tiers.filter((tier) => tierStatus(tier) !== "sold-out"),
    [event],
  );

  const [tierId, setTierId] = useState(
    onSaleTiers.some((t) => t.id === initialTierId) ? initialTierId : onSaleTiers[0]?.id ?? "",
  );
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<OrderData | null>(null);

  const tier = onSaleTiers.find((t) => t.id === tierId);
  const remaining = tier ? tierRemaining(tier) : 0;
  const maxQty = Math.min(remaining, MAX_PER_ORDER);

  if (!tier) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
        <p className="font-display text-lg font-bold tracking-tight">
          Semua tiket sudah habis
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Event ini sudah penuh. Coba cari event lain yang masih buka.
        </p>
        <Link
          href="/events"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Lihat event lain
        </Link>
      </div>
    );
  }

  const subtotal = tier.price * qty;
  const fee = FEE_PER_TICKET * qty;
  const total = subtotal + fee;

  function changeQty(next: number) {
    setQty(Math.min(Math.max(next, 1), maxQty));
  }

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 3) {
      nextErrors.name = "Nama minimal 3 huruf.";
    }
    if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Format email belum benar.";
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      nextErrors.phone = "Nomor HP minimal 9 angka.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setOrder({
      id: `BMT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      tierName: tier.name,
      qty,
      email: email.trim(),
      total,
    });
  };

  if (order) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-8 text-orange-600" aria-hidden="true" />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Pesanan berhasil dibuat
            </h1>
            <p className="text-sm text-muted-foreground">
              Nomor pesanan <span className="font-semibold text-foreground">{order.id}</span>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <TicketStub
            notchClass="bg-background"
            top={
              <div>
                <p className="text-sm font-semibold text-orange-700">E-tiket</p>
                <h2 className="mt-1 font-display text-xl font-bold tracking-tight">
                  {event.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatEventDate(event.date, event.dateEnd)} · {event.venue},{" "}
                  {event.city}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Kategori </span>
                    <span className="font-semibold">{order.tierName}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Jumlah </span>
                    <span className="font-semibold">{order.qty} tiket</span>
                  </p>
                </div>
              </div>
            }
            bottom={
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <FakeQr seed={order.id} />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Contoh e-tiket (dummy). QR asli menyusul saat backend terhubung.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total dibayar{" "}
                  <span className="font-display text-xl font-bold text-foreground">
                    {formatRupiah(order.total)}
                  </span>
                </p>
              </div>
            }
          />
        </div>

        <p className="mt-6 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          E-tiket berisi QR akan dikirim ke <span className="font-medium text-foreground">{order.email}</span>.
          Mode demo: tidak ada pembayaran atau email sungguhan.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Kembali ke beranda
          </Link>
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Lihat event lain
          </Link>
        </div>
      </div>
    );
  }

  const fieldClass =
    "h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="flex flex-col gap-10">
        {/* 1. Kategori tiket */}
        <fieldset>
          <legend className="font-display text-lg font-bold tracking-tight">
            1. Pilih kategori tiket
          </legend>
          <div className="mt-4 space-y-3">
            {onSaleTiers.map((t) => {
              const selected = t.id === tierId;
              const left = tierRemaining(t);
              return (
                <label
                  key={t.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-colors",
                    selected
                      ? "border-neutral-950 ring-1 ring-neutral-950"
                      : "border-border hover:border-neutral-300",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="tier"
                      value={t.id}
                      checked={selected}
                      onChange={() => {
                        setTierId(t.id);
                        setQty(1);
                      }}
                      className="size-4 accent-neutral-950"
                    />
                    <span>
                      <span className="block text-sm font-semibold">{t.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        Sisa {left} tiket
                      </span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatRupiah(t.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* 2. Jumlah tiket */}
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight">
            2. Jumlah tiket
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center overflow-hidden rounded-full border border-input">
              <button
                type="button"
                onClick={() => changeQty(qty - 1)}
                disabled={qty <= 1}
                aria-label="Kurangi jumlah tiket"
                className="flex size-11 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-600"
              >
                <Minus className="size-4" aria-hidden="true" />
              </button>
              <span
                className="w-12 text-center text-base font-semibold tabular-nums"
                aria-live="polite"
                aria-atomic="true"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => changeQty(qty + 1)}
                disabled={qty >= maxQty}
                aria-label="Tambah jumlah tiket"
                className="flex size-11 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-600"
              >
                <Plus className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Maksimal {MAX_PER_ORDER} tiket per transaksi. Sisa tiket kategori ini:{" "}
              <span className="font-semibold text-foreground">{remaining}</span>.
            </p>
          </div>
        </div>

        {/* 3. Data pembeli */}
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight">3. Data pembeli</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            E-tiket dengan QR akan dikirim ke email ini.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
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
              <label htmlFor="hp" className="mb-1.5 block text-sm font-medium">
                Nomor HP
              </label>
              <input
                id="hp"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="08xxxxxxxxxx"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "err-hp" : undefined}
                className={cn(fieldClass, errors.phone && "border-red-600")}
              />
              {errors.phone && (
                <p id="err-hp" className="mt-1.5 text-xs text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan */}
      <aside className="lg:sticky lg:top-24">
        <TicketStub
          notchClass="bg-background"
          top={
            <div>
              <p className="font-display text-lg font-bold leading-snug tracking-tight">
                {event.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatEventDate(event.date, event.dateEnd)} · {event.city}
              </p>
            </div>
          }
          bottom={
            <div>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">
                    {tier.name} × {qty}
                  </dt>
                  <dd className="font-medium tabular-nums">{formatRupiah(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Biaya layanan</dt>
                  <dd className="font-medium tabular-nums">{formatRupiah(fee)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-display text-xl font-bold tracking-tight tabular-nums">
                    {formatRupiah(total)}
                  </dd>
                </div>
              </dl>
              <button
                type="submit"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Bayar sekarang
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Mode demo: tidak ada pembayaran sungguhan.
              </p>
            </div>
          }
        />
      </aside>
    </form>
  );
}

function FakeQr({ seed }: { seed: string }) {
  const cells: boolean[] = [];
  let hash = 7;
  for (let i = 0; i < 169; i++) {
    hash = (hash * 31 + seed.charCodeAt(i % seed.length)) % 97;
    cells.push(hash % 3 !== 0);
  }
  return (
    <div
      className="grid w-fit gap-0.5 rounded-lg border border-neutral-200 bg-white p-2"
      style={{ gridTemplateColumns: "repeat(13, 5px)" }}
      role="img"
      aria-label="Contoh kode QR pada e-tiket"
    >
      {cells.map((filled, index) => (
        <span
          key={index}
          className={cn("size-[5px]", filled ? "bg-neutral-950" : "bg-transparent")}
        />
      ))}
    </div>
  );
}