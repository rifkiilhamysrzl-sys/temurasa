'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Users, ArrowRight, Loader2, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

function JoinPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get('code') || searchParams?.get('roomCode') || '';

  const [inputVal, setInputVal] = useState(initialCode);
  const [partnerName, setPartnerName] = useState('');
  const [step, setStep] = useState<'input' | 'join_name'>('input');
  const [resolvedRoomCode, setResolvedRoomCode] = useState('');
  const [inviterName, setInviterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If initialCode provided, automatically lookup room
  useEffect(() => {
    if (initialCode) {
      lookupRoom(initialCode);
    }
  }, [initialCode]);

  const lookupRoom = async (rawCode: string) => {
    const raw = rawCode.trim();
    if (!raw) return;

    // 1. Check if user pasted an invite URL
    const inviteMatch = raw.match(/\/invite\/([a-zA-Z0-9_-]+)/);
    if (inviteMatch && inviteMatch[1]) {
      router.push(`/invite/${inviteMatch[1]}`);
      return;
    }

    // 2. Check if user pasted a room URL
    const roomMatch = raw.match(/\/room\/(TWO-[a-zA-Z0-9_-]+)/i);
    if (roomMatch && roomMatch[1]) {
      router.push(`/room/${roomMatch[1].toUpperCase()}`);
      return;
    }

    // 3. Normalize Room Code (e.g. 52308 -> TWO-52308)
    let code = raw.toUpperCase();
    if (/^\d{4,6}$/.test(code)) {
      code = `TWO-${code}`;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/rooms/${code}`);
      const data = await res.json();

      if (!res.ok || !data.room) {
        setError(data.error || `Room ID "${code}" tidak ditemukan. Pastikan kodenya benar.`);
        return;
      }

      const room = data.room;
      const partA = room.participants?.find((p: any) => p.role === 'participant_a');
      const partB = room.participants?.find((p: any) => p.role === 'participant_b');

      if (partB) {
        router.push(`/room/${code}`);
        return;
      }

      setResolvedRoomCode(code);
      setInviterName(partA?.displayName || 'Pasangan Anda');
      setStep('join_name');
    } catch (err: any) {
      setError(err.message || 'Gagal memeriksa Room ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupRoom(inputVal);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = partnerName.trim();
    if (!name || name.length < 2) {
      setError('Silakan masukkan nama Anda (minimal 2 karakter).');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: resolvedRoomCode,
          yourName: name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal bergabung ke ruangan.');
      }

      if (typeof window !== 'undefined' && data.accessToken) {
        localStorage.setItem(`twogether_token_${resolvedRoomCode}`, data.accessToken);
        localStorage.setItem('twogether_current_token', data.accessToken);
        localStorage.setItem('twogether_current_role', 'participant_b');
      }

      router.push(`/assessment/${data.accessToken}`);
    } catch (err: any) {
      setError(err.message || 'Gagal bergabung ke ruangan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-6 pb-8">
      <Header title="Join Room" showBack backHref="/" />

      <div className="w-full flex-1 rounded-[32px] glass-panel p-6 sm:p-7 shadow-glass flex flex-col justify-between my-4 relative overflow-hidden">
        <div>
          {step === 'input' ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2.5 rounded-2xl bg-olive/15 text-olive">
                  <Users size={22} />
                </span>
                <h2 className="font-serif-heading text-2xl font-semibold text-textDark">
                  Join Room ID
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-textDark/80 mb-6 leading-relaxed">
                Masukkan <strong>Room ID</strong> dari pasanganmu untuk mulai menjawab 30 pertanyaan kecocokan hubungan.
              </p>

              {error && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-700 flex items-start gap-2 mb-5">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleLookupSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-textDark/80 block mb-1.5 uppercase tracking-wider">
                    Room ID atau Tautan Pasangan
                  </label>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => {
                      setInputVal(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Contoh: TWO-12345 atau tempel link..."
                    className="w-full py-4 px-4 rounded-2xl glass-card bg-white/70 border border-white/80 text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-olive/40 placeholder:text-textDark/40"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !inputVal.trim()}
                  className="w-full py-4 px-6 rounded-full bg-olive text-softWhite font-semibold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 hover:bg-olive-dark active:scale-[0.98] transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Lanjutkan</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-2.5 rounded-2xl bg-olive/15 text-olive">
                  <Sparkles size={22} />
                </span>
                <h2 className="font-serif-heading text-2xl font-semibold text-textDark">
                  Gabung ke Ruangan
                </h2>
              </div>
              <div className="p-4 rounded-2xl bg-olive/10 border border-olive/20 text-xs sm:text-sm text-textDark mb-5 leading-relaxed">
                Ruangan <strong>{resolvedRoomCode}</strong> ditemukan! Anda diundang oleh <strong>{inviterName}</strong>.
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-700 flex items-start gap-2 mb-5">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-textDark/80 block mb-1.5 uppercase tracking-wider">
                    Nama Panggilan Anda
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => {
                      setPartnerName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Masukkan nama panggilan Anda..."
                    className="w-full py-4 px-4 rounded-2xl glass-card bg-white/70 border border-white/80 text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-olive/40 placeholder:text-textDark/40"
                    autoFocus
                  />
                </div>

                <div className="flex items-start gap-2 text-xs text-textDark/70 py-1">
                  <CheckCircle2 size={16} className="text-olive shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Jawaban Anda dirahasiakan dan tidak akan terlihat oleh pasangan sampai kalian berdua selesai.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !partnerName.trim()}
                  className="w-full py-4 px-6 rounded-full bg-olive text-softWhite font-semibold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 hover:bg-olive-dark active:scale-[0.98] transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>Mulai Asesmen</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-full py-2.5 text-xs text-textDark/70 hover:text-textDark text-center"
                >
                  Ganti Room ID
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="text-center pt-6 border-t border-white/40">
          <p className="text-[11px] text-textDark/70">
            TWOgether · Build Your Life Together
          </p>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-olive" />
        </div>
      }
    >
      <JoinPageContent />
    </Suspense>
  );
}
