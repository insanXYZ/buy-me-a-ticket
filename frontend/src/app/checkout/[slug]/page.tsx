import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CheckoutForm } from "@/components/checkout-form";
import { allTiersSoldOut, getEvent, tierStatus } from "@/lib/data";
import { formatEventDate } from "@/lib/utils";

type CheckoutPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tier?: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Event tidak ditemukan" };
  return {
    title: `Checkout · ${event.title}`,
    description: `Beli tiket ${event.title} dengan pilihan jumlah tiket.`,
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { slug } = await params;
  const { tier: tierParam } = await searchParams;
  const event = getEvent(slug);
  if (!event) notFound();

  const onSale = event.tiers.filter((t) => tierStatus(t) !== "sold-out");
  const initialTierId = onSale.some((t) => t.id === tierParam)
    ? (tierParam as string)
    : onSale[0]?.id ?? "";

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke detail event
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-orange-700">Checkout</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {event.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatEventDate(event.date, event.dateEnd)} · {event.venue}, {event.city}
          </p>
        </div>

        <div className="mt-10">
          {allTiersSoldOut(event) ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
              <p className="font-display text-lg font-bold tracking-tight">
                Semua tiket sudah habis
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Event ini sudah penuh. Coba cari event lain yang masih buka.
              </p>
              <Link
                href="/events"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Lihat event lain
              </Link>
            </div>
          ) : (
            <CheckoutForm event={event} initialTierId={initialTierId} />
          )}
        </div>
      </div>
    </div>
  );
}