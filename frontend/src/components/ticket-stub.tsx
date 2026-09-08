import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TicketStubProps = {
  top: ReactNode;
  bottom: ReactNode;
  className?: string;
  /** Warna "lubang" perforasi, harus sama dengan warna latar di belakang komponen. */
  notchClass?: string;
};

/**
 * Bentuk karcis: dua bagian dipisah garis putus-putus dengan lubang
 * perforasi di kedua ujungnya. Motif ini dipakai di kartu tiket dan
 * ringkasan pesanan supaya seluruh situs punya identitas "tiket" yang sama.
 */
export function TicketStub({ top, bottom, className, notchClass }: TicketStubProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-background",
        className,
      )}
    >
      <div className="px-5 py-5 md:px-6">{top}</div>

      <div className="relative border-t-2 border-dashed border-neutral-200" aria-hidden="true">
        <span
          className={cn(
            "absolute -left-3 -top-3 size-6 rounded-full",
            notchClass ?? "bg-background",
          )}
        />
        <span
          className={cn(
            "absolute -right-3 -top-3 size-6 rounded-full",
            notchClass ?? "bg-background",
          )}
        />
      </div>

      <div className="px-5 py-5 md:px-6">{bottom}</div>
    </div>
  );
}