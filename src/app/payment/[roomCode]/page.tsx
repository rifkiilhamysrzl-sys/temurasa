'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import {
  Lock,
  Unlock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function PaymentPaywallPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params?.roomCode as string)?.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [reportPreview, setReportPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load locked report preview from server
  useEffect(() => {
    async function loadPreview() {
      try {
        setLoading(true);
        const res = await fetch(`/api/report/${roomCode}`);
        if (!res.ok) {
          throw new Error('Gagal memuat pratinjau hasil.');
        }

        const data = await res.json();
        if (data.isPaid) {
          // Already paid, redirect straight to full report
          router.replace(`/report/${roomCode}`);
          return;
        }

        setReportPreview(data);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat pratinjau laporan.');
      } finally {
        setLoading(false);
      }
    }

    if (roomCode) {
      loadPreview();
    }
  }, [roomCode, router]);

  const handleCheckout = async () => {
    setInitiating(true);
    setError(null);

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode,
          payerName: reportPreview?.coupleNames?.participantA || 'Pasangan TWOgether',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memulai checkout.');
      }

      if (data.isAlreadyPaid) {
        router.push(`/report/${roomCode}`);
        return;
      }

      // Check if Midtrans Snap is active
      if (data.gateway === 'midtrans' && data.snapToken) {
        // If Snap JS script is loaded or redirect
        if ((window as any).snap) {
          (window as any).snap.pay(data.snapToken, {
            onSuccess: () => {
              router.push(`/payment/success?code=${roomCode}&trx=${data.transactionId}`);
            },
            onPending: () => {
              alert('Menunggu konfirmasi pembayaran Anda.');
            },
            onError: () => {
              setError('Pembayaran tidak berhasil. Silakan coba lagi.');
            },
          });
          return;
        } else if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
      }

      // Built-in Sandbox Simulator mode
      if (data.isSimulator || data.gateway === 'simulator') {
        router.push(`/payment/simulate?trx=${data.transactionId}&code=${roomCode}`);
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem saat pembayaran.');
    } finally {
      setInitiating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3 text-center">
          <Loader2 size={32} className="animate-spin text-olive" />
          <p className="text-sm text-textDark/80">Menyiapkan pratinjau hasil...</p>
        </div>
      </div>
    );
  }

  const coupleNames = reportPreview?.coupleNames;

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      <Header title="TWOgether" showBack backHref={`/room/${roomCode}`} />

      <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-3 relative overflow-hidden">
        <div>
          {/* Badge & Lock Icon */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/60 text-xs font-semibold text-textDark">
              <span>Room:</span>
              <span className="tracking-widest text-olive font-bold">{roomCode}</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-olive/15 border border-olive/30 flex items-center justify-center text-olive">
              <Lock size={16} />
            </div>
          </div>

          <h2 className="font-serif-heading text-3xl font-medium text-textDark leading-tight">
            Your Results Are Ready.
          </h2>
          <p className="text-xs sm:text-sm text-textDark/80 mt-1.5 leading-relaxed">
            {coupleNames?.participantA} & {coupleNames?.participantB} telah menyelesaikan 30 pertanyaan. Buka wawasan keselarasan kalian hari ini.
          </p>

          {error && (
            <div className="mt-4 p-3.5 rounded-2xl bg-red-100/70 border border-red-200/80 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Locked Preview Card */}
          <div className="mt-5 rounded-2xl glass-card p-5 relative overflow-hidden border border-white/70">
            {/* Soft frosted blur overlay for locked preview */}
            <div className="flex items-center justify-between pb-3 border-b border-white/40">
              <span className="text-xs font-semibold text-textDark">
                Laporan Komprehensif 7 Dimensi
              </span>
              <span className="text-[11px] text-olive font-bold uppercase tracking-wider">
                Terkunci
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {[
                '1. Skor Keselarasan Preferensi Pasangan',
                '2. Analisis Lengkap 7 Kategori Hubungan',
                '3. Shared Perspectives (Titik Kesamaan Terkuat)',
                '4. Different Perspectives & Tips Eksplorasi Bersama',
                '5. Personalized Discussion Starters (Topik Ngobrol)',
                '6. Couple Action Plan Mingguan & Bulanan',
                '7. Kartu Cerita Khusus yang Dapat Diunduh',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-textDark/85">
                  <CheckCircle2 size={15} className="text-olive shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Price Badge */}
            <div className="mt-5 p-3.5 rounded-xl bg-white/50 border border-white/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-textDark/60 block font-medium">
                  Biaya Buka Akses
                </span>
                <span className="font-serif-heading text-xl font-bold text-textDark">
                  Rp 10.000 <span className="text-xs font-sans font-normal text-textDark/70">/ pasangan</span>
                </span>
              </div>
              <span className="text-[11px] text-olive font-semibold bg-olive/10 px-2.5 py-1 rounded-full border border-olive/20">
                Sekali Bayar untuk Berdua
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-4 flex items-center justify-around text-[11px] text-textDark/70 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-olive" />
              Pembayaran Aman
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <QrCode size={14} className="text-olive" />
              QRIS & Transfer Bank
            </span>
            <span>•</span>
            <span>Akses Selamanya</span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleCheckout}
            disabled={initiating}
            className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {initiating ? (
              <>
                <Loader2 size={18} className="animate-spin text-textDark" />
                <span>Menghubungkan Gateway...</span>
              </>
            ) : (
              <>
                <span>Unlock Our Results — Rp10.000</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <button
            onClick={() => router.push(`/room/${roomCode}`)}
            className="w-full py-2.5 text-center text-xs text-textDark/60 hover:text-textDark transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
