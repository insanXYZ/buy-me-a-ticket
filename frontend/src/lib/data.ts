// Data dummy untuk demo. Semua event, line-up, venue, dan harga di sini
// adalah contoh, bukan data asli. Sumber data asli menyusul dari user.

export const categories = [
  "Konser",
  "Festival",
  "Komedi",
  "Pameran",
  "Workshop",
  "Musik",
] as const;

export type Category = (typeof categories)[number];

export type TicketTier = {
  id: string;
  name: string;
  price: number;
  quota: number;
  sold: number;
  perks: string[];
};

export type Event = {
  slug: string;
  title: string;
  category: Category;
  date: string; // ISO yyyy-mm-dd
  dateEnd?: string;
  doorsOpen: string;
  startTime: string;
  venue: string;
  address: string;
  city: string;
  organizer: string;
  tagline: string;
  description: string[];
  lineup?: string[];
  poster: { from: string; to: string };
  tiers: TicketTier[];
  featured?: boolean;
};

export type TierStatus = "on-sale" | "last-call" | "sold-out";

export function tierStatus(tier: TicketTier): TierStatus {
  if (tier.sold >= tier.quota) return "sold-out";
  if (tier.quota - tier.sold <= 50) return "last-call";
  return "on-sale";
}

export function tierRemaining(tier: TicketTier): number {
  return Math.max(0, tier.quota - tier.sold);
}

export function minTicketPrice(event: Event): number {
  const onSale = event.tiers.filter((t) => tierStatus(t) !== "sold-out");
  if (onSale.length === 0) return 0;
  return Math.min(...onSale.map((t) => t.price));
}

export function allTiersSoldOut(event: Event): boolean {
  return event.tiers.every((t) => tierStatus(t) === "sold-out");
}

export function hasLastCallTier(event: Event): boolean {
  return event.tiers.some((t) => tierStatus(t) === "last-call");
}

export function getEvent(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug);
}

export function getEventsByCategory(category: Category | "Semua"): Event[] {
  if (category === "Semua") return events;
  return events.filter((e) => e.category === category);
}

export const events: Event[] = [
  {
    slug: "pesta-bunga-kota-2026",
    title: "Pesta Bunga Kota 2026",
    category: "Festival",
    date: "2026-11-28",
    dateEnd: "2026-11-29",
    doorsOpen: "12.00",
    startTime: "14.00",
    venue: "Lapangan Saparua",
    address: "Jl. Saparua No. 1, Bandung Wetan",
    city: "Bandung",
    organizer: "Kolektif Nongkrong",
    tagline:
      "Dua hari penuh musik, pasar bunga, dan komunitas. Bawa tikar, ajak teman, nongkrong sampai bintang muncul.",
    description: [
      "Pesta Bunga Kota adalah festival dua hari yang merayakan musik dan komunitas anak muda Bandung. Lebih dari 20 penampil dari berbagai kota naik panggung di Lapangan Saparua, dikelilingi pasar bunga, pameran ilustrasi, dan panggung kecil untuk open mic.",
      "Tiket festival berlaku untuk dua hari. Di hari H, tunjukkan QR e-tiket di pintu masuk, petugas akan memindainya dan kamu mendapat gelang (wristband) sebagai tanda masuk. Gelang wajib dikenakan selama berada di area festival.",
    ],
    lineup: [
      "Korban Jiwa",
      "Senja Sore",
      "Kelana",
      "Tepi Danau",
      "Pagi Buta",
      "Lampu Kota",
      "Bunga Matahari",
      "Tinta",
      "Jalan Sunyi",
      "Gelombang",
      "Arus Listrik",
      "Nusantara Groove",
    ],
    poster: { from: "#e8501a", to: "#7f1d1d" },
    tiers: [
      {
        id: "early-bird",
        name: "Early Bird",
        price: 150000,
        quota: 500,
        sold: 500,
        perks: ["Akses 2 hari", "Kaus edisi festival", "Stiker + pin"],
      },
      {
        id: "presale-1",
        name: "Presale 1",
        price: 185000,
        quota: 700,
        sold: 580,
        perks: ["Akses 2 hari", "Stiker + pin"],
      },
      {
        id: "presale-2",
        name: "Presale 2",
        price: 220000,
        quota: 900,
        sold: 560,
        perks: ["Akses 2 hari"],
      },
      {
        id: "vip",
        name: "VIP",
        price: 400000,
        quota: 150,
        sold: 110,
        perks: ["Akses 2 hari", "Area depan panggung", "Kaus edisi festival", "Akses toilet khusus"],
      },
    ],
    featured: true,
  },
  {
    slug: "semesta-raya",
    title: "Semesta Raya",
    category: "Konser",
    date: "2026-12-19",
    doorsOpen: "16.00",
    startTime: "19.30",
    venue: "Istora Senayan",
    address: "Jl. Pintu Satu Senayan, Gelora",
    city: "Jakarta",
    organizer: "Karya Kreatif",
    tagline:
      "Konser penutup tahun dari Semesta Raya: satu panggung, orkestra, dan penonton yang nyanyi bareng dari lagu pertama.",
    description: [
      "Semesta Raya menutup tur nasionalnya di Istora Senayan. Konser ini membawa format baru: band penuh, paduan suara, dan pencahayaan yang dirancang khusus untuk gedung tertutup.",
      "Pintu dibuka pukul 16.00, pertunjukan dimulai pukul 19.30. Tiket VIP termasuk akses ke soundcheck sore hari dan area duduk depan.",
    ],
    lineup: ["Semesta Raya", "Bintang Tamu: Jalan Sunyi"],
    poster: { from: "#0f6b5c", to: "#062e29" },
    tiers: [
      {
        id: "presale",
        name: "Presale",
        price: 250000,
        quota: 800,
        sold: 750,
        perks: ["Duduk tribun", "E-tiket dengan QR"],
      },
      {
        id: "regular",
        name: "Regular",
        price: 320000,
        quota: 2000,
        sold: 1200,
        perks: ["Duduk tribun", "E-tiket dengan QR"],
      },
      {
        id: "vip",
        name: "VIP",
        price: 650000,
        quota: 200,
        sold: 185,
        perks: ["Area duduk depan", "Akses soundcheck 16.00", "Merchandise eksklusif"],
      },
    ],
    featured: true,
  },
  {
    slug: "ngobrolin-hidup",
    title: "Ngobrolin Hidup",
    category: "Komedi",
    date: "2026-10-17",
    doorsOpen: "18.00",
    startTime: "19.30",
    venue: "Gedung Cak Durasim",
    address: "Jl. Genteng Kali No. 85, Genteng",
    city: "Surabaya",
    organizer: "Panggung Lelucon",
    tagline:
      "Tiga komika, satu tema: hidup yang kadang lucu, kadang menyedihkan, tapi tetap bisa diketawain.",
    description: [
      "Ngobrolin Hidup adalah show komedi spesial dengan tiga komika yang membawakan materi baru tentang kerja, keluarga, dan cinta jarak jauh. Durasi sekitar 90 menit tanpa jeda.",
      "Dilarang merekam pertunjukan. Handphone boleh dibawa, tapi tolong disimpan di saku selama show.",
    ],
    lineup: ["Komika Tamu 1", "Komika Tamu 2", "Komika Tamu 3"],
    poster: { from: "#b45309", to: "#78350f" },
    tiers: [
      {
        id: "early-bird",
        name: "Early Bird",
        price: 100000,
        quota: 200,
        sold: 200,
        perks: ["Duduk bebas", "Minuman pembuka"],
      },
      {
        id: "presale",
        name: "Presale",
        price: 130000,
        quota: 200,
        sold: 175,
        perks: ["Duduk bebas"],
      },
      {
        id: "normal",
        name: "Normal",
        price: 160000,
        quota: 300,
        sold: 100,
        perks: ["Duduk bebas"],
      },
    ],
  },
  {
    slug: "pasar-ilustrasi-dan-zine",
    title: "Pasar Ilustrasi & Zine",
    category: "Pameran",
    date: "2026-11-07",
    dateEnd: "2026-11-08",
    doorsOpen: "10.00",
    startTime: "10.00",
    venue: "Jogja National Museum",
    address: "Jl. P. Senopati No. 158, Pakualaman",
    city: "Yogyakarta",
    organizer: "Toko Kertas",
    tagline:
      "Seratus lebih ilustrator dan penerbit indie jualan zine, print, dan stiker. Masuk sekali, lihat semua.",
    description: [
      "Pasar Ilustrasi & Zine mempertemukan ilustrator, komikus, dan penerbit indie dari seluruh Jawa. Ada lebih dari 100 stan, dua ruang diskusi, dan area workshop singkat di sore hari.",
      "Tiket berlaku untuk satu hari. Jika ingin datang dua hari, beli dua tiket. Anak di bawah 12 tahun gratis.",
    ],
    poster: { from: "#db2777", to: "#701a40" },
    tiers: [
      {
        id: "early-bird",
        name: "Early Bird",
        price: 60000,
        quota: 300,
        sold: 225,
        perks: ["Masuk 1 hari", "Tote bag edisi pasar"],
      },
      {
        id: "normal",
        name: "Normal",
        price: 80000,
        quota: 1000,
        sold: 480,
        perks: ["Masuk 1 hari"],
      },
    ],
  },
  {
    slug: "bengkel-cetak-sablon",
    title: "Bengkel Cetak Sablon",
    category: "Workshop",
    date: "2026-11-14",
    doorsOpen: "09.00",
    startTime: "09.30",
    venue: "Ruang Praktik Braga",
    address: "Jl. Braga No. 22, Sumur Bandung",
    city: "Bandung",
    organizer: "Lekat Studio",
    tagline:
      "Belajar cetak sablon manual dari nol: bikin screen, expose, sampai nyetrika kaos pertama kamu.",
    description: [
      "Workshop setengah hari untuk pemula yang ingin belajar cetak sablon manual. Peserta membawa pulang satu kaos hasil cetakan sendiri.",
      "Kuota terbatas 20 orang agar setiap peserta mendapat pendampingan. Semua alat dan bahan sudah termasuk harga tiket.",
    ],
    poster: { from: "#4d7c0f", to: "#1a2e05" },
    tiers: [
      {
        id: "early-bird",
        name: "Early Bird",
        price: 300000,
        quota: 10,
        sold: 5,
        perks: ["1 kaos + semua bahan", "Makan siang"],
      },
      {
        id: "reguler",
        name: "Reguler",
        price: 350000,
        quota: 10,
        sold: 7,
        perks: ["1 kaos + semua bahan", "Makan siang"],
      },
    ],
  },
  {
    slug: "pantai-timur-fest",
    title: "Pantai Timur Fest",
    category: "Festival",
    date: "2026-12-05",
    dateEnd: "2026-12-06",
    doorsOpen: "14.00",
    startTime: "15.00",
    venue: "Pantai Kenjeran",
    address: "Jl. Pantai Kenjeran, Bulak",
    city: "Surabaya",
    organizer: "Selatan Timur",
    tagline:
      "Festival di tepi laut dengan panggung pasir, pasar loak, dan sesi sunrise acoustic di hari kedua.",
    description: [
      "Pantai Timur Fest mengusung konsep festival pantai: dua panggung, satu di atas pasir dan satu di area panggung utama, ditutup sesi akustik saat matahari terbit di hari kedua.",
      "Ada dua jenis tiket: pass dua hari dan tiket per hari. Pengunjung disarankan membawa tikar dan sunblock.",
    ],
    lineup: ["Kelana", "Pagi Buta", "Arus Listrik", "Tepi Danau", "Tinta", "Lampu Kota"],
    poster: { from: "#1d4ed8", to: "#0f172a" },
    tiers: [
      {
        id: "early-bird",
        name: "Early Bird (2 Hari)",
        price: 175000,
        quota: 400,
        sold: 400,
        perks: ["Akses 2 hari", "Wristband eksklusif"],
      },
      {
        id: "presale",
        name: "Presale (2 Hari)",
        price: 210000,
        quota: 500,
        sold: 410,
        perks: ["Akses 2 hari", "Wristband"],
      },
      {
        id: "day-1",
        name: "Tiket Hari 1",
        price: 140000,
        quota: 600,
        sold: 300,
        perks: ["Akses Sabtu"],
      },
      {
        id: "day-2",
        name: "Tiket Hari 2",
        price: 140000,
        quota: 600,
        sold: 250,
        perks: ["Akses Minggu"],
      },
    ],
    featured: true,
  },
  {
    slug: "akustik-di-atap",
    title: "Akustik di Atap",
    category: "Musik",
    date: "2026-10-24",
    doorsOpen: "18.30",
    startTime: "19.30",
    venue: "Atap Pusat Kesenian Jakarta",
    address: "Jl. Cikini Raya No. 73, Cikini",
    city: "Jakarta",
    organizer: "Suara Kota",
    tagline:
      "Gig akustik kecil di atas gedung, pemandangan langit senja Jakarta, dan penonton maksimal 80 orang.",
    description: [
      "Suara Kota menghadirkan sesi akustik bulanan di atap Pusat Kesenian. Edisi Oktober menghadirkan dua musisi folk dengan set masing-masing 45 menit.",
      "Karena ruangnya terbatas, tiket hanya dijual 80 lembar per show. Kursi tidak ditentukan, datang lebih awal untuk dapat tempat dekat panggung.",
    ],
    lineup: ["Pagi Buta", "Gelombang"],
    poster: { from: "#6b21a8", to: "#2e1065" },
    tiers: [
      {
        id: "reguler",
        name: "Reguler",
        price: 120000,
        quota: 60,
        sold: 20,
        perks: ["Duduk bebas", "1 minuman ringan"],
      },
      {
        id: "vip",
        name: "Barisan Depan",
        price: 200000,
        quota: 20,
        sold: 10,
        perks: ["Kursi depan panggung", "1 minuman ringan", "Setlist cetak"],
      },
    ],
  },
  {
    slug: "malam-minggu-seru",
    title: "Malam Minggu Seru",
    category: "Komedi",
    date: "2026-11-28",
    doorsOpen: "18.30",
    startTime: "20.00",
    venue: "Simpang Lima Hall",
    address: "Jl. Pandanaran No. 100, Semarang Tengah",
    city: "Semarang",
    organizer: "Comedy Ngopi",
    tagline:
      "Show komedi malam minggu di Semarang: empat komika lokal, satu host, dan bahan yang fresh dari minggu ini.",
    description: [
      "Malam Minggu Seru adalah show komedi mingguan dari Comedy Ngopi dengan line-up komika yang berganti tiap pekan. Edisi ini menghadirkan empat komika dengan materi baru.",
      "Show dimulai pukul 20.00. Kopi dan teh tersedia di area lobby sebelum show dimulai.",
    ],
    poster: { from: "#ea580c", to: "#7c2d12" },
    tiers: [
      {
        id: "presale",
        name: "Presale",
        price: 90000,
        quota: 300,
        sold: 150,
        perks: ["Duduk bebas"],
      },
      {
        id: "normal",
        name: "Normal",
        price: 120000,
        quota: 500,
        sold: 100,
        perks: ["Duduk bebas"],
      },
    ],
  },
];