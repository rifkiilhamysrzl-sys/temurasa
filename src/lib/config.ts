/**
 * Temurasa — Application Configuration & Centralized URL Utility
 */

export const APP_CONFIG = {
  name: 'Temurasa',
  tagline: 'Menemukan titik temu di antara dua rasa.',
  description:
    'Temurasa adalah perjalanan dua hati untuk saling mengenal lebih dalam, memahami perbedaan, menemukan kesamaan, dan menyelaraskan arah.',
  reportPriceIDR: 10000,
  defaultCurrency: 'IDR',
  supportEmail: 'halo@temurasa.love',
};

/**
 * Returns the normalized application base URL.
 * Automatically handles:
 * 1. Client-side execution (window.location.origin)
 * 2. Explicitly configured NEXT_PUBLIC_APP_URL
 * 3. Vercel deployment preview / production (VERCEL_URL)
 * 4. Localhost fallback
 */
export function getAppBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim().length > 0) {
    return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL && process.env.VERCEL_URL.trim().length > 0) {
    const host = process.env.VERCEL_URL.trim().replace(/\/$/, '');
    return host.startsWith('http') ? host : `https://${host}`;
  }

  return 'http://localhost:3000';
}
