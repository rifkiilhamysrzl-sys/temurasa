'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import {
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';

function PaymentSimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const transactionId = searchParams?.get('trx') || '';
  const roomCode = searchParams?.get('code') || '';

  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'bca_va' | 'gopay'>('qris');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!transactionId) {
      setError('ID Transaksi tidak ditemukan.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const res = await fetch('/api/payment/simulate-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          paymentMethod: selectedMethod.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Pembayaran simulasi gagal.');
      }

      // Successful verified unlock
      const targetRoom = data.roomCode || roomCode;
      router.push(`/payment/success?code=${targetRoom}&trx=${transactionId}`);
    } catch (err: any) {
      setError(err.message || 'Gagal memproses pembayaran.');
      setProcessing(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      <Header title="Payment Checkout" showBack backHref={`/payment/${roomCode}`} />

      <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-3 relative overflow-hidden">
        <div>
          {/* Header & Order Summary */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-textDark/70 font-semibold">
              Checkout Gateway
            </span>
            <span className="text-xs font-mono text-textDark/60">{transactionId}</span>
          </div>

          <h2 className="font-serif-heading text-3xl font-medium text-textDark leading-tight">
            Unlock Your Couple Report
          </h2>
          <p className="text-xs text-textDark/80 mt-1 leading-relaxed">
            One report, two perspectives, a better understanding.
          </p>

          {/* Amount Card */}
          <div className="mt-5 p-4 rounded-2xl bg-white/50 border border-white/70 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-textDark/70 block">Total Tagihan</span>
              <span className="font-serif-heading text-2xl font-bold text-textDark">
                Rp 10.000
              </span>
            </div>
            <span className="text-[11px] font-semibold text-olive bg-olive/15 px-3 py-1 rounded-full border border-olive/30">
              Sekali Bayar
            </span>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-100/70 border border-red-200/80 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="mt-5">
            <label className="block text-xs font-semibold text-textDark/80 mb-2.5">
              Pilih Metode Pembayaran:
            </label>

            <div className="flex flex-col gap-2.5">
              {/* QRIS */}
              <div
                onClick={() => setSelectedMethod('qris')}
                className={`p-3.5 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${
                  selectedMethod === 'qris'
                    ? 'glass-card-selected'
                    : 'glass-card glass-card-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center text-textDark">
                    <QrCode size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-textDark">QRIS (GoPay, OVO, ShopeePay)</h4>
                    <p className="text-[10px] text-textDark/70">Instan & Bebas Biaya Layanan</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedMethod === 'qris' ? 'border-olive bg-white' : 'border-textDark/40'
                  }`}
                >
                  {selectedMethod === 'qris' && (
                    <div className="w-2 h-2 rounded-full bg-olive" />
                  )}
                </div>
              </div>

              {/* BCA Virtual Account */}
              <div
                onClick={() => setSelectedMethod('bca_va')}
                className={`p-3.5 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${
                  selectedMethod === 'bca_va'
                    ? 'glass-card-selected'
                    : 'glass-card glass-card-hover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center text-textDark">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-textDark">Virtual Account (BCA / Mandiri / BRI)</h4>
                    <p className="text-[10px] text-textDark/70">Verifikasi Otomatis 24 Jam</p>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedMethod === 'bca_va' ? 'border-olive bg-white' : 'border-textDark/40'
                  }`}
                >
                  {selectedMethod === 'bca_va' && (
                    <div className="w-2 h-2 rounded-full bg-olive" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/30 p-3 border border-white/50 text-[11px] text-textDark/70 flex items-center gap-2">
            <ShieldCheck size={16} className="text-olive shrink-0" />
            <span>Enkripsi 256-bit aman via Webhook Verifikasi Server</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {processing ? (
              <>
                <Loader2 size={18} className="animate-spin text-textDark" />
                <span>Memproses Pembayaran...</span>
              </>
            ) : (
              <>
                <span>Pay Rp 10.000</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-6">
          <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-olive" />
            <p className="text-sm text-textDark/80">Menyiapkan pembayaran...</p>
          </div>
        </div>
      }
    >
      <PaymentSimulatorContent />
    </Suspense>
  );
}
