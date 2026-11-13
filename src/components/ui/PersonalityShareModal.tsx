'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Share2,
  Download,
  Sparkles,
  Check,
  Copy,
  Heart,
  Compass,
} from 'lucide-react';
import { ArchetypeDefinition } from '@/lib/personality/types';

interface PersonalityShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  primaryType: ArchetypeDefinition;
  secondaryType: ArchetypeDefinition;
  testCode: string;
}

export function PersonalityShareModal({
  isOpen,
  onClose,
  userName,
  primaryType,
  secondaryType,
  testCode,
}: PersonalityShareModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/personality/result/${testCode}`
    : `https://www.temurasa.live/personality/result/${testCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Tipe Kepribadian Cinta: ${primaryType.title} — Temurasa`,
          text: `Aku baru saja mengikuti tes "Kenali Kepribadian Cintamu" di Temurasa! Tipe cintaku adalah ${primaryType.title} (${primaryType.indonesianTitle}).`,
          url: shareUrl,
        });
      } catch (err) {
        // Ignored or canceled by user
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-[32px] glass-panel bg-white/95 p-6 shadow-2xl relative flex flex-col gap-4 border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-textDark/70 hover:bg-black/5 transition-all"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-olive/15 text-olive text-[11px] font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Kartu Kepribadian Cinta</span>
          </div>
          <h3 className="font-serif-heading text-xl font-medium text-textDark">
            Bagikan Hasil Refleksimu
          </h3>
        </div>

        {/* The Visual Share Card */}
        <div
          ref={cardRef}
          className="rounded-[24px] p-6 text-center text-textDark relative overflow-hidden shadow-md border border-white/60"
          style={{
            background:
              'linear-gradient(145deg, rgba(240, 235, 214, 0.95) 0%, rgba(184, 197, 173, 0.85) 100%)',
          }}
        >
          {/* Top Logo & Watermark */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-serif italic text-xs tracking-wider text-textDark/70">
              temurasa.
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-olive bg-white/50 px-2 py-0.5 rounded-full">
              Kepribadian Cinta
            </span>
          </div>

          {/* User Name */}
          <p className="text-xs text-textDark/70 font-medium">Refleksi Cinta Milik</p>
          <h4 className="font-serif-heading text-lg font-semibold text-textDark mb-3">
            {userName}
          </h4>

          {/* Primary Type Badge */}
          <div className="my-3 py-4 px-3 rounded-2xl bg-white/70 border border-white/80 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-olive/15 flex items-center justify-center text-olive mb-2">
              <Heart size={22} className="fill-olive/20" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-textDark/60 font-semibold">
              Primary Archetype
            </span>
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-textDark mt-0.5">
              {primaryType.title}
            </h3>
            <span className="text-xs text-olive font-medium mt-0.5">
              {primaryType.indonesianTitle}
            </span>
            <p className="text-[11px] text-textDark/75 italic mt-2.5 max-w-xs leading-relaxed px-2">
              {primaryType.quote}
            </p>
          </div>

          {/* Secondary Type Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 text-[11px] font-medium text-textDark/85 border border-white/60">
            <Compass size={12} className="text-olive" />
            <span>Sentuhan: <strong>{secondaryType.title}</strong></span>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5 text-[10px] text-textDark/60 font-serif italic">
            “Menemukan titik temu di antara dua rasa.” · temurasa.live
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            onClick={handleNativeShare}
            className="w-full py-3.5 px-5 rounded-full bg-olive text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:bg-olive-light active:scale-[0.98] transition-all"
          >
            <Share2 size={16} />
            <span>Bagikan ke Media Sosial / WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-5 rounded-full bg-white/80 text-textDark font-medium text-sm border border-black/10 flex items-center justify-center gap-2 hover:bg-white active:scale-[0.98] transition-all"
          >
            {copied ? (
              <>
                <Check size={16} className="text-olive" />
                <span className="text-olive">Tautan Disalin!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Salin Tautan Hasil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
