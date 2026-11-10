'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { GaugeMeter } from '@/components/ui/GaugeMeter';
import {
  Heart,
  Share2,
  Sparkles,
  MessageCircle,
  Coins,
  Users,
  Smile,
  Compass,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  Check,
  X,
  Loader2,
  AlertCircle,
  Lightbulb,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Clock,
  BookOpen,
  Info,
  Instagram,
} from 'lucide-react';
import { InstagramStoryModal } from '@/components/ui/InstagramStoryModal';

export default function CoupleReportPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params?.roomCode as string)?.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 5 Main Tabs (Part 11)
  const [activeTab, setActiveTab] = useState<
    'overview' | 'connections' | 'differences' | 'seven_areas' | 'recommendations'
  >('overview');

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedQuestionsCat, setExpandedQuestionsCat] = useState<string | null>(null);
  const [activeChallengeWeek, setActiveChallengeWeek] = useState<number>(1);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});

  const toggleActivity = (id: string) => {
    setExpandedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        const res = await fetch(`/api/report/${roomCode}`);
        if (!res.ok) {
          throw new Error('Gagal memuat laporan.');
        }

        const data = await res.json();
        if (!data.isPaid) {
          // If not paid, redirect to paywall
          router.replace(`/payment/${roomCode}`);
          return;
        }

        setReport(data);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data laporan.');
      } finally {
        setLoading(false);
      }
    }

    if (roomCode) {
      loadReport();
    }
  }, [roomCode, router]);

  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'financial':
        return <Coins size={16} className="text-olive" />;
      case 'communication':
        return <MessageCircle size={16} className="text-olive" />;
      case 'family':
        return <Users size={16} className="text-olive" />;
      case 'lifestyle':
        return <Smile size={16} className="text-olive" />;
      case 'future':
        return <Compass size={16} className="text-olive" />;
      case 'emotional':
        return <Heart size={16} className="text-olive" />;
      case 'conflict':
        return <ShieldCheck size={16} className="text-olive" />;
      default:
        return <Sparkles size={16} className="text-olive" />;
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3 text-center">
          <Loader2 size={32} className="animate-spin text-olive" />
          <p className="text-sm text-textDark/80">Menyiapkan wawasan personalisasi...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
        <Header title="Reflect" showBack backHref="/" />
        <div className="rounded-[32px] glass-panel p-7 text-center my-auto shadow-glass">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="font-serif-heading text-2xl font-medium text-textDark">
            Gagal Memuat Laporan
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

  const nameA = report.coupleNames?.participantA || 'Partner A';
  const nameB = report.coupleNames?.participantB || 'Partner B';
  const overallScore = report.overallScore;

  // Rich detailed data from advanced insight engine
  const d = report.detailedReport || {};
  const overview = d.relationshipOverview || {};
  const strongest = d.strongestConnections || [];
  const areasToUnderstand = d.areasToUnderstand || [];
  const sevenDimensions = d.sevenDimensionAnalysis || report.categoryScores || [];
  const dynamics = d.relationshipDynamics || [];
  const financial = d.financialInsights || {};
  const communication = d.communicationPatterns || {};
  const future = d.futureVision || {};
  const recommendations = d.personalizedRecommendations || report.actionPlans || [];
  const conversationStarters = d.conversationStarters || report.discussionPrompts || [];
  const thirtyDayChallenge = d.thirtyDayChallenge || [];
  const disclaimerText = d.disclaimer || 'Laporan ini dirancang untuk tujuan refleksi dan edukasi relasional pasangan.';

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-4 sm:px-5 pt-4 pb-12">
      {/* Top Header */}
      <Header
        title="Reflect"
        showBack
        backHref={`/room/${roomCode}`}
        showShare
        onShare={() => setShowShareModal(true)}
      />

      {/* Main Glass Container */}
      <div className="w-full flex-1 rounded-[32px] glass-panel p-5 sm:p-7 shadow-glass flex flex-col justify-between my-2 relative overflow-hidden">
        <div>
          {/* Interlocking Portrait Avatars (Screen 3 Reference) */}
          <div className="relative flex items-center justify-center my-2">
            <div className="relative z-10 w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-sm bg-warmCream flex items-center justify-center font-serif-heading font-bold text-xl text-olive">
              {nameA.charAt(0).toUpperCase()}
            </div>
            <div className="relative z-20 -mx-3.5 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-red-400">
              <Heart size={14} fill="#F87171" className="text-red-400" />
            </div>
            <div className="relative z-10 w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-sm bg-mutedBlue/40 flex items-center justify-center font-serif-heading font-bold text-xl text-olive">
              {nameB.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mt-2 mb-2">
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-medium text-textDark">
              Laporan Kecocokan<br />{nameA} & {nameB}
            </h2>
            <p className="text-[11px] text-textDark/65 mt-0.5 tracking-wide">
              Analisis Komprehensif 7 Dimensi Hubungan
            </p>
          </div>

          {/* Semicircular Olive Gauge Meter (Screen 3 Reference) */}
          <div className="my-2 flex justify-center">
            <GaugeMeter
              score={overallScore}
              label="Overall Compatibility"
            />
          </div>

          {/* Insight Highlight Quote Card (Screen 3 Reference) */}
          <div className="mt-3 p-4 rounded-2xl glass-card flex items-start gap-3 border border-white/70 shadow-sm">
            <Sparkles size={18} className="text-olive shrink-0 mt-0.5" />
            <p className="text-xs text-textDark/85 leading-relaxed font-medium">
              Kalian memiliki kecocokan preferensi sebesar <span className="font-bold text-olive">{overallScore}%</span>. Hubungan kalian diperkaya oleh fondasi keselarasan yang kuat, dengan area-area spesifik yang menjadi ruang bertumbuh dan saling memahami.
            </p>
          </div>

          {/* ==================================================== */}
          {/* TAB 1: OVERVIEW (RINGKASAN & POLA DINAMIKA HUBUNGAN) */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="mt-5 flex flex-col gap-4 animate-fadeIn">
              {/* Section A: Relationship Overview */}
              <div className="rounded-2xl glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-olive" />
                  <h3 className="font-serif-heading text-base font-semibold text-textDark">
                    A. Ringkasan Eksekutif Hubungan
                  </h3>
                </div>
                <p className="text-xs text-textDark/80 leading-relaxed">
                  {overview.summary || d.overallInterpretation}
                </p>

                {/* Key Observations */}
                {overview.keyObservations && (
                  <div className="mt-4 pt-3 border-t border-white/40 flex flex-col gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-textDark/70">
                      Tiga Observasi Kunci:
                    </span>
                    {overview.keyObservations.map((obs: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-textDark/85">
                        <CheckCircle2 size={14} className="text-olive shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{obs}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Priority Discussion Priority */}
                {overview.primaryDiscussionPriority && (
                  <div className="mt-4 p-3.5 rounded-xl bg-olive/10 border border-olive/20 text-xs text-textDark/90">
                    <span className="font-semibold block text-olive mb-0.5">
                      Fokus Percakapan Terdekat:
                    </span>
                    <span>{overview.primaryDiscussionPriority}</span>
                  </div>
                )}
              </div>

              {/* Section E: Relationship Dynamics (Patterns) */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="font-serif-heading text-sm font-semibold text-textDark flex items-center gap-1.5">
                    <TrendingUp size={15} className="text-olive" />
                    <span>E. Pola Dinamika Hubungan (Berdasarkan Jawaban)</span>
                  </h3>
                </div>

                <div className="flex flex-col gap-2.5">
                  {dynamics.map((pat: any) => (
                    <div key={pat.id} className="rounded-2xl glass-card p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-semibold text-textDark">
                          {pat.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          {pat.supportingQuestionIds?.map((qId: string) => (
                            <span key={qId} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/60 text-olive font-bold">
                              {qId}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-olive font-medium mb-1.5">
                        {pat.tagline}
                      </p>
                      <p className="text-xs text-textDark/80 leading-relaxed mb-2">
                        {pat.description}
                      </p>
                      <div className="pt-2 border-t border-white/30 text-[11px] text-textDark/70 flex items-start gap-1.5">
                        <Lightbulb size={13} className="text-olive shrink-0 mt-0.5" />
                        <span><strong>Saran Konstruktif:</strong> {pat.constructiveTip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-white/20 border border-white/40 text-[11px] text-textDark/70 flex items-start gap-2">
                <Info size={15} className="text-olive shrink-0 mt-0.5" />
                <span className="leading-relaxed">{disclaimerText}</span>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: CONNECTIONS (TITIK KESELARASAN TERKUAT)        */}
          {/* ==================================================== */}
          {activeTab === 'connections' && (
            <div className="mt-5 flex flex-col gap-4 animate-fadeIn">
              <div className="px-1">
                <h3 className="font-serif-heading text-base font-semibold text-textDark">
                  B. Kekuatan Terbesar Kalian (Strongest Connections)
                </h3>
                <p className="text-xs text-textDark/75 mt-0.5">
                  Tiga pilar dimensi dengan keselarasan tertinggi lengkap dengan wawasan personal dan 3 aktivitas terkurasi untuk terus bertumbuh bersama.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {strongest.map((item: any, idx: number) => {
                  const catScore = item.score !== undefined ? item.score : '';
                  const activities: any[] = item.activities && item.activities.length > 0 ? item.activities : [];

                  return (
                    <div key={idx} className="rounded-2xl glass-card p-4 sm:p-5 border-l-4 border-l-olive shadow-sm">
                      {/* Category Header: Category Name + Score */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-olive/15 text-olive">
                            {getCategoryIcon(item.categoryCode)}
                          </span>
                          <span className="text-xs uppercase tracking-wider font-bold text-olive">
                            {item.categoryName} {catScore ? `(${catScore}%)` : ''}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-olive/15 text-olive">
                          Pilar #{idx + 1}
                        </span>
                      </div>

                      <h4 className="font-serif-heading text-sm sm:text-base font-semibold text-textDark mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-textDark/80 leading-relaxed mb-3.5">
                        {item.explanation}
                      </p>

                      {/* 3 Activities to Keep Growing Together */}
                      <div className="pt-3 border-t border-white/40">
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <Sparkles size={13} className="text-olive" />
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-textDark">
                            3 Aktivitas untuk Terus Bertumbuh Bersama
                          </h5>
                        </div>

                        {activities.length > 0 ? (
                          <div className="flex flex-col gap-2.5">
                            {activities.map((act: any, actIdx: number) => {
                              const actId = act.activityId || `${idx}-${actIdx}`;
                              const isOpen = !!expandedActivities[actId];

                              return (
                                <div
                                  key={actId}
                                  className="rounded-xl bg-white/45 border border-white/60 p-3 text-textDark transition-all"
                                >
                                  {/* Activity Top Bar */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-olive bg-olive/10 px-1.5 py-0.5 rounded inline-block mb-1">
                                        Aktivitas 0{actIdx + 1}
                                      </span>
                                      <h6 className="font-serif-heading text-xs sm:text-sm font-semibold text-textDark">
                                        {act.title}
                                      </h6>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => toggleActivity(actId)}
                                      className="p-1 rounded-full hover:bg-white/60 text-olive transition-colors shrink-0"
                                      aria-label={isOpen ? 'Tutup panduan' : 'Buka panduan'}
                                    >
                                      {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                  </div>

                                  {/* Personalized Intro / Description */}
                                  <p className="text-[11px] text-textDark/85 leading-relaxed mt-1.5 mb-2">
                                    {act.personalizedIntro || act.description}
                                  </p>

                                  {/* Duration & Frequency Badges */}
                                  <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] text-textDark/70 font-medium">
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/60">
                                      <Clock size={11} className="text-olive" />
                                      {act.estimatedDuration}
                                    </span>
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/60">
                                      <Calendar size={11} className="text-olive" />
                                      {act.suggestedFrequency}
                                    </span>
                                  </div>

                                  {/* Expandable Step-by-Step Instructions & Expected Benefit */}
                                  {isOpen && (
                                    <div className="pt-2 border-t border-white/40 mt-2 space-y-2 text-[11px] animate-fadeIn">
                                      {act.instructions && act.instructions.length > 0 && (
                                        <div>
                                          <strong className="block text-[10px] uppercase font-bold text-olive mb-1">
                                            Panduan Praktis:
                                          </strong>
                                          <ul className="space-y-1 pl-1">
                                            {act.instructions.map((step: string, sIdx: number) => (
                                              <li key={sIdx} className="flex items-start gap-1.5 text-textDark/80">
                                                <span className="w-3.5 h-3.5 rounded-full bg-olive/15 text-olive font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                                                  {sIdx + 1}
                                                </span>
                                                <span className="leading-snug">{step}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {act.expectedBenefit && (
                                        <div className="p-2 rounded-lg bg-olive/10 border border-olive/20 text-[10px] text-textDark/90 flex items-start gap-1.5">
                                          <Lightbulb size={12} className="text-olive shrink-0 mt-0.5" />
                                          <span><strong>Manfaat yang Diharapkan:</strong> {act.expectedBenefit}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Quick toggle link */}
                                  <button
                                    type="button"
                                    onClick={() => toggleActivity(actId)}
                                    className="text-[10px] font-semibold text-olive hover:underline mt-1 inline-flex items-center gap-1"
                                  >
                                    {isOpen ? 'Tutup Rincian' : 'Lihat Langkah demi Langkah'}
                                    {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* Fallback for legacy records */
                          <div className="p-3 rounded-xl bg-white/40 border border-white/60 text-[11px] text-textDark/85 flex items-start gap-2">
                            <Calendar size={14} className="text-olive shrink-0 mt-0.5" />
                            <div>
                              <strong className="block text-olive">Aktivitas Praktis yang Disarankan:</strong>
                              <span>{item.practicalActivity}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: DIFFERENCES (AREA EKSPLORASI & INSIGHT KHUSUS) */}
          {/* ==================================================== */}
          {activeTab === 'differences' && (
            <div className="mt-5 flex flex-col gap-5 animate-fadeIn">
              {/* Section C: Areas to Understand */}
              <div>
                <div className="px-1 mb-2">
                  <h3 className="font-serif-heading text-base font-semibold text-textDark">
                    C. Area untuk Saling Memahami (Areas to Understand)
                  </h3>
                  <p className="text-xs text-textDark/75 mt-0.5">
                    Tiga perbedaan perspektif paling bermakna dari jawaban kalian. Perbedaan ini adalah ruang belajar untuk saling melengkapi.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {areasToUnderstand.map((item: any, idx: number) => (
                    <div key={idx} className="rounded-2xl glass-card p-4 border-l-4 border-l-warmCream-dark">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-textDark/70 block mb-1">
                        {item.categoryName}
                      </span>
                      <h4 className="font-serif-heading text-sm font-semibold text-textDark mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-textDark/80 leading-relaxed mb-2">
                        {item.differenceExplanation}
                      </p>

                      <div className="p-3 rounded-xl bg-white/40 border border-white/60 text-[11px] text-textDark/85 flex flex-col gap-1.5">
                        <div>
                          <strong className="text-textDark">Potensi Implikasi:</strong>{' '}
                          <span>{item.potentialImplications}</span>
                        </div>
                        <div className="pt-1.5 border-t border-white/40 flex items-start gap-1 text-olive">
                          <MessageCircle size={13} className="shrink-0 mt-0.5" />
                          <span><strong>Topik Obrolan:</strong> {item.discussionSuggestions}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section F: Financial Compatibility Deep Dive */}
              <div className="rounded-2xl glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins size={16} className="text-olive" />
                  <h4 className="font-serif-heading text-sm font-semibold text-textDark">
                    F. Analisis Mendalam: Dinamika Finansial
                  </h4>
                </div>
                <p className="text-xs text-textDark/80 leading-relaxed mb-2">
                  {financial.overview}
                </p>
                <div className="text-xs text-textDark/75 leading-relaxed mb-3">
                  <strong>Pola Perbedaan:</strong> {financial.differencesAnalysis}
                </div>
                <div className="p-3 rounded-xl bg-white/40 border border-white/60 text-[11px] text-textDark/85 mb-3">
                  <strong className="text-olive block mb-1">Peluang Perencanaan Bersama:</strong>
                  <span>{financial.sharedOpportunities}</span>
                </div>
                <div className="p-3 rounded-xl bg-olive/10 border border-olive/20 text-[11px] text-textDark/90">
                  <strong className="block text-olive mb-0.5">Rekomendasi Rutinitas:</strong>
                  <span>{financial.monthlyCheckInRoutine}</span>
                </div>
              </div>

              {/* Section G: Communication Deep Dive */}
              <div className="rounded-2xl glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={16} className="text-olive" />
                  <h4 className="font-serif-heading text-sm font-semibold text-textDark">
                    G. Pola & Irama Komunikasi
                  </h4>
                </div>
                <p className="text-xs text-textDark/80 leading-relaxed mb-2">
                  {communication.overview}
                </p>
                <div className="p-3 rounded-xl bg-white/40 border border-white/60 text-[11px] text-textDark/85 mb-2">
                  <strong className="text-textDark block mb-0.5">Keterusterangan & Tempo:</strong>
                  <span>{communication.directnessAnalysis}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/40 border border-white/60 text-[11px] text-textDark/85">
                  <strong className="text-textDark block mb-0.5">Mendengar vs Solusi:</strong>
                  <span>{communication.listeningVsSolving}</span>
                </div>
              </div>

              {/* Section H: Future Vision Deep Dive */}
              <div className="rounded-2xl glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Compass size={16} className="text-olive" />
                  <h4 className="font-serif-heading text-sm font-semibold text-textDark">
                    H. Visi Masa Depan & Fleksibilitas Hidup
                  </h4>
                </div>
                <p className="text-xs text-textDark/80 leading-relaxed mb-2">
                  {future.overview}
                </p>
                <div className="p-3 rounded-xl bg-white/40 border border-white/60 text-[11px] text-textDark/85">
                  <strong className="text-olive block mb-0.5">Latihan Visi 5 Tahun:</strong>
                  <span>{future.fiveYearExercise}</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: SEVEN AREAS (ANALISIS DETAIL 7 KATEGORI)      */}
          {/* ==================================================== */}
          {activeTab === 'seven_areas' && (
            <div className="mt-5 flex flex-col gap-3.5 animate-fadeIn">
              <div className="px-1">
                <h3 className="font-serif-heading text-base font-semibold text-textDark">
                  D. Analisis Lengkap 7 Dimensi Hubungan
                </h3>
                <p className="text-xs text-textDark/75 mt-0.5">
                  Klik setiap kategori untuk membuka analisis komprehensif, daftar kekuatan, dan rincian jawaban per pertanyaan.
                </p>
              </div>

              {sevenDimensions.map((cat: any) => {
                const isExpanded = expandedCategory === cat.categoryCode;
                const isQuestionsExpanded = expandedQuestionsCat === cat.categoryCode;

                return (
                  <div
                    key={cat.categoryCode}
                    className="rounded-2xl glass-card p-4 transition-all"
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedCategory(isExpanded ? null : cat.categoryCode)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-white/50">
                            {getCategoryIcon(cat.categoryCode)}
                          </div>
                          <h4 className="text-xs sm:text-sm font-semibold text-textDark">
                            {cat.categoryName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif-heading text-sm font-bold text-textDark">
                            {cat.score}%
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-textDark/60" />
                          ) : (
                            <ChevronDown size={16} className="text-textDark/60" />
                          )}
                        </div>
                      </div>

                      {/* Olive Progress Bar (Reference Match) */}
                      <div className="w-full h-2 rounded-full bg-white/40 overflow-hidden">
                        <div
                          className="h-full bg-olive rounded-full transition-all duration-700"
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Expandable Comprehensive Deep Dive */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-white/40 flex flex-col gap-3 animate-fadeIn">
                        {/* 100-150 words synthesis */}
                        <p className="text-xs text-textDark/85 leading-relaxed">
                          {cat.overviewAnalysis || cat.summary}
                        </p>

                        {/* Strengths */}
                        {cat.strengths && cat.strengths.length > 0 && (
                          <div className="p-3 rounded-xl bg-white/40 border border-white/60 text-xs">
                            <span className="font-semibold text-olive block mb-1">
                              Kekuatan Utama di Kategori Ini:
                            </span>
                            <ul className="flex flex-col gap-1 text-[11px] text-textDark/80">
                              {cat.strengths.map((str: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span>•</span>
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Growth Areas */}
                        {cat.growthAreas && cat.growthAreas.length > 0 && (
                          <div className="p-3 rounded-xl bg-white/40 border border-white/60 text-xs">
                            <span className="font-semibold text-textDark block mb-1">
                              Ruang Eksplorasi Bersama:
                            </span>
                            <ul className="flex flex-col gap-1 text-[11px] text-textDark/80">
                              {cat.growthAreas.map((gr: string, i: number) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span>•</span>
                                  <span>{gr}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 3 Action Suggestions */}
                        {cat.actionSuggestions && (
                          <div className="p-3 rounded-xl bg-olive/10 border border-olive/20 text-xs">
                            <span className="font-semibold text-olive block mb-1">
                              3 Saran Aksi Nyata:
                            </span>
                            <div className="flex flex-col gap-1.5 text-[11px] text-textDark/85">
                              {cat.actionSuggestions.map((act: string, i: number) => (
                                <div key={i} className="flex items-start gap-1.5">
                                  <span className="font-bold text-olive">{i + 1}.</span>
                                  <span>{act}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Toggle Question-by-Question Breakdown */}
                        {cat.questions && (
                          <div className="mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedQuestionsCat(
                                  isQuestionsExpanded ? null : cat.categoryCode
                                );
                              }}
                              className="text-[11px] font-semibold text-olive hover:underline flex items-center gap-1"
                            >
                              <span>
                                {isQuestionsExpanded
                                  ? 'Sembunyikan Rincian Soal'
                                  : 'Lihat Rincian Jawaban Soal per Soal'}
                              </span>
                              {isQuestionsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            {isQuestionsExpanded && (
                              <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-white/30">
                                {cat.questions.map((q: any) => (
                                  <div
                                    key={q.questionCode}
                                    className="p-3 rounded-xl bg-white/50 border border-white/70 text-xs flex flex-col gap-1.5"
                                  >
                                    <div className="flex items-center justify-between text-[10px] font-bold text-textDark/60">
                                      <span>{q.questionCode}</span>
                                      <span className="font-mono text-olive font-bold">
                                        Keselarasan: {q.similarity}%
                                      </span>
                                    </div>
                                    <p className="font-medium text-textDark text-xs leading-snug">
                                      &quot;{q.questionText}&quot;
                                    </p>
                                    <div className="flex items-center gap-3 text-[11px] text-textDark/70">
                                      <span>{nameA}: <strong>{q.answerA}/5</strong></span>
                                      <span>•</span>
                                      <span>{nameB}: <strong>{q.answerB}/5</strong></span>
                                    </div>
                                    <p className="text-[11px] text-textDark/75 leading-relaxed bg-white/40 p-2 rounded-lg">
                                      {q.interpretation}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: RECOMMENDATIONS, CONVERSATION & 30-DAY PLAN   */}
          {/* ==================================================== */}
          {activeTab === 'recommendations' && (
            <div className="mt-5 flex flex-col gap-6 animate-fadeIn">
              {/* Section I: Personalized Recommendations (>= 10) */}
              <div>
                <div className="px-1 mb-2">
                  <h3 className="font-serif-heading text-base font-semibold text-textDark">
                    I. Rekomendasi Terpersonalisasi (10+ Aksi)
                  </h3>
                  <p className="text-xs text-textDark/75 mt-0.5">
                    Disusun khusus berdasarkan titik kesamaan terkuat dan perbedaan terbesar jawaban kalian.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {recommendations.map((rec: any, idx: number) => {
                    const isHigh = rec.priority === 'Tinggi';
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl glass-card p-3.5 flex items-start gap-3 border ${
                          isHigh ? 'border-l-4 border-l-olive bg-white/40' : 'border-white/60'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-olive/15 text-olive flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-textDark/60">
                              {rec.category || rec.categoryName}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                isHigh ? 'bg-olive text-white' : 'bg-black/5 text-textDark/70'
                              }`}
                            >
                              {rec.priority || 'Rekomendasi'}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-textDark leading-snug">
                            {rec.recommendation || rec.action}
                          </p>
                          {rec.context && (
                            <p className="text-[10px] text-textDark/65 mt-1 leading-relaxed">
                              {rec.context}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section J: Conversation Starters (15+ Questions) */}
              <div>
                <div className="px-1 mb-2">
                  <h3 className="font-serif-heading text-base font-semibold text-textDark">
                    J. Pemantik Obrolan Bermakna (Conversation Starters)
                  </h3>
                  <p className="text-xs text-textDark/75 mt-0.5">
                    Pertanyaan reflektif untuk dibahas santai saat minum teh atau kencan berdua.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  {conversationStarters.map((starter: any, idx: number) => (
                    <div key={idx} className="rounded-2xl glass-card p-3.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-olive mb-1">
                        <MessageCircle size={13} />
                        <span>{starter.category || starter.categoryName}</span>
                      </div>
                      <p className="font-serif-heading text-xs sm:text-sm text-textDark italic leading-snug">
                        &quot;{starter.prompt}&quot;
                      </p>
                      {starter.whyItMatters && (
                        <p className="text-[10px] text-textDark/65 mt-1">
                          {starter.whyItMatters}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section K: 30-Day Couple Challenge */}
              <div>
                <div className="px-1 mb-2">
                  <h3 className="font-serif-heading text-base font-semibold text-textDark">
                    K. Tantangan 30 Hari Pasangan (30-Day Challenge)
                  </h3>
                  <p className="text-xs text-textDark/75 mt-0.5">
                    Panduan terstruktur 4 minggu untuk membangun kebiasaan relasi yang penuh empati dan kebahagiaan.
                  </p>
                </div>

                {/* Week Selector Tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl glass-card mb-3 text-center text-xs">
                  {[1, 2, 3, 4].map((wk) => (
                    <button
                      key={wk}
                      onClick={() => setActiveChallengeWeek(wk)}
                      className={`py-2 rounded-xl transition-all font-semibold ${
                        activeChallengeWeek === wk
                          ? 'bg-olive text-white shadow-sm'
                          : 'text-textDark/70 hover:bg-white/30'
                      }`}
                    >
                      Minggu {wk}
                    </button>
                  ))}
                </div>

                {/* Active Week Activities */}
                {thirtyDayChallenge
                  .filter((w: any) => w.week === activeChallengeWeek)
                  .map((weekObj: any) => (
                    <div key={weekObj.week} className="flex flex-col gap-2.5">
                      <div className="p-3.5 rounded-2xl bg-white/40 border border-white/60 mb-1">
                        <h4 className="font-serif-heading text-sm font-semibold text-textDark">
                          {weekObj.theme}
                        </h4>
                        <p className="text-xs text-textDark/75 mt-0.5 leading-relaxed">
                          {weekObj.description}
                        </p>
                      </div>

                      {weekObj.activities?.map((act: any) => (
                        <div key={act.day} className="rounded-2xl glass-card p-3.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-olive">
                              Hari ke-{act.day}: {act.title}
                            </span>
                            <span className="text-[10px] text-textDark/70 flex items-center gap-1 font-medium bg-white/50 px-2 py-0.5 rounded-full">
                              <Clock size={11} />
                              {act.duration}
                            </span>
                          </div>
                          <p className="text-xs text-textDark/80 leading-relaxed mb-2">
                            {act.description}
                          </p>
                          <div className="p-2 rounded-lg bg-white/40 text-[10px] text-textDark/85 flex items-start gap-1">
                            <strong className="text-olive">Hasil Obrolan:</strong>
                            <span>{act.outcome}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* STICKY 5-TAB BOTTOM NAVIGATION CAPSULE (PART 11)    */}
        {/* ==================================================== */}
        <div className="mt-8 pt-2 sticky bottom-2 z-20">
          <div className="w-full p-1.5 rounded-full glass-panel flex items-center justify-between shadow-lg border border-white/60 text-[11px] sm:text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-1 rounded-full font-medium transition-all text-center ${
                activeTab === 'overview'
                  ? 'bg-warmCream text-textDark shadow-sm font-semibold'
                  : 'text-textDark/70 hover:text-textDark'
              }`}
            >
              Ringkasan
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 py-2 px-1 rounded-full font-medium transition-all text-center ${
                activeTab === 'connections'
                  ? 'bg-warmCream text-textDark shadow-sm font-semibold'
                  : 'text-textDark/70 hover:text-textDark'
              }`}
            >
              Kekuatan
            </button>
            <button
              onClick={() => setActiveTab('differences')}
              className={`flex-1 py-2 px-1 rounded-full font-medium transition-all text-center ${
                activeTab === 'differences'
                  ? 'bg-warmCream text-textDark shadow-sm font-semibold'
                  : 'text-textDark/70 hover:text-textDark'
              }`}
            >
              Eksplorasi
            </button>
            <button
              onClick={() => setActiveTab('seven_areas')}
              className={`flex-1 py-2 px-1 rounded-full font-medium transition-all text-center ${
                activeTab === 'seven_areas'
                  ? 'bg-warmCream text-textDark shadow-sm font-semibold'
                  : 'text-textDark/70 hover:text-textDark'
              }`}
            >
              7 Dimensi
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex-1 py-2 px-1 rounded-full font-medium transition-all text-center ${
                activeTab === 'recommendations'
                  ? 'bg-warmCream text-textDark shadow-sm font-semibold'
                  : 'text-textDark/70 hover:text-textDark'
              }`}
            >
              Aksi &amp; Challenge
            </button>
          </div>
        </div>

        {/* BOTTOM SHARE BUTTONS (FEATURE: INSTAGRAM STORY SHARE CARD) */}
        <div className="mt-4 pt-4 border-t border-white/40 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="flex-1 py-3.5 px-5 rounded-full bg-olive text-softWhite font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:bg-olive-dark active:scale-[0.98] transition group"
          >
            <Share2 size={16} className="text-softWhite group-hover:scale-110 transition-transform" />
            <span>Share Our Story</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="py-3 px-5 rounded-full glass-card bg-white/40 text-textDark font-medium text-xs sm:text-sm border border-white/60 shadow-sm flex items-center justify-center gap-2 hover:bg-white/60 active:scale-[0.98] transition"
          >
            <Download size={15} className="text-olive" />
            <span>Download Report Card</span>
          </button>
        </div>
      </div>

      {/* Complete Instagram Story Share Card Modal */}
      <InstagramStoryModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        nameA={nameA}
        nameB={nameB}
        overallScore={overallScore}
        topCategories={strongest.map((s: any) => ({
          categoryName: s.categoryName,
          score: s.score || 0,
        }))}
        customQuote={overview.summary}
      />
    </div>
  );
}
