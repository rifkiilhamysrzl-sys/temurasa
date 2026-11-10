'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PillBadge } from '@/components/ui/PillBadge';
import {
  Coins,
  MessageCircle,
  Users,
  Compass,
  Smile,
  Heart,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface QuestionItem {
  id: string;
  questionCode: string;
  questionText: string;
  questionOrder: number;
  category: {
    id: string;
    categoryCode: string;
    categoryName: string;
    description: string;
  };
}

const SCALE_OPTIONS = [
  { value: 1, label: 'Sangat Tidak Setuju' },
  { value: 2, label: 'Tidak Setuju' },
  { value: 3, label: 'Netral / Tergantung Situasi' },
  { value: 4, label: 'Setuju' },
  { value: 5, label: 'Sangat Setuju' },
];

function AssessmentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const accessToken = params?.accessToken as string;
  const initialShowIntro = searchParams?.get('intro') === 'true';

  const [showIntro, setShowIntro] = useState(initialShowIntro);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [participant, setParticipant] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bothCompleted, setBothCompleted] = useState(false);

  // Load questions and participant's saved answers
  useEffect(() => {
    async function loadAssessment() {
      try {
        setLoading(true);

        // 1. Fetch questions
        const qRes = await fetch('/api/assessment/questions');
        if (!qRes.ok) throw new Error('Gagal memuat pertanyaan.');
        const qData = await qRes.json();
        setQuestions(qData.questions || []);

        // 2. Fetch existing answers & participant session
        const aRes = await fetch('/api/assessment/answers', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!aRes.ok) {
          throw new Error('Sesi tidak valid atau telah kedaluwarsa.');
        }

        const aData = await aRes.json();
        setParticipant(aData.participant);
        setAnswers(aData.answers || {});

        if (aData.participant.completionStatus === 'completed') {
          setIsCompleted(true);
        } else if (aData.participant.currentQuestionIndex > 0) {
          // Resume from last unanswered question
          setCurrentIndex(
            Math.min(aData.participant.currentQuestionIndex, qData.questions.length - 1)
          );
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat tes.');
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      loadAssessment();
    }
  }, [accessToken]);

  // Current question helper
  const currentQuestion = questions[currentIndex];
  const selectedValue = currentQuestion ? answers[currentQuestion.id] : undefined;

  // Category Icon Resolver
  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'financial':
        return <Coins size={14} className="text-textDark/70" />;
      case 'communication':
        return <MessageCircle size={14} className="text-textDark/70" />;
      case 'family':
        return <Users size={14} className="text-textDark/70" />;
      case 'lifestyle':
        return <Smile size={14} className="text-textDark/70" />;
      case 'future':
        return <Compass size={14} className="text-textDark/70" />;
      case 'emotional':
        return <Heart size={14} className="text-textDark/70" />;
      case 'conflict':
        return <ShieldCheck size={14} className="text-textDark/70" />;
      default:
        return <Sparkles size={14} className="text-textDark/70" />;
    }
  };

  // Answer selection handler
  const handleSelectOption = async (value: number) => {
    if (!currentQuestion) return;

    // Update state immediately
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);
    setSaving(true);

    try {
      const res = await fetch('/api/assessment/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          questionId: currentQuestion.id,
          answerValue: value,
          questionIndex: currentIndex,
        }),
      });

      const resData = await res.json();
      if (resData.isCompleted) {
        setIsCompleted(true);
      }
      if (resData.bothCompleted) {
        setBothCompleted(true);
      }
    } catch (e) {
      console.warn('Autosave background sync note:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all 30 questions
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3 text-center">
          <Loader2 size={32} className="animate-spin text-olive" />
          <p className="text-sm text-textDark/80">Menyiapkan lembar refleksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
        <Header title="Reflect" showBack backHref="/" />
        <div className="rounded-[32px] glass-panel p-7 text-center my-auto shadow-glass">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="font-serif-heading text-2xl font-medium text-textDark">
            Terjadi Kendala
          </h2>
          <p className="text-xs sm:text-sm text-textDark/80 mt-2">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 w-full py-3.5 px-6 rounded-full bg-warmCream text-textDark font-medium text-sm shadow-md"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // 1. ASSESSMENT INTRODUCTION MODAL/VIEW (Part 7)
  if (showIntro) {
    return (
      <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
        <Header title="Reflect" showBack onBack={() => router.push('/')} />

        <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-3 relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-textDark/70 font-semibold">
                Panduan Refleksi
              </span>
            </div>

            <h2 className="font-serif-heading text-3xl font-medium text-textDark leading-tight">
              Take a Moment to Reflect.
            </h2>
            <p className="text-xs sm:text-sm text-textDark/80 mt-2 leading-relaxed">
              There are no right or wrong answers. Answer honestly based on what you truly
              think and feel.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-2xl bg-white/40 border border-white/60 p-3.5 flex items-center gap-2.5">
                <Clock size={18} className="text-olive shrink-0" />
                <div>
                  <span className="text-xs font-semibold block text-textDark">5–8 Menit</span>
                  <span className="text-[10px] text-textDark/70">Waktu Santai</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/40 border border-white/60 p-3.5 flex items-center gap-2.5">
                <Lock size={18} className="text-olive shrink-0" />
                <div>
                  <span className="text-xs font-semibold block text-textDark">Privat Penuh</span>
                  <span className="text-[10px] text-textDark/70">Terenkripsi</span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl glass-card p-4">
              <span className="text-xs uppercase tracking-wider text-textDark/70 font-semibold block mb-2">
                Skala Jawaban:
              </span>
              <div className="flex flex-col gap-1.5 text-xs text-textDark/85">
                <div><span className="font-semibold text-olive">1</span> — Sangat Tidak Setuju</div>
                <div><span className="font-semibold text-olive">2</span> — Tidak Setuju</div>
                <div><span className="font-semibold text-olive">3</span> — Netral / Tergantung Situasi</div>
                <div><span className="font-semibold text-olive">4</span> — Setuju</div>
                <div><span className="font-semibold text-olive">5</span> — Sangat Setuju</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setShowIntro(false)}
              className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Mulai Asesmen</span>
              <ArrowRight size={18} />
            </button>
            <p className="text-[11px] text-center text-textDark/60">
              30 Pertanyaan · Disimpan secara otomatis
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. ASSESSMENT COMPLETED STATE (Part 10)
  if (isCompleted) {
    const roomCode = participant?.roomCode || '';
    return (
      <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
        <Header title="Reflect" />

        <div className="w-full flex-1 rounded-[32px] glass-panel p-7 shadow-glass flex flex-col justify-between my-3 text-center">
          <div className="my-auto">
            <div className="w-16 h-16 rounded-full bg-olive/15 border border-olive/30 flex items-center justify-center mx-auto mb-4 text-olive">
              <CheckCircle2 size={32} />
            </div>

            <h2 className="font-serif-heading text-3xl font-medium text-textDark">
              You&apos;ve Completed Your Reflection.
            </h2>
            <p className="text-xs sm:text-sm text-textDark/80 mt-2 max-w-xs mx-auto leading-relaxed">
              Terima kasih, <span className="font-semibold text-textDark">{participant?.displayName}</span>, telah meluangkan waktu untuk memahami diri dan hubungan kalian.
            </p>

            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/40 border border-white/60 text-xs font-medium text-textDark">
              <Sparkles size={14} className="text-olive" />
              <span>30 / 30 Pertanyaan Selesai</span>
            </div>

            {bothCompleted ? (
              <div className="mt-6 p-4 rounded-2xl bg-olive/10 border border-olive/20 text-xs text-textDark/90">
                <p className="font-semibold">Pasangan Anda juga telah selesai!</p>
                <p className="text-[11px] mt-1 text-textDark/70">
                  Laporan keselarasan kalian siap untuk dibuka bersama.
                </p>
              </div>
            ) : (
              <div className="mt-6 p-4 rounded-2xl bg-white/40 border border-white/60 text-xs text-textDark/80">
                <p className="font-semibold text-textDark">Satu Langkah Lagi Menuju Laporan Bersama</p>
                <p className="text-[11px] mt-1 text-textDark/70">
                  Menunggu pasangan Anda menyelesaikan 30 pertanyaan. Anda dapat kembali kapan saja.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => router.push(`/room/${roomCode}`)}
              className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Buka Status Ruangan</span>
              <ArrowRight size={18} />
            </button>

            {bothCompleted && (
              <button
                onClick={() => router.push(`/payment/${roomCode}`)}
                className="w-full py-3 px-6 rounded-full bg-olive text-white font-medium text-sm shadow-md"
              >
                Buka Laporan (Rp10.000)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. QUESTIONNAIRE VIEW (Strict Screen 2 Match)
  if (!currentQuestion) return null;

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      {/* Top Header */}
      <Header
        title="Reflect"
        showBack
        onBack={handlePrev}
      />

      {/* Segmented Progress Tracker */}
      <div className="mb-2">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
          segments={6}
        />
      </div>

      {/* Main Glass Card Question Container */}
      <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-2 relative overflow-hidden">
        <div>
          {/* Category Pill Badge with Icon */}
          <div className="mb-4">
            <PillBadge
              icon={getCategoryIcon(currentQuestion.category.categoryCode)}
              label={currentQuestion.category.categoryName}
            />
          </div>

          {/* Main Question Text (Editorial Serif) */}
          <h2 className="font-serif-heading text-2xl sm:text-[26px] font-medium text-textDark leading-snug">
            {currentQuestion.questionText}
          </h2>

          {/* 5 Selectable Translucent Options */}
          <div className="mt-6 flex flex-col gap-2.5">
            {SCALE_OPTIONS.map((opt) => {
              const isSelected = selectedValue === opt.value;

              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-3.5 select-none ${
                    isSelected
                      ? 'glass-card-selected'
                      : 'glass-card glass-card-hover'
                  }`}
                >
                  {/* Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'border-olive bg-white'
                        : 'border-textDark/40 bg-white/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-olive" />
                    )}
                  </div>

                  {/* Option Label */}
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      isSelected ? 'text-textDark font-semibold' : 'text-textDark/85'
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Controls (Matching Screen 2) */}
        <div className="mt-6 pt-2 flex items-center justify-between gap-3">
          {/* Circular Back Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-textDark/80 hover:bg-white/50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Pertanyaan Sebelumnya"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Wide Pill Continue Button in Olive/Sage */}
          <button
            onClick={handleNext}
            disabled={!selectedValue}
            className="flex-1 py-3.5 px-6 rounded-full bg-olive text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:bg-olive-light active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>{currentIndex === questions.length - 1 ? 'Selesai' : 'Lanjutkan'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-6">
          <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-olive" />
            <p className="text-sm text-textDark/80">Menyiapkan lembar refleksi...</p>
          </div>
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
