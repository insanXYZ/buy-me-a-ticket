import Link from "next/link";
import { MapPin } from "lucide-react";
import { EventPoster } from "@/components/event-poster";
import {
  allTiersSoldOut,
  hasLastCallTier,
  minTicketPrice,
  type Event,
} from "@/lib/data";
import { formatRupiah } from "@/lib/utils";

export function EventCard({ event }: { event: Event }) {
  const soldOut = allTiersSoldOut(event);
  const lowStock = hasLastCallTier(event);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-colors hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      <EventPoster event={event} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
          <span>{event.category}</span>
          {lowStock && !soldOut && (
            <span className="font-semibold text-orange-700">Sisa sedikit</span>
          )}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug tracking-tight">
          {event.title}
        </h3>
        <p className="mt-auto flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {event.venue}, {event.city}
          </span>
        </p>
        <div className="flex items-baseline justify-between gap-2 border-t border-border pt-3">
          <p className="text-sm text-muted-foreground">
            {soldOut ? (
              <span className="font-semibold text-neutral-500">Sold out</span>
            ) : (
              <>
                Mulai{" "}
                <span className="font-semibold text-foreground">
                  {formatRupiah(minTicketPrice(event))}
                </span>
              </>
            )}
          </p>
          <span className="text-xs font-medium text-orange-700 transition-transform group-hover:translate-x-0.5">
            Lihat tiket
          </span>
        </div>
      </div>
    </Link>
  );
}