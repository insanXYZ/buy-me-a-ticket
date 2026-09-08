import { getEvent, getEventsByCategory, type Category, type Event } from "./data";

/**
 * Lapisan akses data versi demo.
 *
 * Semua data masih statis, tapi dibungkus fungsi async supaya UI punya
 * state loading dan error yang nyata. Ketika backend terhubung, ganti isi
 * fungsi ini dengan fetch ke API tanpa mengubah komponen.
 *
 * `simulateError` dipakai untuk memicu jalur error (misalnya lewat
 * `/events?debug=error`) supaya state error bisa diperiksa saat demo.
 */
const SIMULATED_LATENCY_MS = 350;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchEvents(
  category: Category | "Semua" = "Semua",
  simulateError = false,
): Promise<Event[]> {
  await wait(SIMULATED_LATENCY_MS);
  if (simulateError) {
    throw new Error("Gagal memuat data event. Silakan coba lagi.");
  }
  return getEventsByCategory(category);
}

export async function fetchEvent(slug: string): Promise<Event | undefined> {
  await wait(SIMULATED_LATENCY_MS);
  return getEvent(slug);
}