/**
 * TEMURASA ADVANCED PERSONALIZED RELATIONSHIP INSIGHTS ENGINE
 * Generates deeply personalized, directional, empathetic, and non-duplicate insights
 * from couple assessment answers across the 7 relationship pillars.
 */

import { RawAnswer } from './scoring';

export type RelationshipPillar =
  | 'communication'
  | 'emotional'
  | 'financial'
  | 'future'
  | 'conflict'
  | 'lifestyle'
  | 'values';

export type InsightCategory =
  | 'understand'
  | 'support'
  | 'appreciate'
  | 'differences'
  | 'strengths'
  | 'together'
  | 'growth'
  | 'micro_habit';

export type PerspectiveDirection = 'A_TO_B' | 'B_TO_A' | 'BOTH';

export interface InsightCard {
  id: string;
  pillar: RelationshipPillar;
  pillarLabel: string;
  category: InsightCategory;
  perspective: PerspectiveDirection;
  perspectiveLabel: string;
  title: string;
  explanation: string;
  recommendation: string;
  relevanceScore: number;
  questionCode?: string;
  iconName?: string;
}

export interface PersonalizedRelationshipJourney {
  summary: {
    totalInsights: number;
    primaryGrowthPillar: string;
    strongestSharedPillar: string;
    executiveMessage: string;
  };
  subsections: {
    // 1. What You Should Understand About Each Other
    whatToUnderstand: InsightCard[];
    // 2. How You Can Support Each Other
    howToSupport: InsightCard[];
    // 3. What Makes You Strong Together
    whatMakesYouStrong: InsightCard[];
    // 4. Where You See Things Differently
    whereYouSeeDifferently: InsightCard[];
    // 5. Your Relationship Growth Opportunities
    growthOpportunities: InsightCard[];
    // 6. Your Next Small Steps Together
    nextSmallSteps: InsightCard[];
  };
  pillarBreakdown: Array<{
    pillar: RelationshipPillar;
    pillarLabel: string;
    score: number;
    insights: InsightCard[];
  }>;
}

export const PILLAR_META: Record<
  RelationshipPillar,
  { label: string; icon: string; description: string }
> = {
  communication: {
    label: 'Komunikasi & Keterbukaan',
    icon: 'MessageCircle',
    description: 'Bagaimana kalian menyampaikan emosi, uneg-uneg, dan saling mendengarkan.',
  },
  emotional: {
    label: 'Koneksi Emosional',
    icon: 'Heart',
    description: 'Cara kalian memberikan rasa aman, kehangatan, dan bahasa kasih sayang.',
  },
  financial: {
    label: 'Pola Pikir Finansial',
    icon: 'Coins',
    description: 'Nilai-nilai seputar pengelolaan uang, transparansi, dan keamanan finansial.',
  },
  future: {
    label: 'Visi & Tujuan Masa Depan',
    icon: 'Compass',
    description: 'Arah hidup, keselarasan cita-cita, dan saling mendukung ambisi pribadi.',
  },
  conflict: {
    label: 'Manajemen Konflik',
    icon: 'ShieldCheck',
    description: 'Cara kalian menavigasi perbedaan pendapat dan memulihkan kehangatan setelah berselisih.',
  },
  lifestyle: {
    label: 'Gaya Hidup & Keseharian',
    icon: 'Smile',
    description: 'Keseimbangan antara waktu bersama, hobi, rutinitas, dan ruang sendiri.',
  },
  values: {
    label: 'Nilai Keluarga & Komitmen',
    icon: 'Users',
    description: 'Harapan tentang keluarga, batasan sehat, dan komitmen jangka panjang.',
  },
};

interface RuleCondition {
  questionCode: string;
  evaluate: (a: number, b: number) => boolean;
  baseRelevance: number;
  generate: (context: {
    nameA: string;
    nameB: string;
    ansA: number;
    ansB: number;
  }) => {
    title: string;
    explanation: string;
    recommendation: string;
  };
}

interface InsightRule {
  id: string;
  pillar: RelationshipPillar;
  category: InsightCategory;
  perspective: PerspectiveDirection;
  condition: RuleCondition;
}

// ----------------------------------------------------------------------
// EXTENSIVE RULES REPOSITORY: 60+ DISTINCT, NON-DUPLICATING RULES
// ----------------------------------------------------------------------
const INSIGHT_RULES: InsightRule[] = [
  // ==========================================
  // PILLAR 1: COMMUNICATION (Q01 - Q05)
  // ==========================================

  // Q01 - Understand (A to B)
  {
    id: 'comm-q01-understand-a-to-b',
    pillar: 'communication',
    category: 'understand',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q01',
      evaluate: (a, b) => a >= 4 && b <= 3,
      baseRelevance: 95,
      generate: ({ nameA, nameB }) => ({
        title: `Pahami Kebutuhan ${nameB} untuk Mengendapkan Pikiran`,
        explanation: `${nameA} terbiasa mengutarakan masalah secara langsung saat itu juga. Bagi ${nameB}, mendadak diajak konfrontasi saat suasana hati belum stabil bisa memicu rasa kewalahan. Saat ${nameB} diam sejenak, itu adalah bentuk kehati-hatian agar ucapannya tidak menyakiti hatimu.`,
        recommendation: `Beri ${nameB} jeda 30–60 menit sebelum memulai obrolan serius. Ucapkan dengan lembut: "${nameB}, kita santai dulu ya. Nanti kalau sudah rileks, kabari aku ya agar kita bisa ngobrol berdua."`,
      }),
    },
  },
  // Q01 - Understand (B to A)
  {
    id: 'comm-q01-understand-b-to-a',
    pillar: 'communication',
    category: 'understand',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q01',
      evaluate: (a, b) => b >= 4 && a <= 3,
      baseRelevance: 95,
      generate: ({ nameA, nameB }) => ({
        title: `Pahami Kebutuhan ${nameA} akan Ruang Aman Tanpa Intimidasi`,
        explanation: `${nameB} cenderung spontan dan lugas menyelesaikan isu. Namun bagi ${nameA}, pembicaraan yang terburu-buru bisa terasa menegangkan. ${nameA} membutuhkan sinyal bahwa obrolan ini murni untuk saling mendengar, bukan ruang perdebatan atau saling menyalahkan.`,
        recommendation: `Awali obrolan dengan nada suara tenang dan bahasa tubuh yang terbuka. Yakinkan ${nameA}: "Aku di sini karena sayang sama kamu, bukan mau memperdebatkan siapa yang salah."`,
      }),
    },
  },
  // Q01 - Support (A to B) - Distinct Action!
  {
    id: 'comm-q01-support-action-a-to-b',
    pillar: 'communication',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q01',
      evaluate: (_, b) => b <= 3,
      baseRelevance: 90,
      generate: ({ nameA, nameB }) => ({
        title: `Ciptakan Suasana Hangat Sebelum Membuka Topik Sensitif untuk ${nameB}`,
        explanation: `Dukungan terbaik yang bisa ${nameA} berikan adalah menurunkan tensi sebelum percakapan dimulai. Duduk bersebelahan, memegang tangan ${nameB}, atau sekadar menyediakan minuman hangat membantu menurunkan hormon stres pasangan secara signifikan.`,
        recommendation: `Jangan memulai diskusi penting di saat ${nameB} baru pulang kerja atau sedang kelelahan fisik. Pilih momen rileks di akhir pekan atau sebelum tidur santai.`,
      }),
    },
  },
  // Q01 - Support (B to A) - Distinct Action!
  {
    id: 'comm-q01-support-action-b-to-a',
    pillar: 'communication',
    category: 'support',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q01',
      evaluate: (a) => a >= 4,
      baseRelevance: 90,
      generate: ({ nameA, nameB }) => ({
        title: `Beri Sinyal Kepastian Segera agar Pikiran ${nameA} Tidak Resah`,
        explanation: `Saat ada ganjalan, menunda tanpa kepastian waktu akan memicu kecemasan (overthinking) pada ${nameA}. Mengetahui kepastian kapan masalah akan dibahas adalah bentuk dukungan terbesar baginya.`,
        recommendation: `Jika belum siap bicara, berikan waktu spesifik kepada ${nameA}: "Aku butuh tenang sampai jam 8 malam ya, setelah itu kita duduk berdua bahas ini tuntas."`,
      }),
    },
  },
  // Q01 - Strengths (Both high)
  {
    id: 'comm-q01-strengths-direct',
    pillar: 'communication',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q01',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 93,
      generate: ({ nameA, nameB }) => ({
        title: 'Keberanian Transparan: Tidak Ada "Gunung Es" Masalah yang Ditimbun',
        explanation: `Kalian berdua sama-sama memiliki mentalitas dewasa untuk segera berbicara terbuka saat ada ketidaknyamanan. Sikap ini menghindarkan hubungan dari racun "passive-aggressive" dan dendam terselubung yang sering merusak hubungan jangka panjang.`,
        recommendation: `Pertahankan kejujuran ini dengan selalu membungkusnya dalam nada yang menghormati. Jadikan keterbukaan sebagai jembatan mendekat, bukan palu untuk memojokkan pasangan.`,
      }),
    },
  },

  // Q02 - Frequency of Daily Updates
  {
    id: 'comm-q02-support-a-needs-updates',
    pillar: 'communication',
    category: 'support',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q02',
      evaluate: (a, b) => a >= 4 && b <= 3,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: `Sapaan Singkat adalah Penenang Hati yang Berarti bagi ${nameA}`,
        explanation: `Bagi ${nameA}, kabar singkat di sela hari bukan bentuk mengekang, melainkan bukti bahwa ia tetap ada di dalam ingatan ${nameB}. Keheningan berjam-jam tanpa kabar bisa secara tidak sadar terasa seperti jarak emosional baginya.`,
        recommendation: `Kirimkan pesan mikro 5 detik: "Aku mulai rapat panjang ya, nanti sore kita ngobrol lagi." Kepastian proaktif sederhana ini melipatgandakan rasa aman ${nameA}.`,
      }),
    },
  },
  {
    id: 'comm-q02-support-b-needs-updates',
    pillar: 'communication',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q02',
      evaluate: (a, b) => b >= 4 && a <= 3,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: `Jadikan Kabar Rutin sebagai Bentuk Kehadiran Emosional untuk ${nameB}`,
        explanation: `Kuesioner menunjukkan ${nameB} merasa dihargai dan dirindukan saat ${nameA} menyempatkan diri memberi update. Luangkan momen kecil agar ${nameB} tidak merasa harus selalu bertanya terlebih dahulu.`,
        recommendation: `Buat kebiasaan manis: foto singkat makan siang atau cerita lucu 1 kalimat. Ini menjaga rasa terhubung meski kalian berdua sedang beraktivitas di tempat berbeda.`,
      }),
    },
  },
  {
    id: 'comm-q02-microhabit-updates',
    pillar: 'communication',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q02',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 84,
      generate: ({ nameA, nameB }) => ({
        title: 'Ritual 3 Sentuhan Harian: Pagi, Siang, dan Menjelang Pulang',
        explanation: `Koneksi tidak harus berupa percakapan berjam-jam. Tiga kali sapaan singkat yang konsisten setiap hari terbukti menjaga kedekatan emosional pasangan di tengah hiruk pikuk pekerjaan.`,
        recommendation: `Terapkan formula 3 titik: (1) Doa atau sapaan hangat di pagi hari, (2) Pertanyaan santai saat makan siang, dan (3) Kabar kepulangan di sore hari.`,
      }),
    },
  },

  // Q03 - Expressing Dislike / Vulnerability
  {
    id: 'comm-q03-understand-expression',
    pillar: 'communication',
    category: 'understand',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q03',
      evaluate: (a, b) => Math.abs(a - b) >= 2 || (a <= 3 && b <= 3),
      baseRelevance: 88,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const shyName = ansA <= ansB ? nameA : nameB;
        return {
          title: `Membangun Keberanian bagi ${shyName} untuk Mengutarakan yang Mengganjal`,
          explanation: `Menyatakan ketidaksukaan pada orang yang dicintai seringkali terasa menakutkan karena takut merusak keharmonisan. Saat ${shyName} memilih diam, rasa tidak nyaman tersebut tidak hilang, melainkan bisa berubah menjadi kelelahan emosional.`,
          recommendation: `Ciptakan "Ruang Bebas Penghakiman": sediakan waktu 10 menit setiap minggu di mana kalian berdua boleh menyampaikan 1 hal kecil yang ingin diselaraskan tanpa boleh ada yang tersinggung.`,
        };
      },
    },
  },
  {
    id: 'comm-q03-growth-constructive',
    pillar: 'communication',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q03',
      evaluate: (a, b) => a >= 3 && b >= 3,
      baseRelevance: 86,
      generate: ({ nameA, nameB }) => ({
        title: 'Meningkatkan Kualitas Feedback: Mengganti Kritik Menjadi Permintaan Cinta',
        explanation: `Menyampaikan ketidaksukaan adalah hal wajar, tetapi cara menyampaikannya menentukan apakah hubungan bertumbuh atau terluka. Kalimat yang diawali dengan "Kamu selalu..." cenderung memicu tameng pertahanan diri.`,
        recommendation: `Ubah formula: alih-alih berkata "Kamu sibuk terus sama HP", gunakan kalimat "Aku lagi kangen ngobrol berdua sama kamu, boleh simpan HP-nya sebentar ya?"`,
      }),
    },
  },

  // Q04 - Speed of Resolution vs Cooldown Pace
  {
    id: 'comm-q04-diff-pace',
    pillar: 'communication',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q04',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 98,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const fastName = ansA > ansB ? nameA : nameB;
        const coolName = ansA > ansB ? nameB : nameA;
        return {
          title: `Titik Temu Ritme Konflik: Antara Kebutuhan ${fastName} dan Waktu Reda ${coolName}`,
          explanation: `Ada perbedaan mendasar dalam meregulasi emosi. ${fastName} merasa gelisah jika tidur dalam keadaan berselisih, sedangkan ${coolName} merasa berbicara saat emosi memuncak justru berisiko memperparah luka. Keduanya memiliki niat baik menjaga hubungan.`,
          recommendation: `Sepakati kompromi "Jeda Bertenggat": ${coolName} berhak meminta waktu jeda untuk menenangkan diri, tetapi dengan komitmen tegas bahwa obrolan akan dilanjutkan maksimal dalam 2 jam (atau sebelum esok siang).`,
        };
      },
    },
  },
  {
    id: 'comm-q04-growth-cooldown',
    pillar: 'communication',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q04',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 85,
      generate: ({ nameA, nameB }) => ({
        title: 'Mencegah Eskalasi: Menghindari Reaksi Impulsif di 15 Menit Pertama',
        explanation: `Ketika otak berada dalam kondisi "fight-or-flight", logika rasional menurun drastis. Belajar menahan diri di fase awal perselisihan adalah tanda kedewasaan tertinggi dalam hubungan.`,
        recommendation: `Jika salah satu mulai menaikkan intonasi suara, sepakati untuk berhenti sejenak, minum segelas air putih, dan menarik napas dalam 5 kali sebelum melanjutkan.`,
      }),
    },
  },

  // Q05 - Listening vs Solving First
  {
    id: 'comm-q05-understand-listening-b-to-a',
    pillar: 'communication',
    category: 'understand',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q05',
      evaluate: (a) => a >= 4,
      baseRelevance: 94,
      generate: ({ nameA, nameB }) => ({
        title: `Pahami Kebutuhan Emosional ${nameA} untuk Merasa Benar-Benar Didengar`,
        explanation: `Saat ${nameA} bercerita tentang kepenatan hariannya, tujuan utamanya bukan meminta daftar solusi praktis, melainkan validasi batin bahwa lelahnya dimengerti. Memberikan nasihat terlalu cepat seringkali disalahartikan sebagai ketidaksabaran mendengarkan.`,
        recommendation: `Tatap mata ${nameA}, anggukkan kepala, dan katakan: "Pasti berat banget ya harimu, aku paham kenapa kamu capek." Biarkan ${nameA} selesai menuntaskan ceritanya.`,
      }),
    },
  },
  {
    id: 'comm-q05-support-action-a-to-b',
    pillar: 'communication',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q05',
      evaluate: (_, b) => b >= 4,
      baseRelevance: 94,
      generate: ({ nameA, nameB }) => ({
        title: `Jadilah Tempat Bersandar yang Menenangkan Hati bagi ${nameB}`,
        explanation: `Jawaban ${nameB} menunjukkan bahwa ia sangat menghargai pasangan yang bisa menjadi pendengar setia tanpa menghakimi. Sentuhan hangat dan kehadiran penuh dari ${nameA} adalah obat penawar lelah terbaik baginya.`,
        recommendation: `Ajukan pertanyaan klarifikasi sebelum memberi masukan: "${nameB}, kamu lagi butuh aku dengerin saja dan peluk, atau kamu mau kita pikirkan solusinya bareng?"`,
      }),
    },
  },

  // ==========================================
  // PILLAR 2: FINANCIAL MINDSET (Q06 - Q10)
  // ==========================================

  // Q06 - Autonomy vs Joint Pool
  {
    id: 'fin-q06-diff-autonomy',
    pillar: 'financial',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q06',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 96,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const personalName = ansA > ansB ? nameA : nameB;
        const jointName = ansA > ansB ? nameB : nameA;
        return {
          title: `Harmonisasi Finansial: Ruang Otonomi ${personalName} & Harapan Kebersamaan ${jointName}`,
          explanation: `${personalName} merasa kepemilikan tabungan pribadi memberikan rasa tenang psikologis dan kemandirian, sementara ${jointName} memandang kebersamaan ideal dicerminkan lewat transparansi dan penyatuan penuh. Perbedaan ini adalah dinamika lumrah yang bisa diselaraskan tanpa kecurigaan.`,
          recommendation: `Terapkan arsitektur "Tiga Rekening": Rekening Bersama untuk operasional rumah tangga dan tabungan masa depan, ditambah Rekening Pribadi masing-masing yang bebas digunakan tanpa perlu pelaporan mikro.`,
        };
      },
    },
  },
  {
    id: 'fin-q06-microhabit-three-wallets',
    pillar: 'financial',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q06',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 87,
      generate: ({ nameA, nameB }) => ({
        title: 'Alokasi "Guilt-Free Spending" Setiap Awal Bulan',
        explanation: `Hubungan finansial yang sehat tidak mengharuskan setiap rupiah dipertanggungjawabkan hingga menghilangkan kebahagiaan pribadi. Alokasi dana pribadi yang disepakati bersama mencegah rasa terkekang.`,
        recommendation: `Sepakati nominal anggaran pribadi (misal: 10–15% dari penghasilan) yang bebas dibelanjakan untuk hobi, traktir teman, atau perawatan diri tanpa rasa bersalah.`,
      }),
    },
  },

  // Q07 - Consultation on Big Expenses
  {
    id: 'fin-q07-strengths-consultation',
    pillar: 'financial',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q07',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 92,
      generate: ({ nameA, nameB }) => ({
        title: 'Fondasi Musyawarah: Perlindungan Kuat dari Kejutan Finansial Negatif',
        explanation: `Kalian berdua memiliki kedewasaan tinggi untuk selalu berkonsultasi sebelum mengambil keputusan pengeluaran besar. Kesepakatan ini melindungi hubungan dari salah satu pemicu perceraian terbesar di dunia modern: keputusan finansial sepihak.`,
        recommendation: `Pertahankan prinsip ini dan rumuskan bersama ambang batas nominal pastinya (misal: pembelian di atas Rp1.000.000 wajib disetujui berdua).`,
      }),
    },
  },
  {
    id: 'fin-q07-growth-spending-threshold',
    pillar: 'financial',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q07',
      evaluate: (a, b) => a <= 3 || b <= 3,
      baseRelevance: 88,
      generate: ({ nameA, nameB }) => ({
        title: 'Menyepakati Batas Nominal Diskusi untuk Mencegah Salah Paham Finansial',
        explanation: `Terkadang persepsi tentang apa yang disebut "pengeluaran besar" berbeda antara satu orang dengan yang lain. Menyamakan definisi nominal secara konkret menghindarkan rasa tersinggung di masa depan.`,
        recommendation: `Duduk bersama malam ini dan sepakati satu angka batas: "Berapa nominal belanja non-rutin yang harus kita diskusikan berdua terlebih dahulu?"`,
      }),
    },
  },

  // Q08 - Long-term Investments & Savings
  {
    id: 'fin-q08-strengths-investment',
    pillar: 'financial',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q08',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 91,
      generate: ({ nameA, nameB }) => ({
        title: 'Visi Kemakmuran: Komitmen Solid Membangun Aset Masa Depan',
        explanation: `Kalian berdua memandang keuangan bukan sekadar alat konsumsi hari ini, melainkan fondasi untuk membangun masa depan yang berdaya tahan tinggi. Kedisiplinan menabung dan berinvestasi bersama adalah pilar kemandirian keluarga kalian.`,
        recommendation: `Buka instrumen investasi bersama yang memiliki tujuan jelas (misal: dana pendidikan anak, DP hunian impian, atau dana haji/ibadah).`,
      }),
    },
  },
  {
    id: 'fin-q08-microhabit-money-date',
    pillar: 'financial',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q08',
      evaluate: (a, b) => a >= 3 && b >= 3,
      baseRelevance: 86,
      generate: ({ nameA, nameB }) => ({
        title: 'Ritual "Money Date" Bulanan Sambil Menikmati Kopi Santai',
        explanation: `Membicarakan uang tidak boleh terasa seperti sidang pengadilan. Menjadikannya sesi kencan bulanan yang santai mengubah diskusi finansial menjadi momen merayakan progres bersama.`,
        recommendation: `Pilih tanggal 28 atau akhir bulan: pesan camilan favorit, buka catatan keuangan bersama selama 30 menit, dan rayakan target tabungan yang berhasil dicapai.`,
      }),
    },
  },

  // Q09 - Debt Transparency & Financial Openness
  {
    id: 'fin-q09-understand-vulnerability',
    pillar: 'financial',
    category: 'understand',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q09',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 93,
      generate: ({ nameA, nameB }) => ({
        title: 'Keberanian Bersikap Jujur tentang Kondisi & Riwayat Keuangan',
        explanation: `Membuka kondisi keuangan nyata—termasuk cicilan, tanggungan keluarga, atau kekhawatiran finansial—memerlukan kerentanan dan keberanian tinggi. Keterbukaan ini adalah bukti cinta paling jujur dalam membangun rumah tangga.`,
        recommendation: `Ketika pasangan menceritakan kondisi keuangannya, sambutlah dengan rasa terima kasih atas kejujurannya, bukan dengan cercaan atau kepanikan. Fokus pada menyusun rencana pemulihan bersama.`,
      }),
    },
  },
  {
    id: 'fin-q09-support-safe-debt-space',
    pillar: 'financial',
    category: 'support',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q09',
      evaluate: (a, b) => true,
      baseRelevance: 85,
      generate: ({ nameA, nameB }) => ({
        title: 'Ciptakan Ruang Bebas Cemas untuk Membicarakan Tanggungan Finansial',
        explanation: `Ketakutan dianggap sebagai beban sering membuat seseorang menyembunyikan kewajiban finansialnya. Memastikan pasangan merasa aman bercerita adalah kunci menjaga transparansi jangka panjang.`,
        recommendation: `Katakan pada pasanganmu: "Apa pun kondisi finansial kita sekarang, kita ini satu tim. Kita petakan bareng-bareng dan kita selesaikan langkah demi langkah."`,
      }),
    },
  },

  // Q10 - Safety vs Lifestyle Upgrade
  {
    id: 'fin-q10-diff-security-vs-enjoyment',
    pillar: 'financial',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q10',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 89,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const frugalName = ansA > ansB ? nameA : nameB;
        const enjoyName = ansA > ansB ? nameB : nameA;
        return {
          title: `Menyeimbangkan Ketenteraman Dana Darurat & Apresiasi Hasil Kerja`,
          explanation: `Ketika rezeki bertambah, ${frugalName} memprioritaskan rasa tenang dengan mempertebal benteng tabungan, sementara ${enjoyName} memandang wajar jika jerih payah dirayakan dengan peningkatan kenyamanan hidup. Keduanya saling menjaga agar tidak terjebak dalam kikir ekstrem maupun boros berlebih.`,
          recommendation: `Terapkan aturan pembagian kenaikan pendapatan: 70% dialokasikan untuk memperkuat tabungan/investasi, dan 30% dialokasikan untuk peningkatan kualitas hidup dan kebahagiaan berdua.`,
        };
      },
    },
  },
  {
    id: 'fin-q10-growth-financial-wisdom',
    pillar: 'financial',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q10',
      evaluate: (a, b) => true,
      baseRelevance: 83,
      generate: ({ nameA, nameB }) => ({
        title: 'Membangun Kebijaksanaan Finansial: Menikmati Proses Tanpa Mengorbankan Masa Depan',
        explanation: `Kematangan finansial bukan tentang siapa yang paling hemat, melainkan bagaimana uang menjadi sarana menghadirkan ketenangan jiwa dan kebahagiaan keluarga.`,
        recommendation: `Rancang satu target liburan bersama yang dibiayai murni dari hasil tabungan terencana, agar kalian merasakan manisnya hasil kompromi finansial yang seimbang.`,
      }),
    },
  },

  // ==========================================
  // PILLAR 3: VALUES & FAMILY (Q11 - Q14)
  // ==========================================

  // Q11 - Children Decision Alignment
  {
    id: 'val-q11-strengths-children',
    pillar: 'values',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q11',
      evaluate: (a, b) => (a >= 4 && b >= 4) || (a <= 2 && b <= 2),
      baseRelevance: 98,
      generate: ({ nameA, nameB, ansA }) => ({
        title: 'Keselarasan Fundamental: Visi Kehadiran Buah Hati dalam Rumah Tangga',
        explanation: `Kalian berdua memiliki pandangan dasar yang sangat selaras mengenai kehadiran anak (${ansA >= 4 ? 'kalian berdua memiliki kerinduan membina generasi penerus' : 'kalian berdua memiliki pandangan yang seirama'}). Ini adalah salah satu pilar komitmen paling fundamental yang meminimalkan krisis eksistensial dalam pernikahan.`,
        recommendation: `Lanjutkan keselarasan ini dengan mendiskusikan ekspektasi kesiapan fisik, mental, dan finansial jauh-jauh hari dengan penuh kehangatan.`,
      }),
    },
  },
  {
    id: 'val-q11-diff-children-timeline',
    pillar: 'values',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q11',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 97,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const eagerName = ansA > ansB ? nameA : nameB;
        const cautiousName = ansA > ansB ? nameB : nameA;
        return {
          title: `Menyelaraskan Kesiapan Hati & Waktu Menjelang Kehadiran Anak`,
          explanation: `${eagerName} memiliki antusiasme tinggi untuk segera menyambut momongan, sementara ${cautiousName} memandang pentingnya persiapan fondasi kematangan emosi dan finansial terlebih dahulu. Menghargai kekhawatiran pasangan adalah kunci agar kehamilan disambut dengan bahagia, bukan keterpaksaan.`,
          recommendation: `Susun "Daftar Kesiapan Berdua": apa saja 3 indikator (misal: stabilitas hunian, tabungan persalinan, dan kematangan komunikasi) yang ingin kalian capai bersama sebelum memulai program anak.`,
        };
      },
    },
  },

  // Q12 - Parenting Philosophy & Shared Agreement
  {
    id: 'val-q12-strengths-parenting',
    pillar: 'values',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q12',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 94,
      generate: ({ nameA, nameB }) => ({
        title: 'Prinsip Satu Suara: Kekompakan Mengasuh dan Menjaga Wibawa Orang Tua',
        explanation: `Kalian berdua sepakat bahwa pola asuh anak harus didiskusikan dan diputuskan berdua. Anak yang dibesarkan oleh orang tua yang kompak tumbuh dengan rasa aman emosional yang tinggi karena tidak ada celah manipulasi aturan.`,
        recommendation: `Pegang teguh aturan emas pengasuhan: jika ada ketidaksetujuan cara mendidik di depan anak, simpan pembahasannya di dalam kamar berdua tanpa saling mendebat di hadapan si kecil.`,
      }),
    },
  },
  {
    id: 'val-q12-growth-parenting-values',
    pillar: 'values',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q12',
      evaluate: (a, b) => true,
      baseRelevance: 84,
      generate: ({ nameA, nameB }) => ({
        title: 'Mengeksplorasi Warisan Pengasuhan: Mengadopsi yang Baik, Memutus yang Melukai',
        explanation: `Kita cenderung mendidik anak dengan cara kita dididik dulu. Menyadari pola asuh keluarga masa lalu membantu kalian menyaring nilai-nilai luhur dan tidak mengulangi pola pengasuhan yang meninggalkan luka batin.`,
        recommendation: `Diskusikan topik ini sambil bernostalgia: "Nilai pengasuhan apa dari orang tuamu yang ingin kamu terapkan, dan apa yang ingin kita perbaiki di keluarga kita?"`,
      }),
    },
  },

  // Q13 - Couple First Mindset after Kids
  {
    id: 'val-q13-together-couple-first',
    pillar: 'values',
    category: 'together',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q13',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 93,
      generate: ({ nameA, nameB }) => ({
        title: 'Fondasi Utama Anak: Orang Tua yang Saling Mencintai Sepenuh Hati',
        explanation: `Kalian berdua menyadari bahwa hadirnya buah hati tidak boleh menenggelamkan ikatan cinta sebagai pasangan suami-istri. Hadiah paling indah yang bisa kalian berikan kepada anak kelak adalah pemandangan orang tuanya yang selalu saling menghormati dan mesra.`,
        recommendation: `Jangan biarkan waktu berdua hilang total saat anak lahir. Titipkan anak sejenak pada keluarga terpercaya minimal sebulan sekali untuk kencan berdua murni sebagai pasangan.`,
      }),
    },
  },
  {
    id: 'val-q13-microhabit-pillow-talk',
    pillar: 'values',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q13',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: 'Ritual "15 Menit Obrolan Bantal (Pillow Talk)" Sebelum Terlelap',
        explanation: `Sebelum tidur, keheningan malam adalah ruang intim paling tepat untuk saling menanyakan kabar hati setelah seharian bergelut dengan kesibukan dan tanggung jawab keluarga.`,
        recommendation: `Sisihkan gawai 15 menit sebelum tidur. Tanyakan satu pertanyaan sederhana: "Hari ini hal apa yang paling bikin hatimu senang atau lelah?" dan dengarkan dengan pelukan.`,
      }),
    },
  },

  // Q14 - Healthy Boundaries with Extended Family
  {
    id: 'val-q14-understand-extended-family',
    pillar: 'values',
    category: 'understand',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q14',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 96,
      generate: ({ nameA, nameB }) => ({
        title: 'Membangun Benteng Suci: Batasan Sehat & Privasi dari Keluarga Besar',
        explanation: `Berbakti kepada orang tua dan mertua adalah kewajiban luhur, tetapi keutuhan dan kedaulatan rumah tangga kalian berdua adalah prioritas nomor satu. Menyelesaikan urusan internal tanpa campur tangan pihak ketiga adalah pelindung terbesar pernikahan.`,
        recommendation: `Sepakati prinsip "Satu Pintu": setiap isu sensitif terkait keluarga asal (orang tua/mertua) dikomunikasikan terlebih dahulu di internal kamar berdua, bukan diumbar ke grup keluarga.`,
      }),
    },
  },
  {
    id: 'val-q14-support-united-front',
    pillar: 'values',
    category: 'support',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q14',
      evaluate: (a, b) => true,
      baseRelevance: 88,
      generate: ({ nameA, nameB }) => ({
        title: 'Jadilah Pembela Utama Pasangan di Hadapan Keluarga Besar',
        explanation: `Pasangan harus selalu merasa bahwa pasangannya berada di pihak yang sama saat menghadapi komentar atau ekspektasi keluarga besar yang berat. Dukungan pasangan adalah benteng harga dirinya.`,
        recommendation: `Jika ada masukan atau kritikan dari pihak keluarga, jangan pernah menyalahkan pasangan di depan umum. Katakan: "Ini sudah keputusan bersama kami berdua."`,
      }),
    },
  },

  // ==========================================
  // PILLAR 4: LIFESTYLE & DAILY LIFE (Q15 - Q18)
  // ==========================================

  // Q15 - Togetherness vs Solitary Leisure
  {
    id: 'life-q15-diff-togetherness',
    pillar: 'lifestyle',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q15',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 91,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const clingyName = ansA > ansB ? nameA : nameB;
        const freeName = ansA > ansB ? nameB : nameA;
        return {
          title: `Menyelaraskan Definisi Libur: Waktu Nempel Berdua vs Me Time Menenangkan`,
          explanation: `${clingyName} memandang hari libur ideal adalah menghabiskannya bersama pasangan, sementara ${freeName} merasa perlu sesekali larut dalam aktivitas pribadi tanpa gangguan. Perbedaan ini wajar dan bukan tanda memudarnya rasa cinta.`,
          recommendation: `Rancang akhir pekan berirama: hari Sabtu untuk kencan bersama secara total, dan Minggu siang untuk waktu santai masing-masing menekuni minat pribadi.`,
        };
      },
    },
  },
  {
    id: 'life-q15-support-togetherness-quality',
    pillar: 'lifestyle',
    category: 'support',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q15',
      evaluate: (a, b) => a >= 3 && b >= 3,
      baseRelevance: 86,
      generate: ({ nameA, nameB }) => ({
        title: 'Kualitas Lebih Berarti dari Sekadar Berada di Ruangan yang Sama',
        explanation: `Duduk berdua di sofa namun sama-sama asyik menatap layar ponsel tidak memberikan nutrisi emosional bagi jiwa. Kebersamaan yang disengaja menghadirkan keintiman sejati.`,
        recommendation: `Pilih aktivitas yang melibatkan interaksi nyata: memasak menu baru bersama di dapur, jalan sore di taman, atau bermain board game berdua.`,
      }),
    },
  },

  // Q16 - Novelty, Adventure & Travel
  {
    id: 'life-q16-strengths-adventure',
    pillar: 'lifestyle',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q16',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 90,
      generate: ({ nameA, nameB }) => ({
        title: 'Jiwa Petualang: Selalu Menghidupkan Kebaruan & Warna dalam Hubungan',
        explanation: `Kalian berdua sama-sama menyukai petualangan baru, baik mencoba tempat kuliner yang belum pernah dikunjungi maupun mengeksplorasi kota baru bersama. Kebaruan (novelty) adalah dopamin alami yang menjaga hubungan tetap awet muda.`,
        recommendation: `Buat daftar keinginan bersama "Temurasa Bucket List" dan agendakan satu petualangan kecil setiap bulan.`,
      }),
    },
  },
  {
    id: 'life-q16-microhabit-bucketlist',
    pillar: 'lifestyle',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q16',
      evaluate: (a, b) => a >= 3 || b >= 3,
      baseRelevance: 85,
      generate: ({ nameA, nameB }) => ({
        title: 'Kencan Eksplorasi Bulanan: Mengunjungi 1 Tempat Baru Berdua',
        explanation: `Rasa bosan dalam hubungan terjadi saat rutinitas menjadi monoton. Mengunjungi tempat baru memicu kembali hormon kebahagiaan seperti saat masa pendekatan dulu.`,
        recommendation: `Bergiliran setiap bulan: bulan ini ${nameA} yang memilihkan tempat kopi atau kuliner baru yang belum pernah dicoba, bulan depan giliran ${nameB}.`,
      }),
    },
  },

  // Q17 - Daily Structure & Routines
  {
    id: 'life-q17-understand-routine',
    pillar: 'lifestyle',
    category: 'understand',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q17',
      evaluate: (a, b) => Math.abs(a - b) >= 2 || (a >= 4 && b >= 4),
      baseRelevance: 87,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const structuredName = ansA >= ansB ? nameA : nameB;
        return {
          title: `Menghargai Ritme Keseharian: Kebutuhan Keteraturan bagi ${structuredName}`,
          explanation: `Bagi ${structuredName}, jadwal harian yang rapi dan kepastian rutinitas memberikan rasa aman dan mengurangi stres mental. Mengacaukan rencana di menit-menit akhir bisa membuatnya merasa cemas.`,
          recommendation: `Beri tahu pasangan jauh-jauh hari jika ada perubahan jadwal mendadak, agar pasangan memiliki waktu untuk menyesuaikan ekspektasi ritme harinya.`,
        };
      },
    },
  },
  {
    id: 'life-q17-growth-flexibility',
    pillar: 'lifestyle',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q17',
      evaluate: (a, b) => true,
      baseRelevance: 82,
      generate: ({ nameA, nameB }) => ({
        title: 'Memadukan Disiplin Rutinitas dengan Keluwesan Menghadapi Kejutan Hidup',
        explanation: `Rumah tangga membutuhkan keteraturan agar urusan domestik berjalan lancar, namun juga membutuhkan fleksibilitas agar tidak kaku saat terjadi hal di luar rencana.`,
        recommendation: `Sepakati pembagian peran domestik dasar, namun miliki sikap lapang dada untuk saling mem-backup ketika salah satu pasangan sedang kelelahan.`,
      }),
    },
  },

  // Q18 - Solitude & Me-Time
  {
    id: 'life-q18-understand-me-time-a',
    pillar: 'lifestyle',
    category: 'understand',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q18',
      evaluate: (a) => a >= 4,
      baseRelevance: 93,
      generate: ({ nameA, nameB }) => ({
        title: `Pahami Waktu Sendiri ${nameA} sebagai Sarana Mengisi Ulang Baterai Jiwa`,
        explanation: `Bagi ${nameA}, waktu sendiri menekuni hobi atau sekadar membaca buku bukan bentuk penolakan terhadapmu. Me-time adalah caranya meregulasi energi agar saat kembali berinteraksi, ia bisa hadir dengan senyuman dan hati yang penuh.`,
        recommendation: `Dukung waktu me-time ${nameA} tanpa prasangka curiga. Jadikan waktu tersebut sebagai kesempatan bagi ${nameB} untuk menikmati waktu berkualitas bersama sahabat atau perawatan diri.`,
      }),
    },
  },
  {
    id: 'life-q18-support-me-time-b',
    pillar: 'lifestyle',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q18',
      evaluate: (_, b) => b >= 4,
      baseRelevance: 93,
      generate: ({ nameA, nameB }) => ({
        title: `Beri ${nameB} Ruang Bernapas yang Nyaman Tanpa Rasa Terbebani`,
        explanation: `Jawaban kuesioner menunjukkan ${nameB} sangat membutuhkan ruang pribadi untuk menjaga keutuhan identitas dirinya di dalam pernikahan. Ruang otonom ini justru menjaga gairah cinta tetap segar.`,
        recommendation: `Katakan pada ${nameB}: "Silakan nikmati waktumu hari ini ya, jangan pikirkan urusan lain, aku di sini kalau kamu butuh apa-apa."`,
      }),
    },
  },

  // ==========================================
  // PILLAR 5: FUTURE & GOALS (Q19 - Q22)
  // ==========================================

  // Q19 - Shared 5-10 Year Financial Vision
  {
    id: 'fut-q19-strengths-5yr-plan',
    pillar: 'future',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q19',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 92,
      generate: ({ nameA, nameB }) => ({
        title: 'Kompas Bersama: Visi Jangka Panjang 5–10 Tahun yang Solid',
        explanation: `Kalian berdua memiliki kedewasaan untuk tidak hanya hidup hari demi hari, melainkan memikirkan ke mana arah bahtera rumah tangga akan berlabuh dalam 5–10 tahun ke depan. Keselarasan target ini memberikan rasa aman yang mendalam.`,
        recommendation: `Petakan target besar kalian ke dalam tonggak capaian tahunan (misal: pelunasan tanggungan, tabungan masa depan, atau kepemilikan aset).`,
      }),
    },
  },
  {
    id: 'fut-q19-growth-milestones',
    pillar: 'future',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q19',
      evaluate: (a, b) => a <= 3 || b <= 3,
      baseRelevance: 87,
      generate: ({ nameA, nameB }) => ({
        title: 'Merumuskan Cetak Biru Keluarga: Mengubah Mimpi Menjadi Rencana Nyata',
        explanation: `Memiliki mimpi adalah awal yang baik, tetapi mimpi yang tidak dituangkan dalam langkah terukur bersama bisa memicu kegelisahan tentang ketidakpastian masa depan.`,
        recommendation: `Luangkan waktu satu malam khusus untuk menuliskan: "Di mana kita ingin berada 5 tahun dari sekarang secara spiritual, finansial, dan karier?"`,
      }),
    },
  },

  // Q20 - Mobility & Relocation Willingness
  {
    id: 'fut-q20-diff-relocation',
    pillar: 'future',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q20',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 91,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const nomadName = ansA > ansB ? nameA : nameB;
        const rootName = ansA > ansB ? nameB : nameA;
        return {
          title: `Menavigasi Peluang Pindah Kota: Antara Ambisi Merantau & Kenyamanan Menetap`,
          explanation: `${nomadName} memiliki fleksibilitas tinggi untuk berpindah domisili demi kemajuan keluarga, sementara ${rootName} memandang pentingnya kedekatan dengan lingkaran keluarga, lingkungan yang sudah akrab, dan stabilitas tempat tinggal.`,
          recommendation: `Jangan pernah mengambil keputusan karier atau tawaran pindah secara sepihak. Jadikan pertimbangan kesejahteraan psikologis pasangan sebagai faktor penentu utama.`,
        };
      },
    },
  },
  {
    id: 'fut-q20-support-relocation-safety',
    pillar: 'future',
    category: 'support',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q20',
      evaluate: (a, b) => true,
      baseRelevance: 84,
      generate: ({ nameA, nameB }) => ({
        title: 'Mendengarkan Kekhawatiran Pasangan Sebelum Mengambil Keputusan Domisili',
        explanation: `Pindah tempat tinggal bukan sekadar soal biaya logistik, melainkan mencabut akar sosial dan kenyamanan emosional. Dukungan dan empati pasangan adalah penenang terbaik.`,
        recommendation: `Diskusikan secara terbuka: "Apa syarat atau fasilitas yang paling kamu butuhkan agar kamu merasa nyaman jika suatu hari kita harus pindah kota?"`,
      }),
    },
  },

  // Q21 - Supporting Partner's Ambitions & Career
  {
    id: 'fut-q21-understand-career-a',
    pillar: 'future',
    category: 'understand',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q21',
      evaluate: (a) => a >= 4,
      baseRelevance: 94,
      generate: ({ nameA, nameB }) => ({
        title: `Pahami Arti Pencapaian Profesional bagi Harga Diri ${nameA}`,
        explanation: `Bagi ${nameA}, karier dan karya pribadinya bukan sekadar mata pencaharian materi, melainkan wujud aktualisasi diri. Dukungan tulus dari ${nameB} adalah bahan bakar semangat terbesar baginya untuk berjuang di luar rumah.`,
        recommendation: `Tanyakan kabar proyek atau tantangan kerjanya dengan antusias: "Bagaimana rapatmu tadi siang? Cerita dong apa yang lagi kamu kerjakan."`,
      }),
    },
  },
  {
    id: 'fut-q21-support-career-b',
    pillar: 'future',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q21',
      evaluate: (_, b) => b >= 4,
      baseRelevance: 94,
      generate: ({ nameA, nameB }) => ({
        title: `Jadilah Pendukung Nomor Satu untuk Langkah Karier & Impian ${nameB}`,
        explanation: `Kuesioner menegaskan ${nameB} mendambakan pasangan yang memberinya sayap untuk terbang menggapai potensi terbaiknya, bukan sangkar yang membatasi ambisinya. Melihat pasangan bangga atas prestasinya adalah kebahagiaan tak ternilai.`,
        recommendation: `Bantu ringankan beban domestik saat ${nameB} sedang mengejar tenggat waktu kerja penting. Rayakan setiap pencapaian kariernya dengan makan malam spesial.`,
      }),
    },
  },

  // Q22 - Unified Future Picture
  {
    id: 'fut-q22-strengths-unified-vision',
    pillar: 'future',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q22',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 95,
      generate: ({ nameA, nameB }) => ({
        title: 'Keselarasan Jiwa: Gambaran Rumah Tangga Masa Depan yang Seirama',
        explanation: `Kalian berdua memiliki imajinasi masa depan yang sangat cocok satu sama lain. Ketika dua orang melangkah dengan kompas batin yang sama, setiap rintangan hidup terasa jauh lebih ringan untuk dilewati bersama.`,
        recommendation: `Jadikan visi bersama ini sebagai pengingat saat menghadapi masa sulit: "Ingat tujuan akhir kita, kita berdua sedang membangun istana yang sama."`,
      }),
    },
  },
  {
    id: 'fut-q22-microhabit-annual-retreat',
    pillar: 'future',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q22',
      evaluate: (a, b) => true,
      baseRelevance: 88,
      generate: ({ nameA, nameB }) => ({
        title: 'Ritual "Refleksi Akhir Tahun Berdua" untuk Memperbarui Janji',
        explanation: `Seiring bertambahnya usia, prioritas hidup bisa bergeser. Mengagendakan satu sesi refleksi setiap pergantian tahun menjaga agar kedua pasangan terus bertumbuh ke arah yang sama.`,
        recommendation: `Luangkan satu hari di bulan Desember: tuliskan 3 hal yang paling disyukuri dari pasangan tahun ini dan 3 harapan baru untuk tahun mendatang.`,
      }),
    },
  },

  // ==========================================
  // PILLAR 6: EMOTIONAL CONNECTION (Q23 - Q26)
  // ==========================================

  // Q23 - Words of Affirmation
  {
    id: 'emo-q23-understand-affirmation-a',
    pillar: 'emotional',
    category: 'understand',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q23',
      evaluate: (a) => a >= 4,
      baseRelevance: 94,
      generate: ({ nameA, nameB }) => ({
        title: `Kata-Kata Cinta & Pujian adalah Oksigen Emosional bagi ${nameA}`,
        explanation: `Bagi ${nameA}, mendengar ungkapan kasih secara langsung bukan formalitas belaka. Ungkapan "Aku bangga sama kamu", "Terima kasih sudah berjuang hari ini", dan "Aku sayang kamu" mengisi tangki cintanya secara instan.`,
        recommendation: `Jangan berasumsi bahwa ${nameA} sudah tahu kamu mencintainya. Ucapkan secara langsung setiap hari dengan tatapan mata yang lembut.`,
      }),
    },
  },
  {
    id: 'emo-q23-support-affirmation-b',
    pillar: 'emotional',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q23',
      evaluate: (_, b) => b >= 4,
      baseRelevance: 94,
      generate: ({ nameA, nameB }) => ({
        title: `Hangatkan Hati ${nameB} Lewat Apresiasi dan Penegasan Rasa Sayang`,
        explanation: `Jawaban kuesioner menunjukkan bahwa kepastian kata-kata dari ${nameA} memiliki kekuatan besar meredakan rasa cemas atau lelah pada diri ${nameB}. Kata-kata manismu adalah penopang keyakinannya.`,
        recommendation: `Tinggalkan pesan cinta kecil di meja riasnya atau kirim pesan manis tanpa alasan di tengah hari: "Cuma mau bilang, aku bersyukur banget punya kamu."`,
      }),
    },
  },

  // Q24 - Thoughtful Gestures & Small Details
  {
    id: 'emo-q24-appreciate-details',
    pillar: 'emotional',
    category: 'appreciate',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q24',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 89,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const detailLover = ansA >= ansB ? nameA : nameB;
        return {
          title: `Kekuatan Hal-Hal Sederhana: Cinta Nyata yang Hadir dalam Perhatian Kecil`,
          explanation: `Bagi ${detailLover}, pembuktian cinta tidak diukur dari hadiah mewah sesekali, melainkan dari ingatan tentang hal-hal kecil: minuman hangat saat sakit, makanan favorit saat lelah, atau perhatian pada hal yang pernah diceritakan sepintas.`,
          recommendation: `Buat catatan rahasia di ponsel berisi hal-hal kecil kesukaan pasangan (makanan favorit, ukuran pakaian, impian masa kecil) untuk memberinya kejutan manis saat ia sedang penat.`,
        };
      },
    },
  },
  {
    id: 'emo-q24-microhabit-random-kindness',
    pillar: 'emotional',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q24',
      evaluate: (a, b) => true,
      baseRelevance: 83,
      generate: ({ nameA, nameB }) => ({
        title: 'Gerakan Kasih Spontan: Satu Gestur Manis Tanpa Diminta Setiap Pekan',
        explanation: `Memberikan bantuan atau kejutan tanpa diminta membuat pasangan merasa sangat diperhatikan dan dipikirkan.`,
        recommendation: `Lakukan 1 tindakan servis sederhana setiap minggu: siapkan pakaian kerjanya, bawakan camilan kesukaannya, atau buatkan teh hangat saat ia sedang sibuk bekerja.`,
      }),
    },
  },

  // Q25 - Emotional Support in Tough Times
  {
    id: 'emo-q25-understand-vulnerability',
    pillar: 'emotional',
    category: 'understand',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q25',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 95,
      generate: ({ nameA, nameB }) => ({
        title: 'Menjadi Pelabuhan Aman di Tengah Badai Kehidupan',
        explanation: `Kalian berdua sepakat bahwa esensi terdalam dari pasangan hidup adalah menjadi orang pertama yang dituju saat dunia terasa kejam dan melelahkan. Tempat di mana kalian bisa menanggalkan semua topeng kekuatan dan berani menangis bersama.`,
        recommendation: `Saat pasangan sedang dilanda kesedihan, tahan dorongan untuk menghakimi atau menyalahkannya. Cukup peluk erat dan katakan: "Aku ada di sini, kita lewati ini bareng-bareng."`,
      }),
    },
  },
  {
    id: 'emo-q25-growth-emotional-safety',
    pillar: 'emotional',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q25',
      evaluate: (a, b) => true,
      baseRelevance: 86,
      generate: ({ nameA, nameB }) => ({
        title: 'Membangun Ketahanan Mental Hubungan: Menghilangkan Rasa Takut Dihakimi',
        explanation: `Kematangan cinta tercapai ketika tidak ada lagi rasa gengsi untuk mengakui kegagalan atau ketakutan pribadi di depan pasangan.`,
        recommendation: `Biasakan saling bercerita tentang kekhawatiran terbesar kalian tanpa ada rasa takut ditertawakan atau diremehkan.`,
      }),
    },
  },

  // Q26 - Keeping Romance Alive
  {
    id: 'emo-q26-together-romance',
    pillar: 'emotional',
    category: 'together',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q26',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 92,
      generate: ({ nameA, nameB }) => ({
        title: 'Komitmen Menjaga Api Cinta Tetap Menyala (Intentional Dating)',
        explanation: `Kalian berdua menyadari bahwa kehangatan asmara tidak terjadi secara otomatis melainkan buah dari usaha yang disengaja. Hubungan yang awet adalah hubungan dua orang yang tidak pernah berhenti berusaha saling memikat.`,
        recommendation: `Jaga kebiasaan berdandan rapi dan wangi saat bepergian berdua, seolah kalian sedang pergi ke kencan pertama dulu.`,
      }),
    },
  },
  {
    id: 'emo-q26-microhabit-date-night',
    pillar: 'emotional',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q26',
      evaluate: (a, b) => a >= 3 && b >= 3,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: 'Kencan Dwi-Mingguan Bebas Gawai & Bebas Topik Masalah Logistik',
        explanation: `Kencan yang hanya diisi obrolan urusan tagihan dan komplain kantor tidak mengisi tangki asmara. Kencan sejati mengembalikan rasa jatuh cinta dan percakapan mendalam.`,
        recommendation: `Jadwalkan kencan 2 jam setiap 2 minggu sekali: simpan ponsel di dalam tas, tatap mata pasangan, dan bicarakan impian, memori indah, atau hal-hal konyol yang menyenangkan.`,
      }),
    },
  },

  // ==========================================
  // PILLAR 7: CONFLICT RESOLUTION (Q27 - Q30)
  // ==========================================

  // Q27 - Admitting Mistakes & Apologizing
  {
    id: 'conf-q27-appreciate-apology',
    pillar: 'conflict',
    category: 'appreciate',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q27',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 91,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const humbleName = ansA >= ansB ? nameA : nameB;
        return {
          title: `Keberanian Mengakui Kesalahan: Menanggalkan Ego Demi Keutuhan Cinta`,
          explanation: `Kemampuan untuk menanggalkan ego dan berani berkata "Maaf, aku keliru" adalah sifat langka dan sangat mulia. Kesiapan ${humbleName} untuk meminta maaf adalah jembatan pemulihan yang menyelamatkan hubungan dari jurang dendam.`,
          recommendation: `Jangan pernah memanfaatkan kata maaf pasangan untuk merasa menang atau menari di atas kesalahannya. Sambut dengan pelukan hangat dan kata: "Terima kasih sudah berani minta maaf, kita perbaiki ini sama-sama."`,
        };
      },
    },
  },
  {
    id: 'conf-q27-support-safe-apology',
    pillar: 'conflict',
    category: 'support',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q27',
      evaluate: (a, b) => true,
      baseRelevance: 87,
      generate: ({ nameA, nameB }) => ({
        title: 'Ciptakan Iklim yang Memudahkan Pasangan Mengakui Kesalahannya',
        explanation: `Seseorang enggan meminta maaf jika permintaan maafnya justru dibalas dengan ceramah panjang atau diungkit terus di kemudian hari. Membuat permintaan maaf terasa aman mengikis sikap keras kepala.`,
        recommendation: `Ketika pasangan meminta maaf, segera tutup perdebatan dan katakan: "Aku hargai kejujuranmu, aku maafkan, dan masalah ini kita anggap selesai."`,
      }),
    },
  },

  // Q28 - Solution-oriented vs Being Right
  {
    id: 'conf-q28-strengths-us-vs-problem',
    pillar: 'conflict',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q28',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 97,
      generate: ({ nameA, nameB }) => ({
        title: 'Mindset Emas: "Kita Melawan Masalah", Bukan "Aku Melawan Kamu"',
        explanation: `Kalian berdua memiliki kedewasaan untuk mengutamakan keutuhan hubungan daripada hasrat kekanak-kanakan membuktikan siapa yang menang atau kalah. Kemenangan sejati adalah saat kalian berdua keluar dari masalah sebagai satu tim yang semakin rekat.`,
        recommendation: `Saat perdebatan mulai memanas, ingat mantra ini: "Jika salah satu dari kita kalah, hubungan kita berdua yang kalah. Mari kita cari jalan keluar yang bikin kita berdua tenang."`,
      }),
    },
  },
  {
    id: 'conf-q28-growth-curiosity',
    pillar: 'conflict',
    category: 'growth',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q28',
      evaluate: (a, b) => a <= 3 || b <= 3,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: 'Mengganti Tuduhan dengan Keingintahuan (Curiosity over Judgment)',
        explanation: `Ketika kecewa, kita sering langsung berasumsi buruk tentang niat pasangan. Mengganti praduga dengan pertanyaan yang tulus membuka ruang penyelesaian yang damai.`,
        recommendation: `Ganti kalimat tuduhan "Kenapa kamu begitu?!" dengan kalimat bijak: "Bantu aku memahami apa yang sedang kamu rasakan saat mengambil tindakan tadi."`,
      }),
    },
  },

  // Q29 - Cooldown Time Alone
  {
    id: 'conf-q29-understand-cooldown-safety',
    pillar: 'conflict',
    category: 'understand',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q29',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 92,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const coolDownName = ansA >= ansB ? nameA : nameB;
        const partnerName = ansA >= ansB ? nameB : nameA;
        return {
          title: `Waktu Sendiri bagi ${coolDownName} adalah Cara Menjaga Cinta dari Kata yang Menyakiti`,
          explanation: `Saat konflik memuncak, ${coolDownName} membutuhkan waktu menyendiri untuk menurunkan denyut jantung dan meredakan luapan emosi. Sikap menarik diri ini bukan pengabaian terhadap ${partnerName}, melainkan rem darurat agar tidak melontarkan kalimat kasar yang disesali seumur hidup.`,
          recommendation: `${partnerName}, jangan memburu atau mendesak ${coolDownName} saat ia meminta waktu sendiri. Berikan waktu 1–2 jam sambil meyakinkan bahwa kamu menunggunya dengan penuh kasih sayang.`,
        };
      },
    },
  },
  {
    id: 'conf-q29-support-hold-space',
    pillar: 'conflict',
    category: 'support',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q29',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 88,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const partnerName = ansA >= ansB ? nameB : nameA;
        const coolDownName = ansA >= ansB ? nameA : nameB;
        return {
          title: `Beri Jaminan Cinta untuk ${partnerName} Saat Meminta Jeda Emosi`,
          explanation: `Bagi orang yang ditinggal menenangkan diri, keheningan bisa terasa seperti penolakan yang menakutkan. Memberi jaminan cinta sebelum menyendiri meredakan ketakutan tersebut.`,
          recommendation: `Sebelum ${coolDownName} menyendiri, peluk pasangan dan ucapkan kalimat penenang: "Aku cuma butuh waktu 1 jam menenangkan kepala ya, aku sayang kamu dan kita baik-baik saja."`,
        };
      },
    },
  },

  // Q30 - Resolution without Harm
  {
    id: 'conf-q30-strengths-sacred-words',
    pillar: 'conflict',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q30',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 96,
      generate: ({ nameA, nameB }) => ({
        title: 'Kesucian Lisan: Komitmen Menyelesaikan Masalah Tanpa Melukai Martabat',
        explanation: `Kalian berdua memiliki kesepakatan batin yang sangat luhur bahwa perdebatan tidak boleh diwarnai makian, penghinaan fisik/keluarga, atau ancaman perpisahan. Perlindungan batas lisan ini membuat hubungan kalian memiliki rasa aman psikologis yang tak tergoyahkan.`,
        recommendation: `Pegang teguh aturan ini selamanya: marah boleh, kecewa boleh, tetapi rasa hormat dan kehormatan pasangan tidak boleh diinjak dalam kondisi apa pun.`,
      }),
    },
  },
  {
    id: 'conf-q30-microhabit-deescalation',
    pillar: 'conflict',
    category: 'micro_habit',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q30',
      evaluate: (a, b) => true,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: 'Menerapkan "Sandi Gencatan Senjata" Saat Perdebatan Mulai Melenceng',
        explanation: `Ketika debat semakin liar dan mulai mengungkit masa lalu yang tidak relevan, memiliki kata sandi atau sinyal jeda membantu kalian kembali ke titik kesadaran.`,
        recommendation: `Sepakati satu kata sandi lucu atau hangat (misal: "Temurasa!" atau memegang kedua telinga): ketika diucapkan, kedua pihak wajib berhenti bicara selama 5 menit untuk meredakan tensi.`,
      }),
    },
  },
];

/**
 * Deterministically generates the comprehensive "Perjalanan Memahami Satu Sama Lain"
 * based on actual couple assessment answers.
 *
 * GUARANTEES:
 * 1. STRICT GLOBAL DEDUPLICATION across all 6 subsections.
 * 2. Every single subsection receives UNIQUE, highly specialized, non-repeating advice cards.
 * 3. 7 Pillars breakdown also prefers distinct cards so the user experiences fresh guidance throughout.
 */
export function generatePersonalizedJourney(
  rawAnswers: RawAnswer[],
  nameA: string,
  nameB: string,
  categoryScores: Array<{ categoryCode: string; categoryName: string; score: number }>
): PersonalizedRelationshipJourney {
  const answerMap = new Map<string, { a: number; b: number }>();
  for (const item of rawAnswers) {
    answerMap.set(item.questionCode, { a: item.answerA, b: item.answerB });
  }

  // 1. Evaluate all candidate rules
  const evaluatedInsights: InsightCard[] = [];

  for (const rule of INSIGHT_RULES) {
    const qData = answerMap.get(rule.condition.questionCode);
    if (!qData) continue;

    const isTriggered = rule.condition.evaluate(qData.a, qData.b);
    if (isTriggered) {
      const generated = rule.condition.generate({
        nameA,
        nameB,
        ansA: qData.a,
        ansB: qData.b,
      });

      // Calculate dynamic relevance score based on answer difference and intensity
      const diff = Math.abs(qData.a - qData.b);
      const intensity = (qData.a + qData.b) / 2;
      let dynamicRelevance = rule.condition.baseRelevance;

      if (rule.category === 'differences') {
        dynamicRelevance += diff * 4;
      } else if (rule.category === 'strengths') {
        dynamicRelevance += (5 - diff) * 2 + intensity * 2;
      } else if (rule.category === 'understand' || rule.category === 'support') {
        dynamicRelevance += diff * 3 + intensity;
      }

      let perspectiveLabel = 'Untuk Kalian Berdua';
      if (rule.perspective === 'A_TO_B') {
        perspectiveLabel = `Untuk ${nameA} tentang ${nameB}`;
      } else if (rule.perspective === 'B_TO_A') {
        perspectiveLabel = `Untuk ${nameB} tentang ${nameA}`;
      }

      evaluatedInsights.push({
        id: rule.id,
        pillar: rule.pillar,
        pillarLabel: PILLAR_META[rule.pillar].label,
        category: rule.category,
        perspective: rule.perspective,
        perspectiveLabel,
        title: generated.title,
        explanation: generated.explanation,
        recommendation: generated.recommendation,
        relevanceScore: Math.round(dynamicRelevance),
        questionCode: rule.condition.questionCode,
        iconName: PILLAR_META[rule.pillar].icon,
      });
    }
  }

  // Sort by relevance score descending
  evaluatedInsights.sort((x, y) => y.relevanceScore - x.relevanceScore);

  // ----------------------------------------------------------------------
  // 2. STRICT GLOBAL DEDUPLICATION ACROSS ALL 6 SUBSECTIONS
  // ----------------------------------------------------------------------
  const usedGlobalCardIds = new Set<string>();

  const pickUniqueCards = (
    predicate: (c: InsightCard) => boolean,
    limit: number
  ): InsightCard[] => {
    const picked: InsightCard[] = [];
    for (const card of evaluatedInsights) {
      if (picked.length >= limit) break;
      if (!usedGlobalCardIds.has(card.id) && predicate(card)) {
        usedGlobalCardIds.add(card.id);
        picked.push(card);
      }
    }
    return picked;
  };

  // Subsection 1: What You Should Understand About Each Other (Understanding mindset, emotions, psychology)
  // Prioritizes directional understanding: A_TO_B and B_TO_A
  const whatToUnderstand = pickUniqueCards(
    (c) => c.category === 'understand',
    4
  );

  // Subsection 2: How You Can Support Each Other (Concrete action, caring deeds)
  // Strictly selects 'support' cards, ensuring 100% different insights from Subsection 1!
  const howToSupport = pickUniqueCards(
    (c) => c.category === 'support',
    4
  );

  // Subsection 3: What Makes You Strong Together (Shared strengths, aligned values)
  const whatMakesYouStrong = pickUniqueCards(
    (c) => c.category === 'strengths' || c.category === 'appreciate',
    4
  );

  // Subsection 4: Where You See Things Differently (Contrasting perspectives & compromise bridges)
  const whereYouSeeDifferently = pickUniqueCards(
    (c) => c.category === 'differences',
    4
  );

  // Subsection 5: Your Relationship Growth Opportunities (Maturity goals, growth areas)
  const growthOpportunities = pickUniqueCards(
    (c) => c.category === 'growth' || c.category === 'together',
    4
  );

  // Subsection 6: Your Next Small Steps Together (Micro-habits, actionable rituals)
  const nextSmallSteps = pickUniqueCards(
    (c) => c.category === 'micro_habit' || c.category === 'together',
    4
  );

  // Safety fallback: if any subsection has fewer than 2 cards, fill from remaining unused candidates
  const fillMissing = (arr: InsightCard[], fallbackPredicate: (c: InsightCard) => boolean, target: number) => {
    if (arr.length < target) {
      for (const card of evaluatedInsights) {
        if (arr.length >= target) break;
        if (!usedGlobalCardIds.has(card.id) && fallbackPredicate(card)) {
          usedGlobalCardIds.add(card.id);
          arr.push(card);
        }
      }
    }
  };

  fillMissing(whatToUnderstand, (c) => c.perspective !== 'BOTH', 3);
  fillMissing(howToSupport, (c) => c.perspective !== 'BOTH' || c.category === 'support', 3);
  fillMissing(whatMakesYouStrong, (c) => c.category === 'strengths' || c.category === 'appreciate', 3);
  fillMissing(whereYouSeeDifferently, (c) => c.category === 'differences' || c.relevanceScore > 85, 2);
  fillMissing(growthOpportunities, (c) => c.category === 'growth' || c.category === 'together', 3);
  fillMissing(nextSmallSteps, (c) => c.category === 'micro_habit' || c.category === 'together', 3);

  // ----------------------------------------------------------------------
  // 3. PILLAR BREAKDOWN (2-3 INSIGHTS PER PILLAR)
  // Prefers cards not shown in the top 6 subsections, or highest-scoring pillar cards
  // ----------------------------------------------------------------------
  const pillars: RelationshipPillar[] = [
    'communication',
    'emotional',
    'financial',
    'future',
    'conflict',
    'lifestyle',
    'values',
  ];

  const pillarBreakdown = pillars.map((p) => {
    const matchingInsights = evaluatedInsights.filter((c) => c.pillar === p);
    // Prioritize cards that weren't in top 6 subsections so user gets fresh advice
    const freshForPillar = matchingInsights.filter((c) => !usedGlobalCardIds.has(c.id));
    const pillarCards = (freshForPillar.length >= 2 ? freshForPillar : matchingInsights).slice(0, 2);

    const scoreItem = categoryScores.find(
      (cs) =>
        cs.categoryCode === p ||
        (p === 'values' && cs.categoryCode === 'family')
    );

    return {
      pillar: p,
      pillarLabel: PILLAR_META[p].label,
      score: scoreItem ? scoreItem.score : 80,
      insights: pillarCards,
    };
  });

  // Find lowest and highest pillars
  const sortedCategories = [...categoryScores].sort((a, b) => a.score - b.score);
  const lowest = sortedCategories[0]?.categoryName || 'Komunikasi';
  const highest = sortedCategories[sortedCategories.length - 1]?.categoryName || 'Koneksi Emosional';

  return {
    summary: {
      totalInsights: evaluatedInsights.length,
      primaryGrowthPillar: lowest,
      strongestSharedPillar: highest,
      executiveMessage: `Berdasarkan 30 jawaban komparatif, hubungan ${nameA} dan ${nameB} diperkuat oleh fondasi ${highest} yang kokoh. Ruang bertumbuh paling bermakna untuk dieksplorasi bersama saat ini terletak pada dimensi ${lowest}.`,
    },
    subsections: {
      whatToUnderstand,
      howToSupport,
      whatMakesYouStrong,
      whereYouSeeDifferently,
      growthOpportunities,
      nextSmallSteps,
    },
    pillarBreakdown,
  };
}
