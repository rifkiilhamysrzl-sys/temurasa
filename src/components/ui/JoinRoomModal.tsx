'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, Loader2, Users, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const router = useRouter();
  const [inputVal, setInputVal] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [step, setStep] = useState<'input' | 'join_name'>('input');
  const [resolvedRoomCode, setResolvedRoomCode] = useState('');
  const [inviterName, setInviterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setInputVal('');
    setPartnerName('');
    setStep('input');
    setResolvedRoomCode('');
    setInviterName('');
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) {
      setError('Silakan masukkan Room ID atau link undangan.');
      return;
    }

    setError(null);

    // 1. Check if user pasted an invite URL or invite token
    const inviteMatch = raw.match(/\/invite\/([a-zA-Z0-9_-]+)/);
    if (inviteMatch && inviteMatch[1]) {
      handleReset();
      router.push(`/invite/${inviteMatch[1]}`);
      return;
    }

    // 2. Check if user pasted a room URL
    const roomMatch = raw.match(/\/room\/(TWO-[a-zA-Z0-9_-]+)/i);
    if (roomMatch && roomMatch[1]) {
      handleReset();
      router.push(`/room/${roomMatch[1].toUpperCase()}`);
      return;
    }

    // 3. Normalize Room Code (e.g. 52308 -> TWO-52308 or TWO 52308 -> TWO-52308)
    let code = raw.replace(/\s+/g, '-').toUpperCase();
    if (!code.startsWith('TWO-') && /^\d{4,6}$/.test(code)) {
      code = `TWO-${code}`;
    }

    if (!code.startsWith('TWO-')) {
      // If it looks like a 32+ hex/alphanumeric token
      if (/^[a-fA-F0-9]{32,}$/.test(raw)) {
        handleReset();
        router.push(`/invite/${raw}`);
        return;
      }
    }

    // 4. Verify room with API
    try {
      setLoading(true);
      const res = await fetch(`/api/rooms/${code}`);
      const data = await res.json();

      const room = data.room || (data.roomCode ? data : null);

      if (!res.ok || !room) {
        setError(data.error || `Room ID "${code}" tidak ditemukan. Pastikan kodenya benar.`);
        return;
      }

      const partA = room.participants?.find((p: any) => p.role === 'participant_a');
      const partB = room.participants?.find((p: any) => p.role === 'participant_b');

      if (partB) {
        // Room already has both participants, take them to the room status
        handleReset();
        router.push(`/room/${code}`);
        return;
      }

      // Room is waiting for partner B! Show name input step
      setResolvedRoomCode(code);
      setInviterName(partA?.displayName || 'Pasangan Anda');
      setStep('join_name');
    } catch (err: any) {
      setError(err.message || 'Gagal memeriksa Room ID.');
    } finally {
      setLoading(false);
    }
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

      // Save token to localStorage for seamless session resume
      if (typeof window !== 'undefined' && data.accessToken) {
        localStorage.setItem(`twogether_token_${resolvedRoomCode}`, data.accessToken);
        localStorage.setItem('twogether_current_token', data.accessToken);
        localStorage.setItem('twogether_current_role', 'participant_b');
        localStorage.setItem('twogether_current_room', resolvedRoomCode);
      }

      handleReset();
      // Redirect directly to the assessment
      router.push(`/assessment/${data.accessToken}`);
    } catch (err: any) {
      setError(err.message || 'Gagal bergabung ke ruangan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-sm rounded-[32px] glass-panel bg-white/95 p-6 shadow-2xl relative text-textDark border border-white/60 my-auto">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-textDark/70 hover:bg-black/5 transition"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {step === 'input' ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-olive/15 text-olive">
                <Users size={18} />
              </span>
              <h3 className="font-serif-heading text-xl font-semibold text-textDark">
                Join Room ID
              </h3>
            </div>
            <p className="text-xs text-textDark/75 mb-4 leading-relaxed">
              Masukkan <strong>Room ID</strong> (contoh: <code>TWO-52308</code>) atau tempel tautan undangan yang dibagikan oleh pasanganmu.
            </p>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 flex items-start gap-2 mb-4">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Lookup Form */}
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-textDark/80 block mb-1.5">
                  Room ID atau Link Undangan
                </label>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Contoh: TWO-12345 atau tempel link..."
                  className="w-full py-3.5 px-4 rounded-2xl glass-card bg-white/70 border border-white/80 text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-olive/40 placeholder:text-textDark/40"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || !inputVal.trim()}
                className="w-full py-3.5 px-5 rounded-full bg-olive text-softWhite font-semibold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-olive-dark active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Lanjutkan</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Step 2: Name Input for Joining */}
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-olive/15 text-olive">
                <Sparkles size={18} />
              </span>
              <h3 className="font-serif-heading text-xl font-semibold text-textDark">
                Gabung Ruangan
              </h3>
            </div>
            <div className="p-3 rounded-2xl bg-olive/10 border border-olive/20 text-xs text-textDark mb-4 leading-relaxed">
              Ruangan <strong>{resolvedRoomCode}</strong> ditemukan! Anda diundang oleh <strong>{inviterName}</strong>.
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 flex items-start gap-2 mb-4">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-textDark/80 block mb-1.5">
                  Nama Panggilan Anda
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => {
                    setPartnerName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Masukkan nama Anda..."
                  className="w-full py-3.5 px-4 rounded-2xl glass-card bg-white/70 border border-white/80 text-textDark text-sm focus:outline-none focus:ring-2 focus:ring-olive/40 placeholder:text-textDark/40"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-textDark/70">
                <CheckCircle2 size={14} className="text-olive shrink-0" />
                <span>Jawaban 30 pertanyaan Anda akan dijaga privat hingga kedua pihak selesai.</span>
              </div>

              <button
                type="submit"
                disabled={loading || !partnerName.trim()}
                className="w-full py-3.5 px-5 rounded-full bg-olive text-softWhite font-semibold text-sm shadow-md flex items-center justify-center gap-2 hover:bg-olive-dark active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Mulai Asesmen</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-full py-2 text-xs text-textDark/70 hover:text-textDark text-center"
              >
                Ganti Room ID
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
