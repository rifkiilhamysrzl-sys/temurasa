'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';

function PersonalitySimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const testCode = searchParams?.get('testCode') || '';
  const trx = searchParams?.get('trx') || '';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/personality/payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: trx }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = `/personality/result/${encodeURIComponent(testCode)}`;
        }, 800);
      } else {
        alert(data.error || 'Gagal simulasi');
      }
    } catch (err) {
      alert('Gagal simulasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-8">
      <Header title="Simulator Pembayaran" />

      <main className="w-full max-w-sm mx-auto my-auto rounded-[32px] glass-panel p-7 shadow-glass text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-olive/15 flex items-center justify-center text-olive mb-4">
          <ShieldCheck size={32} />
        </div>

        <h2 className="font-serif-heading text-2xl font-medium text-textDark">
          Mayar Sandbox Simulator
        </h2>
        <p className="text-xs text-textDark/80 mt-2 leading-relaxed">
          Simulasi pembayaran untuk tes kepribadian: <strong>{testCode}</strong>
        </p>

        <div className="p-3.5 rounded-2xl bg-white/50 border border-white/60 w-full my-4 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-textDark/70">Nominal:</span>
            <span className="font-bold text-textDark">Rp12.000</span>
          </div>
          <div className="flex justify-between py-1 border-t border-black/5">
            <span className="text-textDark/70">Trx ID:</span>
            <span className="font-mono text-[11px] text-textDark/80">{trx}</span>
          </div>
        </div>

        {success ? (
          <div className="text-xs font-semibold text-olive flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>Pembayaran Sukses! Mengalihkan...</span>
          </div>
        ) : (
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-olive text-white text-xs font-medium flex items-center justify-center gap-2 shadow-md hover:bg-olive-light"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            <span>Simulasikan Pembayaran Sukses (Rp12.000)</span>
          </button>
        )}
      </main>
    </div>
  );
}

export default function PersonalitySimulatorPage() {
  return (
    <Suspense fallback={<div>Memuat...</div>}>
      <PersonalitySimulatorContent />
    </Suspense>
  );
}
