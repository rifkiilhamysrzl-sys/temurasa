'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Header } from '@/components/layout/Header';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Loader2,
} from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomCode = searchParams?.get('code') || '';
  const trxId = searchParams?.get('trx') || '';

  useEffect(() => {
    // Elegant celebratory confetti burst
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#777D4B', '#9EAD91', '#F0EBD6', '#8FAEAE'],
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      <Header title="TWOgether" />

      <div className="w-full flex-1 rounded-[32px] glass-panel p-7 shadow-glass flex flex-col justify-between my-3 text-center relative overflow-hidden">
        <div className="my-auto">
          {/* Success Animated Icon */}
          <div className="w-16 h-16 rounded-full bg-olive/15 border border-olive/30 flex items-center justify-center mx-auto mb-4 text-olive shadow-sm">
            <CheckCircle2 size={36} />
          </div>

          <h2 className="font-serif-heading text-3xl font-medium text-textDark leading-tight">
            Your Report Is Unlocked!
          </h2>
          <p className="text-xs sm:text-sm text-textDark/80 mt-2 max-w-xs mx-auto leading-relaxed">
            Thank you for choosing to understand each other better.
          </p>

          {/* Receipt Card */}
          <div className="mt-6 rounded-2xl bg-white/40 border border-white/60 p-4 text-left shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-white/40 text-xs">
              <span className="text-textDark/70">Status Pembayaran</span>
              <span className="font-semibold text-olive flex items-center gap-1">
                <CheckCircle2 size={13} />
                Lunas (Verified)
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/40 text-xs">
              <span className="text-textDark/70">No. Referensi</span>
              <span className="font-mono text-textDark font-medium truncate max-w-[150px]">
                {trxId || 'TRX-CONFIRMED'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-white/40 text-xs">
              <span className="text-textDark/70">Kode Ruangan</span>
              <span className="font-bold text-olive">{roomCode || 'TWO-ROOM'}</span>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-textDark/70">Total Biaya</span>
              <span className="font-serif-heading text-base font-bold text-textDark">
                Rp 10.000
              </span>
            </div>
          </div>

          <p className="text-[11px] text-textDark/65 mt-4">
            Akses laporan ini terbuka untuk Anda dan pasangan Anda selamanya.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push(`/report/${roomCode}`)}
            className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Discover Our Results</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-6">
          <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-olive" />
            <p className="text-sm text-textDark/80">Menyiapkan konfirmasi...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
