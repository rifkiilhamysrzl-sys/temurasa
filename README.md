# Temurasa — Titik Temu di Antara Dua Rasa
> **"Sebuah perjalanan untuk saling mengenal lebih dalam, memahami perbedaan, menemukan kesamaan, dan perlahan menyelaraskan arah."**  
> *Ikut tes untuk menemukan titik temu di antara dua rasa.*

**Temurasa** adalah platform evaluasi dan refleksi kecocokan hubungan intim berbasis web mobile-first dengan desain editorial glassmorphic premium. Dua orang pasangan menjawab 30 pertanyaan refleksi di 7 pilar hubungan secara independen tanpa melihat jawaban satu sama lain, membandingkan perspektif, dan menerima laporan wawasan mendalam bersama.

---

## 🎨 Visual Identity & Desain Editorial
Aplikasi dirancang dengan estetika *lifestyle journal* yang tenang, dewasa, dan intim:
- **Palet Warna**:
  - Background Sage: `#9EAD91`
  - Muted Blue: `#8FAEAE`
  - Olive: `#777D4B`
  - Warm Cream: `#F0EBD6`
  - Soft White: `#F9F8F1`
  - Text Dark: `#333A2C`
- **Glassmorphism**: Panel kaca translusen (`rgba(255, 255, 255, 0.28)`), garis tepi halus putih (`rgba(255, 255, 255, 0.55)`), dan blur latar 20px.
- **Tipografi Editorial**: Huruf serif editorial (`Playfair Display` / `Cormorant Garamond`) untuk headline, kutipan, dan skor; huruf sans-serif bersih (`Inter`) untuk navigasi dan formulir.

---

## 💡 Model Monetisasi & Akses Pasangan
- **Buat Ruangan Pasangan (Couple Room)**: Gratis
- **Undang Pasangan (Invite Link & Room ID)**: Gratis
- **Jawab 30 Pertanyaan Refleksi**: Gratis untuk kedua pasangan
- **Buka Laporan Analisis Lengkap**: **IDR 10.000** sekali bayar per ruangan
- **Akses Bersama**: Cukup salah satu pasangan yang membayar; laporan otomatis terbuka untuk kedua pasangan.

---

## 📐 7 Dimensi Hubungan & 30 Pertanyaan
1. **Komunikasi (5 Pertanyaan)**: Keterbukaan dialog, check-in harian, penyampaian masukan, pemulihan kesalahpahaman, dan active listening.
2. **Finansial (5 Pertanyaan)**: Dana darurat pribadi, konsultasi pengeluaran besar, investasi bersama, transparansi utang, dan keseimbangan gaya hidup vs masa depan.
3. **Keluarga & Anak (4 Pertanyaan)**: Rencana anak, filosofi pengasuhan bersama, menjaga waktu berdua setelah memiliki anak, dan batasan sehat dengan keluarga besar.
4. **Gaya Hidup (4 Pertanyaan)**: Waktu berdua vs waktu sendiri, eksplorasi kuliner/traveling, ritme rutinitas harian, dan ruang untuk hobi pribadi.
5. **Visi Masa Depan (4 Pertanyaan)**: Target finansial 5–10 tahun, kesiapan relokasi karier, dukungan ambisi pasangan, dan gambaran masa tua bersama.
6. **Kebutuhan Emosional (4 Pertanyaan)**: Bahasa kasih verbal, perhatian pada hal-hal kecil harian, dukungan saat pasangan lelah/stres, dan merawat keintiman.
7. **Manajemen Konflik (4 Pertanyaan)**: Kerendahan hati meminta maaf, mencari solusi menang-menang (*win-win*), jeda sejenak saat emosi meninggi, dan menjaga argumen tetap sehat.

---

## 🧮 Formula Skor & Engine Rekomendasi
Untuk setiap pertanyaan berskala 1–5:
$$\text{Tingkat Keselarasan} = \frac{4 - |A - B|}{4} \times 100\%$$
- Selisih $|A - B| = 0 \implies 100\%$
- Selisih $|A - B| = 1 \implies 75\%$
- Selisih $|A - B| = 2 \implies 50\%$
- Selisih $|A - B| = 3 \implies 25\%$
- Selisih $|A - B| = 4 \implies 0\%$

**Skor Keseluruhan**: Rata-rata tidak berbobot dari ke-7 pilar dimensi, dibulatkan ke persentase terdekat.
**Personalized Recommendation Engine**: 70 aktivitas terkurasi dengan durasi, frekuensi, instruksi langkah-demi-langkah, dan manfaat nyata berdasarkan jawaban spesifik kedua pasangan.

---

## 🚀 Panduan Deploy ke Vercel (Production)

### 1. Prasyarat Database Serverless (PostgreSQL)
Vercel berjalan pada arsitektur *serverless functions* yang *stateless*. Untuk produksi, gunakan PostgreSQL terkelola gratis dari **Supabase** atau **Neon**:
1. Buat proyek baru di [supabase.com](https://supabase.com).
2. Di **Project Settings > Database**, salin **Connection String (Transaction Pooler - port 6543)**:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
   ```
3. Skrip otomatis `scripts/prepare-database.js` akan mendeteksi PostgreSQL, menyesuaikan schema Prisma, melakukan sinkronisasi tabel (`prisma db push`), dan memasukkan 30 pertanyaan secara otomatis saat build Vercel berjalan.

### 2. Konfigurasi Environment Variables di Vercel
Tambahkan variabel berikut pada menu **Project Settings > Environment Variables** di Vercel:

| Variabel | Keterangan | Contoh Nilai |
|---|---|---|
| `DATABASE_URL` | URL Database PostgreSQL Supabase / Neon | `postgresql://...` |
| `NEXT_PUBLIC_APP_URL` | Domain publik aplikasi Temurasa | `https://temurasa.vercel.app` atau `https://temurasa.love` |
| `MIDTRANS_SERVER_KEY` | Server Key dari Midtrans Dashboard | `Mid-server-...` (Live) atau `SB-Mid-...` (Sandbox) |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Client Key dari Midtrans Dashboard | `Mid-client-...` atau `SB-Mid-...` |
| `MIDTRANS_IS_PRODUCTION` | Mode Midtrans | `"true"` untuk Live, `"false"` untuk Sandbox |
| `ENABLE_PAYMENT_SIMULATOR` | Simulator pembayaran internal | `"false"` untuk produksi live, `"true"` untuk staging |
| `ADMIN_SECRET` | Kunci proteksi portal admin | `temurasa_rahasia_admin_2026` |

### 3. Deploy Melalui Vercel CLI atau GitHub
#### Opsi A: Hubungkan ke GitHub (Rekomendasi)
1. Buat repositori baru di GitHub.
2. Push kode lokal ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: release Temurasa production ready"
   git branch -M main
   git remote add origin https://github.com/username/temurasa.git
   git push -u origin main
   ```
3. Buka [vercel.com/new](https://vercel.com/new), pilih repositori GitHub Anda, masukkan Environment Variables di atas, dan klik **Deploy**.

#### Opsi B: Deploy Menggunakan Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 4. Konfigurasi Webhook Midtrans
Setelah deploy selesai, salin URL publik Vercel Anda dan daftarkan ke Midtrans:
- Masuk ke **Midtrans Dashboard > Settings > Configuration**
- Isi **Payment Notification URL**:
  `https://nama-proyek.vercel.app/api/payment/webhook`

---

## 🔒 Fitur Keamanan & Privasi
- **Privasi Jawaban**: Jawaban individual disimpan secara privat dan tidak pernah dibocorkan melalui respons API publik.
- **Token Akses Kriptografis**: Token acak 32-byte yang di-hash dengan SHA-256 di database.
- **Server-Side Report Unlock**: Laporan lengkap hanya di-generate jika `payment_status === 'paid'`.
- **Idempotent Webhooks**: Transaksi duplikat aman dari *double-spending* melalui tabel `payment_events`.
- **Rate Limiting**: Perlindungan terhadap spam pembuatan room dan transaksi pembayaran.
- **Security Headers**: Dilengkapi header perlindungan `X-Frame-Options`, `X-Content-Type-Options: nosniff`, dan `Referrer-Policy`.
- **SEO & Social Share Ready**: Dilengkapi OpenGraph preview dinamis, Twitter Card, `sitemap.xml`, `robots.txt`, dan custom 404 page.

---

## 🛡️ Admin Portal
- URL: `/admin`
- Memerlukan secret key yang diatur di variabel `ADMIN_SECRET`.
- Memantau metrik total ruangan, jumlah pasangan selesai, konversi pembayaran, total pendapatan, dan log transaksi.
