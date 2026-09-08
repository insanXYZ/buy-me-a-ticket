"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { fetchEvents } from "@/lib/api";
import type { Category, Event } from "@/lib/data";

type EventBrowserProps = {
  category: Category | "Semua";
  simulateError?: boolean;
};

export function EventBrowser({ category, simulateError = false }: EventBrowserProps) {
  // Ganti kategori = remount list, jadi state loading/error mulai dari nol
  // tanpa perlu reset manual di dalam effect.
  return <EventList key={category} category={category} simulateError={simulateError} />;
}

function EventList({
  category,
  simulateError,
}: {
  category: Category | "Semua";
  simulateError: boolean;
}) {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchEvents(category, simulateError)
      .then((result) => {
        if (!cancelled) {
          setEvents(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat data event.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [category, simulateError, attempt]);

  if (error) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
        <AlertCircle className="mx-auto size-8 text-red-600" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-bold tracking-tight">
          Gagal memuat event
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{error}</p>
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (!events) {
    return (
      <div
        className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="size-5 animate-spin text-orange-700" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Memuat event...</p>
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? events.filter((event) =>
        [event.title, event.venue, event.city, event.organizer, event.category]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : events;

  return (
    <>
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="cari-event" className="sr-only">
          Cari event, venue, atau kota
        </label>
        <input
          id="cari-event"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari event, venue, atau kota"
          className="h-11 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-orange-600 focus-visible:ring-2 focus-visible:ring-orange-600/20"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
          <p className="font-display text-lg font-bold tracking-tight">
            Tidak ada event yang cocok
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {q
              ? `Hasil pencarian "${query.trim()}" tidak ketemu. Coba kata kunci lain.`
              : "Belum ada event di kategori ini."}
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-input bg-background px-6 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Bersihkan pencarian
          </button>
        </div>
      )}
    </>
  );
}