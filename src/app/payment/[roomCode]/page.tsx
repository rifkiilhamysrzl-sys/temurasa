'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import {
  Lock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
} from 'lucide-react';

export default function PaymentPaywallPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params?.roomCode as string)?.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);
  const [reportPreview, setReportPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Payer details required for Mayar Invoice
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [payerMobile, setPayerMobile] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    mobile?: string;
  }>({});

  // Load locked report preview from server
  useEffect(() => {
    async function loadPreview() {
      try {
        setLoading(true);
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem(`twogether_token_${roomCode}`) ||
              localStorage.getItem('twogether_current_token') ||
              ''
            : '';

        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`/api/report/${roomCode}`, { headers });
        if (!res.ok) {
          throw new Error('Gagal memuat pratinjau hasil.');
        }

        const data = await res.json();
        if (data.isPaid && data.isAuthorized !== false) {
          // Already paid, redirect straight to full report
          router.replace(`/report/${roomCode}`);
          return;
        }

        setReportPreview(data);

        // Prepopulate default name from participant A if empty
        if (data.coupleNames?.participantA) {
          setPayerName((prev) => prev || data.coupleNames.participantA);
        }
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

  const validateForm = (): boolean => {
    const errors: { name?: string; email?: string; mobile?: string } = {};

    const cleanName = payerName.trim();
    if (!cleanName || cleanName.length < 2) {
      errors.name = 'Nama lengkap pembayar wajib diisi (minimal 2 karakter).';
    }

    const cleanEmail = payerEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      errors.email = 'Format email tidak valid (contoh: nama@domain.com).';
    }

    const cleanMobile = payerMobile.replace(/[^0-9]/g, '');
    if (!cleanMobile || cleanMobile.length < 10 || cleanMobile.length > 15) {
      errors.mobile = 'Nomor WhatsApp / HP wajib diisi minimal 10 digit (contoh: 081234567890).';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    setError(null);

    // Validate real customer data before proceeding
    if (!validateForm()) {
      return;
    }

    setInitiating(true);

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode,
          payerName: payerName.trim(),
          payerEmail: payerEmail.trim().toLowerCase(),
          payerMobile: payerMobile.replace(/[^0-9]/g, ''),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memulai tagihan pembayaran.');
      }

      if (data.isAlreadyPaid) {
        router.push(`/report/${roomCode}`);
        return;
      }

      // If redirect URL is provided by Mayar V2, navigate directly to official checkout
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      // Built-in Sandbox Simulator mode (dev fallback only)
      if (data.isSimulator || data.gateway === 'simulator') {
        router.push(`/payment/simulate?trx=${data.transactionId}&code=${roomCode}`);
        return;
      }

      throw new Error('Tidak menerima URL pembayaran dari gateway.');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem saat memproses pembayaran.');
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

      <div className="w-full flex-1 rounded-[32px] glass-panel p-5 sm:p-7 shadow-glass flex flex-col justify-between my-3 relative overflow-hidden">
        <div>
          {/* Teaser Header */}
          <div className="text-center my-2">
            <div className="w-14 h-14 rounded-full bg-olive/15 border border-olive/30 flex items-center justify-center mx-auto mb-3 text-olive shadow-sm">
              <Lock size={26} />
            </div>

            <span className="text-[11px] font-bold text-olive uppercase tracking-widest block">
              Laporan Siap Dibuka
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-medium text-textDark mt-1 leading-tight">
              Buka Hasil Lengkap<br />
              <span className="text-olive">
                {coupleNames?.participantA || 'Anda'} & {coupleNames?.participantB || 'Pasangan'}
              </span>
            </h2>
            <p className="text-xs text-textDark/75 mt-1.5 max-w-xs mx-auto">
              Kalian berdua telah menyelesaikan seluruh 30 dimensi asesmen relasi.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="my-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-red-700 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Informasi Pembayar (Mayar Requirement) */}
          <div className="mt-4 p-4 rounded-2xl bg-white/50 border border-white/80 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-textDark mb-3">
              <Sparkles size={14} className="text-olive" />
              <span>Data Pembayar untuk Invoice Mayar</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Nama */}
              <div>
                <label className="text-[11px] font-semibold text-textDark/75 block mb-1">
                  Nama Pembayar
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textDark/50" />
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => {
                      setPayerName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Nama Lengkap Anda"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/70 border border-olive/20 text-textDark focus:outline-none focus:border-olive transition-colors"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-semibold text-textDark/75 block mb-1">
                  Email Pembayar (Bukti Invoice Resmi)
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textDark/50" />
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => {
                      setPayerEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/70 border border-olive/20 text-textDark focus:outline-none focus:border-olive transition-colors"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Nomor HP/WhatsApp */}
              <div>
                <label className="text-[11px] font-semibold text-textDark/75 block mb-1">
                  Nomor WhatsApp / HP
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textDark/50" />
                  <input
                    type="tel"
                    value={payerMobile}
                    onChange={(e) => {
                      setPayerMobile(e.target.value);
                      if (fieldErrors.mobile) setFieldErrors((prev) => ({ ...prev, mobile: undefined }));
                    }}
                    placeholder="081234567890"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-white/70 border border-olive/20 text-textDark focus:outline-none focus:border-olive transition-colors"
                  />
                </div>
                {fieldErrors.mobile && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.mobile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Features Included List */}
          <div className="mt-4 p-4 rounded-2xl bg-white/40 border border-white/60">
            <span className="text-[11px] uppercase tracking-wider text-olive font-bold block mb-2">
              Yang Anda Dapatkan:
            </span>
            <div className="flex flex-col gap-2">
              {[
                'Skor & Gelar Kompatibilitas Unik Pasangan',
                'Analisis Terarah 7 Pilar Hubungan (A → B & B → A)',
                'Titik Temu Kompromi & Ruang Bertumbuh Bersama',
                'Akses Terbuka Selamanya untuk Kedua Pasangan',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-textDark/85">
                  <CheckCircle2 size={14} className="text-olive shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Price Badge */}
            <div className="mt-4 p-3 rounded-xl bg-white/60 border border-white/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-textDark/60 block font-medium">
                  Total Biaya
                </span>
                <span className="font-serif-heading text-lg font-bold text-textDark">
                  Rp 10.000 <span className="text-[11px] font-sans font-normal text-textDark/70">/ berdua</span>
                </span>
              </div>
              <span className="text-[10px] text-olive font-semibold bg-olive/10 px-2.5 py-1 rounded-full border border-olive/20">
                Sekali Bayar untuk Berdua
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-3 flex items-center justify-around text-[11px] text-textDark/70 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-olive" />
              Gateway Mayar
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <QrCode size={13} className="text-olive" />
              QRIS, VA & E-Wallet
            </span>
            <span>•</span>
            <span>Akses Instan</span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={handleCheckout}
            disabled={initiating}
            className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-sm sm:text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {initiating ? (
              <>
                <Loader2 size={18} className="animate-spin text-textDark" />
                <span>Menghubungkan ke Mayar...</span>
              </>
            ) : (
              <>
                <span>Lanjut ke Pembayaran Mayar — Rp10.000</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <button
            onClick={() => router.push(`/room/${roomCode}`)}
            className="w-full py-2 text-center text-xs text-textDark/60 hover:text-textDark transition-colors"
          >
            Kembali ke Ruangan
          </button>
        </div>
      </div>
    </div>
  );
}
