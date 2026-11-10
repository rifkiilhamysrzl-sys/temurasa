'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { getAppBaseUrl } from '@/lib/config';
import {
  Copy,
  Check,
  Share2,
  Heart,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  Loader2,
  Users,
  Shield,
} from 'lucide-react';

function InviteJoinContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = params?.token as string;
  const isCreatedByMe = searchParams?.get('created') === 'true';
  const queryRoomCode = searchParams?.get('code') || '';

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [partnerJoinName, setPartnerJoinName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [roomData, setRoomData] = useState<{
    roomCode: string;
    inviterName: string;
    participantBName?: string;
    isFull: boolean;
    isActive: boolean;
  } | null>(null);

  // Derive invite URL
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    setOrigin(getAppBaseUrl());
  }, []);

  const inviteUrl = origin ? `${origin}/invite/${token}` : `/invite/${token}`;

  // Check invitation and room status on load
  useEffect(() => {
    async function checkInvitation() {
      try {
        setPageLoading(true);
        // If room code is known from query, fetch room info directly
        const targetCode = queryRoomCode;
        if (targetCode) {
          const res = await fetch(`/api/rooms/${targetCode}`);
          if (res.ok) {
            const data = await res.json();
            const partA = data.participants.find((p: any) => p.role === 'participant_a');
            const partB = data.participants.find((p: any) => p.role === 'participant_b');
            setRoomData({
              roomCode: data.roomCode,
              inviterName: partA?.displayName || 'Pasangan Anda',
              participantBName: partB?.displayName,
              isFull: data.isFullyJoined,
              isActive: data.status === 'active',
            });
            setPageLoading(false);
            return;
          }
        }

        // Otherwise attempt lightweight query or placeholder
        setRoomData({
          roomCode: queryRoomCode || 'ROOM',
          inviterName: 'Pasangan Anda',
          isFull: false,
          isActive: true,
        });
      } catch (err) {
        console.error('Failed to load room info:', err);
      } finally {
        setPageLoading(false);
      }
    }

    if (token) {
      checkInvitation();
    }
  }, [token, queryRoomCode]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Hai! Aku baru saja membuat sesi refleksi Temurasa untuk kita berdua.\n\nYuk luangkan waktu untuk menjawab 30 pertanyaan refleksi dan temukan titik temu di antara dua rasa kita.\n\nGabung di sini:\n${inviteUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Temurasa — Titik Temu di Antara Dua Rasa',
          text: `Hai! Aku baru saja membuat sesi refleksi Temurasa untuk kita berdua. Mari jawab 30 pertanyaan bersama.`,
          url: inviteUrl,
        });
      } catch (e) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = partnerJoinName.trim();
    if (!name || name.length < 2) {
      setError('Mohon masukkan nama Anda (minimal 2 karakter).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationToken: token,
          yourName: name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal bergabung ke dalam ruangan.');
      }

      // Save participant B token
      localStorage.setItem(`twogether_token_${data.roomCode}`, data.accessToken);
      localStorage.setItem(`twogether_current_room`, data.roomCode);

      // Redirect to assessment intro
      router.push(`/assessment/${data.accessToken}?intro=true&room=${data.roomCode}`);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat bergabung.');
    } finally {
      setLoading(false);
    }
  };

  const myToken = typeof window !== 'undefined' && queryRoomCode 
    ? localStorage.getItem(`twogether_token_${queryRoomCode}`) 
    : null;

  if (pageLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3 text-center">
          <Loader2 size={28} className="animate-spin text-olive" />
          <p className="text-sm text-textDark/80">Memuat ruangan...</p>
        </div>
      </div>
    );
  }

  // State: Room is already full and current user is not part of it
  if (roomData?.isFull && !isCreatedByMe && !myToken) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
        <Header title="TWOgether" showBack backHref="/" />
        <div className="rounded-[32px] glass-panel p-7 text-center my-auto shadow-glass">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-red-600">
            <Users size={24} />
          </div>
          <h2 className="font-serif-heading text-2xl font-medium text-textDark">
            Ruangan Sudah Terisi Penuh
          </h2>
          <p className="text-xs sm:text-sm text-textDark/80 mt-2 leading-relaxed">
            Ruangan ini sudah memiliki dua pasangan aktif. Anda dapat membuat ruangan baru bersama pasangan Anda.
          </p>
          <button
            onClick={() => router.push('/create')}
            className="mt-6 w-full py-3.5 px-6 rounded-full bg-warmCream text-textDark font-medium text-sm shadow-md"
          >
            Buat Ruangan Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      <Header
        title="TWOgether"
        showBack
        backHref={queryRoomCode ? `/room/${queryRoomCode}` : '/'}
      />

      <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-3 relative overflow-hidden">
        {/* VIEW A: CREATOR VIEW (Inviting Partner) */}
        {isCreatedByMe ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-textDark/70 font-semibold">
                Undangan Siap
              </span>
            </div>

            <h2 className="font-serif-heading text-3xl font-medium text-textDark leading-tight">
              Your Couple Room Is Ready!
            </h2>
            <p className="text-xs sm:text-sm text-textDark/80 mt-1.5 leading-relaxed">
              Invite your partner to complete the assessment with you.
            </p>

            {/* Room ID Badge */}
            {queryRoomCode && (
              <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full bg-white/40 border border-white/60 text-xs font-semibold text-textDark">
                <span>Room ID:</span>
                <span className="tracking-widest text-olive font-bold">{queryRoomCode}</span>
              </div>
            )}

            {/* Invitation Link Box */}
            <div className="mt-5 rounded-2xl bg-white/40 border border-white/60 p-4 shadow-sm">
              <label className="block text-[11px] uppercase tracking-wider text-textDark/70 font-medium mb-1.5">
                Tautan Undangan Privat
              </label>
              <div className="flex items-center gap-2 bg-white/50 rounded-xl px-3 py-2.5 border border-white/70 overflow-hidden">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="bg-transparent text-xs text-textDark flex-1 outline-none select-all font-mono"
                />
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg hover:bg-white/60 text-textDark/80 transition-all"
                  aria-label="Salin Link"
                  title="Salin Link"
                >
                  {copied ? <Check size={16} className="text-olive" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 mt-3">
                <button
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-textDark text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-[#25D366]/30 transition-all active:scale-95"
                >
                  <MessageCircle size={15} className="text-[#128C7E]" />
                  <span>Kirim WhatsApp</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="py-2.5 px-3 rounded-xl bg-white/50 border border-white/70 text-textDark text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/70 transition-all active:scale-95"
                >
                  <Share2 size={15} />
                  <span>{copied ? 'Tersalin!' : 'Bagikan Link'}</span>
                </button>
              </div>
            </div>

            {/* Waiting Status Card */}
            <div className="mt-5 rounded-2xl glass-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-olive/15 flex items-center justify-center text-olive shrink-0">
                <Users size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-textDark">
                  Menunggu Pasangan Bergabung...
                </p>
                <p className="text-[11px] text-textDark/70 mt-0.5">
                  Anda bisa mulai menjawab sekarang atau menunggu pasangan masuk.
                </p>
              </div>
            </div>

            {/* Start My Assessment Button */}
            <div className="mt-6 flex flex-col gap-2.5">
              {myToken && queryRoomCode && (
                <button
                  onClick={() =>
                    router.push(
                      `/assessment/${myToken}?intro=true&room=${queryRoomCode}`
                    )
                  }
                  className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Mulai Jawaban Saya</span>
                  <ArrowRight size={18} />
                </button>
              )}

              {queryRoomCode && (
                <button
                  onClick={() => router.push(`/room/${queryRoomCode}`)}
                  className="w-full py-3 px-6 rounded-full glass-card text-textDark/80 font-medium text-xs text-center hover:bg-white/40 transition-all"
                >
                  Buka Dashboard Ruangan
                </button>
              )}
            </div>
          </div>
        ) : (
          /* VIEW B: PARTNER B JOIN FLOW */
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-olive" />
              <span className="text-xs uppercase tracking-widest text-textDark/70 font-semibold">
                Undangan Pasangan
              </span>
            </div>

            <h2 className="font-serif-heading text-3xl font-medium text-textDark leading-tight">
              {roomData?.inviterName || 'Pasangan Anda'} mengundangmu!
            </h2>
            <p className="text-xs sm:text-sm text-textDark/80 mt-1.5 leading-relaxed">
              Join this private space and discover how your perspectives align.
            </p>

            {roomData?.roomCode && (
              <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full bg-white/40 border border-white/60 text-xs font-semibold text-textDark">
                <span>Room ID:</span>
                <span className="tracking-widest text-olive font-bold">{roomData.roomCode}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3.5 rounded-2xl bg-red-100/70 border border-red-200/80 text-red-800 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleJoin} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-textDark/80 mb-1.5 ml-1">
                  Nama Anda <span className="text-olive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda..."
                  value={partnerJoinName}
                  onChange={(e) => setPartnerJoinName(e.target.value)}
                  maxLength={50}
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/40 border border-white/60 text-sm text-textDark placeholder:text-textDark/40 focus:outline-none focus:bg-white/60 focus:border-olive transition-all shadow-sm"
                />
              </div>

              <div className="rounded-2xl bg-white/30 p-3.5 border border-white/50 text-[11px] text-textDark/75 flex items-start gap-2">
                <Shield size={15} className="text-olive shrink-0 mt-0.5" />
                <span>
                  Jawaban Anda bersifat rahasia dan tidak akan dilihat langsung oleh pasangan.
                  Kalian berdua akan menerima laporan rangkuman bersama.
                </span>
              </div>

              <div className="mt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-textDark" />
                      <span>Bergabung ke Ruangan...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Couple Room</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/30 text-center text-xs text-textDark/60">
          TWOgether · Build Your Life Together
        </div>
      </div>
    </div>
  );
}

export default function InviteJoinPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-6">
          <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-olive" />
            <p className="text-sm text-textDark/80">Memuat undangan...</p>
          </div>
        </div>
      }
    >
      <InviteJoinContent />
    </Suspense>
  );
}
