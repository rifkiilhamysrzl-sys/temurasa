import type { Metadata, Viewport } from 'next';
import { getAppBaseUrl, APP_CONFIG } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getAppBaseUrl()),
  title: {
    default: `${APP_CONFIG.name} — Titik Temu di Antara Dua Rasa`,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    'tes kecocokan pasangan',
    'couple compatibility',
    'temurasa',
    'refleksi hubungan',
    'premarital check',
    'komunikasi pasangan',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${APP_CONFIG.name} — Titik Temu di Antara Dua Rasa`,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
    url: '/',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_CONFIG.name} — Titik Temu di Antara Dua Rasa`,
    description: APP_CONFIG.description,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="scenic-bg min-h-screen text-textDark selection:bg-olive/20 selection:text-textDark">
        {/* Soft atmospheric nature backdrop overlays */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Subtle sun glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/20 rounded-full blur-3xl" />
          {/* Atmospheric rolling mist */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-sage/40 to-transparent" />
        </div>

        {/* Responsive App Container: mobile-width centered on desktop */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-start">
          <div className="w-full max-w-md min-h-screen flex flex-col sm:shadow-2xl sm:my-4 sm:rounded-[36px] sm:overflow-hidden sm:border sm:border-white/40">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
