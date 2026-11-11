/**
 * TEMURASA ADVANCED PERSONALIZED RELATIONSHIP INSIGHTS ENGINE
 * Generates deeply personalized, directional, empathetic, and actionable insights
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
  | 'together';

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
  // Test function receiving answerA and answerB (1 to 5)
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

// -------------------------------------------------------------
// COMPREHENSIVE INSIGHT RULES REPOSITORY (HUNDREDS OF COMBINATIONS)
// -------------------------------------------------------------
const INSIGHT_RULES: InsightRule[] = [
  // ==========================================
  // PILLAR 1: COMMUNICATION (Q01 - Q05)
  // ==========================================

  // Q01: Direct vs Indirect communication
  {
    id: 'comm-q01-a-direct-b-indirect',
    pillar: 'communication',
    category: 'understand',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q01',
      evaluate: (a, b) => a >= 4 && b <= 3,
      baseRelevance: 88,
      generate: ({ nameA, nameB }) => ({
        title: `Pahami Kebutuhan ${nameB} untuk Menata Pikiran`,
        explanation: `Jawaban kalian menunjukkan ${nameA} lebih nyaman mengutarakan masalah secara langsung, sedangkan ${nameB} cenderung membutuhkan waktu untuk memproses emosinya terlebih dahulu. Saat ${nameB} tidak langsung menjawab atau tampak menahan diri, bukan berarti ia abai—melainkan ia berhati-hati agar kata-katanya tidak memperkeruh suasana.`,
        recommendation: `Beri jeda sejenak saat ada isu yang sensitif. Tanyakan dengan lembut: "${nameB}, santai dulu ya. Kalau sudah lebih nyaman, kabari aku ya agar kita bisa ngobrol santai."`,
      }),
    },
  },
  {
    id: 'comm-q01-b-direct-a-indirect',
    pillar: 'communication',
    category: 'understand',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q01',
      evaluate: (a, b) => b >= 4 && a <= 3,
      baseRelevance: 88,
      generate: ({ nameA, nameB }) => ({
        title: `Pahami Kebutuhan ${nameA} untuk Merasa Aman Sebelum Berbicara`,
        explanation: `Ketika ada hal yang mengganjal, ${nameB} terbiasa segera membicarakannya tuntas. Namun, bagi ${nameA}, konfrontasi langsung bisa terasa menegangkan jika suasananya belum terasa tenang. ${nameA} lebih mudah terbuka ketika ia merasa ruang obrolan bebas dari intimidasi atau kritik tajam.`,
        recommendation: `Awali obrolan dengan nada suara tenang dan bahasa tubuh yang hangat. Yakinkan ${nameA}: "Aku ingin mendengar sudut pandangmu, tidak ada yang perlu ditakutkan."`,
      }),
    },
  },
  {
    id: 'comm-q01-both-direct',
    pillar: 'communication',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q01',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 85,
      generate: ({ nameA, nameB }) => ({
        title: 'Kekuatan: Kejujuran & Keberanian Bicara Terbuka',
        explanation: `Kalian berdua sama-sama memiliki keberanian untuk membicarakan ganjalan secara langsung tanpa memendamnya berlarut-larut. Ini adalah aset luar biasa dalam hubungan dewasa yang mencegah terbentuknya "gunung es" kekecewaan tersembunyi.`,
        recommendation: `Pertahankan kebiasaan ini dengan selalu mengimbangi keterusterangan menggunakan kelembutan tutur kata, agar kejujuran selalu terasa seperti pelukan, bukan serangan.`,
      }),
    },
  },

  // Q02: Frequency of daily updates
  {
    id: 'comm-q02-a-needs-updates',
    pillar: 'communication',
    category: 'support',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q02',
      evaluate: (a, b) => a >= 4 && b <= 3,
      baseRelevance: 82,
      generate: ({ nameA, nameB }) => ({
        title: `Kabar Singkat adalah Bahasa Rasa Aman bagi ${nameA}`,
        explanation: `Bagi ${nameA}, saling bertukar kabar sepanjang hari bukan bentuk posesif, melainkan cara ia merasakan kehadiran dan kehangatan ${nameB} di tengah kesibukan. Bagi ${nameB}, fokus kerja mungkin membuat ponsel dikesampingkan. Perbedaan ini bisa memicu salah paham jika tidak diselaraskan.`,
        recommendation: `Kirimkan pesan singkat 5 detik di sela kegiatan: "Aku lagi masuk rapat ya, nanti jam 12 aku kabari lagi." Kabar proaktif sederhana ini melipatgandakan rasa tenang ${nameA}.`,
      }),
    },
  },
  {
    id: 'comm-q02-b-needs-updates',
    pillar: 'communication',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q02',
      evaluate: (a, b) => b >= 4 && a <= 3,
      baseRelevance: 82,
      generate: ({ nameA, nameB }) => ({
        title: `Hadirkan Kepastian Melalui Kabar Rutin untuk ${nameB}`,
        explanation: `Berdasarkan jawaban kuesioner, ${nameB} merasa dihargai dan dirindukan ketika ${nameA} menyempatkan memberi kabar. Keheningan yang terlalu lama tanpa kejelasan bisa membuat ${nameB} merasa terabaikan secara emosional.`,
        recommendation: `Buat kebiasaan mikro: sapaan pagi sebelum memulai aktivitas dan kabar singkat saat jam makan siang. Konsistensi kecil ini sangat berarti bagi stabilitas hati ${nameB}.`,
      }),
    },
  },

  // Q04: Speed of resolution vs cool-down
  {
    id: 'comm-q04-resolution-urgency-diff',
    pillar: 'communication',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q04',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 92,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const impatientName = ansA > ansB ? nameA : nameB;
        const patientName = ansA > ansB ? nameB : nameA;
        return {
          title: 'Ritme Penyelesaian: Cepat vs Menunggu Suasana Tenang',
          explanation: `Ada perbedaan ritme dalam merespons kesalahpahaman. ${impatientName} merasa gelisah jika masalah tidak segera diselesaikan hari itu juga, sementara ${patientName} merasa diskusi saat emosi masih bergolak hanya akan memicu luka baru. Keduanya memiliki niat baik, hanya saja menggunakan strategi regulasi emosi yang berbeda.`,
          recommendation: `Terapkan aturan "Jeda Terjadwal": Jika suasana panas, sepakati jeda selama 45–60 menit untuk menenangkan diri, tetapi dengan janji tegas waktu kapan kalian akan kembali duduk berdua untuk menuntaskannya.`,
        };
      },
    },
  },

  // Q05: Listening vs Solving
  {
    id: 'comm-q05-listen-first-b-to-a',
    pillar: 'communication',
    category: 'support',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q05',
      evaluate: (a) => a >= 4,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: `Dengarkan & Validasi Perasaan ${nameA} Sebelum Memberi Solusi`,
        explanation: `Saat ${nameA} bercerita tentang kelelahan atau masalahnya, yang ia butuhkan pertama kali adalah validasi emosi bahwa perasaannya dimengerti. Memberikan nasihat atau solusi terlalu dini seringkali secara tidak sengaja membuat ${nameA} merasa keluhannya dianggap enteng atau diabaikan.`,
        recommendation: `Gunakan formula 3 tahap: (1) Tatap matanya dan dengarkan, (2) Katakan: "Pasti berat banget ya harimu, aku paham kenapa kamu capek", (3) Baru tanyakan: "Kamu ingin aku dengarkan saja, atau kita pikirkan solusinya bareng?"`,
      }),
    },
  },
  {
    id: 'comm-q05-listen-first-a-to-b',
    pillar: 'communication',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q05',
      evaluate: (_, b) => b >= 4,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: `Jadilah Tempat Berlabuh yang Mendengarkan bagi ${nameB}`,
        explanation: `Jawaban ${nameB} menegaskan bahwa ia sangat menghargai pasangan yang bisa menjadi pendengar setia tanpa buru-buru menghakimi atau menyodorkan solusi teknis. Kehadiran emosional ${nameA} adalah obat paling ampuh baginya saat penat.`,
        recommendation: `Saat ${nameB} berkeluh kesah, berikan pelukan atau sentuhan hangat di pundaknya. Tahan hasrat untuk mendebat fakta cerita, dan fokuslah pada validasi apa yang sedang dirasakannya.`,
      }),
    },
  },

  // ==========================================
  // PILLAR 2: EMOTIONAL CONNECTION (Q23 - Q26)
  // ==========================================

  // Q23: Words of affirmation
  {
    id: 'emo-q23-verbal-affirmation-a',
    pillar: 'emotional',
    category: 'understand',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q23',
      evaluate: (a) => a >= 4,
      baseRelevance: 86,
      generate: ({ nameA, nameB }) => ({
        title: `Kata-Kata Cinta & Apresiasi adalah Energi Hati ${nameA}`,
        explanation: `Meskipun tindakan nyata itu penting, bagi ${nameA}, mendengar ungkapan kasih sayang secara verbal memiliki dampak emosional yang mendalam. Kata-kata lembut seperti pujian, ungkapan terima kasih, dan pengakuan atas usahanya membuat tangki cintanya selalu penuh.`,
        recommendation: `Jangan biarkan apresiasi hanya tersimpan di dalam hati. Katakan secara spesifik: "Aku suka caramu memperlakukan aku", atau tinggalkan pesan manis kecil di tempat yang mudah ia temukan.`,
      }),
    },
  },
  {
    id: 'emo-q23-verbal-affirmation-b',
    pillar: 'emotional',
    category: 'understand',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q23',
      evaluate: (_, b) => b >= 4,
      baseRelevance: 86,
      generate: ({ nameA, nameB }) => ({
        title: `Ungkapkan Apresiasi Verbal Secara Rutin untuk ${nameB}`,
        explanation: `Bagi ${nameB}, penegasan rasa cinta lewat ucapan langsung adalah penopang keyakinan dalam hubungan. Kata-kata yang tulus bisa menghapus keraguan dan menyuntikkan semangat baru baginya di masa-masa sulit.`,
        recommendation: `Biasakan mengucap terima kasih atas hal-hal sederhana yang dilakukan ${nameB}, dan katakan betapa kamu bersyukur memilikinya sebagai pasangan hidup.`,
      }),
    },
  },

  // Q24: Remembering small details
  {
    id: 'emo-q24-small-details-both',
    pillar: 'emotional',
    category: 'appreciate',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q24',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 83,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const detailLover = ansA >= ansB ? nameA : nameB;
        return {
          title: 'Kekuatan Hal-Hal Kecil: Perhatian yang Terasa Nyata',
          explanation: `Bagi ${detailLover}, rasa cinta paling nyata terpancar bukan dari gestur megah, melainkan dari ingatan tentang hal-hal kecil: minuman kesukaan saat lelah, tanggal-tanggal bermakna, atau hal yang pernah diceritakan sepintas.`,
          recommendation: `Catat hal-hal favorit pasangan di catatan pribadi ponselmu. Kejutkan pasangan dengan membawakan camilan favoritnya tanpa diminta saat ia sedang lelah beraktivitas.`,
        };
      },
    },
  },

  // Q26: Long-term Romance
  {
    id: 'emo-q26-keep-romance-alive',
    pillar: 'emotional',
    category: 'together',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q26',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 87,
      generate: ({ nameA, nameB }) => ({
        title: 'Komitmen Menjaga Romantisme Tetap Menyala',
        explanation: `Kalian berdua sepakat bahwa hubungan jangka panjang tidak boleh kehilangan percikan romantis. Hubungan yang awet bukan terjadi secara kebetulan, melainkan hasil dari usaha yang disengaja (intentional dating) untuk terus saling memikat.`,
        recommendation: `Jadwalkan kencan berdua minimal 2 kali sebulan tanpa gadget dan tanpa membicarakan urusan logistik/masalah sehari-hari. Berdandanlah rapi seperti saat kalian pertama kali berkencan.`,
      }),
    },
  },

  // ==========================================
  // PILLAR 3: FINANCIAL MINDSET (Q06 - Q10)
  // ==========================================

  // Q06: Personal vs joint savings
  {
    id: 'fin-q06-personal-autonomy-diff',
    pillar: 'financial',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q06',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 90,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const autonomyName = ansA > ansB ? nameA : nameB;
        const poolingName = ansA > ansB ? nameB : nameA;
        return {
          title: 'Titik Temu Finansial: Otonomi Pribadi vs Penyatuan Penuh',
          explanation: `${autonomyName} merasa penting memiliki tabungan pribadi sebagai rasa aman psikologis, sedangkan ${poolingName} cenderung memandang komitmen hubungan idealnya mengarah pada keterbukaan dan penyatuan aset penuh. Perbedaan ini wajar dan bukan tanda ketidakjujuran.`,
          recommendation: `Terapkan sistem "Tiga Kantong Finansial": (1) Kantong Bersama untuk kebutuhan rumah tangga dan investasi masa depan, (2) Kantong Pribadi ${nameA}, dan (3) Kantong Pribadi ${nameB} yang bebas dipakai tanpa perlu izin detail pasangan.`,
        };
      },
    },
  },

  // Q07: Joint consultation on big expenses
  {
    id: 'fin-q07-big-expense-alignment',
    pillar: 'financial',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q07',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: 'Kekuatan: Transparansi & Musyawarah Pengeluaran Besar',
        explanation: `Kalian berdua memiliki prinsip yang selaras untuk mendiskusikan pengeluaran besar sebelum mengambil keputusan. Hal ini menghindarkan hubungan dari konflik finansial mendadak yang seringkali menjadi pemicu keretakan rumah tangga.`,
        recommendation: `Tetapkan batas nominal kesepakatan bersama, misalnya pengeluaran di atas Rp1.000.000 (atau nominal yang kalian sepakati) wajib dikomunikasikan berdua terlebih dahulu.`,
      }),
    },
  },

  // Q09: Financial transparency and debt disclosure
  {
    id: 'fin-q09-debt-transparency-support',
    pillar: 'financial',
    category: 'support',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q09',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 87,
      generate: ({ nameA, nameB }) => ({
        title: 'Membangun Ruang Aman untuk Keterbukaan Utang & Beban Finansial',
        explanation: `Membicarakan kondisi keuangan nyata—termasuk kewajiban masa lalu atau cicilan—membutuhkan keberanian luar biasa. Rasa takut dihakimi seringkali menjadi penghalang terbesar pasangan untuk jujur.`,
        recommendation: `Jadikan obrolan keuangan sebagai sesi "Bahas Solusi Bersama", bukan sesi investigasi. Respons kejujuran pasangan dengan terima kasih dan fokus pada strategi bersama ke depan.`,
      }),
    },
  },

  // Q10: Safety vs Lifestyle Upgrade
  {
    id: 'fin-q10-safety-vs-upgrade-diff',
    pillar: 'financial',
    category: 'differences',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q10',
      evaluate: (a, b) => Math.abs(a - b) >= 2,
      baseRelevance: 85,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const safetyName = ansA > ansB ? nameA : nameB;
        const enjoyName = ansA > ansB ? nameB : nameA;
        return {
          title: 'Menyeimbangkan Dana Darurat & Menikmati Hasil Kerja',
          explanation: `Ketika rezeki bertambah, ${safetyName} memprioritaskan rasa aman dengan memperbesar dana darurat/investasi, sementara ${enjoyName} merasa wajar meningkatkan kualitas hidup dan menikmati hasil jerih payah. Keduanya saling melengkapi jika dipadukan secara proporsional.`,
          recommendation: `Buat porsi terukur: saat ada kenaikan pendapatan, alokasikan 60–70% untuk akselerasi keamanan finansial (investasi/dana darurat) dan 30–40% untuk peningkatan kualitas hidup serta hadiah bagi kebersamaan kalian.`,
        };
      },
    },
  },

  // ==========================================
  // PILLAR 4: FUTURE & GOALS (Q19 - Q22)
  // ==========================================

  // Q21: Career support & personal ambition
  {
    id: 'fut-q21-career-support-a-to-b',
    pillar: 'future',
    category: 'support',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q21',
      evaluate: (_, b) => b >= 4,
      baseRelevance: 88,
      generate: ({ nameA, nameB }) => ({
        title: `Dukung Impian & Langkah Karier ${nameB}`,
        explanation: `Bagi ${nameB}, hubungan yang sehat adalah hubungan yang memberinya sayap untuk bertumbuh, bukan sangkar yang membatasi potensinya. Memiliki pasangan yang tulus mendukung perkembangan kariernya adalah sumber motivasi terbesar.`,
        recommendation: `Tanyakan secara berkala: "${nameB}, apa mimpi kariermu tahun ini yang bisa aku bantu dukung dari rumah/keseharian kita?" Jadilah pendukung nomor satu di setiap pencapaiannya.`,
      }),
    },
  },
  {
    id: 'fut-q21-career-support-b-to-a',
    pillar: 'future',
    category: 'support',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q21',
      evaluate: (a) => a >= 4,
      baseRelevance: 88,
      generate: ({ nameA, nameB }) => ({
        title: `Jadilah Mitra yang Menguatkan Ambisi ${nameA}`,
        explanation: `Berdasarkan jawaban kuesioner, ${nameA} sangat mendambakan pasangan yang menghargai dedikasi dan cita-cita profesionalnya. Ketika impian pribadinya dihargai, komitmennya terhadap keluarga justru semakin kokoh.`,
        recommendation: `Rayakan setiap kemenangan kecil ${nameA} dalam pekerjaannya. Berikan ruang dan pengertian saat ia harus lembur atau menghadapi tantangan besar dalam kariernya.`,
      }),
    },
  },

  // Q22: Shared Vision Alignment
  {
    id: 'fut-q22-shared-vision-strength',
    pillar: 'future',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q22',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 91,
      generate: ({ nameA, nameB }) => ({
        title: 'Kompas Bersama: Visi Masa Depan yang Selaras',
        explanation: `Kalian berdua memiliki kesadaran tinggi bahwa bahtera rumah tangga membutuhkan kompas yang sama. Memiliki visi masa depan yang seirama memberikan kekuatan saat badai kehidupan datang, karena kalian tahu persis ke mana arah pelabuhan yang dituju.`,
        recommendation: `Luangkan satu akhir pekan setiap tahun untuk "Annual Vision Check-in": menuliskan 3 target utama keluarga untuk tahun berikutnya, baik dari sisi spiritual, finansial, maupun tempat tinggal.`,
      }),
    },
  },

  // ==========================================
  // PILLAR 5: CONFLICT RESOLUTION (Q27 - Q30)
  // ==========================================

  // Q27: Admitting faults and apologizing
  {
    id: 'conf-q27-apology-humility',
    pillar: 'conflict',
    category: 'appreciate',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q27',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 86,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const humbleName = ansA >= ansB ? nameA : nameB;
        return {
          title: `Keberanian Mengakui Kesalahan: Jembatan Damai dari ${humbleName}`,
          explanation: `Kemampuan untuk menanggalkan ego dan berani berkata "Maaf, aku salah" adalah salah satu sifat paling langka dan berharga dalam hubungan. Kesiapan ${humbleName} untuk meminta maaf adalah fondasi kepercayaan yang menjaga hubungan tetap sehat.`,
          recommendation: `Jangan pernah memanfaatkan permintaan maaf pasangan sebagai senjata untuk merasa menang. Sambut permintaan maaf dengan pelukan dan kata-kata: "Terima kasih sudah berani minta maaf, kita perbaiki bareng ya."`,
        };
      },
    },
  },

  // Q28: Solution vs Being Right
  {
    id: 'conf-q28-solution-oriented-strength',
    pillar: 'conflict',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q28',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 93,
      generate: ({ nameA, nameB }) => ({
        title: 'Mindset Emas: "Kita Melawan Masalah", Bukan "Aku Melawan Kamu"',
        explanation: `Kalian berdua memiliki kedewasaan untuk mengutamakan solusi bersama daripada sibuk membuktikan siapa yang salah atau siapa yang benar. Pola pikir ini adalah pelindung terkuat hubungan dari racun defensif dan rasa dendam.`,
        recommendation: `Ketika terjadi perdebatan sengit, berhentilah sejenak dan ingat mantra ini: "Kemenangan sejati adalah saat hubungan kita tetap utuh, bukan saat salah satu dari kita berhasil memojokkan yang lain."`,
      }),
    },
  },

  // Q29: Needing cool-down time alone
  {
    id: 'conf-q29-cooldown-understanding',
    pillar: 'conflict',
    category: 'understand',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q29',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 89,
      generate: ({ nameA, nameB, ansA, ansB }) => {
        const coolDownName = ansA >= ansB ? nameA : nameB;
        const partnerName = ansA >= ansB ? nameB : nameA;
        return {
          title: `Waktu Sendiri bagi ${coolDownName} adalah Cara Menyelamatkan Hubungan`,
          explanation: `Saat konflik memuncak, ${coolDownName} membutuhkan waktu menyendiri untuk menurunkan detak jantung dan meredakan banjir emosi. Menarik diri ini bukan penolakan terhadap ${partnerName}, melainkan pertahanan diri agar tidak melontarkan kata-kata pedas yang disesali kelak.`,
          recommendation: `${partnerName}, jangan memburu atau mendesak ${coolDownName} saat ia meminta waktu sendiri. Berikan waktu 1–2 jam sambil meyakinkan bahwa kamu menunggunya dengan penuh kasih sayang.`,
        };
      },
    },
  },

  // ==========================================
  // PILLAR 6: LIFESTYLE & DAILY LIFE (Q15 - Q18)
  // ==========================================

  // Q18: Need for me-time and hobbies
  {
    id: 'life-q18-me-time-a-to-b',
    pillar: 'lifestyle',
    category: 'understand',
    perspective: 'B_TO_A',
    condition: {
      questionCode: 'Q18',
      evaluate: (a) => a >= 4,
      baseRelevance: 87,
      generate: ({ nameA, nameB }) => ({
        title: `Hargai Ruang Pribadi & Waktu "Me-Time" ${nameA}`,
        explanation: `Bagi ${nameA}, memiliki waktu untuk menjalankan hobi atau sekadar menyendiri adalah cara ia mengisi ulang energi jiwanya. Ruang pribadi ini justru membuatnya menjadi pasangan yang lebih ceria, sabar, dan penuh cinta saat kembali bersama.`,
        recommendation: `Dukung waktu hobi ${nameA} tanpa membuatnya merasa bersalah. Jadikan momen tersebut sebagai kesempatan bagi kamu sendiri untuk menikmati aktivitas pribadimu.`,
      }),
    },
  },
  {
    id: 'life-q18-me-time-b-to-a',
    pillar: 'lifestyle',
    category: 'understand',
    perspective: 'A_TO_B',
    condition: {
      questionCode: 'Q18',
      evaluate: (_, b) => b >= 4,
      baseRelevance: 87,
      generate: ({ nameA, nameB }) => ({
        title: `Beri ${nameB} Ruang untuk Bernapas dan Menjalankan Hobinya`,
        explanation: `Kebutuhan ${nameB} akan waktu sendiri tidak pernah berarti ia bosan bersamamu. Justru dengan memiliki ruang otonom, ${nameB} menjaga identitas dirinya tetap utuh di dalam ikatan pernikahan.`,
        recommendation: `Sepakati jadwal mingguan bebas tanpa agenda pasangan, di mana ${nameB} bisa bebas menekuni minatnya tanpa rasa terbebani.`,
      }),
    },
  },

  // Q16: Exploring new things & adventures
  {
    id: 'life-q16-shared-adventure',
    pillar: 'lifestyle',
    category: 'together',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q16',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 84,
      generate: ({ nameA, nameB }) => ({
        title: 'Jiwa Penjelajah: Menyuntikkan Kebaruan dalam Keseharian',
        explanation: `Kalian berdua sama-sama menyukai petualangan baru, baik mencoba kuliner unik, jalan-jalan ke tempat baru, maupun belajar keahlian baru bersama. Kebaruan (novelty) adalah bahan bakar terbaik untuk mencegah kebosanan dalam hubungan jangka panjang.`,
        recommendation: `Buat daftar "Temurasa Bucket List": tuliskan 5 tempat kuliner atau destinasi alam baru yang belum pernah kalian kunjungi dan jadwalkan untuk dikunjungi bergiliran setiap bulan.`,
      }),
    },
  },

  // ==========================================
  // PILLAR 7: VALUES & FAMILY (Q11 - Q14)
  // ==========================================

  // Q14: Healthy boundaries with extended family
  {
    id: 'val-q14-extended-family-boundaries',
    pillar: 'values',
    category: 'understand',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q14',
      evaluate: (a, b) => a >= 4 || b >= 4,
      baseRelevance: 90,
      generate: ({ nameA, nameB }) => ({
        title: 'Membangun Benteng Suci: Batasan Sehat dengan Keluarga Besar',
        explanation: `Mencintai dan berbakti pada orang tua serta mertua adalah keharusan, namun keutuhan dan privasi rumah tangga kalian berdua adalah prioritas utama. Perbedaan pendapat atau keputusan rumah tangga harus diselesaikan berdua di dalam kamar, bukan melibatkan pihak luar yang berisiko memperkeruh keadaan.`,
        recommendation: `Sepakati prinsip "Satu Suara": apa pun keputusan yang diambil (soal keuangan, pola asuh, atau rencana hidup), kalian menyampaikannya ke keluarga besar sebagai keputusan bersama, tanpa menyalahkan pasangan.`,
      }),
    },
  },

  // Q13: Keeping couple quality time after kids
  {
    id: 'val-q13-couple-first-mindset',
    pillar: 'values',
    category: 'together',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q13',
      evaluate: (a, b) => a >= 4 && b >= 4,
      baseRelevance: 89,
      generate: ({ nameA, nameB }) => ({
        title: 'Fondasi Utama Anak adalah Orang Tua yang Saling Mencintai',
        explanation: `Kalian berdua sepakat bahwa hadirnya anak tidak boleh menenggelamkan ikatan romantis sebagai pasangan. Hadiah terindah yang bisa diberikan orang tua kepada anak-anaknya adalah rumah tangga yang hangat dan penuh kasih sayang di antara kedua orang tuanya.`,
        recommendation: `Komitmenkan "15 Menit Obrolan Bantal (Pillow Talk)": sebelum tidur, luangkan waktu 15 menit tanpa membicarakan urusan anak atau pekerjaan, murni untuk menanyakan kabar hati satu sama lain.`,
      }),
    },
  },

  // Q11: Alignment on having children
  {
    id: 'val-q11-children-decision-alignment',
    pillar: 'values',
    category: 'strengths',
    perspective: 'BOTH',
    condition: {
      questionCode: 'Q11',
      evaluate: (a, b) => (a >= 4 && b >= 4) || (a <= 2 && b <= 2),
      baseRelevance: 94,
      generate: ({ nameA, nameB, ansA }) => ({
        title: 'Keselarasan Mendasar: Visi Kehadiran Anak',
        explanation: `Kalian memiliki pandangan dasar yang sangat selaras mengenai kehadiran buah hati dalam pernikahan (${ansA >= 4 ? 'kalian berdua sama-sama menginginkan anak' : 'kalian memiliki pandangan seirama'}). Ini adalah salah satu pilar komitmen paling fundamental yang meminimalkan krisis eksistensial dalam pernikahan.`,
        recommendation: `Lanjutkan keselarasan ini dengan mendiskusikan ekspektasi kesiapan mental, finansial, dan pembagian peran pengasuhan jauh-jauh hari dengan santai dan terbuka.`,
      }),
    },
  },
];

/**
 * Deterministically generates the comprehensive "Perjalanan Memahami Satu Sama Lain"
 * based on actual couple assessment answers.
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

  // Helper to deduplicate cards
  const dedupe = (cards: InsightCard[]): InsightCard[] => {
    const seen = new Set<string>();
    const result: InsightCard[] = [];
    for (const c of cards) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        result.push(c);
      }
    }
    return result;
  };

  // 2. Populate 6 Subsections
  // Subsection 1: What You Should Understand About Each Other (Directional)
  const whatToUnderstand = dedupe(
    evaluatedInsights.filter(
      (c) =>
        c.category === 'understand' ||
        (c.perspective !== 'BOTH' && (c.category === 'differences' || c.category === 'support'))
    )
  ).slice(0, 4);

  // Subsection 2: How You Can Support Each Other (Directional action)
  const howToSupport = dedupe(
    evaluatedInsights.filter(
      (c) => c.category === 'support' || (c.category === 'understand' && c.perspective !== 'BOTH')
    )
  ).slice(0, 4);

  // Subsection 3: What Makes You Strong Together (Shared strengths & values)
  const whatMakesYouStrong = dedupe(
    evaluatedInsights.filter((c) => c.category === 'strengths' || c.category === 'appreciate')
  ).slice(0, 4);

  // Subsection 4: Where You See Things Differently (Key differences & compromise)
  const whereYouSeeDifferently = dedupe(
    evaluatedInsights.filter((c) => c.category === 'differences')
  ).slice(0, 4);

  // Subsection 5: Your Relationship Growth Opportunities
  const growthOpportunities = dedupe(
    evaluatedInsights.filter(
      (c) => c.category === 'together' || c.category === 'differences' || c.category === 'understand'
    )
  ).slice(0, 4);

  // Subsection 6: Your Next Small Steps Together
  const nextSmallSteps = dedupe(
    evaluatedInsights.filter(
      (c) => c.category === 'together' || c.category === 'support' || c.category === 'strengths'
    )
  ).slice(0, 4);

  // 3. Pillar Breakdown (2–3 insights per pillar)
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
    const pillarInsights = dedupe(evaluatedInsights.filter((c) => c.pillar === p)).slice(0, 3);
    const scoreItem = categoryScores.find(
      (cs) =>
        cs.categoryCode === p ||
        (p === 'values' && cs.categoryCode === 'family')
    );

    return {
      pillar: p,
      pillarLabel: PILLAR_META[p].label,
      score: scoreItem ? scoreItem.score : 80,
      insights: pillarInsights,
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
