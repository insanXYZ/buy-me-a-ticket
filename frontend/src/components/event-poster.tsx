import { cn, formatEventDateShort } from "@/lib/utils";
import { allTiersSoldOut, type Event } from "@/lib/data";

type EventPosterProps = {
  event: Event;
  className?: string;
};

/**
 * Poster event dibuat dari gradien + tipografi sebagai placeholder.
 * Tidak memakai foto asli: data event masih dummy, jadi artwork
 * dikerjakan dengan tipografi ala poster festival. Tekstur garis
 * miring di sini berfungsi sebagai "artwork sementara" yang tetap
 * terlihat disengaja, bukan gradien kosong.
 */
export function EventPoster({ event, className }: EventPosterProps) {
  const soldOut = allTiersSoldOut(event);
  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] flex-col justify-between overflow-hidden p-5 text-white",
        className,
      )}
      style={{
        background: `linear-gradient(140deg, ${event.poster.from} 0%, ${event.poster.to} 100%)`,
      }}
      role="img"
      aria-label={`Poster ${event.title}`}
    >
      <div
        className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(135deg,rgba(255,255,255,0.05)_0_2px,transparent_2px_7px)]"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-2">
        <span className="rounded-md bg-black/25 px-2 py-1 text-[11px] font-semibold">
          {event.category}
        </span>
        <span className="text-[10px] font-medium text-white/60">
          buy me a ticket presents
        </span>
      </div>

      <div className="relative">
        <h3 className="font-display text-2xl font-bold leading-tight tracking-tight [text-wrap:balance] sm:text-3xl">
          {event.title}
        </h3>
        <p className="mt-2 text-xs font-medium text-white/85">
          {formatEventDateShort(event.date, event.dateEnd)} · {event.city}
        </p>
        {soldOut && (
          <p className="mt-2 inline-block rounded-md bg-black/30 px-2 py-1 text-xs font-bold">
            Sold out
          </p>
        )}
        <div
          className="mt-3 h-7 w-28 [background:repeating-linear-gradient(90deg,currentColor_0_2px,transparent_2px_5px)] opacity-50"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}