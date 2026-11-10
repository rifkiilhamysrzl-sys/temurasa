import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Menu, User, Share2 } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  backHref?: string;
  showShare?: boolean;
  onShare?: () => void;
  showMenu?: boolean;
  onMenu?: () => void;
  showProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'TWOgether',
  showBack = false,
  onBack,
  backHref,
  showShare = false,
  onShare,
  showMenu = false,
  onMenu,
  showProfile = false,
}) => {
  return (
    <header className="relative w-full px-6 pt-6 pb-2 flex items-center justify-between z-20">
      {/* Left Action */}
      <div className="w-10 flex items-center">
        {showBack ? (
          backHref ? (
            <Link
              href={backHref}
              className="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:text-textDark hover:bg-white/30 transition-all active:scale-95"
              aria-label="Kembali"
            >
              <ChevronLeft size={24} />
            </Link>
          ) : (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:text-textDark hover:bg-white/30 transition-all active:scale-95"
              aria-label="Kembali"
            >
              <ChevronLeft size={24} />
            </button>
          )
        ) : showMenu ? (
          <button
            onClick={onMenu}
            className="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:text-textDark hover:bg-white/30 transition-all active:scale-95"
            aria-label="Menu"
          >
            <Menu size={22} strokeWidth={1.8} />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Center Title or Brand Logo */}
      <div className="flex-1 flex items-center justify-center">
        {title === 'TWOgether' || title.toLowerCase() === 'temurasa' ? (
          <img
            src="/temurasa-logo.png"
            alt="temurasa."
            className="h-7 w-auto object-contain"
          />
        ) : (
          <h1 className="font-serif-heading text-xl sm:text-2xl font-semibold tracking-wide text-textDark">
            {title}
          </h1>
        )}
      </div>

      {/* Right Action */}
      <div className="w-10 flex items-center justify-end">
        {showShare ? (
          <button
            onClick={onShare}
            className="w-10 h-10 rounded-full flex items-center justify-center text-textDark/80 hover:text-textDark hover:bg-white/30 transition-all active:scale-95"
            aria-label="Bagikan"
          >
            <Share2 size={20} strokeWidth={1.8} />
          </button>
        ) : showProfile ? (
          <div
            className="w-9 h-9 rounded-full border border-white/60 bg-white/30 flex items-center justify-center text-textDark/80 shadow-sm"
            aria-label="Profil"
          >
            <User size={18} strokeWidth={1.8} />
          </div>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </header>
  );
};
