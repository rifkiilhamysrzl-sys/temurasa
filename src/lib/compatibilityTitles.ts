/**
 * Temurasa Compatibility Title System
 * Maps compatibility scores (0–100%) to unique, fun, witty, and relatable titles.
 */

export interface CompatibilityTitleInfo {
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
}

export const COMPATIBILITY_TITLES: CompatibilityTitleInfo[] = [
  {
    minScore: 98,
    maxScore: 100,
    title: 'Si Paling Soulmate 💘',
    description: 'Kayak sudah janjian bahkan sebelum saling kenal.',
  },
  {
    minScore: 95,
    maxScore: 97,
    title: 'Si Paling Satu Server 🫶',
    description: 'Cara berpikirnya hampir selalu sejalan.',
  },
  {
    minScore: 90,
    maxScore: 94,
    title: 'Si Paling Telepati 🧠',
    description: 'Belum ngomong, sudah saling mengerti.',
  },
  {
    minScore: 85,
    maxScore: 89,
    title: 'Si Paling Copy Paste 👯',
    description: 'Banyak kesamaan, beda sedikit di detail.',
  },
  {
    minScore: 80,
    maxScore: 84,
    title: 'Si Paling Sefrekuensi 🎧',
    description: 'Ketemu ritme yang nyaman untuk berdua.',
  },
  {
    minScore: 75,
    maxScore: 79,
    title: 'Si Paling Couple Goals 💍',
    description: 'Punya banyak hal yang bikin hubungan terasa solid.',
  },
  {
    minScore: 70,
    maxScore: 74,
    title: 'Si Paling Nyambung 💬',
    description: 'Selalu ada cara untuk menemukan titik temu.',
  },
  {
    minScore: 65,
    maxScore: 69,
    title: 'Si Paling Beda Tipis 🤏',
    description: 'Mirip, tapi tetap punya warna masing-masing.',
  },
  {
    minScore: 60,
    maxScore: 64,
    title: 'Si Paling Banyak Kompromi 🤝',
    description: 'Perbedaan jadi ruang untuk saling memahami.',
  },
  {
    minScore: 55,
    maxScore: 59,
    title: 'Si Paling Beda Universe 🌌',
    description: 'Dua dunia yang sedang belajar bertemu.',
  },
  {
    minScore: 50,
    maxScore: 54,
    title: 'Si Paling Plot Twist 🎬',
    description: 'Banyak hal tak terduga dalam perjalanan kalian.',
  },
  {
    minScore: 45,
    maxScore: 49,
    title: 'Si Paling Butuh Translator 🗣️',
    description: 'Kadang maksudnya sama, bahasanya berbeda.',
  },
  {
    minScore: 40,
    maxScore: 44,
    title: 'Si Paling Beda Jalan Pikiran 🧩',
    description: 'Punya perspektif yang unik satu sama lain.',
  },
  {
    minScore: 35,
    maxScore: 39,
    title: 'Si Paling Sabar Ya 🥲',
    description: 'Butuh sedikit lebih banyak ruang untuk memahami.',
  },
  {
    minScore: 30,
    maxScore: 34,
    title: 'Si Paling Butuh Update Sistem 🔧',
    description: 'Saatnya upgrade cara memahami satu sama lain.',
  },
];

export const FALLBACK_COMPATIBILITY_TITLE: CompatibilityTitleInfo = {
  minScore: 0,
  maxScore: 29,
  title: 'Si Paling Butuh Waktu Berdua 🌱',
  description: 'Perjalanan memahami satu sama lain baru saja dimulai.',
};

/**
 * Returns the unique compatibility title and description for a given score.
 * Rounds to integer and ensures every score (0–100%) maps to exactly one title.
 */
export function getCompatibilityTitle(score: number): CompatibilityTitleInfo {
  const rounded = Math.round(score);
  const clamped = Math.max(0, Math.min(100, rounded));

  const match = COMPATIBILITY_TITLES.find(
    (item) => clamped >= item.minScore && clamped <= item.maxScore
  );

  return match || FALLBACK_COMPATIBILITY_TITLE;
}
