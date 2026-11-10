export interface ChallengeDayActivity {
  day: number;
  title: string;
  description: string;
  duration: string;
  outcome: string;
}

export interface ChallengeWeek {
  week: number;
  theme: string;
  description: string;
  activities: ChallengeDayActivity[];
}

export function generateThirtyDayChallenge(
  lowestCategories: string[],
  nameA: string,
  nameB: string
): ChallengeWeek[] {
  // Check focus areas
  const focusOnComm = lowestCategories.includes('communication') || lowestCategories.includes('conflict');
  const focusOnFin = lowestCategories.includes('financial') || lowestCategories.includes('future');
  const focusOnLife = lowestCategories.includes('lifestyle') || lowestCategories.includes('family');

  const weeks: ChallengeWeek[] = [
    // WEEK 1: KOMUNIKASI & SALING MEMAHAMI
    {
      week: 1,
      theme: 'Minggu 1: Komunikasi & Saling Memahami',
      description: 'Membangun kebiasaan mendengar aktif, menurunkan asumsi, dan memperjelas sinyal harian.',
      activities: [
        {
          day: 1,
          title: 'Ritual 15 Menit Bebas Gawai',
          description: `Duduk berdua di tempat tenang tanpa layar gawai. ${nameA} dan ${nameB} saling menceritakan satu hal yang paling disyukuri hari ini.`,
          duration: '15 Menit',
          outcome: 'Merasakan kembali kehadiran emosional pasangan tanpa distraksi notifikasi.',
        },
        {
          day: 3,
          title: 'Teknik "Dengar Dahulu, Solusi Nanti"',
          description:
            'Ketika pasangan menceritakan masalah atau keluh kesah, tahan diri untuk memberi solusi. Cukup katakan: "Aku paham perasaanmu, terima kasih sudah cerita."',
          duration: '10 Menit',
          outcome: 'Pasangan merasa divalidasi dan didengar tanpa dihakimi.',
        },
        {
          day: 5,
          title: 'Menyepakati Sinyal Waktu Jeda',
          description:
            'Diskusikan satu kata kunci atau kode lembut yang boleh diucapkan saat suasana mulai tegang (misal: "Teh Hangat" atau "Jeda 20 Menit").',
          duration: '15 Menit',
          outcome: 'Memiliki rem darurat saat tensi emosi mulai memuncak.',
        },
        {
          day: 7,
          title: 'Refleksi Akhir Pekan Pertama',
          description: 'Saling bertanya: "Kapan kamu merasa paling didengar olehku minggu ini?"',
          duration: '20 Menit',
          outcome: 'Mengetahui gestur komunikasi spesifik yang berhasil menyentuh hati pasangan.',
        },
      ],
    },

    // WEEK 2: FINANSIAL & KESELARASAN TUJUAN
    {
      week: 2,
      theme: 'Minggu 2: Finansial & Keselarasan Nilai',
      description: 'Menghadirkan kenyamanan saat membicarakan uang, impian tabungan, dan batasan belanja.',
      activities: [
        {
          day: 9,
          title: 'Kisah Hubungan Masa Kecil dengan Uang',
          description:
            'Ceritakan bagaimana orang tua kalian mengajarkan soal uang saat kecil. Apakah suasana uang dulu terasa tenang atau penuh kecemasan?',
          duration: '25 Menit',
          outcome: 'Memahami akar psikologis di balik kebiasaan menabung atau belanja pasangan.',
        },
        {
          day: 11,
          title: 'Menyepakati Batas Belanja Mandiri (Threshold)',
          description:
            'Tentukan batas nominal rupiah pengeluaran yang boleh diputuskan sendiri tanpa perlu konfirmasi berdua (misal: Rp500.000 atau Rp1.000.000).',
          duration: '15 Menit',
          outcome: 'Menghilangkan rasa bersalah saat belanja kecil dan menjaga transparansi belanja besar.',
        },
        {
          day: 13,
          title: 'Satu Target Tabungan Impian',
          description:
            'Pilih satu pengalaman (liburan bersama, investasi, atau tabungan rumah) yang ingin diwujudkan dalam 12 bulan ke depan.',
          duration: '20 Menit',
          outcome: 'Menciptakan antusiasme positif dalam menabung bersama.',
        },
        {
          day: 14,
          title: 'Evaluasi Aliran Anggaran Santai',
          description: 'Minum kopi santai sambil meninjau pos pengeluaran rutin bulanan tanpa saling mengoreksi.',
          duration: '20 Menit',
          outcome: 'Menjadikan obrolan keuangan terasa rileks dan bukan sesi audit yang menakutkan.',
        },
      ],
    },

    // WEEK 3: KEDEKATAN EMOSIONAL & APRESIASI
    {
      week: 3,
      theme: 'Minggu 3: Kedekatan Emosional & Rasa Dihargai',
      description: 'Mengisi kembali "tangki emosional" melalui kata-kata penegasan, sentuhan, dan perhatian kecil.',
      activities: [
        {
          day: 16,
          title: 'Surat Kecil di Tempat Tak Terduga',
          description:
            'Tulis satu catatan kecil berisi hal yang kamu kagumi dari pasangan, lalu selipkan di tas atau dekat dompetnya.',
          duration: '5 Menit',
          outcome: 'Menciptakan senyum tak terduga di tengah kepenatan aktivitas harian.',
        },
        {
          day: 18,
          title: 'Pelukan Hangat 30 Detik',
          description:
            'Peluk pasangan secara tenang selama minimal 30 detik saat bertemu di sore atau malam hari tanpa berbicara.',
          duration: '2 Menit',
          outcome: 'Memicu pelepasan hormon oksitosin yang menurunkan stres dan mempererat rasa aman.',
        },
        {
          day: 20,
          title: 'Mengingat Kencan Awal',
          description:
            'Buka kembali foto-foto lama saat pertama kali dekat. Ceritakan apa hal pertama yang membuatmu jatuh hati kepadanya.',
          duration: '25 Menit',
          outcome: 'Menghidupkan kembali percikan rasa cinta awal yang mungkin tertutup rutinitas.',
        },
        {
          day: 21,
          title: 'Kencan Sederhana Tanpa Ponsel',
          description:
            'Jalan santai sore atau makan malam berdua di tempat makan favorit tanpa menyentuh ponsel sama sekali.',
          duration: '1 Jam',
          outcome: 'Membangun kembali fokus eksklusif satu sama lain.',
        },
      ],
    },

    // WEEK 4: VISI MASA DEPAN & RESOLUSI DAMAI
    {
      week: 4,
      theme: 'Minggu 4: Visi Masa Depan & Resolusi Damai',
      description: 'Mempertegas arah kompas jangka panjang dan menyepakati aturan main saat berselisih.',
      activities: [
        {
          day: 23,
          title: 'Pakta Perdamaian Pasangan',
          description:
            'Tuliskan 3 hal yang pantang dilakukan saat bertengkar (misal: tidak memaki, tidak mengungkit kesalahan masa lalu, tidak membanting barang).',
          duration: '20 Menit',
          outcome: 'Menjaga batas aman agar pertengkaran tidak melukai martabat pasangan.',
        },
        {
          day: 25,
          title: 'Dukungan untuk Ambisi Pasangan',
          description:
            `Tanyakan pada pasangan: "Apa satu mimpi pribadimu yang paling ingin kamu wujudkan, dan bagaimana aku bisa membantumu meraihnya?"`,
          duration: '25 Menit',
          outcome: 'Menjadi mitra pendukung utama bagi pertumbuhan pribadi pasangan.',
        },
        {
          day: 28,
          title: 'Peta Visi 5 Tahun ke Depan',
          description:
            'Bayangkan satu hari ideal dalam kehidupan kalian berdua 5 tahun mendatang. Di mana kalian tinggal, dan apa yang sedang kalian kerjakan?',
          duration: '30 Menit',
          outcome: 'Menyelaraskan kompas hidup agar selalu melangkah ke arah yang sejalan.',
        },
        {
          day: 30,
          title: 'Perayaan 30 Hari Saling Memahami',
          description:
            'Rayakan kelulusan 30 hari ini dengan makan malam spesial. Saling ucapkan terima kasih atas komitmen berjuang bersama.',
          duration: '1-2 Jam',
          outcome: 'Mengukuhkan babak baru perjalanan hubungan yang lebih dewasa, hangat, dan kokoh.',
        },
      ],
    },
  ];

  return weeks;
}
