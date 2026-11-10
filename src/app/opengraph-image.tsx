import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Temurasa — Titik Temu di Antara Dua Rasa';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#9DAA98',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.45) 0%, rgba(142,158,138,0.95) 100%)',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '40px',
            padding: '60px 80px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            maxWidth: '1000px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '68px',
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#1F2922',
              letterSpacing: '-2px',
              marginBottom: '16px',
            }}
          >
            temurasa.
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#4B5842',
              marginBottom: '24px',
              letterSpacing: '1px',
            }}
          >
            MENEMUKAN TITIK TEMU DI ANTARA DUA RASA
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#2B352E',
              maxWidth: '750px',
              lineHeight: '1.5',
            }}
          >
            Sebuah perjalanan untuk saling mengenal lebih dalam, memahami perbedaan, menemukan kesamaan, dan perlahan menyelaraskan arah berdua.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
