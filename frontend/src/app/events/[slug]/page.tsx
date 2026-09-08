import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { EventPoster } from "@/components/event-poster";
import { TicketStub } from "@/components/ticket-stub";
import { allTiersSoldOut, minTicketPrice, tierRemaining, tierStatus } from "@/lib/data";
import { fetchEvent } from "@/lib/api";
import { formatEventDate, formatRupiah } from "@/lib/utils";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEvent(slug);
  if (!event) return { title: "Event tidak ditemukan" };
  return {
    title: event.title,
    description: event.tagline,
  };
}

function TierStatusChip({ status, remaining }: { status: string; remaining: number }) {
  if (status === "sold-out") {
    return (
      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
        Sold out
      </span>
    );
  }
  if (status === "last-call") {
    return (
      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
        Sisa sedikit, {remaining} tiket
      </span>
    );
  }
  return (
    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-neutral-600">
      Sisa {remaining} tiket
    </span>
  );
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await fetchEvent(slug);
  if (!event) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-neutral-950 text-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <Link
            href="/events"
            className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Semua event
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            <div className="mx-auto w-full max-w-xs lg:mx-0">
              <EventPoster event={event} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-orange-500/15 px-2.5 py-1 text-xs font-bold text-orange-300">
                  {event.category}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-neutral-300">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {formatEventDate(event.date, event.dateEnd)}
                </span>
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl [text-wrap:balance]">
                {event.title}
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-300">
                {event.tagline}
              </p>

              <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-orange-300" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Lokasi</dt>
                    <dd className="mt-0.5 text-neutral-300">
                      {event.venue}, {event.city}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-orange-300" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Jadwal hari H</dt>
                    <dd className="mt-0.5 text-neutral-300">
                      Pintu buka {event.doorsOpen}, mulai {event.startTime}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Building2 className="mt-0.5 size-4 shrink-0 text-orange-300" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Penyelenggara</dt>
                    <dd className="mt-0.5 text-neutral-300">{event.organizer}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-300" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-white">Harga mulai</dt>
                    <dd className="mt-0.5 text-neutral-300">
                      {allTiersSoldOut(event)
                        ? "Semua tiket habis"
                        : formatRupiah(minTicketPrice(event))}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8">
                {allTiersSoldOut(event) ? (
                  <span className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/10 px-7 text-sm font-semibold text-neutral-400">
                    Tiket habis
                  </span>
                ) : (
                  <a
                    href="#tiket"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-7 text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                  >
                    Pilih tiket
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Line-up */}
      {event.lineup && event.lineup.length > 0 && (
        <section className="border-t border-white/10 bg-neutral-900 text-neutral-100">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="font-display text-xl font-bold tracking-tight text-orange-300">
              Line-up
            </h2>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              {event.lineup.map((name, index) => (
                <span key={name} className="flex items-center gap-3">
                  {index > 0 && (
                    <span className="text-neutral-500" aria-hidden="true">
                      /
                    </span>
                  )}
                  <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {name}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tiket */}
      <section id="tiket" className="bg-background scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Pilih tiket
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Kategori tiket mengikuti gelombang penjualan event: early bird paling murah,
            lalu presale, sampai harga normal dan VIP. Semua sudah termasuk biaya layanan.
          </p>

          {allTiersSoldOut(event) ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
              <p className="font-display text-lg font-bold tracking-tight">
                Semua tiket sudah habis
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Pantau halaman ini untuk informasi penjualan gelombang berikutnya.
              </p>
            </div>
          ) : (
            <div className="mt-8 flex max-w-3xl flex-col gap-5">
              {event.tiers.map((tier) => {
                const status = tierStatus(tier);
                const soldOut = status === "sold-out";
                const remaining = tierRemaining(tier);
                return (
                  <TicketStub
                    key={tier.id}
                    notchClass="bg-background"
                    top={
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-bold tracking-tight">
                              {tier.name}
                            </h3>
                            <TierStatusChip status={status} remaining={remaining} />
                          </div>
                          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            {tier.perks.map((perk) => (
                              <li
                                key={perk}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="size-3.5 shrink-0 text-orange-700" aria-hidden="true" />
                                {perk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    }
                    bottom={
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-display text-2xl font-bold tracking-tight">
                            {formatRupiah(tier.price)}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Per tiket, sudah termasuk biaya layanan
                          </p>
                        </div>
                        {soldOut ? (
                          <span className="inline-flex min-h-11 items-center rounded-full bg-neutral-100 px-6 text-sm font-semibold text-neutral-600">
                            Sold out
                          </span>
                        ) : (
                          <Link
                            href={`/checkout/${event.slug}?tier=${tier.id}`}
                            className="inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                          >
                            Pilih
                          </Link>
                        )}
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Deskripsi */}
      <section className="border-t border-border bg-muted/50">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Tentang event
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {event.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Informasi penting
            </h2>
            <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-background text-sm">
              {[
                { label: "Venue", value: event.venue },
                { label: "Alamat", value: event.address },
                { label: "Kota", value: event.city },
                { label: "Pintu buka", value: event.doorsOpen },
                { label: "Acara mulai", value: event.startTime },
                { label: "Penyelenggara", value: event.organizer },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 px-4 py-3"
                >
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="text-right font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}