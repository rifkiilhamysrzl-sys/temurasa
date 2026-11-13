'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';

function PersonalityPaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const testCode = searchParams?.get('testCode') || searchParams?.get('code') || '';
  const trx = searchParams?.get('trx') || searchParams?.get('transactionId') || '';

  const [status, setStatus] = useState<'verifying' | 'success' | 'pending' | 'error'>('verifying');
  const [message, setMessage] = useState('Memverifikasi pembayaran dengan server Mayar...');
  const [retryCount, setRetryCount] = useState(0);

  const verifyPayment = async () => {
    if (!testCode || !trx) {
      setStatus('error');
      setMessage('Parameter pembayaran tidak lengkap.');
      return;
    }

    try {
      setStatus('verifying');
      setMessage('Menghubungi server Mayar untuk verifikasi...');

      const res = await fetch('/api/personality/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCode,
          transactionId: trx,
        }),
      });

      const data = await res.json();

      if (res.ok && data.isPaid) {
        setStatus('success');
        setMessage('Pembayaran berhasil diverifikasi! Membuka laporan lengkap...');
        setTimeout(() => {
          router.push(`/personality/result/${encodeURIComponent(testCode)}`);
        }, 1500);
      } else {
        if (retryCount < 3) {
          // Retry verification after short delay in case webhook is settling
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 3000);
        } else {
          setStatus('pending');
          setMessage('Pembayaran sedang dalam proses verifikasi perbankan. Silakan klik tombol periksa status.');
        }
      }
    } catch (err: any) {
      setStatus('pending');
      setMessage(err.message || 'Gagal menghubungi server verifikasi.');
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [retryCount, testCode, trx]);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-8">
      <Header title="Status Pembayaran" />

      <main className="w-full max-w-sm mx-auto my-auto rounded-[32px] glass-panel p-7 shadow-glass text-center flex flex-col items-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 rounded-full bg-olive/15 flex items-center justify-center text-olive mb-4">
              <Loader2 size={32} className="animate-spin" />
            </div>
            <h2 className="font-serif-heading text-2xl font-medium text-textDark">
              Memverifikasi Pembayaran
            </h2>
            <p className="text-xs text-textDark/80 mt-2 leading-relaxed">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-olive/15 flex items-center justify-center text-olive mb-4">
              <CheckCircle2 size={36} className="text-olive" />
            </div>
            <h2 className="font-serif-heading text-2xl font-medium text-textDark">
              Pembayaran Berhasil!
            </h2>
            <p className="text-xs text-textDark/80 mt-2 leading-relaxed">{message}</p>
            <Link
              href={`/personality/result/${encodeURIComponent(testCode)}`}
              className="mt-6 w-full py-3.5 px-6 rounded-full bg-olive text-white text-xs font-medium flex items-center justify-center gap-2 shadow-md hover:bg-olive-light"
            >
              <span>Lihat Laporan Lengkap</span>
              <ArrowRight size={16} />
            </Link>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="w-16 h-16 rounded-full bg-yellow-500/15 flex items-center justify-center text-yellow-700 mb-4">
              <RefreshCw size={28} />
            </div>
            <h2 className="font-serif-heading text-xl font-medium text-textDark">
              Menunggu Konfirmasi
            </h2>
            <p className="text-xs text-textDark/80 mt-2 leading-relaxed">{message}</p>
            <div className="mt-6 flex flex-col gap-2.5 w-full">
              <button
                onClick={() => {
                  setRetryCount(0);
                  verifyPayment();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-olive text-white text-xs font-medium flex items-center justify-center gap-2 shadow-md hover:bg-olive-light"
              >
                <RefreshCw size={15} />
                <span>Periksa Status Kembali</span>
              </button>
              <Link
                href={`/personality/result/${encodeURIComponent(testCode)}`}
                className="w-full py-3 px-6 rounded-full glass-card text-textDark text-xs font-medium"
              >
                Kembali ke Ringkasan Hasil
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center text-red-600 mb-4">
              <AlertCircle size={32} />
            </div>
            <h2 className="font-serif-heading text-xl font-medium text-textDark">
              Verifikasi Terkendala
            </h2>
            <p className="text-xs text-textDark/80 mt-2 leading-relaxed">{message}</p>
            <Link
              href="/"
              className="mt-6 w-full py-3.5 px-6 rounded-full bg-white/80 text-textDark text-xs font-medium border border-black/10"
            >
              Kembali ke Beranda
            </Link>
          </>
        )}
      </main>

      <footer className="text-center text-[11px] text-textDark/60 font-serif italic">
        “Menemukan titik temu di antara dua rasa.”
      </footer>
    </div>
  );
}

export default function PersonalityPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-6">
          <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-olive animate-spin" />
            <p className="text-xs text-textDark/80">Memuat...</p>
          </div>
        </div>
      }
    >
      <PersonalityPaymentSuccessContent />
    </Suspense>
  );
}
