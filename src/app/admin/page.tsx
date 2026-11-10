'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import {
  Users,
  CreditCard,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  FileText,
  Search,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [secret, setSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'payments' | 'questions'>('overview');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!secret) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/metrics?secret=${encodeURIComponent(secret)}`);
      if (!res.ok) {
        throw new Error('Kunci rahasia admin salah atau akses ditolak.');
      }

      const json = await res.json();
      setData(json);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Gagal masuk.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-6">
        <Header title="TWOgether Admin" showBack backHref="/" />

        <div className="w-full flex-1 rounded-[32px] glass-panel p-7 shadow-glass flex flex-col justify-between my-auto max-h-[460px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-olive/15 flex items-center justify-center mx-auto mb-3 text-olive">
              <Lock size={22} />
            </div>

            <h2 className="font-serif-heading text-2xl font-medium text-textDark text-center">
              Protected Admin Portal
            </h2>
            <p className="text-xs text-textDark/75 text-center mt-1">
              Masukkan admin secret key untuk mengakses analitik dan manajemen.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-100/70 border border-red-200/80 text-red-800 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-textDark/80 mb-1 ml-1">
                  Admin Secret Key
                </label>
                <input
                  type="password"
                  placeholder="Masukkan admin secret..."
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/70 text-sm focus:outline-none focus:border-olive shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full py-3.5 rounded-full bg-warmCream text-textDark font-medium text-sm shadow-md hover:bg-warmCream-light active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <span>Masuk Dashboard</span>}
              </button>
            </form>
          </div>

          <p className="text-[11px] text-center text-textDark/50">
            Akses dibatasi hanya untuk pengelola resmi TWOgether.
          </p>
        </div>
      </div>
    );
  }

  const m = data?.metrics || {};

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between px-5 pt-4 pb-8">
      <Header title="TWOgether Admin" showBack backHref="/" />

      <div className="w-full flex-1 rounded-[32px] glass-panel p-5 sm:p-6 shadow-glass my-2 flex flex-col gap-5 overflow-hidden">
        {/* Top Segmented Tabs */}
        <div className="w-full p-1 rounded-2xl glass-card flex items-center justify-between text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-white/70 font-semibold shadow-sm' : 'text-textDark/70'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'rooms' ? 'bg-white/70 font-semibold shadow-sm' : 'text-textDark/70'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'payments' ? 'bg-white/70 font-semibold shadow-sm' : 'text-textDark/70'
            }`}
          >
            Transaksi
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'questions' ? 'bg-white/70 font-semibold shadow-sm' : 'text-textDark/70'
            }`}
          >
            30 Soal
          </button>
        </div>

        {/* 1. OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl glass-card p-4">
                <span className="text-[11px] text-textDark/70 uppercase tracking-wider block">Total Rooms</span>
                <span className="font-serif-heading text-2xl font-bold text-textDark">{m.totalRooms}</span>
              </div>
              <div className="rounded-2xl glass-card p-4">
                <span className="text-[11px] text-textDark/70 uppercase tracking-wider block">Total Peserta</span>
                <span className="font-serif-heading text-2xl font-bold text-textDark">{m.totalParticipants}</span>
              </div>
              <div className="rounded-2xl glass-card p-4">
                <span className="text-[11px] text-textDark/70 uppercase tracking-wider block">Asesmen Selesai</span>
                <span className="font-serif-heading text-2xl font-bold text-olive">{m.completedRooms}</span>
              </div>
              <div className="rounded-2xl glass-card p-4">
                <span className="text-[11px] text-textDark/70 uppercase tracking-wider block">Ruangan Bayar</span>
                <span className="font-serif-heading text-2xl font-bold text-olive">{m.paidRooms}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white/50 border border-white/70 p-4 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-textDark/70 block">Total Pendapatan Terkumpul</span>
                <span className="font-serif-heading text-2xl font-bold text-textDark">
                  Rp {m.totalRevenue?.toLocaleString('id-ID')}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-olive/15 text-olive">
                Konversi: {m.conversionRate}%
              </span>
            </div>
          </div>
        )}

        {/* 2. RECENT ROOMS */}
        {activeTab === 'rooms' && (
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[500px] pr-1">
            <span className="text-xs font-semibold text-textDark">Daftar Ruangan Terkini</span>
            {data?.recentRooms?.map((r: any) => (
              <div key={r.id} className="rounded-xl glass-card p-3 text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-olive">{r.roomCode}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    r.paymentStatus === 'paid' ? 'bg-olive/20 text-olive' : 'bg-black/5 text-textDark/70'
                  }`}>
                    {r.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM BAYAR'}
                  </span>
                </div>
                <div className="text-textDark/80 flex items-center gap-2">
                  <span>Pasangan:</span>
                  <span className="font-medium">
                    {r.participants?.map((p: any) => p.displayName).join(' & ') || '1 Orang'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. PAYMENTS LOG */}
        {activeTab === 'payments' && (
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[500px] pr-1">
            <span className="text-xs font-semibold text-textDark">Catatan Transaksi</span>
            {data?.recentPayments?.length === 0 ? (
              <p className="text-xs text-textDark/60 py-4 text-center">Belum ada transaksi.</p>
            ) : (
              data?.recentPayments?.map((pay: any) => (
                <div key={pay.id} className="rounded-xl glass-card p-3 text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-textDark font-semibold">{pay.transactionId}</span>
                    <span className="font-bold text-olive">Rp {pay.amount?.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-textDark/70">
                    <span>Room: {pay.room?.roomCode}</span>
                    <span className="capitalize">{pay.paymentStatus}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. QUESTIONS AUDIT */}
        {activeTab === 'questions' && (
          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[500px] pr-1">
            <span className="text-xs font-semibold text-textDark">30 Pertanyaan Aktif</span>
            {data?.questions?.map((q: any) => (
              <div key={q.id} className="rounded-xl glass-card p-3 text-xs">
                <div className="flex items-center justify-between text-textDark/60 text-[10px] uppercase font-bold mb-1">
                  <span>{q.questionCode} · {q.category?.categoryName}</span>
                  <span>No. {q.questionOrder}</span>
                </div>
                <p className="text-textDark font-medium leading-relaxed">{q.questionText}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
