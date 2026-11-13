'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  Compass,
  Sparkles,
  ShieldCheck,
  Clock,
  Lock,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PillBadge } from '@/components/ui/PillBadge';

interface QuestionOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface QuestionItem {
  id: number;
  dimension: string;
  dimensionName: string;
  scenario: string;
  questionText: string;
  options: QuestionOption[];
}

const TARGET_HORIZON_OPTIONS = [
  { value: '6_months', label: 'Dalam 6 bulan ke depan' },
  { value: '1_year', label: 'Dalam 1 tahun' },
  { value: '2_3_years', label: 'Dalam 2–3 tahun' },
  { value: '3_5_years', label: 'Dalam 3–5 tahun' },
  { value: 'no_target', label: 'Belum memiliki target spesifik' },
];

function PersonalityTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Test session state
  const [testCode, setTestCode] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [targetMarriage, setTargetMarriage] = useState('1_year');

  // UI state
  const [step, setStep] = useState<'intro' | 'testing' | 'submitting'>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Questionnaire state
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Check existing session from query or localStorage
  useEffect(() => {
    const codeParam = searchParams?.get('code');
    const savedCode = codeParam || (typeof window !== 'undefined' ? localStorage.getItem('temurasa_last_pers_code') : null);

    if (savedCode) {
      setTestCode(savedCode);
      // Fetch saved answers
      fetch(`/api/personality/answers?testCode=${encodeURIComponent(savedCode)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setUserName(data.userName || '');
            if (data.status === 'completed') {
              router.push(`/personality/result/${encodeURIComponent(savedCode)}`);
              return;
            }
            if (data.answers && Object.keys(data.answers).length > 0) {
              setAnswers(data.answers);
              const maxAnswered = Math.max(...Object.keys(data.answers).map(Number));
              if (maxAnswered > 0 && maxAnswered < 25) {
                setCurrentIndex(maxAnswered); // resume at next unanswered question
              } else if (maxAnswered >= 25) {
                setCurrentIndex(24);
              }
              setStep('testing');
            } else if (data.userName) {
              setStep('testing');
            }
          }
        })
        .catch(() => {});
    }

    // Load questions list
    fetch('/api/personality/questions')
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          setQuestions(data.questions);
        }
      })
      .catch((err) => {
        setError('Gagal memuat pertanyaan. Silakan periksa koneksi.');
      });
  }, [searchParams]);

  // Save answers to localStorage on change
  useEffect(() => {
    if (testCode && Object.keys(answers).length > 0) {
      try {
        localStorage.setItem(`temurasa_pers_answers_${testCode}`, JSON.stringify(answers));
      } catch (e) {}
    }
  }, [answers, testCode]);

  // Handle starting test from Intro
  const handleStartTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || userName.trim().length < 2) {
      setError('Mohon masukkan nama atau panggilan kamu (minimal 2 karakter).');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/personality/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim(),
          targetMarriage,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal memulai tes.');
      }

      setTestCode(data.testCode);
      if (typeof window !== 'undefined') {
        localStorage.setItem('temurasa_last_pers_code', data.testCode);
        window.history.replaceState(null, '', `/personality?code=${encodeURIComponent(data.testCode)}`);
      }

      setStep('testing');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memulai tes.');
    } finally {
      setLoading(false);
    }
  };

  // Select an option
  const handleSelectOption = (optionId: string) => {
    const qNum = currentQuestion.id;
    const updated = { ...answers, [qNum]: optionId };
    setAnswers(updated);

    // Save to server in background
    if (testCode) {
      fetch('/api/personality/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCode,
          answers: [{ questionIndex: qNum, selectedOptionId: optionId }],
        }),
      }).catch(() => {});
    }
  };

  // Next Question
  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed last question -> submit
      await handleSubmitAll();
    }
  };

  // Previous Question
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Submit
  const handleSubmitAll = async () => {
    if (!testCode) return;
    setStep('submitting');
    setError(null);

    try {
      const res = await fetch('/api/personality/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCode,
          answers,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal menyimpan hasil tes.');
      }

      // Redirect to Result Page
      router.push(`/personality/result/${encodeURIComponent(testCode)}`);
    } catch (err: any) {
      setError(err.message || 'Gagal menyelesaikan tes.');
      setStep('testing');
    }
  };

  // Helper for Dimension Icons
  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case 'emotional_needs':
        return <Heart size={13} className="text-olive" />;
      case 'communication_style':
        return <MessageCircle size={13} className="text-olive" />;
      case 'affection_expression':
        return <Sparkles size={13} className="text-olive" />;
      case 'independence_space':
        return <ShieldCheck size={13} className="text-olive" />;
      case 'future_commitment':
      default:
        return <Compass size={13} className="text-olive" />;
    }
  };

  // ========================================================
  // 1. SUBMITTING STATE
  // ========================================================
  if (step === 'submitting') {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm rounded-[32px] glass-panel p-8 shadow-glass flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-olive/15 flex items-center justify-center text-olive mb-4 animate-pulse">
            <Sparkles size={28} />
          </div>
          <h2 className="font-serif-heading text-2xl font-medium text-textDark">
            Menyelaraskan Jiwa & Karakter...
          </h2>
          <p className="text-xs text-textDark/80 mt-2 max-w-xs leading-relaxed">
            Sistem sedang menganalisis 25 jawabanmu untuk menemukan Primary & Secondary Love Personality Type serta gambaran pasangan idealmu.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-olive font-medium">
            <Loader2 size={16} className="animate-spin" />
            <span>Membuat Laporan Personal...</span>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. INTRO SCREEN
  // ========================================================
  if (step === 'intro') {
    return (
      <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-6 pb-8">
        <div className="w-full max-w-md mx-auto flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between relative overflow-hidden">
          {/* Top Bar with Logo & Back Link */}
          <div className="flex items-center justify-between mb-2">
            <Link
              href="/"
              className="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:bg-white/30 transition-all active:scale-95"
              aria-label="Kembali ke Beranda"
            >
              <ChevronLeft size={22} />
            </Link>
            <div className="flex items-center justify-center">
              <img
                src="/temurasa-logo.png"
                alt="temurasa."
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="w-10 h-10" aria-hidden="true" />
          </div>

          {/* Intro Hero Content */}
          <div className="my-auto py-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive/15 border border-olive/20 text-olive text-[11px] font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>Kenali Kepribadian Cintamu</span>
            </div>

            <h1 className="font-serif-heading text-3xl sm:text-[34px] font-medium text-textDark leading-tight">
              Seberapa jauh kamu mengenal dirimu dalam cinta?
            </h1>

            <p className="text-xs sm:text-sm text-textDark/85 mt-3 leading-relaxed font-normal">
              Jawab beberapa pertanyaan sederhana untuk mengetahui bagaimana kamu mencintai, apa yang kamu butuhkan dalam hubungan, dan seperti apa pasangan yang cocok untukmu.
            </p>

            {/* 4 Feature Highlights */}
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <div className="rounded-2xl bg-white/45 border border-white/60 p-3 flex items-center gap-2.5">
                <Sparkles size={18} className="text-olive shrink-0" />
                <div>
                  <span className="text-xs font-semibold block text-textDark">25 Pertanyaan</span>
                  <span className="text-[10px] text-textDark/70">5 Dimensi Cinta</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/45 border border-white/60 p-3 flex items-center gap-2.5">
                <Clock size={18} className="text-olive shrink-0" />
                <div>
                  <span className="text-xs font-semibold block text-textDark">5–7 Menit</span>
                  <span className="text-[10px] text-textDark/70">Waktu Santai</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/45 border border-white/60 p-3 flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-olive shrink-0" />
                <div>
                  <span className="text-xs font-semibold block text-textDark">Tanpa Benar/Salah</span>
                  <span className="text-[10px] text-textDark/70">Jujur pada Diri</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/45 border border-white/60 p-3 flex items-center gap-2.5">
                <Lock size={18} className="text-olive shrink-0" />
                <div>
                  <span className="text-xs font-semibold block text-textDark">Personal & Privat</span>
                  <span className="text-[10px] text-textDark/70">Reflektif</span>
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mt-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-900 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleStartTest} className="mt-5 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-textDark/85 mb-1.5">
                  Nama atau Panggilan Kamu
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Contoh: Rian atau Sarah"
                  className="w-full px-4 py-3 rounded-2xl glass-card bg-white/60 text-textDark text-sm placeholder:text-textDark/40 focus:outline-none focus:ring-2 focus:ring-olive/40 border border-white/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textDark/85 mb-1.5">
                  Target Menuju Pernikahan
                </label>
                <select
                  value={targetMarriage}
                  onChange={(e) => setTargetMarriage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl glass-card bg-white/60 text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-olive/40 border border-white/80"
                >
                  {TARGET_HORIZON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-olive" />
                    <span>Mempersiapkan Tes...</span>
                  </>
                ) : (
                  <>
                    <span>Mulai Sekarang</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-[11px] text-textDark/60">
            20 Archetypes · Analisis Pasangan Ideal · Kesiapan Pernikahan
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 3. TESTING SCREEN (1 Question per Screen)
  // ========================================================
  if (!questions || questions.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-olive animate-spin" />
          <p className="text-xs text-textDark/80">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      {/* Top Header */}
      <Header title="Kepribadian Cinta" />

      {/* Segmented Progress Tracker */}
      <div className="mb-2">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
          segments={5}
        />
      </div>

      {/* Main Question Glass Card */}
      <div className="w-full max-w-md mx-auto flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-2 relative overflow-hidden">
        <div>
          {/* Dimension Pill Badge with Icon */}
          <div className="mb-3">
            <PillBadge
              icon={getDimensionIcon(currentQuestion.dimension)}
              label={currentQuestion.dimensionName}
            />
          </div>

          {/* Contextual Scenario */}
          {currentQuestion.scenario && (
            <p className="text-xs sm:text-sm text-textDark/70 italic mb-2 leading-relaxed">
              {currentQuestion.scenario}
            </p>
          )}

          {/* Main Question Text */}
          <h2 className="font-serif-heading text-xl sm:text-[24px] font-medium text-textDark leading-snug">
            {currentQuestion.questionText}
          </h2>

          {/* 4 Selectable Options */}
          <div className="mt-5 flex flex-col gap-2.5">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedValue === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-4 rounded-2xl cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isSelected
                      ? 'glass-card-selected'
                      : 'glass-card glass-card-hover'
                  }`}
                >
                  {/* Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? 'border-olive bg-white'
                        : 'border-textDark/40 bg-white/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-olive" />
                    )}
                  </div>

                  {/* Option Text and Sublabel */}
                  <div className="flex-1">
                    <span
                      className={`text-xs sm:text-sm block leading-relaxed ${
                        isSelected ? 'text-textDark font-semibold' : 'text-textDark/85'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {opt.sublabel && (
                      <span className="text-[11px] text-textDark/60 block mt-0.5">
                        {opt.sublabel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="mt-6 pt-2 flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-textDark/80 hover:bg-white/50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Pertanyaan Sebelumnya"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Continue / Finish Button */}
          <button
            onClick={handleNext}
            disabled={!selectedValue}
            className="flex-1 py-3.5 px-6 rounded-full bg-olive text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:bg-olive-light active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>
              {currentIndex === questions.length - 1
                ? 'Selesai & Lihat Hasil'
                : 'Lanjutkan'}
            </span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PersonalityTestPage() {
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
      <PersonalityTestContent />
    </Suspense>
  );
}
