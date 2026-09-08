import { cn } from "cn";

export { cn };

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** "Sabtu, 28 November 2026" or "28–29 November 2026" for multi-day events. */
export function formatEventDate(date: string, dateEnd?: string): string {
  const start = new Date(`${date}T00:00:00`);
  const long = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (!dateEnd) return long.format(start);

  const end = new Date(`${dateEnd}T00:00:00`);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const monthYear = new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    }).format(start);
    return `${start.getDate()}–${end.getDate()} ${monthYear}`;
  }
  const short = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long" });
  return `${short.format(start)} – ${long.format(end)}`;
}

/** Short label for cards, e.g. "28 Nov 2026" or "28–29 Nov 2026". */
export function formatEventDateShort(date: string, dateEnd?: string): string {
  const start = new Date(`${date}T00:00:00`);
  const short = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
  if (!dateEnd) {
    return `${short.format(start)} ${start.getFullYear()}`;
  }
  const end = new Date(`${dateEnd}T00:00:00`);
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${end.getDate()} ${new Intl.DateTimeFormat("id-ID", {
      month: "short",
    }).format(start)} ${start.getFullYear()}`;
  }
  return `${short.format(start)} – ${short.format(end)} ${end.getFullYear()}`;
}