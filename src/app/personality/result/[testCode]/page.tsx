'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Lock,
  ArrowRight,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Compass,
  MessageCircle,
  Eye,
  Check,
  User,
  Phone,
  Mail,
  X,
  RefreshCw,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { PillBadge } from '@/components/ui/PillBadge';
import { PersonalityShareModal } from '@/components/ui/PersonalityShareModal';
import {
  ArchetypeDefinition,
  DimensionScore,
  FreePreviewData,
  FullReportData,
  MarriageReadinessReflection,
} from '@/lib/personality/types';

export default function PersonalityResultPage() {
  const params = useParams();
  const router = useRouter();
  const testCode = (params?.testCode as string)?.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Result data
  const [userName, setUserName] = useState('');
  const [primaryType, setPrimaryType] = useState<ArchetypeDefinition | null>(null);
  const [secondaryType, setSecondaryType] = useState<ArchetypeDefinition | null>(null);
  const [dimensionScores, setDimensionScores] = useState<DimensionScore[]>([]);
  const [freePreview, setFreePreview] = useState<FreePreviewData | null>(null);
  const [fullReport, setFullReport] = useState<FullReportData | null>(null);
  const [marriageReadiness, setMarriageReadiness] = useState<MarriageReadinessReflection | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Payment form state
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [payerMobile, setPayerMobile] = useState('');
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Load result from API
  const loadResult = async () => {
    if (!testCode) return;
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/personality/result/${encodeURIComponent(testCode)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal memuat hasil tes.');
      }

      setUserName(data.userName || '');
      setPayerName(data.userName || '');
      setPrimaryType(data.primaryType);
      setSecondaryType(data.secondaryType);
      setDimensionScores(data.dimensionScores || []);
      setFreePreview(data.freePreview);
      setFullReport(data.fullReport);
      setMarriageReadiness(data.marriageReadiness);
      setIsPaid(data.isPaid);

      if (data.isPaid) {
        // Trigger celebratory confetti once on unlocked view
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat hasil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResult();
  }, [testCode]);

  // Handle Mayar Invoice Creation
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!payerName.trim() || payerName.trim().length < 3) {
      setPaymentError('Mohon masukkan nama lengkap untuk keperluan invoice pembayaran.');
      return;
    }

    if (!payerEmail.trim() || !payerEmail.includes('@')) {
      setPaymentError('Alamat email valid wajib diisi untuk bukti pembayaran.');
      return;
    }

    let cleanMobile = payerMobile.replace(/[^0-9]/g, '');
    if (cleanMobile.startsWith('62')) cleanMobile = '0' + cleanMobile.slice(2);
    if (!cleanMobile || cleanMobile.length < 10) {
      setPaymentError('Nomor WhatsApp / HP wajib diisi minimal 10 digit angka valid (contoh: 081234567890).');
      return;
    }

    setPaying(true);

    try {
      const res = await fetch('/api/personality/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCode,
          payerName: payerName.trim(),
          payerEmail: payerEmail.trim(),
          payerMobile: cleanMobile,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal membuat tagihan pembayaran.');
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('Tautan pembayaran tidak diterima dari server.');
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Gagal memproses pembayaran.');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-olive animate-spin" />
          <p className="text-xs text-textDark/80">Memuat hasil refleksi cinta...</p>
        </div>
      </div>
    );
  }

  if (error || !primaryType || !secondaryType) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-4 text-center max-w-sm">
          <AlertCircle size={32} className="text-red-600" />
          <h3 className="font-serif-heading text-xl font-medium text-textDark">
            Hasil Belum Dapat Ditampilkan
          </h3>
          <p className="text-xs text-textDark/80 leading-relaxed">
            {error || 'Data tes tidak ditemukan atau belum diselesaikan.'}
          </p>
          <Link
            href="/personality"
            className="w-full py-3 px-6 rounded-full bg-olive text-white text-xs font-medium"
          >
            Mulai Tes Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-12">
      {/* Top Navigation */}
      <Header title="Hasil Kepribadian" />

      <main className="w-full max-w-md mx-auto flex flex-col gap-6 my-2">
        {/* ======================================================== */}
        {/* 1. HERO ARCHETYPE CARD (FREE PREVIEW) */}
        {/* ======================================================== */}
        <section className="rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass relative overflow-hidden text-center">
          {/* Subtle Top Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive/15 text-olive text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Refleksi Kepribadian Cinta</span>
          </div>

          <p className="text-xs text-textDark/70 font-medium">Hai, {userName}</p>
          <h2 className="font-serif-heading text-xs uppercase tracking-widest text-textDark/60 mt-0.5">
            Tipe Karakter Cintamu Adalah:
          </h2>

          {/* Primary Type Title */}
          <div className="my-4 py-5 px-4 rounded-[28px] bg-white/60 border border-white/80 shadow-sm flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-olive/15 flex items-center justify-center text-olive mb-2.5">
              <Heart size={26} className="fill-olive/20" />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-textDark/60">
              Primary Archetype
            </span>
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-textDark mt-1">
              {primaryType.title}
            </h1>
            <span className="text-sm text-olive font-medium mt-0.5">
              {primaryType.indonesianTitle}
            </span>

            <p className="text-xs text-textDark/85 italic mt-3 max-w-xs leading-relaxed px-2 font-serif">
              {primaryType.quote}
            </p>

            <p className="text-xs text-textDark/80 mt-3.5 leading-relaxed text-left border-t border-black/5 pt-3">
              {primaryType.shortDescription}
            </p>
          </div>

          {/* Secondary Type Pill Card */}
          <div className="p-3.5 rounded-2xl bg-white/45 border border-white/60 flex items-center justify-between text-left">
            <div>
              <span className="text-[10px] uppercase font-semibold text-textDark/60 tracking-wider block">
                Secondary Archetype
              </span>
              <span className="font-serif-heading text-base font-semibold text-textDark">
                {secondaryType.title}
              </span>
              <span className="text-xs text-olive block">
                {secondaryType.indonesianTitle}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center text-olive">
              <Compass size={16} />
            </div>
          </div>

          {/* Share Button */}
          <div className="mt-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full py-3 px-4 rounded-full glass-card bg-white/60 hover:bg-white/80 text-textDark font-medium text-xs flex items-center justify-center gap-2 border border-white/80 transition-all active:scale-[0.98]"
            >
              <Share2 size={15} className="text-olive" />
              <span>Bagikan Kartu Kepribadian Ini</span>
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. CORE CHARACTERISTICS & PERSONAL INSIGHT */}
        {/* ======================================================== */}
        <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/40 pb-3">
            <Sparkles size={18} className="text-olive" />
            <h3 className="font-serif-heading text-lg font-medium text-textDark">
              Karakter Utama Hubunganmu
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {primaryType.coreCharacteristics.slice(0, 3).map((trait, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/45 border border-white/60 flex items-start gap-2.5 text-xs text-textDark/85 leading-relaxed"
              >
                <CheckCircle2 size={16} className="text-olive shrink-0 mt-0.5" />
                <span>{trait}</span>
              </div>
            ))}
          </div>

          {/* 1 Personal Insight Card */}
          <div className="mt-2 p-4 rounded-2xl bg-olive/10 border border-olive/20 text-textDark text-xs leading-relaxed">
            <span className="font-semibold text-olive block mb-1">
              Kekuatan Utamamu dalam Cinta:
            </span>
            <p>
              Sebagai seorang <strong>{primaryType.title}</strong> yang berpadu dengan <strong>{secondaryType.title}</strong>, kekuatan terbesarmu adalah menghadirkan rasa aman yang tulus. Pasangan yang tepat akan sangat bersyukur memilikimu karena kamu mencintai dengan kedewasaan hati.
            </p>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. 5 DIMENSI REFLEKSI CINTA (SCORE BREAKDOWN) */}
        {/* ======================================================== */}
        <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/40 pb-3">
            <h3 className="font-serif-heading text-lg font-medium text-textDark">
              Profil 5 Dimensi Cinta
            </h3>
            <span className="text-[11px] text-textDark/60 font-medium">Hasil Skoring</span>
          </div>

          <div className="flex flex-col gap-3">
            {dimensionScores.map((dim) => (
              <div key={dim.code} className="p-3.5 rounded-2xl bg-white/40 border border-white/60">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-textDark">{dim.name}</span>
                  <span className="text-[11px] font-semibold text-olive px-2 py-0.5 rounded-full bg-olive/15">
                    {dim.score}% · {dim.level}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-white/60 overflow-hidden mb-2">
                  <div
                    className="h-full bg-olive rounded-full transition-all duration-500"
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-textDark/75 leading-relaxed">{dim.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. MARRIAGE READINESS SUMMARY */}
        {/* ======================================================== */}
        {marriageReadiness && (
          <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-white/40 pb-3">
              <Compass size={18} className="text-olive" />
              <h3 className="font-serif-heading text-lg font-medium text-textDark">
                Refleksi Kesiapan Pernikahan
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/45 border border-white/60">
              <span className="text-[10px] uppercase font-semibold text-textDark/60 tracking-wider block">
                Target Waktu yang Kamu Tuju:
              </span>
              <span className="text-sm font-semibold text-textDark mt-0.5 block">
                {marriageReadiness.targetHorizonLabel}
              </span>
              <p className="text-xs text-textDark/80 mt-2 leading-relaxed">
                {marriageReadiness.summaryReflection}
              </p>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* 5. LOCKED SECTION & PAYWALL (OR UNLOCKED FULL REPORT) */}
        {/* ======================================================== */}
        {!isPaid ? (
          <section className="rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass relative overflow-hidden border border-olive/30">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive text-white text-[11px] font-semibold uppercase tracking-wider mb-3 shadow-sm">
              <Lock size={12} />
              <span>Laporan Lengkap Terkunci</span>
            </div>

            <h3 className="font-serif-heading text-2xl font-medium text-textDark leading-snug">
              Seperti apa pasangan yang cocok untukmu?
            </h3>
            <p className="text-xs text-textDark/85 mt-2 leading-relaxed">
              Buka analisis komprehensif 10 bagian untuk mengetahui karakter pasangan ideal, cara komunikasi terbaik, rekomendasi pengembangan diri, dan cetak biru hubungan impianmu.
            </p>

            {/* Blurred Teaser Preview */}
            <div className="my-5 relative rounded-2xl overflow-hidden border border-white/60 p-4 bg-white/30 backdrop-blur-md">
              <div className="filter blur-[5px] select-none pointer-events-none opacity-60 flex flex-col gap-2.5 text-xs text-textDark">
                <div className="p-3 rounded-xl bg-white/50">
                  <strong>1. Relationship Personality Profile:</strong> Kombinasi {primaryType.title} dan {secondaryType.title} menciptakan energi kemitraan yang...
                </div>
                <div className="p-3 rounded-xl bg-white/50">
                  <strong>2. Ideal Partner Characteristics:</strong> Karakter pasangan yang paling selaras adalah sosok yang memiliki ketenangan emosi...
                </div>
                <div className="p-3 rounded-xl bg-white/50">
                  <strong>3. Recommended Partner Traits:</strong> 4 sifat wajib yang perlu kamu cari dalam diri calon pasangan hidup...
                </div>
                <div className="p-3 rounded-xl bg-white/50">
                  <strong>4. Emotional Needs & Safety:</strong> Cara agar kamu merasa dicintai seutuhnya tanpa rasa cemas...
                </div>
                <div className="p-3 rounded-xl bg-white/50">
                  <strong>10. Ideal Relationship Blueprint:</strong> Panduan harian dan prinsip pernikahan jangka panjang...
                </div>
              </div>

              {/* Overlay Lock Notice */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/40 backdrop-blur-[2px] text-center">
                <div className="w-12 h-12 rounded-full bg-olive text-white flex items-center justify-center mb-2 shadow-md">
                  <Lock size={20} />
                </div>
                <span className="font-serif-heading text-base font-semibold text-textDark">
                  10 Bab Laporan Mendalam
                </span>
                <span className="text-[11px] text-textDark/70 mt-0.5">
                  Akses instan selamanya untuk kamu
                </span>
              </div>
            </div>

            {/* 10 Sections Checklist */}
            <div className="rounded-2xl bg-white/40 p-4 border border-white/60 mb-5">
              <span className="text-xs font-semibold text-textDark block mb-2">
                Yang Akan Kamu Dapatkan dalam Full Report:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-textDark/85">
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>Profil Kepribadian Lengkap</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>Karakter Pasangan Ideal</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>4 Sifat Rekomendasi Pasangan</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>Kebutuhan Emosional Terdalam</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>Kompatibilitas Komunikasi</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>Kekuatan Utama dalam Hubungan</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>Blind Spot & Solusi Konflik</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>Refleksi Kesiapan Pernikahan</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>3 Langkah Pengembangan Diri</span></div>
                <div className="flex items-center gap-1.5"><Check size={14} className="text-olive shrink-0" /><span>Cetak Biru Hubungan Harmonis</span></div>
              </div>
            </div>

            {/* Price & CTA Button */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowUnlockModal(true)}
                className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Unlock Laporan Lengkap — Rp12.000</span>
                <ArrowRight size={18} />
              </button>
              <p className="text-[11px] text-center text-textDark/60">
                Pembayaran satu kali · Akses permanen tanpa langganan
              </p>
            </div>
          </section>
        ) : (
          /* ======================================================== */
          /* UNLOCKED FULL REPORT (10 COMPLETE SECTIONS) */
          /* ======================================================== */
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-2xl bg-olive/15 border border-olive/30 text-textDark flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-olive shrink-0" />
                <span className="text-xs font-semibold">Laporan Lengkap Telah Terbuka</span>
              </div>
              <span className="text-[11px] text-olive font-medium bg-white/60 px-2.5 py-0.5 rounded-full">
                Status: Lunas
              </span>
            </div>

            {fullReport && (
              <>
                {/* 1. Relationship Personality Profile */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">1</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Profil Kepribadian Cinta: {fullReport.personalityProfile.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-textDark/85 leading-relaxed">{fullReport.personalityProfile.primaryAnalysis}</p>
                  <p className="text-xs sm:text-sm text-textDark/80 leading-relaxed italic bg-white/40 p-3 rounded-2xl border border-white/60">
                    {fullReport.personalityProfile.secondaryAnalysis}
                  </p>
                  <p className="text-xs sm:text-sm text-textDark/85 leading-relaxed">{fullReport.personalityProfile.synergyAnalysis}</p>
                </section>

                {/* 2. Ideal Partner Characteristics */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">2</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Karakter Pasangan Ideal untukmu
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-textDark/85 leading-relaxed">{fullReport.idealPartnerCharacteristics.summary}</p>
                  <div className="grid grid-cols-1 gap-2 mt-1">
                    <div className="p-3 rounded-2xl bg-white/45 border border-white/60 text-xs">
                      <strong className="text-textDark block mb-0.5">Temperamen yang Selaras:</strong>
                      <span className="text-textDark/80 leading-relaxed">{fullReport.idealPartnerCharacteristics.temperament}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/45 border border-white/60 text-xs">
                      <strong className="text-textDark block mb-0.5">Tipe Chemistry Hubungan:</strong>
                      <span className="text-textDark/80 leading-relaxed">{fullReport.idealPartnerCharacteristics.chemistryType}</span>
                    </div>
                  </div>
                </section>

                {/* 3. Recommended Partner Traits */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">3</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Sifat yang Perlu Kamu Cari dalam Calon Pasangan
                    </h3>
                  </div>
                  <p className="text-xs text-textDark/80 mb-1">{fullReport.recommendedPartnerTraits.title}</p>
                  <div className="flex flex-col gap-2.5">
                    {fullReport.recommendedPartnerTraits.traits.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/45 border border-white/60 text-xs">
                        <span className="font-semibold text-olive block mb-0.5">✦ {item.trait}</span>
                        <span className="text-textDark/80 leading-relaxed">{item.why}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. Emotional Needs */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">4</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Kebutuhan Emosional Terdalammu
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-textDark/85 leading-relaxed">{fullReport.emotionalNeeds.summary}</p>
                  <div className="flex flex-col gap-2">
                    {fullReport.emotionalNeeds.primaryNeeds.map((need, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-white/45 border border-white/60 flex items-center gap-2 text-xs text-textDark/85">
                        <Heart size={14} className="text-olive shrink-0" />
                        <span>{need}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-olive/10 border border-olive/20 text-xs text-textDark/85 mt-1 leading-relaxed">
                    <strong className="text-olive block mb-0.5">Faktor Rasa Aman Batin:</strong>
                    {fullReport.emotionalNeeds.whatMakesYouFeelSafe}
                  </div>
                </section>

                {/* 5. Communication Compatibility */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">5</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Kompatibilitas Komunikasi & Resolusi Konflik
                    </h3>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/45 border border-white/60 text-xs">
                    <strong className="text-textDark block mb-0.5">Gaya Komunikasimu:</strong>
                    <span className="text-textDark/80 leading-relaxed">{fullReport.communicationCompatibility.yourStyle}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/45 border border-white/60 text-xs">
                    <strong className="text-textDark block mb-0.5">Gaya Pasangan Paling Melengkapi:</strong>
                    <span className="text-textDark/80 leading-relaxed">{fullReport.communicationCompatibility.bestComplementaryStyle}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/45 border border-white/60 text-xs">
                    <strong className="text-textDark block mb-0.5">Panduan Menyelesaikan Konflik Berdua:</strong>
                    <span className="text-textDark/80 leading-relaxed">{fullReport.communicationCompatibility.handlingConflictTogether}</span>
                  </div>
                </section>

                {/* 6. Relationship Strengths */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">6</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Kekuatan Terbesarmu dalam Hubungan
                    </h3>
                  </div>
                  <p className="text-xs text-textDark/85 leading-relaxed">{fullReport.relationshipStrengths.summary}</p>
                  <div className="flex flex-col gap-2">
                    {fullReport.relationshipStrengths.strengths.map((str, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-white/45 border border-white/60 flex items-center gap-2 text-xs text-textDark/85">
                        <CheckCircle2 size={15} className="text-olive shrink-0" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 7. Potential Challenges */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">7</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Potensi Titik Rawan & Cara Mengantisipasinya
                    </h3>
                  </div>
                  <p className="text-xs text-textDark/85 leading-relaxed">{fullReport.potentialChallenges.summary}</p>
                  <div className="flex flex-col gap-2.5">
                    {fullReport.potentialChallenges.blindSpots.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/45 border border-white/60 text-xs flex flex-col gap-1">
                        <span className="font-semibold text-red-900/80">⚠️ Blind Spot: {item.issue}</span>
                        <span className="text-textDark/80 leading-relaxed">💡 Langkah Solutif: {item.remedy}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 8. Marriage Readiness Reflection */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">8</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Refleksi Kesiapan Menuju Pernikahan
                    </h3>
                  </div>
                  <p className="text-xs text-textDark/85 leading-relaxed">{fullReport.marriageReadiness.summaryReflection}</p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-white/45 border border-white/60">
                      <strong>Kesiapan Emosional:</strong> <span className="text-textDark/80">{fullReport.marriageReadiness.emotionalReadinessText}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/45 border border-white/60">
                      <strong>Kesiapan Finansial:</strong> <span className="text-textDark/80">{fullReport.marriageReadiness.financialReadinessText}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/45 border border-white/60">
                      <strong>Kesiapan Komitmen & Krisis:</strong> <span className="text-textDark/80">{fullReport.marriageReadiness.commitmentReadinessText}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/45 border border-white/60">
                      <strong>Visi Rumah Tangga:</strong> <span className="text-textDark/80">{fullReport.marriageReadiness.visionText}</span>
                    </div>
                  </div>
                </section>

                {/* 9. Personal Growth Recommendations */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">9</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      3 Rekomendasi Pengembangan Diri
                    </h3>
                  </div>
                  <p className="text-xs text-textDark/85 leading-relaxed">{fullReport.personalGrowthRecommendations.summary}</p>
                  <div className="flex flex-col gap-2">
                    {fullReport.personalGrowthRecommendations.actionableSteps.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-white/45 border border-white/60 text-xs text-textDark/85 leading-relaxed flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-olive/20 text-olive text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 10. Ideal Relationship Blueprint */}
                <section className="rounded-[32px] glass-panel p-6 shadow-glass flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/40 pb-2.5">
                    <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">10</span>
                    <h3 className="font-serif-heading text-lg font-semibold text-textDark">
                      Cetak Biru Hubungan Impian (Relationship Blueprint)
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-textDark/85 leading-relaxed font-serif italic bg-white/40 p-3 rounded-2xl border border-white/60">
                    “{fullReport.idealRelationshipBlueprint.vision}”
                  </p>
                  <div className="p-3.5 rounded-2xl bg-white/45 border border-white/60 text-xs">
                    <strong className="text-olive block mb-1">3 Pilar Utama Rumah Tangga:</strong>
                    <ul className="list-disc list-inside text-textDark/80 flex flex-col gap-1">
                      {fullReport.idealRelationshipBlueprint.corePillars.map((pillar, idx) => (
                        <li key={idx}>{pillar}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-olive/10 border border-olive/20 text-xs text-textDark/85 leading-relaxed">
                    <strong className="text-olive block mb-0.5">Ritual Kasih Sayang Harian:</strong>
                    {fullReport.idealRelationshipBlueprint.dailyRitual}
                  </div>
                </section>
              </>
            )}
          </div>
        )}
      </main>

      {/* Share Modal */}
      <PersonalityShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        userName={userName}
        primaryType={primaryType}
        secondaryType={secondaryType}
        testCode={testCode}
      />

      {/* Unlock Report Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[32px] glass-panel bg-white/95 p-6 shadow-2xl relative flex flex-col gap-4 border border-white/80 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowUnlockModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-textDark/70 hover:bg-black/5"
            >
              <X size={18} />
            </button>

            <div className="text-center pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive/15 text-olive text-[11px] font-semibold uppercase tracking-wider mb-2">
                <Lock size={12} />
                <span>Unlock Full Report</span>
              </div>
              <h3 className="font-serif-heading text-xl font-medium text-textDark">
                Buka Analisis Pasangan Ideal
              </h3>
              <p className="text-xs text-textDark/75 mt-1 leading-relaxed">
                Dapatkan 10 bab laporan lengkap kepribadian cinta dan panduan pasangan ideal seumur hidup.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-olive/10 border border-olive/20 flex items-center justify-between text-xs">
              <span className="font-medium text-textDark">Biaya Akses Laporan:</span>
              <span className="text-base font-bold text-olive">Rp12.000</span>
            </div>

            {paymentError && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-900 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{paymentError}</span>
              </div>
            )}

            <form onSubmit={handleInitiatePayment} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-semibold text-textDark/85 mb-1">
                  Nama Lengkap (Sesuai Invoice)
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textDark/40" />
                  <input
                    type="text"
                    required
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Minimal 3 karakter"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card bg-white/70 text-textDark focus:outline-none focus:ring-2 focus:ring-olive/40 border border-white/80"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-textDark/85 mb-1">
                  Alamat Email (Untuk Bukti Pembayaran)
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textDark/40" />
                  <input
                    type="email"
                    required
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card bg-white/70 text-textDark focus:outline-none focus:ring-2 focus:ring-olive/40 border border-white/80"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-textDark/85 mb-1">
                  Nomor WhatsApp / HP
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textDark/40" />
                  <input
                    type="tel"
                    required
                    value={payerMobile}
                    onChange={(e) => setPayerMobile(e.target.value)}
                    placeholder="081234567890"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card bg-white/70 text-textDark focus:outline-none focus:ring-2 focus:ring-olive/40 border border-white/80"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={paying}
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-olive text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:bg-olive-light active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Mempersiapkan Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <span>Lanjutkan ke Pembayaran (Rp12.000)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-textDark/60 mt-1">
                Pembayaran aman didukung oleh Mayar (QRIS, VA, E-Wallet).
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
