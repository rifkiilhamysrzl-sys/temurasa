import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-between p-6">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center my-8">
        <div className="w-full rounded-[32px] glass-panel p-8 text-center flex flex-col items-center border border-white/40 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-olive/15 text-olive flex items-center justify-center mb-6">
            <Compass size={32} />
          </div>

          <span className="text-xs font-semibold tracking-wider uppercase text-olive mb-2">
            404 • Halaman Belum Ditemukan
          </span>

          <h1 className="font-serif text-3xl font-normal text-textDark mb-3 tracking-tight">
            Tersesat Sejenak
          </h1>

          <p className="text-sm text-textDark/80 leading-relaxed max-w-xs mb-8">
            Jalan yang Anda tuju belum memiliki titik temu. Mari kembali ke ruang awal untuk memulai perjalanan berdua.
          </p>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white text-textDark font-medium text-sm shadow-md hover:bg-cream active:scale-[0.98] transition-all duration-200 border border-black/5"
          >
            <span>Kembali ke Beranda</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <footer className="text-center py-4">
        <p className="text-xs text-textDark/60 font-serif italic">
          &ldquo;Menemukan titik temu di antara dua rasa.&rdquo;
        </p>
      </footer>
    </div>
  );
}
