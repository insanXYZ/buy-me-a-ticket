"use client";

import { AlertCircle } from "lucide-react";

export default function EventDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
        <AlertCircle className="mx-auto size-8 text-red-600" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-bold tracking-tight">
          Gagal memuat event
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {error.message || "Terjadi kesalahan saat memuat data event."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}