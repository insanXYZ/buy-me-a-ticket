import type { Metadata } from "next";
import Link from "next/link";
import { EventBrowser } from "@/components/event-browser";
import { categories, events, type Category } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Semua Event",
  description:
    "Daftar semua event: konser, festival, komedi, pameran, dan workshop. Beli tiket online dengan e-tiket QR.",
};

type EventsPageProps = {
  searchParams: Promise<{ kategori?: string; debug?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { kategori, debug } = await searchParams;
  const isCategory = (value: string): value is Category =>
    categories.includes(value as Category);
  const activeCategory: Category | "Semua" =
    kategori && isCategory(kategori) ? kategori : "Semua";

  const categoryCounts = new Map<string, number>();
  for (const event of events) {
    categoryCounts.set(event.category, (categoryCounts.get(event.category) ?? 0) + 1);
  }

  const chips: (Category | "Semua")[] = ["Semua", ...categories];

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Semua Event
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          {events.length} event tersedia. Semua data di halaman ini dummy untuk demo.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
          {chips.map((category) => {
            const active = category === activeCategory;
            const count =
              category === "Semua" ? events.length : categoryCounts.get(category) ?? 0;
            return (
              <Link
                key={category}
                href={
                  category === "Semua"
                    ? "/events"
                    : `/events?kategori=${encodeURIComponent(category)}`
                }
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
                  active
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-border bg-background text-muted-foreground hover:border-neutral-300 hover:text-foreground",
                )}
              >
                {category}
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    active ? "text-neutral-400" : "text-neutral-500",
                  )}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          <EventBrowser
            category={activeCategory}
            simulateError={debug === "error"}
          />
        </div>
      </div>
    </div>
  );
}