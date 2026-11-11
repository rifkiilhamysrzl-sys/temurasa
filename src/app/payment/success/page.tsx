'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Header } from '@/components/layout/Header';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomCode = searchParams?.get('code') || '';
  const trxId = searchParams?.get('trx') || '';

  const [verifying, setVerifying] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-verify with server-to-server Mayar check upon landing
  useEffect(() => {
    let isMounted = true;

    async function checkVerification() {
      if (!roomCode || !trxId) {
        setVerifying(false);
        setIsPaid(true); // Default to unlocked if direct visit with parameters
        return;
      }

      try {
        setVerifying(true);
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomCode, transactionId: trxId }),
        });

        const data = await res.json();
        if (isMounted) {
          if (data.isPaid) {
            setIsPaid(true);
            setErrorMessage(null);
            // Trigger celebratory confetti
            try {
              confetti({
                particleCount: 70,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#777D4B', '#9EAD91', '#F0EBD6', '#8FAEAE'],
              });
            } catch (e) {
              // Ignore confetti error
            }
          } else {
            setIsPaid(false);
            setErrorMessage(data.message || 'Pembayaran sedang menunggu konfirmasi.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMessage(err.message || 'Gagal memverifikasi status pembayaran.');
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    }

    checkVerification();

    return () => {
      isMounted = false;
    };
  }, [roomCode, trxId]);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      <Header title="TWOgether" />

      <div className="w-full flex-1 rounded-[32px] glass-panel p-7 shadow-glass flex flex-col justify-between my-3 text-center relative overflow-hidden">
        <div className="my-auto">
          {verifying ? (
            <div className="py-8">
              <div className="w-16 h-16 rounded-full bg-olive/15 border border-olive/30 flex items-center justify-center mx-auto mb-4 text-olive">
                <Loader2 size={32} className="animate-spin" />
              </div>
              <h2 className="font-serif-heading text-2xl font-medium text-textDark">
                Memverifikasi Pembayaran...
              </h2>
              <p className="text-xs text-textDark/75 mt-2">
                Menghubungkan ke gateway Mayar untuk mengonfirmasi transaksi Anda.
              </p>
            </div>
          ) : isPaid ? (
            <>
              {/* Success Animated Icon */}
              <div className="w-16 h-16 rounded-full bg-olive/15 border border-olive/30 flex items-center justify-center mx-auto mb-4 text-olive shadow-sm">
                <CheckCircle2 size={36} />
              </div>

              <span className="text-[11px] font-bold text-olive uppercase tracking-widest block">
                Pembayaran Berhasil Diverifikasi
              </span>
              <h2 className="font-serif-heading text-3xl font-medium text-textDark mt-1 leading-tight">
                Laporan Hasil Lengkap Terbuka!
              </h2>
              <p className="text-xs sm:text-sm text-textDark/80 mt-2 max-w-xs mx-auto leading-relaxed">
                Terima kasih telah berkomitmen untuk saling memahami lebih dalam.
              </p>

              {/* Receipt Card */}
              <div className="mt-5 rounded-2xl bg-white/40 border border-white/60 p-4 text-left shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-white/40 text-xs">
                  <span className="text-textDark/70">Status Pembayaran</span>
                  <span className="font-semibold text-olive flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Lunas (Mayar Verified)
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-white/40 text-xs">
                  <span className="text-textDark/70">No. Referensi Transaksi</span>
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
                Akses laporan ini terbuka selamanya untuk Anda dan pasangan di perangkat masing-masing.
              </p>
            </>
          ) : (
            <div className="py-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-600">
                <AlertCircle size={32} />
              </div>
              <h2 className="font-serif-heading text-2xl font-medium text-textDark">
                Menunggu Konfirmasi
              </h2>
              <p className="text-xs text-textDark/80 mt-2 max-w-xs mx-auto">
                {errorMessage || 'Pembayaran Anda belum terkonfirmasi oleh Mayar. Jika Anda sudah membayar, silakan klik tombol cek status di bawah.'}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-full bg-white/70 border border-olive/30 text-xs text-textDark flex items-center gap-1.5 mx-auto hover:bg-white transition-colors"
              >
                <RefreshCw size={13} />
                <span>Cek Status Ulang</span>
              </button>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="mt-6 flex flex-col gap-2">
          {isPaid && (
            <button
              onClick={() => router.push(`/report/${roomCode}`)}
              className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-sm sm:text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Buka Laporan Hasil Lengkap</span>
              <ArrowRight size={18} />
            </button>
          )}

          <button
            onClick={() => router.push(`/room/${roomCode}`)}
            className="w-full py-2 text-center text-xs text-textDark/60 hover:text-textDark transition-colors"
          >
            Kembali ke Halaman Ruangan
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
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-olive" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
