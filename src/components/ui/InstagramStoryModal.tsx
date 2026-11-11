'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Download,
  Sparkles,
  Check,
  Instagram,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import {
  renderStoryCardToCanvas,
  shareStoryImage,
  downloadCanvasImage,
  StoryVariant,
  StoryCardData,
} from '@/lib/storyCanvas';

interface InstagramStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  nameA: string;
  nameB: string;
  overallScore: number;
  topCategories: Array<{
    categoryName: string;
    score: number;
  }>;
  customQuote?: string;
  compatibilityTitle?: string;
  compatibilityDescription?: string;
}

export function InstagramStoryModal({
  isOpen,
  onClose,
  nameA,
  nameB,
  overallScore,
  topCategories,
  customQuote,
  compatibilityTitle,
  compatibilityDescription,
}: InstagramStoryModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<StoryVariant>('editorial');
  const [isRendering, setIsRendering] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const sanitizedNames = `${nameA.replace(/[^a-zA-Z0-9]/g, '')}-${nameB.replace(/[^a-zA-Z0-9]/g, '')}`.toLowerCase();
  const filename = `temurasa-${sanitizedNames || 'couple'}-story.png`;

  // Draw card whenever variant changes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsRendering(true);

    const storyData: StoryCardData = {
      nameA,
      nameB,
      overallScore,
      topCategories,
      customQuote,
      compatibilityTitle,
      compatibilityDescription,
      domain: typeof window !== 'undefined' ? window.location.host : 'temurasa.love',
    };

    const timer = setTimeout(async () => {
      if (canvasRef.current && isMounted) {
        try {
          await renderStoryCardToCanvas(canvasRef.current, storyData, selectedVariant);
        } catch (err) {
          console.error('Failed to render story canvas:', err);
        } finally {
          if (isMounted) setIsRendering(false);
        }
      }
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, selectedVariant, nameA, nameB, overallScore, topCategories, customQuote, compatibilityTitle, compatibilityDescription]);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!canvasRef.current) return;
    setIsSharing(true);
    setShareNotice(null);

    const shareTitle = `Temurasa: ${nameA} & ${nameB}`;
    const shareText = `Kecocokan kami di Temurasa mencapai ${overallScore}%! "${compatibilityTitle || ''}". Lihat cerita kami:`;

    const res = await shareStoryImage(canvasRef.current, filename, shareTitle, shareText);
    setIsSharing(false);

    if (res.sharedNatively) {
      setShareNotice('Berhasil membuka menu bagikan. Pilih Instagram Story untuk langsung memposting!');
    } else {
      setShareNotice(
        'Gambar Story (1080x1920) berhasil disimpan ke galeri! Buka aplikasi Instagram di ponsel, pilih Cerita Anda (Story), lalu unggah gambar ini.'
      );
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasImage(canvasRef.current, filename);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-[32px] glass-panel bg-white/95 p-5 sm:p-6 shadow-2xl relative text-textDark border border-white/60 my-auto animate-fadeIn max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5 shrink-0">
          <div>
            <h3 className="font-serif-heading text-lg sm:text-xl font-semibold text-textDark flex items-center gap-2">
              <Instagram size={20} className="text-olive" />
              Instagram Story Card
            </h3>
            <p className="text-[11px] text-textDark/70">
              Format 9:16 (1080 x 1920 px) resolusi tinggi
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-textDark/70 hover:bg-black/5 transition"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto py-3 space-y-4 pr-1">
          {/* Design Variant Switcher (Requirement 3) */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-textDark/70 block mb-1.5">
              Pilih Gaya Desain:
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedVariant('connections')}
                className={`py-2 px-1 rounded-xl text-center font-medium transition ${
                  selectedVariant === 'connections'
                    ? 'bg-warmCream text-textDark font-semibold shadow-sm'
                    : 'text-textDark/70 hover:text-textDark'
                }`}
              >
                Pilar Kekuatan
              </button>
              <button
                type="button"
                onClick={() => setSelectedVariant('editorial')}
                className={`py-2 px-1 rounded-xl text-center font-medium transition ${
                  selectedVariant === 'editorial'
                    ? 'bg-warmCream text-textDark font-semibold shadow-sm'
                    : 'text-textDark/70 hover:text-textDark'
                }`}
              >
                Minimal Editorial
              </button>
              <button
                type="button"
                onClick={() => setSelectedVariant('quote')}
                className={`py-2 px-1 rounded-xl text-center font-medium transition ${
                  selectedVariant === 'quote'
                    ? 'bg-warmCream text-textDark font-semibold shadow-sm'
                    : 'text-textDark/70 hover:text-textDark'
                }`}
              >
                Kutipan Relasi
              </button>
            </div>
          </div>

          {/* 9:16 Canvas Preview */}
          <div className="relative mx-auto w-full max-w-[260px] aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 bg-sage/20 flex items-center justify-center">
            {isRendering && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
                <Loader2 size={24} className="animate-spin text-olive" />
                <span className="text-[10px] font-medium text-textDark/70">Merender Story...</span>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain block"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Feedback Notices */}
          {shareNotice && (
            <div className="p-3 rounded-2xl bg-olive/10 border border-olive/20 text-xs text-textDark flex items-start gap-2 animate-fadeIn">
              <Sparkles size={16} className="text-olive shrink-0 mt-0.5" />
              <p className="leading-snug">{shareNotice}</p>
            </div>
          )}

          {/* Privacy Note (Requirement 6) */}
          <div className="p-2.5 rounded-xl bg-black/5 text-[10px] text-textDark/75 flex items-start gap-2">
            <ShieldCheck size={14} className="text-olive shrink-0 mt-0.5" />
            <span>
              <strong>Privasi Terjaga:</strong> Hanya menampilkan nama panggilan, skor keselarasan, dan pilar kekuatan umum. Jawaban privat dan rincian sensitif tidak disertakan.
            </span>
          </div>
        </div>

        {/* Action Buttons (Requirement 1 & 4) */}
        <div className="pt-3 border-t border-black/5 flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            disabled={isSharing || isRendering}
            className="w-full py-3.5 px-5 rounded-full bg-olive text-softWhite font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:bg-olive-dark active:scale-[0.98] transition disabled:opacity-50"
          >
            {isSharing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Share2 size={16} />
            )}
            <span>Bagikan ke Instagram Story</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isRendering}
            className="w-full py-3 px-5 rounded-full bg-warmCream text-textDark font-medium text-xs sm:text-sm border border-warmCream-dark/30 shadow-sm flex items-center justify-center gap-2 hover:bg-warmCream-light active:scale-[0.98] transition"
          >
            {downloadSuccess ? (
              <Check size={16} className="text-olive" />
            ) : (
              <Download size={16} />
            )}
            <span>{downloadSuccess ? 'Tersimpan ke Galeri!' : 'Unduh Gambar (1080x1920)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
