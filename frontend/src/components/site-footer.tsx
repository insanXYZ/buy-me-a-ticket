import Link from "next/link";
import { Ticket } from "lucide-react";
import { categories } from "@/lib/data";

const footerNav = [
  { href: "/", label: "Beranda" },
  { href: "/events", label: "Semua Event" },
  { href: "/login", label: "Masuk" },
  { href: "/register", label: "Daftar" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[2fr_1fr_1.5fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-orange-500 text-neutral-950">
              <Ticket className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Buy Me a Ticket
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Marketplace tiket event dari komunitas untuk komunitas. Beli tiket konser,
            festival, komedi, dan event lainnya, lalu tunjukkan e-tiket di pintu masuk.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Semua event, harga, dan data di situs ini adalah data dummy untuk demo.
          </p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="text-sm font-semibold">Navigasi</h2>
          <ul className="mt-3 space-y-2">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Kategori event">
          <h2 className="text-sm font-semibold">Kategori</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/events?kategori=${category}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Buy Me a Ticket</p>
          <p>Data dummy untuk demo. Tidak ada pembayaran sungguhan.</p>
        </div>
      </div>
    </footer>
  );
}