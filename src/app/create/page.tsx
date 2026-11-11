'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ArrowRight, Heart, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function CreateRoomPage() {
  const router = useRouter();
  const [yourName, setYourName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdData, setCreatedData] = useState<{
    roomCode: string;
    invitationToken: string;
    accessToken: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedYour = yourName.trim();
    const trimmedPartner = partnerName.trim();

    if (!trimmedYour || trimmedYour.length < 2) {
      setError('Mohon masukkan nama Anda (minimal 2 karakter).');
      return;
    }

    if (!trimmedPartner || trimmedPartner.length < 2) {
      setError('Mohon masukkan nama pasangan Anda (minimal 2 karakter).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yourName: trimmedYour,
          partnerName: trimmedPartner,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat couple room.');
      }

      // Store Participant A access token and session in localStorage
      localStorage.setItem(`twogether_token_${data.roomCode}`, data.accessToken);
      localStorage.setItem(`twogether_current_room`, data.roomCode);
      localStorage.setItem(`twogether_invitation_${data.roomCode}`, data.invitationToken);

      // Save created room in state so Room ID is immediately visible
      setCreatedData({
        roomCode: data.roomCode,
        invitationToken: data.invitationToken,
        accessToken: data.accessToken,
      });

      // Redirect to the dedicated invitation screen
      router.push(`/invite/${data.invitationToken}?created=true&code=${data.roomCode}`);
    } catch (err: any) {
      setError(err.message || 'Terjadi gangguan jaringan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (createdData) {
    return (
      <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
        <Header title="Temurasa" showBack backHref="/" />
        <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-3 relative overflow-hidden text-center">
          <div>
            <div className="w-14 h-14 rounded-full bg-olive/20 text-olive flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} />
            </div>
            <span className="text-xs uppercase tracking-widest text-textDark/70 font-semibold block mb-1">
              Ruangan Pasangan Aktif
            </span>
            <h2 className="font-serif-heading text-3xl font-medium text-textDark leading-tight mb-2">
              Ruangan Berhasil Dibuat!
            </h2>
            <p className="text-xs sm:text-sm text-textDark/80 mb-6">
              Simpan Room ID ini atau bagikan tautan kepada pasangan Anda.
            </p>

            <div className="p-5 rounded-2xl bg-white/60 border border-white/80 shadow-sm">
              <span className="text-[11px] uppercase tracking-widest text-textDark/60 font-semibold block mb-1">
                KODE RUANGAN (ROOM ID)
              </span>
              <div className="font-serif-heading text-4xl font-bold tracking-widest text-olive select-all my-1">
                {createdData.roomCode}
              </div>
              <p className="text-[11px] text-textDark/60 mt-1">
                Gunakan kode ini kapan pun untuk masuk kembali
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() =>
                router.push(
                  `/invite/${createdData.invitationToken}?created=true&code=${createdData.roomCode}`
                )
              }
              className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Tautan Undangan</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      {/* Top Header */}
      <Header title="Temurasa" showBack backHref="/" />

      {/* Main Glass Panel Form */}
      <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-3 relative overflow-hidden">
        <div>
          {/* Badge & Title */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-textDark/70 font-semibold">
              Langkah 1 dari 2
            </span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl font-medium text-textDark leading-tight">
            Let&apos;s Begin Together.
          </h2>
          <p className="text-xs sm:text-sm text-textDark/80 mt-2 leading-relaxed">
            Create your private space to discover how compatible you are.
          </p>

          {/* Error Notice */}
          {error && (
            <div className="mt-4 p-3.5 rounded-2xl bg-red-100/70 border border-red-200/80 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-textDark/80 mb-1.5 ml-1">
                Nama Anda <span className="text-olive">*</span>
              </label>
              <input
                type="text"
                placeholder="mis. Alex"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                maxLength={50}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-white/40 border border-white/60 text-sm text-textDark placeholder:text-textDark/40 focus:outline-none focus:bg-white/60 focus:border-olive transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textDark/80 mb-1.5 ml-1">
                Nama Pasangan Anda <span className="text-olive">*</span>
              </label>
              <input
                type="text"
                placeholder="mis. Sarah"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                maxLength={50}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-white/40 border border-white/60 text-sm text-textDark placeholder:text-textDark/40 focus:outline-none focus:bg-white/60 focus:border-olive transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textDark/80 mb-1.5 ml-1">
                Email Anda <span className="text-textDark/50 text-[11px]">(Opsional - untuk arsip laporan)</span>
              </label>
              <input
                type="email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-white/40 border border-white/60 text-sm text-textDark placeholder:text-textDark/40 focus:outline-none focus:bg-white/60 focus:border-olive transition-all shadow-sm"
              />
            </div>

            {/* Privacy note */}
            <div className="pt-2 flex items-start gap-2 text-[11px] text-textDark/70 leading-relaxed">
              <Sparkles size={14} className="text-olive shrink-0 mt-0.5" />
              <span>
                Ruangan bersifat privat dan aman. Kode unik dan tautan undangan akan dibuatkan secara otomatis.
              </span>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-textDark" />
                    <span>Membuat Ruangan...</span>
                  </>
                ) : (
                  <>
                    <span>Create Couple Room</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom subtle note */}
        <div className="mt-6 pt-4 border-t border-white/30 text-center text-xs text-textDark/60">
          Ruang privat berdua · Jawaban tersimpan aman dan terenkripsi
        </div>
      </div>
    </div>
  );
}
