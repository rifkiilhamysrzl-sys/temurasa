'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { getAppBaseUrl } from '@/lib/config';
import {
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Lock,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function RoomProgressDashboard() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params?.roomCode as string)?.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Retrieve stored token for this room if any
  const [myToken, setMyToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && roomCode) {
      const stored = localStorage.getItem(`twogether_token_${roomCode}`);
      setMyToken(stored);
    }
  }, [roomCode]);

  const fetchRoomStatus = async () => {
    try {
      const url = myToken
        ? `/api/rooms/${roomCode}?token=${myToken}`
        : `/api/rooms/${roomCode}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error('Gagal memuat status ruangan.');
      }

      const data = await res.json();
      setRoomData(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomCode) {
      fetchRoomStatus();
      // Poll every 5s if waiting for partner
      const interval = setInterval(fetchRoomStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [roomCode, myToken]);

  const handleCopyLink = () => {
    const inviteUrl = `${getAppBaseUrl()}/room/${roomCode}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6">
        <div className="rounded-[28px] glass-panel p-8 flex flex-col items-center gap-3 text-center">
          <Loader2 size={32} className="animate-spin text-olive" />
          <p className="text-sm text-textDark/80">Memuat status ruangan...</p>
        </div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
        <Header title="TWOgether" showBack backHref="/" />
        <div className="rounded-[32px] glass-panel p-7 text-center my-auto shadow-glass">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <h2 className="font-serif-heading text-2xl font-medium text-textDark">
            Ruangan Tidak Ditemukan
          </h2>
          <p className="text-xs sm:text-sm text-textDark/80 mt-2">
            {error || 'Kode ruangan tidak valid atau telah kedaluwarsa.'}
          </p>
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

  const participants = roomData.participants || [];
  const partA = participants.find((p: any) => p.role === 'participant_a');
  const partB = participants.find((p: any) => p.role === 'participant_b');
  const isBothCompleted = roomData.isBothCompleted;
  const isPaid = roomData.paymentStatus === 'paid';

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
      <Header title="Progress" showBack backHref="/" />

      <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-3 relative overflow-hidden">
        <div>
          {/* Room ID Badge & Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 border border-white/60 text-xs font-semibold text-textDark">
              <span>Room:</span>
              <span className="tracking-widest text-olive font-bold">{roomData.roomCode}</span>
            </div>

            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                isBothCompleted
                  ? 'bg-olive text-white'
                  : 'bg-white/40 text-textDark/80'
              }`}
            >
              {isBothCompleted ? 'Asesmen Selesai' : 'Sedang Berjalan'}
            </span>
          </div>

          <h2 className="font-serif-heading text-3xl font-medium text-textDark leading-tight">
            {isBothCompleted
              ? 'Your Couple Report Is Ready!'
              : 'Couple Progress Dashboard'}
          </h2>
          <p className="text-xs sm:text-sm text-textDark/80 mt-1.5 leading-relaxed">
            {isBothCompleted
              ? 'Kedua pasangan telah menyelesaikan 30 pertanyaan.'
              : 'Laporan bersama akan siap setelah kedua pasangan selesai menjawab.'}
          </p>

          {/* Side-by-Side Participants Cards */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {/* Participant A */}
            <div className="rounded-2xl glass-card p-4 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white/60 border border-white/80 flex items-center justify-center font-serif-heading font-bold text-olive text-lg shadow-sm mb-3">
                  {partA ? partA.displayName.charAt(0).toUpperCase() : 'A'}
                </div>
                <h4 className="font-semibold text-sm text-textDark truncate">
                  {partA?.displayName || 'Partner A'}
                </h4>
                <p className="text-[11px] text-textDark/60 mt-0.5">
                  {partA?.role === 'participant_a' ? 'Pembuat Ruangan' : 'Pasangan'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/40">
                {partA?.completionStatus === 'completed' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-olive font-medium">
                    <CheckCircle2 size={15} />
                    <span>30/30 Selesai</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-textDark/70 font-medium">
                    <Clock size={15} />
                    <span>
                      {partA ? `${partA.currentQuestionIndex}/30 Berjalan` : 'Belum Mulai'}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Participant B */}
            <div className="rounded-2xl glass-card p-4 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-white/60 border border-white/80 flex items-center justify-center font-serif-heading font-bold text-olive text-lg shadow-sm mb-3">
                  {partB ? partB.displayName.charAt(0).toUpperCase() : 'B'}
                </div>
                <h4 className="font-semibold text-sm text-textDark truncate">
                  {partB?.displayName || 'Menunggu Pasangan'}
                </h4>
                <p className="text-[11px] text-textDark/60 mt-0.5">
                  {partB ? 'Pasangan' : 'Belum Bergabung'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/40">
                {partB ? (
                  partB.completionStatus === 'completed' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-olive font-medium">
                      <CheckCircle2 size={15} />
                      <span>30/30 Selesai</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-textDark/70 font-medium">
                      <Clock size={15} />
                      <span>{partB.currentQuestionIndex}/30 Berjalan</span>
                    </span>
                  )
                ) : (
                  <button
                    onClick={handleCopyLink}
                    className="text-[11px] text-olive font-semibold flex items-center gap-1 hover:underline"
                  >
                    <span>{copied ? 'Tersalin!' : 'Undang Pasangan'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Reminder */}
          <div className="mt-5 rounded-2xl bg-white/30 border border-white/50 p-3.5 flex items-start gap-2.5 text-xs text-textDark/80">
            <Lock size={16} className="text-olive shrink-0 mt-0.5" />
            <span>
              Jawaban individual kalian tidak pernah diperlihatkan. Yang disajikan adalah hasil
              analisis keselarasan bersama.
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-col gap-2.5">
          {/* If both completed, show payment / view results */}
          {isBothCompleted ? (
            isPaid ? (
              <button
                onClick={() => router.push(`/report/${roomCode}`)}
                className="w-full py-4 px-6 rounded-full bg-olive text-white font-medium text-base text-center shadow-md hover:bg-olive-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Laporan Kecocokan</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => router.push(`/payment/${roomCode}`)}
                className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Cerita Lengkap Hubungan Kalian</span>
                <ArrowRight size={18} />
              </button>
            )
          ) : (
            // If current user has not completed, allow continuing
            myToken && (
              <button
                onClick={() => router.push(`/assessment/${myToken}?room=${roomCode}`)}
                className="w-full py-4 px-6 rounded-full bg-warmCream text-textDark font-medium text-base text-center shadow-md hover:bg-warmCream-light active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjutkan Asesmen Saya</span>
                <ArrowRight size={18} />
              </button>
            )
          )}

          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-6 rounded-full glass-card text-textDark/80 font-medium text-xs text-center hover:bg-white/40 transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check size={15} className="text-olive" /> : <Copy size={15} />}
            <span>{copied ? 'Tautan Ruangan Tersalin!' : 'Salin Tautan Ruangan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
