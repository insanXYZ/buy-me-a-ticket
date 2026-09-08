import Link from "next/link";
import { ScanLine } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { EventPoster } from "@/components/event-poster";
import { categories, events } from "@/lib/data";

const flowSteps = [
  {
    number: "01",
    title: "Pilih event & jumlah tiket",
    text: "Cari event yang kamu mau, pilih kategori tiket (early bird, presale, VIP), dan tentukan berapa tiket.",
  },
  {
    number: "02",
    title: "Isi data & bayar",
    text: "Masukkan nama, email, dan nomor HP. Total harga dihitung otomatis dari jumlah tiket.",
  },
  {
    number: "03",
    title: "E-tiket masuk email",
    text: "Tiket berisi QR dikirim ke email kamu. Simpan baik-baik sampai hari H.",
  },
  {
    number: "04",
    title: "Scan di pintu masuk",
    text: "Di hari H, tunjukkan QR di pintu. Petugas memindainya untuk cek masuk pengunjung.",
  },
];

export default function HomePage() {
  const featured = events.filter((event) => event.featured).slice(0, 3);
  const heroPosters = [events[0], events[1]];

  return (
    <>
      {/* Hero */}
      <section className="bg-neutral-950 text-neutral-100">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
              Marketplace tiket event
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl [text-wrap:balance]">
              Dari early bird sampai VIP, semua tiket event ada di sini.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
              Konser, festival, stand-up, sampai gig di kafe. Pilih jumlah tiket, bayar,
              e-tiket langsung masuk email, lalu tunjukkan QR di pintu saat hari H.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/events"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              >
                Lihat semua event
              </Link>
              <a
                href="#alur"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              >
                Cara beli tiket
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-white/10 pt-6">
              <span className="text-xs font-medium text-neutral-400">
                Cari per kategori:
              </span>
              {categories.map((category, index) => (
                <span key={category} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="text-neutral-500" aria-hidden="true">
                      /
                    </span>
                  )}
                  <Link
                    href={`/events?kategori=${category}`}
                    className="text-xs font-semibold text-neutral-200 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                  >
                    {category}
                  </Link>
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden justify-center gap-6 lg:flex" aria-hidden="true">
            <div className="-rotate-2 transition-transform duration-300 hover:rotate-0">
              <EventPoster event={heroPosters[0]} className="w-60" />
            </div>
            <div className="mt-10 rotate-2 transition-transform duration-300 hover:rotate-0">
              <EventPoster event={heroPosters[1]} className="w-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Sedang ramai dibicarakan
              </h2>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                Contoh event unggulan. Semua event, harga, dan jadwal di halaman ini
                adalah data dummy untuk demo.
              </p>
            </div>
            <Link
              href="/events"
              className="text-sm font-semibold text-orange-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              Semua event
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Alur pembelian */}
      <section id="alur" className="border-y border-border bg-muted/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Dari beli tiket sampai masuk venue
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Empat langkah, tidak ada antre di loket, tidak ada tiket fisik yang bisa
            hilang.
          </p>

          <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-0">
            {flowSteps.map((step, index) => (
              <li
                key={step.number}
                className="relative pr-6 md:px-6 md:first:pl-0 md:last:pr-0"
              >
                {index < flowSteps.length - 1 && (
                  <span
                    className="absolute right-0 top-3 hidden w-6 border-t-2 border-dashed border-neutral-300 md:block"
                    aria-hidden="true"
                  />
                )}
                <span className="font-display text-4xl font-bold text-orange-700">
                  {step.number}
                </span>
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-2xl bg-neutral-950 p-6 text-neutral-100 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <div className="flex items-center gap-2">
                  <ScanLine className="size-5 text-orange-300" aria-hidden="true" />
                  <h3 className="font-display text-lg font-bold tracking-tight">
                    Buat Event Organizer
                  </h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                  Saat acara dimulai, dashboard EO punya fitur scan tiket untuk cek
                  masuk pengunjung di pintu. Pantau jumlah penonton yang datang
                  real-time, cukup satu perangkat dan koneksi internet.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              >
                Buat akun EO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-neutral-950 text-neutral-100">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6 md:py-20">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl [text-wrap:balance]">
            Rencana nonton bulan depan?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-300 sm:text-base">
            Pilih event, tentukan jumlah tiket, dan selesai. Semua dihitung otomatis di
            halaman pembayaran.
          </p>
          <Link
            href="/events"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-orange-500 px-7 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
          >
            Lihat semua event
          </Link>
        </div>
      </section>
    </>
  );
}