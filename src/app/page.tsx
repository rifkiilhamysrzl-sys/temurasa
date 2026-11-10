'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Coins,
  Sprout,
  ArrowRight,
  MessageCircle,
  Users,
  Compass,
  Smile,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  Menu,
  User,
  X,
} from 'lucide-react';
import { PillBadge } from '@/components/ui/PillBadge';
import { JoinRoomModal } from '@/components/ui/JoinRoomModal';

export default function HomePage() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const heroQuotes = [
    '"Temurasa — Menemukan titik temu di antara dua rasa."',
    '"Sebuah perjalanan untuk saling mengenal lebih dalam dan memahami perbedaan."',
    '"Menemukan kesamaan dan perlahan menyelaraskan arah bersama."',
  ];

  const categories = [
    {
      icon: <MessageCircle size={22} className="text-olive" />,
      title: 'Communication Style',
      description: 'Cara kalian mengekspresikan pikiran, perasaan, dan merespons satu sama lain.',
    },
    {
      icon: <Coins size={22} className="text-olive" />,
      title: 'Financial Compatibility',
      description: 'Prinsip pengelolaan uang, tabungan masa depan, dan transparansi finansial.',
    },
    {
      icon: <Users size={22} className="text-olive" />,
      title: 'Family & Children',
      description: 'Harapan pengasuhan anak dan batasan sehat dengan keluarga besar.',
    },
    {
      icon: <Smile size={22} className="text-olive" />,
      title: 'Lifestyle Compatibility',
      description: 'Keseimbangan antara rutinitas bersama, hobi, dan ruang pribadi.',
    },
    {
      icon: <Compass size={22} className="text-olive" />,
      title: 'Future Vision',
      description: 'Arah hidup, cita-cita 5–10 tahun ke depan, serta saling mendukung karier.',
    },
    {
      icon: <Heart size={22} className="text-olive" />,
      title: 'Emotional Needs',
      description: 'Bahasa kasih, perhatian kecil, dan rasa aman dalam hubungan.',
    },
    {
      icon: <ShieldCheck size={22} className="text-olive" />,
      title: 'Conflict Management',
      description: 'Penyelesaian perbedaan pendapat secara dewasa tanpa saling menyakiti.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Buat Ruangan',
      desc: 'Buat Couple Room privat untuk Anda dan pasangan tanpa biaya awal.',
    },
    {
      step: '02',
      title: 'Undang Pasangan',
      desc: 'Kirim tautan undangan privat via WhatsApp atau salin link.',
    },
    {
      step: '03',
      title: 'Jawab Mandiri',
      desc: 'Kalian menjawab 30 pertanyaan secara terpisah. Jawaban terjaga rahasia.',
    },
    {
      step: '04',
      title: 'Buka Laporan Bersama',
      desc: 'Buka laporan kecocokan mendalam hanya Rp10.000 sekali bayar untuk berdua.',
    },
  ];

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between pb-8">
      {/* 1. HERO SECTION (Screen 1 Reference Match) */}
      <section className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-6 pb-6">
        {/* Glass Card Container */}
        <div className="w-full flex-1 rounded-[32px] glass-panel p-6 flex flex-col justify-between shadow-glass relative overflow-hidden">
          {/* Top Bar with Temurasa Logo */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowMenuModal(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:bg-white/30 transition-all active:scale-95"
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1.8} />
            </button>
            <div className="flex-1 flex items-center justify-center">
              <img
                src="/temurasa-logo.png"
                alt="temurasa."
                className="h-8 w-auto object-contain"
              />
            </div>
            {/* Top right profile icon removed per request, placeholder keeps logo centered */}
            <div className="w-10 h-10" aria-hidden="true" />
          </div>

          {/* Main Title & Subtitle with User-Requested Wording */}
          <div className="mt-2 mb-3">
            <h2 className="font-serif-heading text-3xl sm:text-[38px] leading-[1.16] text-textDark font-medium">
              Temukan Titik Temu<br />di Antara Dua Rasa.
            </h2>
            <p className="text-xs sm:text-sm text-textDark/85 mt-2.5 font-normal leading-relaxed">
              <span className="font-semibold text-textDark">Temurasa</span> adalah sebuah perjalanan untuk saling mengenal lebih dalam, memahami perbedaan, menemukan kesamaan, dan perlahan menyelaraskan arah. Ikut test di bawah ini untuk menemukan titik temu di antara dua rasa.
            </p>
          </div>

          {/* 3 Glass Chips */}
          <div className="flex items-center gap-2 my-2 overflow-x-auto no-scrollbar py-1">
            <PillBadge
              icon={<Heart size={13} className="text-textDark/70" />}
              label="Relationship"
            />
            <PillBadge
              icon={<Coins size={13} className="text-textDark/70" />}
              label="Financial"
            />
            <PillBadge
              icon={<Sprout size={13} className="text-textDark/70" />}
              label="Future"
            />
          </div>

          {/* Cinematic Photo Card with Quotation */}
          <div className="relative my-3 rounded-2xl overflow-hidden shadow-sm group">
            {/* Visual Scenic Image */}
            <div className="relative w-full h-48 bg-gradient-to-t from-olive/70 via-sage/50 to-mutedBlue/30 flex items-center justify-center overflow-hidden">
              {/* Couple Silhouette Backdrop */}
              <div
                className="absolute inset-0 bg-cover bg-center filter contrast-95"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80')",
                  backgroundColor: '#8FAEAE',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              {/* Floating circular arrow action */}
              <button
                onClick={() =>
                  setActiveSlide((prev) => (prev + 1) % heroQuotes.length)
                }
                className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 text-textDark flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-all"
                aria-label="Next Quote"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Quotation below photo */}
            <div className="pt-3 pb-1 text-center">
              <p className="font-serif-heading italic text-base sm:text-lg text-textDark/90 px-3">
                {heroQuotes[activeSlide]}
              </p>

              {/* Carousel Pagination Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                {heroQuotes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlide === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Primary CTA Buttons */}
          <div className="mt-4 flex flex-col items-center gap-2.5">
            <Link
              href="/create"
              className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Mulai Tes Sekarang</span>
              <ArrowRight size={18} />
            </Link>

            {/* Join Room ID Button positioned directly below Mulai Tes Sekarang */}
            <button
              type="button"
              onClick={() => setShowJoinModal(true)}
              className="w-full py-3.5 px-6 rounded-full glass-card bg-white/45 text-textDark font-medium text-sm text-center border border-white/60 shadow-sm hover:bg-white/65 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Users size={16} className="text-olive" />
              <span>Join Room ID</span>
            </button>

            <div className="text-center mt-1">
              <p className="text-xs text-textDark/75 tracking-wide">
                30 Questions · 7 Dimensions · One Shared Report
              </p>
              <p className="text-[11px] text-textDark/65 mt-0.5">
                Full report only <span className="font-semibold text-textDark">Rp10.000</span> per couple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT YOU WILL DISCOVER (7 DIMENSIONS) */}
      <section className="px-5 py-6">
        <div className="rounded-[32px] glass-panel p-6 shadow-glass">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-textDark/70 font-semibold">
              7 Hubungan Kunci
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-medium text-textDark mt-1">
              Apa yang Akan Kalian Temukan?
            </h3>
            <p className="text-xs sm:text-sm text-textDark/80 mt-1.5">
              Refleksi komprehensif untuk memahami dinamika cinta, masa depan, dan keseharian.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-2xl glass-card p-4 flex items-start gap-3.5 glass-card-hover"
              >
                <div className="p-2.5 rounded-xl bg-white/40 shadow-sm shrink-0">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-serif-heading text-base font-semibold text-textDark">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-textDark/75 mt-0.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="px-5 py-6">
        <div className="rounded-[32px] glass-panel p-6 shadow-glass">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-textDark/70 font-semibold">
              Proses Sederhana
            </span>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-medium text-textDark mt-1">
              Cara Kerja TWOgether
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {steps.map((st, i) => (
              <div
                key={i}
                className="rounded-2xl glass-card p-4 flex items-start gap-4 relative overflow-hidden"
              >
                <span className="font-serif-heading text-2xl font-bold text-olive/80 shrink-0">
                  {st.step}
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-textDark">
                    {st.title}
                  </h4>
                  <p className="text-xs text-textDark/75 mt-1 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRUST & PRIVACY */}
      <section className="px-5 py-6">
        <div className="rounded-[32px] glass-panel p-6 shadow-glass text-center">
          <div className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center mx-auto mb-3 shadow-sm text-olive">
            <Lock size={22} />
          </div>
          <h3 className="font-serif-heading text-2xl font-medium text-textDark">
            Jawaban Kalian Bersifat Personal
          </h3>
          <p className="text-xs sm:text-sm text-textDark/80 mt-2 leading-relaxed">
            Kedua pasangan menjawab 30 pertanyaan secara independen. Jawaban perorangan
            tidak pernah ditampilkan kepada pasangan. Yang dibuka hanyalah skor keselarasan
            dan topik obrolan bermakna setelah pembayaran 1 kali Rp10.000.
          </p>

          <div className="mt-5 pt-4 border-t border-white/40 flex flex-col gap-2 text-left">
            <div className="flex items-center gap-2 text-xs text-textDark/85">
              <CheckCircle2 size={16} className="text-olive shrink-0" />
              <span>Privasi penuh & terenkripsi</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-textDark/85">
              <CheckCircle2 size={16} className="text-olive shrink-0" />
              <span>Bebas biaya sampai kedua pasangan selesai menjawab</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-textDark/85">
              <CheckCircle2 size={16} className="text-olive shrink-0" />
              <span>Hanya Rp10.000 untuk membuka laporan satu pasangan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA & FOOTER */}
      <section className="px-5 py-6 text-center">
        <div className="rounded-[32px] glass-panel p-8 shadow-glass flex flex-col items-center">
          <Sparkles size={28} className="text-olive mb-2" />
          <h3 className="font-serif-heading text-2xl sm:text-3xl font-medium text-textDark">
            Every great relationship starts with understanding.
          </h3>
          <p className="text-xs text-textDark/75 mt-2 mb-6 max-w-xs">
            Luangkan 5–8 menit bersama pasangan untuk membangun masa depan yang lebih kokoh.
          </p>

          <Link
            href="/create"
            className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Start Your Couple Test</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-textDark/60 flex flex-col gap-1.5">
          <div className="flex justify-center items-center gap-3">
            <Link href="/" className="hover:underline">About TWOgether</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:underline">Terms</Link>
          </div>
          <p>© {new Date().getFullYear()} TWOgether. Build Your Life Together.</p>
        </footer>
      </section>

      {/* Minimal Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[28px] glass-panel p-6 shadow-2xl relative bg-white/80">
            <button
              onClick={() => setShowMenuModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-textDark/70 hover:bg-black/5"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <img
                src="/temurasa-logo.png"
                alt="temurasa."
                className="h-7 w-auto object-contain"
              />
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                href="/create"
                onClick={() => setShowMenuModal(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-black/5 font-medium"
              >
                Mulai Tes Baru
              </Link>
              <Link
                href="/admin"
                onClick={() => setShowMenuModal(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-black/5 font-medium text-olive"
              >
                Admin Dashboard
              </Link>
              <a
                href="#how-it-works"
                onClick={() => setShowMenuModal(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-black/5"
              >
                Cara Kerja
              </a>
              <div className="pt-3 border-t border-black/10 text-xs text-textDark/60">
                Laporan lengkap hanya Rp10.000 per pasangan.
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Join Room Modal */}
      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  );
}
