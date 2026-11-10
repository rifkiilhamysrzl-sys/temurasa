export interface RecommendedActivity {
  activityId: string;
  categoryCode: string;
  categoryName: string;
  title: string;
  description: string;
  instructions: string[];
  expectedBenefit: string;
  estimatedDuration: string;
  suggestedFrequency: string;
  relevantQuestions: string[];
  tags: string[];
  personalizedIntro?: string;
}

export interface ActivityTemplate {
  activityId: string;
  categoryCode: string;
  title: string;
  baseDescription: string;
  instructions: string[];
  expectedBenefit: string;
  estimatedDuration: string;
  suggestedFrequency: string;
  relevantQuestions: string[];
  tags: string[];
  generatePersonalizedIntro: (nameA: string, nameB: string, context?: any) => string;
}

/**
 * Dedicated Activity Library
 * Minimum 10 distinct activities for each of the 7 relationship dimensions (Total: 70+ activities).
 * Each activity has unique practical instructions, duration, frequency, and personalized introductory logic.
 */
export const ACTIVITY_LIBRARY: ActivityTemplate[] = [
  // =========================================================================
  // CATEGORY A — COMMUNICATION STYLE (10 ACTIVITIES)
  // =========================================================================
  {
    activityId: 'comm_question_night',
    categoryCode: 'communication',
    title: 'Question Night',
    baseDescription: 'Malam refleksi berdua menggunakan kartu pertanyaan terbuka untuk menggali pikiran, kenangan, dan impian yang jarang terucap dalam kesibukan sehari-hari.',
    instructions: [
      'Siapkan suasana santai tanpa gangguan gawai selama minimal 30 menit.',
      'Tuliskan masing-masing 5 pertanyaan reflektif tentang harapan, rasa syukur, atau kenangan masa lalu di secarik kertas.',
      'Kocok kertas pertanyaan dan jawab secara bergantian dengan jujur tanpa menyela.',
      'Setelah pasangan selesai menjawab, ucapkan terima kasih dan tanyakan satu pertanyaan lanjutan untuk memperdalam konteks.',
    ],
    expectedBenefit: 'Membuka lapisan percakapan baru yang lebih intim dan hangat di luar topik rutinitas harian.',
    estimatedDuration: '30–45 Menit',
    suggestedFrequency: 'Dua minggu sekali',
    relevantQuestions: ['Q01', 'Q02', 'Q03'],
    tags: ['open_questions', 'emotional_depth', 'storytelling'],
    generatePersonalizedIntro: (a, b) =>
      `Karena ${a} dan ${b} menghargai percakapan yang mendalam, aktivitas ini membantu menciptakan ruang yang nyaman untuk saling mengeksplorasi pikiran tanpa distraksi rutinitas harian.`,
  },
  {
    activityId: 'comm_active_listening',
    categoryCode: 'communication',
    title: 'Active Listening Challenge',
    baseDescription: 'Latihan mendengar aktif tanpa menyela, memotong, atau langsung menawarkan solusi sebelum pasangan merasa benar-benar didengarkan dan divalidasi.',
    instructions: [
      'Pilih satu topik tentang apa yang sedang membuat pikiran atau perasaan salah satu dari kalian terasa penuh.',
      'Partner pertama berbicara selama 5 menit penuh tanpa diinterupsi sedikit pun.',
      'Partner kedua menyimak dengan kontak mata dan mengulang kembali intisari emosi: "Yang aku tangkap, kamu merasa... Apakah benar begitu?"',
      'Tukar peran setelah pasangan merasa dipahami sepenuhnya.',
    ],
    expectedBenefit: 'Menghilangkan kebiasaan memberi nasihat terburu-buru dan memperkuat rasa aman bahwa perasaan pasangan diakui.',
    estimatedDuration: '20 Menit',
    suggestedFrequency: 'Sekali seminggu',
    relevantQuestions: ['Q05', 'Q01'],
    tags: ['active_listening', 'validation', 'no_interruptions'],
    generatePersonalizedIntro: (a, b) =>
      `Berdasarkan jawaban kalian mengenai pentingnya mendengarkan sebelum memberi solusi, latihan ini melatih kalian menjadi tempat berlabuh yang aman bagi perasaan pasangan.`,
  },
  {
    activityId: 'comm_appreciation_exchange',
    categoryCode: 'communication',
    title: 'Appreciation Exchange',
    baseDescription: 'Sesi pertukaran rasa terima kasih terperinci untuk kebaikan-kebaikan kecil yang sering luput atau dianggap biasa dalam rutinitas bersama.',
    instructions: [
      'Duduk berhadapan dalam posisi rileks.',
      'Sampaikan secara spesifik minimal 3 hal kecil yang dilakukan pasangan minggu ini yang membuatmu merasa terbantu atau disayangi.',
      'Gunakan format: "Aku sangat menghargai ketika kamu... karena itu membuatku merasa..."',
      'Terima apresiasi tersebut dengan senyuman dan pelukan hangat tanpa merendahkan diri.',
    ],
    expectedBenefit: 'Membangun rekening bank emosional positif yang melindungi hubungan dari rasa jenuh dan kritik.',
    estimatedDuration: '15 Menit',
    suggestedFrequency: 'Seminggu sekali (misal setiap Minggu malam)',
    relevantQuestions: ['Q02', 'Q03'],
    tags: ['gratitude', 'daily_kindness', 'positive_reinforcement'],
    generatePersonalizedIntro: (a, b) =>
      `Apresiasi yang diungkapkan secara tulus membantu ${a} dan ${b} menjaga kehangatan emosional serta memperkuat rasa saling dihargai dalam hubungan.`,
  },
  {
    activityId: 'comm_no_phone_convo',
    categoryCode: 'communication',
    title: 'No Phone Conversation',
    baseDescription: 'Ritual percakapan eksklusif tanpa layar ponsel untuk memulihkan kontak mata dan kehadiran batin sepenuhnya.',
    instructions: [
      'Letakkan kedua ponsel dalam mode senyap di ruangan lain atau dalam kotak khusus.',
      'Seduh minuman favorit berdua (teh hangat atau kopi) dan duduk berdampingan.',
      'Fokus membicarakan perasaan hari ini, hal lucu yang ditemui, atau mimpi sederhana akhir pekan.',
      'Pertahankan kontak mata penuh dan dengarkan nada suara pasangan dengan seksama.',
    ],
    expectedBenefit: 'Mengatasi fenomena "phubbing" (mengabaikan pasangan demi ponsel) dan menghidupkan kembali koneksi tatap muka yang intim.',
    estimatedDuration: '20–30 Menit',
    suggestedFrequency: 'Setiap hari sepulang beraktivitas',
    relevantQuestions: ['Q02', 'Q01'],
    tags: ['digital_detox', 'presence', 'eye_contact'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian menganggap kabar dan perhatian harian adalah hal berharga, momen bebas layar ponsel ini akan melipatgandakan kualitas kebersamaan kalian.`,
  },
  {
    activityId: 'comm_weekly_checkin',
    categoryCode: 'communication',
    title: 'Weekly Relationship Check-in',
    baseDescription: 'Pertemuan mingguan santai untuk mengecek suhu emosional hubungan, menguraikan sumbatan kecil, dan merayakan keberhasilan bersama.',
    instructions: [
      'Tentukan waktu tetap setiap akhir pekan yang disepakati bersama.',
      'Bahas 3 pertanyaan terpandu: (1) Apa yang berjalan sangat menyenangkan di antara kita minggu ini? (2) Apa hal yang terasa berat atau butuh dukungan lebih? (3) Bagaimana aku bisa mencintaimu lebih baik minggu depan?',
      'Catat hal-hal konkret yang bisa saling dibantu dalam beberapa hari ke depan.',
    ],
    expectedBenefit: 'Mencegah akumulasi kekecewaan terpendam dan membangun ritme perawatan hubungan yang berkelanjutan.',
    estimatedDuration: '25 Menit',
    suggestedFrequency: 'Setiap minggu',
    relevantQuestions: ['Q01', 'Q03'],
    tags: ['alignment', 'proactive_care', 'growth'],
    generatePersonalizedIntro: (a, b) =>
      `Karena ${a} dan ${b} lebih suka membicarakan hal secara langsung daripada memendamnya, sesi check-in mingguan ini adalah wadah proaktif terbaik untuk kalian.`,
  },
  {
    activityId: 'comm_story_behind_day',
    categoryCode: 'communication',
    title: 'Story Behind My Day',
    baseDescription: 'Berbagi bukan hanya sekadar jadwal aktivitas yang telah dilalui, melainkan perasaan dan makna di balik peristiwa-peristiwa tersebut.',
    instructions: [
      'Alih-alih hanya bertanya "Hari ini ngapain aja?", tanyakan: "Momen apa yang paling bikin kamu berenergi atau paling bikin lelah hari ini?"',
      'Dengarkan emosi yang menyertai cerita tersebut (rasa bangga, cemas, senang, atau lelah).',
      'Validasi perasaan pasangan sebelum membicarakan hal teknis lainnya.',
    ],
    expectedBenefit: 'Mengubah obrolan basa-basi menjadi jembatan empati yang mendalam terhadap dunia batin pasangan.',
    estimatedDuration: '15 Menit',
    suggestedFrequency: '3–4 kali seminggu',
    relevantQuestions: ['Q02', 'Q05'],
    tags: ['emotional_connection', 'daily_sharing', 'empathy'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini memperdalam cara kalian saling memberi kabar sehingga tidak sekadar informatif, melainkan penuh kehangatan rasa.`,
  },
  {
    activityId: 'comm_understanding_styles',
    categoryCode: 'communication',
    title: "Understanding Each Other's Communication Style",
    baseDescription: 'Eksplorasi bersama mengenai ritme dan cara komunikasi yang membuat masing-masing merasa nyaman saat lelah atau sedang tenang.',
    instructions: [
      'Tuliskan jawaban pribadi untuk pertanyaan: "Saat aku sedang lelah atau overwhelmed, caraku berkomunikasi biasanya..." dan "Hal yang paling kubutuhkan saat itu adalah..."',
      'Saling tukar catatan dan bacakan jawaban pasangan dengan empati.',
      'Sepakati sinyal lembut yang bisa digunakan saat salah satu dari kalian membutuhkan ketenangan sejenak.',
    ],
    expectedBenefit: 'Mengurangi salah sangka ketika salah satu pasangan sedang butuh waktu mencerna atau diam sejenak.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setiap 6 bulan atau saat fase hidup baru',
    relevantQuestions: ['Q04', 'Q01'],
    tags: ['self_awareness', 'tempo', 'mutual_respect'],
    generatePersonalizedIntro: (a, b) =>
      `Memahami ritme komunikasi satu sama lain membantu ${a} dan ${b} menghindari kesalahpahaman saat salah satu pihak sedang kehabisan energi sosial.`,
  },
  {
    activityId: 'comm_unspoken_conversation',
    categoryCode: 'communication',
    title: 'The Unspoken Conversation',
    baseDescription: 'Memberikan ruang yang aman untuk menyampaikan hal-hal yang selama ini ragu disampaikan karena khawatir menyinggung pasangan.',
    instructions: [
      'Awali sesi dengan menegaskan niat kasih: "Aku menyampaikan ini bukan untuk menyalahkan, tapi karena aku peduli pada keintiman kita."',
      'Gunakan rumus kalimat "I-Statement": "Aku merasa... ketika... dan harapanku ke depan adalah..."',
      'Pasangan menyimak tanpa menyela membela diri, lalu mengapresiasi keberanian pasangan untuk jujur.',
    ],
    expectedBenefit: 'Mengikis dinding kekhawatiran dan membuktikan bahwa hubungan kalian cukup tangguh untuk menampung kejujuran yang lembut.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q03', 'Q01'],
    tags: ['courage', 'honesty', 'vulnerability'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian sama-sama ingin tumbuh dalam kenyamanan menyampaikan isi hati, latihan ini menjaga kejujuran tetap berjalan selaras dengan kelembutan.`,
  },
  {
    activityId: 'comm_three_things_to_know',
    categoryCode: 'communication',
    title: 'Three Things I Want You to Know',
    baseDescription: 'Refleksi sederhana untuk membagikan hal-hal terkini yang sedang berkecamuk dalam pikiran yang mungkin belum sempat terbagi.',
    instructions: [
      'Masing-masing menulis 3 hal: (1) Satu hal yang sedang kupikirkan akhir-akhir ini, (2) Satu hal yang membuatku bersyukur memilikimu, (3) Satu hal yang kuharapkan bisa kita lakukan bersama minggu ini.',
      'Saling bacakan di tempat yang tenang sambil bergandengan tangan.',
      'Diskusikan bagaimana kalian bisa saling mendukung rencana tersebut.',
    ],
    expectedBenefit: 'Menjaga sinkronisasi pikiran dan harapan pasangan secara teratur dan ringan.',
    estimatedDuration: '20 Menit',
    suggestedFrequency: 'Dua minggu sekali',
    relevantQuestions: ['Q02', 'Q03'],
    tags: ['lighthearted', 'intentional', 'connection'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini menyelaraskan harapan dan pikiran terkini ${a} dan ${b} dengan format yang ringkas, menyenangkan, dan berdaya rekat emosional tinggi.`,
  },
  {
    activityId: 'comm_communication_agreement',
    categoryCode: 'communication',
    title: 'Our Communication Agreement',
    baseDescription: 'Merumuskan 3 kesepakatan etika berbicara saat berdiskusi topik penting agar percakapan selalu terasa menghargai martabat berdua.',
    instructions: [
      'Diskusikan pengalaman percakapan terbaik yang pernah kalian lalui: apa yang membuatnya terasa sangat nyaman?',
      'Sepakati 3 aturan emas komunikasi kalian (contoh: tidak memotong bicara, menurunkan nada suara saat lelah, dan menatap mata saat mendengar).',
      'Tuliskan kesepakatan ini di catatan bersama di ponsel sebagai pengingat saling menjaga.',
    ],
    expectedBenefit: 'Memberikan standar perilaku yang jelas dan disepakati bersama untuk melindungi kualitas dialog kalian selamanya.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Sekali dibuat, dievaluasi setiap 6 bulan',
    relevantQuestions: ['Q01', 'Q05'],
    tags: ['rules_of_engagement', 'safety', 'respect'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian memiliki kesepakatan tinggi dalam mengutamakan dialog sehat, piagam komunikasi ini akan menjadi panduan abadi kalian berdua.`,
  },

  // =========================================================================
  // CATEGORY B — FINANCIAL COMPATIBILITY (10 ACTIVITIES)
  // =========================================================================
  {
    activityId: 'fin_couple_money_date',
    categoryCode: 'financial',
    title: 'Couple Money Date',
    baseDescription: 'Kencan santai berdua berbalut suasana nyaman untuk mengevaluasi arus kas dan rencana belanja tanpa ketegangan atau penghakiman.',
    instructions: [
      'Pilih lokasi yang menyenangkan (kedai kopi favorit atau meja makan berhias lilin).',
      'Siapkan minuman hangat dan camilan enak sebelum membuka catatan keuangan.',
      'Tinjau pengeluaran sebulan terakhir dengan fokus mengapresiasi keberhasilan berhemat bersama.',
      'Bahas rencana belanja bersama untuk 30 hari ke depan dengan santai dan terbuka.',
    ],
    expectedBenefit: 'Mengubah topik uang yang biasanya tegang menjadi momen kerja sama yang intim dan produktif.',
    estimatedDuration: '45 Menit',
    suggestedFrequency: 'Sebulan sekali (setelah tanggal gajian)',
    relevantQuestions: ['Q07', 'Q09'],
    tags: ['money_date', 'budgeting', 'transparency'],
    generatePersonalizedIntro: (a, b) =>
      `Karena ${a} dan ${b} menunjukkan kedewasaan dalam transparansi pengeluaran, Money Date berkala ini akan menjaga rencana finansial kalian tetap rapi dan menyenangkan.`,
  },
  {
    activityId: 'fin_shared_vision',
    categoryCode: 'financial',
    title: 'Shared Financial Vision',
    baseDescription: 'Penyelarasan impian finansial masa depan: mendefinisikan arti "kemandirian finansial" dan gaya hidup yang ingin dibangun berdua.',
    instructions: [
      'Masing-masing menjawab pertanyaan: "Arti keamanan finansial bagiku adalah..." dan "Satu impian besar yang ingin kita capai lewat tabungan adalah..."',
      'Bandingkan jawaban kalian dan temukan titik temu antara kebutuhan menabung untuk rasa aman dan alokasi untuk menikmati hidup.',
      'Rancang komitmen bersama untuk mencapai impian finansial nomor satu kalian.',
    ],
    expectedBenefit: 'Menghindari konflik prioritas belanja karena kedua belah pihak paham tujuan luhur di balik uang yang ditabung.',
    estimatedDuration: '40 Menit',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q06', 'Q08'],
    tags: ['shared_goals', 'future_wealth', 'values'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini membantu kalian menyelaraskan makna uang bagi masa depan, sehingga setiap rupiah yang disisihkan memiliki tujuan emosional yang disepakati.`,
  },
  {
    activityId: 'fin_needs_vs_wants',
    categoryCode: 'financial',
    title: 'Needs vs Wants Challenge',
    baseDescription: 'Diskusi menyenangkan untuk menyepakati definisi kebutuhan primer vs keinginan sekunder dalam gaya hidup bersama.',
    instructions: [
      'Ambil 10 pos pengeluaran rutin kalian (makan di luar, langganan streaming, liburan, pakaian, dll.).',
      'Bagi pos-pos tersebut ke dalam kategori: "Kebutuhan Pokok", "Kenyamanan Bernilai Tinggi", dan "Keinginan yang Bisa Dievaluasi".',
      'Cari kesepakatan bersama mengenai pos mana yang bisa dioptimalkan tanpa mengurangi kebahagiaan berdua.',
    ],
    expectedBenefit: 'Mencegah friksi mengenai belanja impulsif dan menciptakan keselarasan standar gaya hidup.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setiap 3 bulan',
    relevantQuestions: ['Q08', 'Q06'],
    tags: ['mindful_spending', 'priorities', 'lifestyle_balance'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian memiliki perspektif yang matang seputar pengelolaan uang, tantangan ini mempertajam kebijaksanaan kalian dalam menyeimbangkan tabungan dan kesenangan.`,
  },
  {
    activityId: 'fin_future_budget_planning',
    categoryCode: 'financial',
    title: 'Future Budget Planning',
    baseDescription: 'Merancang simulasi anggaran realistis untuk fase hidup berikutnya (pernikahan, hunian pertama, atau tabungan keluarga).',
    instructions: [
      'Tuliskan proyeksi estimasi pemasukan dan pengeluaran tetap bersama.',
      'Terapkan formula alokasi yang disepakati (misalnya 50% kebutuhan hidup, 30% tabungan masa depan, 20% gaya hidup & sosial).',
      'Sepakati rekening atau pos penampungan dana agar arus kas dapat dimonitor bersama dengan transparan.',
    ],
    expectedBenefit: 'Memberikan kepastian angka dan ketenangan batin dalam melangkah menuju jenjang hidup bersama.',
    estimatedDuration: '45–60 Menit',
    suggestedFrequency: 'Setiap 6 bulan sekali',
    relevantQuestions: ['Q07', 'Q09'],
    tags: ['budget_simulation', 'stability', 'practical_steps'],
    generatePersonalizedIntro: (a, b) =>
      `Perencanaan anggaran masa depan ini membumikan niat baik ${a} dan ${b} ke dalam peta angka yang terukur dan menenangkan hati.`,
  },
  {
    activityId: 'fin_dream_purchase_planning',
    categoryCode: 'financial',
    title: 'Dream Purchase Planning',
    baseDescription: 'Memilih satu barang atau pengalaman impian bersama dan menyusun strategi menabung bertahap untuk mewujudkannya tanpa utang konsumtif.',
    instructions: [
      'Pilih satu impian yang sama-sama kalian dambakan (misal perjalanan liburan spesial atau perlengkapan rumah idaman).',
      'Hitung total nominal yang dibutuhkan dan bagi ke dalam periode waktu target (misal 6 bulan atau 12 bulan).',
      'Tentukan nominal setoran bulanan yang sanggup disisihkan berdua ke rekening terpisah.',
      'Rayakan setiap kali progres tabungan mencapai 50% dan 100%.',
    ],
    expectedBenefit: 'Membangun sensasi kemenangan bersama dalam mencapai target nyata lewat disiplin finansial berdua.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Sekali setahun',
    relevantQuestions: ['Q06', 'Q08'],
    tags: ['reward', 'discipline', 'shared_joy'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini membuktikan bahwa menabung bersama bukan tentang membatasi diri, melainkan tentang merayakan impian yang diperjuangkan berdua.`,
  },
  {
    activityId: 'fin_transparency_session',
    categoryCode: 'financial',
    title: 'Financial Transparency Session',
    baseDescription: 'Ruang aman tanpa rahasia untuk saling terbuka mengenai kondisi keuangan, komitmen cicilan, serta kebiasaan belanja masing-masing.',
    instructions: [
      'Masing-masing menyampaikan secara transparan posisi aset, tabungan, dan kewajiban/cicilan yang sedang berjalan.',
      'Fokus mendengarkan dengan sikap suportif tanpa menyalahkan masa lalu.',
      'Bahas batas nominal belanja pribadi yang bebas dilakukan tanpa perlu konfirmasi (Threshold Limit) demi menjaga otonomi yang sehat.',
    ],
    expectedBenefit: 'Membangun fondasi integritas dan rasa saling percaya penuh tanpa rasa curiga.',
    estimatedDuration: '40 Menit',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q07', 'Q09'],
    tags: ['trust', 'transparency', 'integrity'],
    generatePersonalizedIntro: (a, b) =>
      `Keterbukaan yang dilandasi rasa aman membuat ${a} dan ${b} dapat bermitra secara jujur tanpa ada beban rahasia keuangan.`,
  },
  {
    activityId: 'fin_emergency_fund_challenge',
    categoryCode: 'financial',
    title: 'Emergency Fund Challenge',
    baseDescription: 'Tantangan bersama mengumpulkan dana darurat 3–6 bulan pengeluaran rutin sebagai jaring pengaman rumah tangga.',
    instructions: [
      'Hitung estimasi pengeluaran wajib bulanan kalian berdua jika terjadi kondisi tak terduga.',
      'Tentukan target awal dana darurat (misal 3 kali pengeluaran bulanan).',
      'Sepakati pos-pos pengeluaran yang bisa dialihkan sementara ke dana darurat ini setiap bulannya.',
      'Tentukan kriteria apa saja yang sah dikategorikan sebagai "kondisi darurat".',
    ],
    expectedBenefit: 'Melindungi kestabilan hubungan dari guncangan ekonomi mendadak yang sering memicu stres pasangan.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Dievaluasi setiap kuartal',
    relevantQuestions: ['Q06', 'Q07'],
    tags: ['emergency_fund', 'security', 'risk_management'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian sama-sama menghargai ketenangan jangka panjang, pembentukan jaring pengaman ini akan mengukuhkan rasa aman dalam rumah tangga kalian.`,
  },
  {
    activityId: 'fin_five_year_money_goals',
    categoryCode: 'financial',
    title: 'Five-Year Money Goals',
    baseDescription: 'Merumuskan 3 pencapaian finansial strategis yang ingin diraih bersama dalam kurun waktu 5 tahun ke depan.',
    instructions: [
      'Tuliskan 3 target finansial 5 tahunan (contoh: dana uang muka rumah, dana pendidikan anak awal, atau modal usaha).',
      'Bagi target besar tersebut menjadi target tahunan dan target tabungan bulanan.',
      'Sepakati instrumen tabungan atau investasi yang cocok dengan profil risiko kenyamanan kalian berdua.',
    ],
    expectedBenefit: 'Menghubungkan kerja keras harian dengan pencapaian masa depan yang nyata dan membanggakan.',
    estimatedDuration: '45 Menit',
    suggestedFrequency: 'Setahun sekali',
    relevantQuestions: ['Q06', 'Q08'],
    tags: ['long_term_goals', 'wealth_building', 'milestones'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini memadukan mimpi besar ${a} dan ${b} dengan roadmap keuangan strategis yang kokoh untuk 5 tahun ke depan.`,
  },
  {
    activityId: 'fin_lifestyle_budget_challenge',
    categoryCode: 'financial',
    title: 'Lifestyle Budget Challenge',
    baseDescription: 'Eksperimen 1 minggu gaya hidup hemat cerdas yang mengasyikkan tanpa mengurangi romantisme kebersamaan.',
    instructions: [
      'Tantang diri kalian untuk berhemat 30% dari pos gaya hidup selama satu minggu (misal memasak menu restoran berdua di rumah).',
      'Alokasikan uang yang berhasil dihemat langsung ke rekening impian liburan kalian.',
      'Bahas apa yang kalian pelajari dari eksperimen ini: kenyamanan mana yang benar-benar esensial dan mana yang hanya kebiasaan konsumtif.',
    ],
    expectedBenefit: 'Membuktikan bahwa kebahagiaan dan keintiman tidak selalu bergantung pada pengeluaran bernominal tinggi.',
    estimatedDuration: '1 Minggu eksperimen (evaluasi 20 menit)',
    suggestedFrequency: 'Dua kali setahun',
    relevantQuestions: ['Q08', 'Q09'],
    tags: ['creative_budgeting', 'fun_challenge', 'teamwork'],
    generatePersonalizedIntro: (a, b) =>
      `Tantangan ringan ini mengasah kreativitas kalian dalam menikmati momen romantis yang berkualitas tinggi sekaligus ramah kantong.`,
  },
  {
    activityId: 'fin_monthly_review',
    categoryCode: 'financial',
    title: 'Monthly Financial Review',
    baseDescription: 'Ritual evaluasi 15 menit di akhir bulan untuk memastikan seluruh tagihan terbayar dan tabungan terisi sesuai rencana.',
    instructions: [
      'Buka bersama dashboard mutasi atau catatan keuangan keluarga selama 15 menit.',
      'Pastikan seluruh kewajiban rutin (tempat tinggal, listrik, asuransi, tabungan rencana) sudah terdistribusi dengan benar.',
      'Ucapkan terima kasih atas kerja keras masing-masing dalam menopang kehidupan bersama.',
    ],
    expectedBenefit: 'Menghilangkan stres keterlambatan tagihan dan menjaga transparansi keuangan tetap terkontrol.',
    estimatedDuration: '15–20 Menit',
    suggestedFrequency: 'Setiap akhir bulan',
    relevantQuestions: ['Q07', 'Q09'],
    tags: ['routine', 'accountability', 'peace_of_mind'],
    generatePersonalizedIntro: (a, b) =>
      `Ritual evaluasi singkat ini menjaga perahu finansial ${a} dan ${b} tetap berada di jalur yang aman dan terkendali setiap bulannya.`,
  },

  // =========================================================================
  // CATEGORY C — FAMILY & CHILDREN (10 ACTIVITIES)
  // =========================================================================
  {
    activityId: 'fam_vision_board',
    categoryCode: 'family',
    title: 'Family Vision Board',
    baseDescription: 'Merangkai gambaran suasana rumah tangga yang ingin kalian bangun: nilai-nilai kehangatan, suasana meja makan, dan perlakuan terhadap sesama.',
    instructions: [
      'Diskusikan suasana emosional rumah tangga yang kalian dambakan (hangat, santai, teratur, atau penuh tawa).',
      'Pilih 5 kata kunci utama yang menjadi pilar rumah kalian (contoh: Kasih, Rasa Aman, Saling Menghargai, Terbuka, Rendah Hati).',
      'Tuliskan kata kunci ini di media yang mudah terlihat sebagai pedoman moral rumah tangga berdua.',
    ],
    expectedBenefit: 'Menyatukan gambaran batin tentang suasana keluarga yang ingin diwujudkan bersama.',
    estimatedDuration: '40 Menit',
    suggestedFrequency: 'Sekali dibuat, dievaluasi setahun sekali',
    relevantQuestions: ['Q10', 'Q13'],
    tags: ['family_values', 'home_culture', 'atmosphere'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian berdua memiliki kepedulian mendalam terhadap fondasi keluarga, visi bersama ini akan menjadi jiwa dari rumah tangga kalian.`,
  },
  {
    activityId: 'fam_parenting_values',
    categoryCode: 'family',
    title: 'Parenting Values Discussion',
    baseDescription: 'Eksplorasi nilai-nilai pengasuhan utama yang ingin ditanamkan jika kalian berdua memilih memiliki anak di masa depan.',
    instructions: [
      'Diskusikan bagaimana cara kalian ingin merespons emosi anak, mengajarkan empati, dan menyikapi disiplin.',
      'Jika ada perbedaan pandangan tentang waktu atau keputusan memiliki anak, diskusikan makna dan kekhawatiran masing-masing secara suportif tanpa memaksakan kehendak.',
      'Sepakati bahwa keharmonisan dan rasa aman relasi orang tua adalah hadiah terbaik untuk tumbuh kembang anak.',
    ],
    expectedBenefit: 'Mencegah perbedaan pola asuh di masa depan dan menyelaraskan nilai moral sejak dini.',
    estimatedDuration: '45 Menit',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q10', 'Q11'],
    tags: ['parenting_style', 'values', 'child_rearing'],
    generatePersonalizedIntro: (a, b) =>
      `Diskusi pengasuhan ini memberikan ruang yang matang bagi ${a} dan ${b} untuk menyepakati prinsip bimbingan dan cinta dalam keluarga.`,
  },
  {
    activityId: 'fam_future_traditions',
    categoryCode: 'family',
    title: 'Our Future Family Traditions',
    baseDescription: 'Merancang tradisi khas keluarga kecil kalian (ritual liburan, tradisi hari raya, atau sarapan akhir pekan) yang membedakan dari keluarga asal.',
    instructions: [
      'Ingat kembali tradisi keluarga masa kecil yang paling membekas di hati masing-masing.',
      'Pilih tradisi mana yang ingin dipertahankan dan ciptakan minimal 2 tradisi baru yang orisinal milik kalian berdua.',
      'Rencanakan kapan tradisi pertama ini akan mulai dipraktikkan.',
    ],
    expectedBenefit: 'Membangun identitas unik keluarga kecil yang mempererat rasa memiliki dan kebanggaan bersama.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setahun sekali menjelang akhir tahun atau hari raya',
    relevantQuestions: ['Q13', 'Q10'],
    tags: ['traditions', 'rituals', 'family_identity'],
    generatePersonalizedIntro: (a, b) =>
      `Tradisi keluarga yang dirancang bersama memperkuat jati diri unik rumah tangga ${a} dan ${b} sebagai tim keluarga yang mandiri.`,
  },
  {
    activityId: 'fam_time_planning',
    categoryCode: 'family',
    title: 'Family Time Planning',
    baseDescription: 'Menyusun jadwal berkualitas untuk keluarga inti dan menyeimbangkannya dengan komitmen silaturahmi keluarga besar.',
    instructions: [
      'Tentukan hari atau blok waktu tertentu dalam seminggu yang dikhususkan murni untuk keluarga inti tanpa interupsi pekerjaan luar.',
      'Diskusikan ritme kunjungan atau acara keluarga besar (misal setiap dua minggu atau sebulan sekali).',
      'Pastikan kedua belah pihak merasa porsi waktu tersebut adil dan tidak memicu kelelahan fisik/emosional.',
    ],
    expectedBenefit: 'Menjaga kehangatan keluarga inti sekaligus merawat relasi dengan orang tua dan kerabat secara seimbang.',
    estimatedDuration: '25 Menit',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q13', 'Q12'],
    tags: ['time_management', 'family_balance', 'boundaries'],
    generatePersonalizedIntro: (a, b) =>
      `Perencanaan waktu keluarga ini melindungi keintiman inti kalian sekaligus menjaga kehangatan relasi dengan keluarga besar.`,
  },
  {
    activityId: 'fam_parenting_roles',
    categoryCode: 'family',
    title: 'Parenting Role Discussion',
    baseDescription: 'Pembagian peran pengasuhan dan tugas domestik yang setara, fleksibel, dan saling melengkapi.',
    instructions: [
      'Tuliskan daftar tugas harian pengasuhan dan domestik (menjaga anak, kebersihan rumah, logistik makanan).',
      'Bagi tugas tersebut berdasarkan kenyamanan dan ketersediaan waktu masing-masing secara adil.',
      'Sepakati prinsip "tidak ada tugas yang tabu bagi salah satu pihak": saling back-up saat salah satu pasangan sedang lelah atau sakit.',
    ],
    expectedBenefit: 'Mencegah kelelahan sepihak (*burnout*) dan membangun rasa kemitraan sejati dalam rumah tangga.',
    estimatedDuration: '35 Menit',
    suggestedFrequency: 'Setiap 6 bulan atau saat pergantian jadwal kerja',
    relevantQuestions: ['Q11', 'Q10'],
    tags: ['equal_partnership', 'teamwork', 'domestic_chores'],
    generatePersonalizedIntro: (a, b) =>
      `Karena ${a} dan ${b} mengutamakan kerja sama yang setara, pembagian peran yang jelas akan meringankan beban dan memperkuat kekompakan tim.`,
  },
  {
    activityId: 'fam_boundary_conversation',
    categoryCode: 'family',
    title: 'Family Boundary Conversation',
    baseDescription: 'Menyepakati batasan sehat dan santun antara ranah privasi rumah tangga inti dengan keterlibatan keluarga besar/orang tua.',
    instructions: [
      'Diskusikan hal-hal apa saja yang merupakan wilayah keputusan mutlak kalian berdua (keuangan, pola asuh, pemilihan tempat tinggal).',
      'Sepakati bagaimana cara merespons nasihat orang tua dengan tetap santun dan berbakti tanpa mengorbankan kesepakatan berdua.',
      'Terapkan prinsip: masing-masing menjadi komunikator utama ke keluarga besarnya sendiri untuk topik sensitif.',
    ],
    expectedBenefit: 'Mencegah campur tangan luar yang merusak keharmonisan rumah tangga serta merawat rasa hormat timbal balik.',
    estimatedDuration: '40 Menit',
    suggestedFrequency: 'Sebelum menikah dan dievaluasi saat ada momen penting keluarga',
    relevantQuestions: ['Q12', 'Q13'],
    tags: ['healthy_boundaries', 'extended_family', 'protection'],
    generatePersonalizedIntro: (a, b) =>
      `Batasan sehat yang disepakati bersama akan menjadi benteng pelindung kedamaian dan kemandirian rumah tangga kalian.`,
  },
  {
    activityId: 'fam_childhood_memories',
    categoryCode: 'family',
    title: 'Childhood Memories Exchange',
    baseDescription: 'Saling mendengarkan cerita masa kecil dan pola asuh orang tua masing-masing untuk memahami akar respons emosional saat ini.',
    instructions: [
      'Ceritakan kenangan masa kecil yang paling membahagiakan dan satu kenangan yang paling membuat sedih atau terluka.',
      'Refleksikan bagaimana pola pengasuhan orang tua memengaruhi kebiasaan atau ketakutan kalian hari ini.',
      'Bahas bersama hal positif apa yang ingin diwarisi dan hal kurang menyenangkan apa yang ingin diputus mata rantainya.',
    ],
    expectedBenefit: 'Menumbuhkan empati mendalam terhadap cara pasangan bersikap dan merespons situasi tertentu.',
    estimatedDuration: '45 Menit',
    suggestedFrequency: 'Sekali atau dua kali dalam momen refleksi mendalam',
    relevantQuestions: ['Q10', 'Q12'],
    tags: ['childhood_roots', 'empathy', 'healing'],
    generatePersonalizedIntro: (a, b) =>
      `Mengenal cerita masa kecil pasangan membantu ${a} dan ${b} saling mengasihi secara utuh beserta latar belakang kehidupannya.`,
  },
  {
    activityId: 'fam_family_priorities',
    categoryCode: 'family',
    title: 'Our Family Priorities',
    baseDescription: 'Menentukan 3 prioritas utama keluarga dalam kurun waktu 1 tahun ke depan agar energi dan perhatian terfokus.',
    instructions: [
      'Tuliskan prioritas keluarga tahun ini (misal: kesehatan keluarga, stabilitas tabungan, atau waktu santai berkualitas bersama).',
      'Bahas konsekuensi praktis dari prioritas tersebut (misal jika prioritas kesehatan, kurangi memesan makanan cepat saji).',
      'Lakukan review berkala untuk memastikan keputusan harian sejalan dengan prioritas tersebut.',
    ],
    expectedBenefit: 'Menjaga arah kehidupan keluarga tetap fokus dan tidak terombang-ambing oleh ekspektasi lingkungan sosial.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setiap awal tahun',
    relevantQuestions: ['Q13', 'Q11'],
    tags: ['focus', 'family_goals', 'harmony'],
    generatePersonalizedIntro: (a, b) =>
      `Penyelarasan prioritas keluarga ini menjaga energi kalian tetap terarah pada hal-hal yang paling bernilai bagi kebahagiaan berdua.`,
  },
  {
    activityId: 'fam_parenting_scenarios',
    categoryCode: 'family',
    title: 'Future Parenting Scenarios',
    baseDescription: 'Simulasi santai menghadapi skenario pengasuhan anak yang realistis untuk menguji kekompakan dan pendekatan bersama.',
    instructions: [
      'Pilih skenario situasi: misalnya anak tantrum di tempat umum, anak mendapat nilai kurang baik di sekolah, atau anak meminta gawai lebih awal.',
      'Diskusikan bagaimana respons pertama masing-masing dan bagaimana kalian saling melengkapi tanpa saling menjatuhkan di depan anak.',
      'Sepakati aturan emas: jika ada perbedaan pendapat soal disiplin anak, bicarakan secara empat mata tanpa kehadiran anak.',
    ],
    expectedBenefit: 'Mempersiapkan mental kerja sama sebagai satu kesatuan tim yang solid di depan anak.',
    estimatedDuration: '35 Menit',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q10', 'Q11'],
    tags: ['simulation', 'parenting_teamwork', 'cohesion'],
    generatePersonalizedIntro: (a, b) =>
      `Simulasi skenario pengasuhan ini mengasah kekompakan ${a} dan ${b} agar selalu tampil sebagai tim yang solid dan sehati.`,
  },
  {
    activityId: 'fam_weekend_planning',
    categoryCode: 'family',
    title: 'Family Weekend Planning',
    baseDescription: 'Merancang akhir pekan keluarga yang menyegarkan fisik dan jiwa tanpa rasa terburu-buru.',
    instructions: [
      'Luangkan 10 menit setiap Kamis malam untuk merencanakan akhir pekan.',
      'Kombinasikan antara agenda silaturahmi keluarga, waktu istirahat di rumah, dan kegiatan menyenangkan bersama.',
      'Pastikan salah satu hari memiliki jeda waktu bebas agenda untuk menjaga suasana tetap relaks.',
    ],
    expectedBenefit: 'Menghindarkan akhir pekan dari rasa penat dan memastikan waktu istirahat keluarga terjaga dengan optimal.',
    estimatedDuration: '15 Menit',
    suggestedFrequency: 'Seminggu sekali (setiap Kamis)',
    relevantQuestions: ['Q13', 'Q12'],
    tags: ['weekend_routine', 'restful_home', 'refreshment'],
    generatePersonalizedIntro: (a, b) =>
      `Perencanaan akhir pekan ini memastikan waktu istirahat dan kebersamaan keluarga ${a} dan ${b} berlangsung berkualitas dan menenangkan.`,
  },

  // =========================================================================
  // CATEGORY D — LIFESTYLE COMPATIBILITY (10 ACTIVITIES)
  // =========================================================================
  {
    activityId: 'life_new_experience_date',
    categoryCode: 'lifestyle',
    title: 'New Experience Date',
    baseDescription: 'Mencoba satu hal baru yang belum pernah dicoba oleh kalian berdua (makanan asing, rute jalan baru, atau kelas kreasi).',
    instructions: [
      'Pilih satu aktivitas baru yang sama-sama belum pernah kalian lakukan berdua.',
      'Lakukan bersama dengan rasa ingin tahu dan kesiapan menertawakan kekonyolan yang mungkin terjadi.',
      'Selesai aktivitas, ceritakan kesan masing-masing dan putuskan apakah aktivitas tersebut layak dijadikan hobi baru.',
    ],
    expectedBenefit: 'Menyuntikkan hormon dopamin dan rasa segar ke dalam hubungan agar tidak terjebak dalam rasa bosan.',
    estimatedDuration: '2–3 Jam',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q16', 'Q14'],
    tags: ['adventure', 'novelty', 'fresh_energy'],
    generatePersonalizedIntro: (a, b) =>
      `Mencoba pengalaman baru bersama menjaga percikan rasa ingin tahu dan semangat petualangan ${a} dan ${b} tetap hidup dan menyegarkan.`,
  },
  {
    activityId: 'life_personal_space_calendar',
    categoryCode: 'lifestyle',
    title: 'Personal Space Calendar',
    baseDescription: 'Penyelarasan jadwal ruang pribadi (me-time) untuk hobi, teman, atau istirahat mandiri tanpa rasa bersalah.',
    instructions: [
      'Bahas bersama kebutuhan waktu sendiri masing-masing dalam seminggu (misal 3 jam untuk olahraga, membaca, atau berkumpul dengan sahabat).',
      'Tandai waktu tersebut di kalender bersama agar pasangan saling menghormati dan tidak menginterupsi.',
      'Gunakan waktu sendiri tersebut untuk mengisi ulang energi sehingga saat kembali berdua, kalian hadir dengan energi yang segar.',
    ],
    expectedBenefit: 'Mencegah rasa terkekang dan menjaga kemandirian individu yang sehat dalam pernikahan.',
    estimatedDuration: '15 Menit perencanaan',
    suggestedFrequency: 'Dua minggu sekali',
    relevantQuestions: ['Q15', 'Q14'],
    tags: ['healthy_autonomy', 'me_time', 'recharge'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian menghargai pentingnya ruang pribadi yang sehat, kalender ini memastikan kebutuhan me-time dan we-time berjalan seimbang tanpa salah paham.`,
  },
  {
    activityId: 'life_weekend_adventure',
    categoryCode: 'lifestyle',
    title: 'Weekend Adventure',
    baseDescription: 'Petualangan singkat di akhir pekan menjelajahi alam terbuka, taman kota, atau sudut kota yang belum terjamah.',
    instructions: [
      'Pilih destinasi luar ruangan yang terjangkau dalam 1–2 jam perjalanan.',
      'Bawa bekal sederhana dan nikmati jalan kaki santai sambil menghirup udara segar.',
      'Gunakan perjalanan ini untuk mengobrol ringan dan menikmati keindahan sekitar tanpa memikirkan pekerjaan.',
    ],
    expectedBenefit: 'Menyegarkan pikiran dari kepenatan rutinitas kerja dan mempererat kebersamaan fisik berdua.',
    estimatedDuration: 'Setengah hari',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q14', 'Q16'],
    tags: ['nature', 'weekend_getaway', 'physical_movement'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas petualangan akhir pekan ini memberikan jeda fisik yang sehat sekaligus memperkaya memori indah kebersamaan kalian.`,
  },
  {
    activityId: 'life_couple_bucket_list',
    categoryCode: 'lifestyle',
    title: 'Couple Bucket List',
    baseDescription: 'Menyusun daftar 20 hal menyenangkan yang ingin dilakukan berdua sebelum hari ulang tahun atau perayaan penting berikutnya.',
    instructions: [
      'Masing-masing menyumbang 10 ide kegiatan (dari yang sederhana seperti piknik di teras hingga yang menantang seperti naik gunung bersama).',
      'Gabungkan ke dalam satu daftar cantik di dinding atau buku jurnal bersama.',
      'Pilih satu kegiatan dari daftar tersebut untuk dieksekusi dalam 30 hari ke depan.',
    ],
    expectedBenefit: 'Memberikan antisipasi positif dan antusiasme bersama mengenai masa depan.',
    estimatedDuration: '40 Menit',
    suggestedFrequency: 'Setahun sekali',
    relevantQuestions: ['Q16', 'Q14'],
    tags: ['bucket_list', 'anticipation', 'fun'],
    generatePersonalizedIntro: (a, b) =>
      `Daftar bucket list ini menjadi katalog keceriaan yang akan selalu dinantikan oleh ${a} dan ${b} sepanjang perjalanan hidup bersama.`,
  },
  {
    activityId: 'life_hobby_exchange',
    categoryCode: 'lifestyle',
    title: 'Hobby Exchange',
    baseDescription: 'Mencoba menyelami dunia hobi pasangan selama satu hari dengan pikiran terbuka dan penuh penghargaan.',
    instructions: [
      'Pilih satu hari di mana partner A mengajari atau mengajak partner B mencoba hobi favoritnya (misal memasak, bermain gim, berkebun, atau melukis).',
      'Partner yang diajari bersikap mendukung dan tidak mencela kesenangan pasangan.',
      'Tukar giliran di minggu berikutnya untuk hobi partner B.',
    ],
    expectedBenefit: 'Memperluas pemahaman tentang hal-hal yang membahagiakan pasangan dan menemukan potensi hobi bersama.',
    estimatedDuration: '2 Jam',
    suggestedFrequency: 'Setiap 2–3 bulan',
    relevantQuestions: ['Q15', 'Q16'],
    tags: ['curiosity', 'shared_interests', 'bonding'],
    generatePersonalizedIntro: (a, b) =>
      `Saling menyelami hobi membuktikan perhatian tulus kalian pada apa yang membahagiakan dunia pribadi pasangan.`,
  },
  {
    activityId: 'life_dream_weekend_planning',
    categoryCode: 'lifestyle',
    title: 'Dream Weekend Planning',
    baseDescription: 'Merancang akhir pekan impian yang memadukan relaksasi total, makanan favorit, dan waktu intim tanpa beban rutinitas.',
    instructions: [
      'Diskusikan versi akhir pekan terbaik menurut masing-masing (apakah seharian bersantai membaca buku atau menjelajah kafe baru).',
      'Rancang kompromi manis yang menggabungkan elemen istirahat dan kegiatan aktif.',
      'Lakukan persiapan logistik sejak hari kerja agar saat akhir pekan tiba, kalian tinggal menikmati suasana.',
    ],
    expectedBenefit: 'Mencegah kelelahan akhir pekan dan memberikan pengalaman pemulihan tenaga yang memuaskan kedua belah pihak.',
    estimatedDuration: '25 Menit perencanaan',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q14', 'Q15'],
    tags: ['rest', 'rejuvenation', 'weekend_harmony'],
    generatePersonalizedIntro: (a, b) =>
      `Perencanaan akhir pekan impian ini menghadirkan perpaduan sempurna antara waktu santai berdua dan istirahat yang berkualitas.`,
  },
  {
    activityId: 'life_daily_routine_mapping',
    categoryCode: 'lifestyle',
    title: 'Daily Routine Mapping',
    baseDescription: 'Penyelarasan ritme aktivitas harian (waktu bangun tidur, olahraga, dan waktu tidur) agar ritme rumah tangga berjalan selaras.',
    instructions: [
      'Petakan ritme harian masing-masing: jam produktif, jam istirahat, dan jam ingin mengobrol.',
      'Cari titik temu di mana kalian bisa menikmati waktu bersama (misal minum teh pagi 15 menit atau membaca sebelum tidur).',
      'Hormati perbedaan ritme biologis (misal antara early bird dan night owl) tanpa saling memaksakan.',
    ],
    expectedBenefit: 'Mengurangi gesekan seputar kebiasaan harian dan membangun ritme hidup bersama yang nyaman.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Saat ada perubahan ritme kerja atau setahun sekali',
    relevantQuestions: ['Q17', 'Q14'],
    tags: ['circadian_rhythm', 'daily_flow', 'domestic_peace'],
    generatePersonalizedIntro: (a, b) =>
      `Karena ${a} dan ${b} peduli pada kenyamanan rutinitas harian, pemetaan ritme ini menyelaraskan irama hidup berdua dengan sangat anggun.`,
  },
  {
    activityId: 'life_digital_detox_date',
    categoryCode: 'lifestyle',
    title: 'Digital Detox Date',
    baseDescription: 'Setengah hari penuh mematikan koneksi internet gawai untuk hadir utuh menikmati alam, buku, dan percakapan berdua.',
    instructions: [
      'Sepakati waktu (misal Minggu pagi jam 08.00–13.00) di mana ponsel dimatikan atau disimpan di laci.',
      'Lakukan kegiatan analog: memasak bersama dari buku resep, bermain permainan papan (*board game*), atau piknik di taman.',
      'Rasakan bagaimana waktu terasa melambat dan pikiran menjadi jauh lebih jernih dan tenang.',
    ],
    expectedBenefit: 'Menurunkan kadar stres digital dan memulihkan kedekatan organik yang hangat.',
    estimatedDuration: '4–5 Jam',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q17', 'Q14'],
    tags: ['digital_wellness', 'mindfulness', 'slow_living'],
    generatePersonalizedIntro: (a, b) =>
      `Detoks gawai ini mengembalikan fokus perhatian kalian sepenuhnya pada sentuhan, tatapan, dan percakapan nyata yang menghangatkan jiwa.`,
  },
  {
    activityId: 'life_one_new_place_monthly',
    categoryCode: 'lifestyle',
    title: 'One New Place Every Month',
    baseDescription: 'Komitmen mengunjungi satu tempat baru setiap bulan yang belum pernah didatangi sebelumnya.',
    instructions: [
      'Buat daftar kandidat tempat baru (taman kota, museum, perpustakaan, restoran autentik, atau pasar seni).',
      'Pilih satu tempat setiap bulan secara bergantian: bulan ganjil ditentukan partner A, bulan genap oleh partner B.',
      'Abadikan satu foto kebersamaan terbaik di tempat tersebut untuk album kenangan.',
    ],
    expectedBenefit: 'Menambah perbendaharaan cerita bersama dan merawat semangat eksplorasi dalam hubungan.',
    estimatedDuration: '2–3 Jam',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q16', 'Q14'],
    tags: ['exploration', 'monthly_ritual', 'shared_memories'],
    generatePersonalizedIntro: (a, b) =>
      `Tradisi mengunjungi tempat baru ini memperkaya perbendaharaan memori manis dan memperluas cakrawala kebersamaan ${a} dan ${b}.`,
  },
  {
    activityId: 'life_shared_lifestyle_vision',
    categoryCode: 'lifestyle',
    title: 'Shared Lifestyle Vision',
    baseDescription: 'Mendefinisikan bersama standar hidup sehat, pola konsumsi makanan, dan kenyamanan lingkungan rumah.',
    instructions: [
      'Diskusikan kebiasaan kesehatan apa yang ingin dijaga bersama (misal rutin jalan kaki 30 menit, pola makan sayur, atau jam tidur teratur).',
      'Tentukan bagaimana kalian bisa saling menyemangati tanpa merasa dihakimi.',
      'Jadikan kesehatan fisik sebagai investasi jangka panjang agar bisa menikmati kebersamaan hingga usia senja.',
    ],
    expectedBenefit: 'Meningkatkan vitalitas tubuh dan kualitas kesehatan bersama sebagai modal hidup panjang berdampingan.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q17', 'Q15'],
    tags: ['healthy_living', 'vitality', 'long_term_wellness'],
    generatePersonalizedIntro: (a, b) =>
      `Keselarasan gaya hidup sehat ini membuktikan komitmen kalian untuk saling merawat fisik demi kebersamaan jangka panjang yang berkualitas.`,
  },

  // =========================================================================
  // CATEGORY E — FUTURE VISION (10 ACTIVITIES)
  // =========================================================================
  {
    activityId: 'fut_dream_mapping',
    categoryCode: 'future',
    title: 'Dream Mapping',
    baseDescription: 'Memetakan 5 impian terbesar yang ingin diwujudkan bersama dalam kurun waktu 5 tahun ke depan ke dalam lembar impian bersama.',
    instructions: [
      'Masing-masing menuliskan 5 impian terbesar (karier, tempat tinggal, spiritual, atau kontribusi sosial).',
      'Bandingkan kedua daftar, cari kesamaan, dan diskusikan bagaimana impian yang berbeda bisa saling melengkapi.',
      'Rangkum menjadi 3 target inti bersama dan pajang di tempat yang sering terlihat.',
    ],
    expectedBenefit: 'Mengubah angan-angan abstrak menjadi arah bersama yang jelas, inspiratif, dan terarah.',
    estimatedDuration: '30–45 Menit',
    suggestedFrequency: 'Setiap awal tahun atau setiap 6 bulan',
    relevantQuestions: ['Q18', 'Q21'],
    tags: ['vision', 'dream_mapping', 'alignment'],
    generatePersonalizedIntro: (a, b) =>
      `Karena ${a} dan ${b} menunjukkan keselarasan tinggi dalam merancang masa depan, pemetaan impian ini memusatkan daya cipta kalian pada tujuan yang sama.`,
  },
  {
    activityId: 'fut_five_year_timeline',
    categoryCode: 'future',
    title: 'Five-Year Life Timeline',
    baseDescription: 'Menyusun garis waktu fase kehidupan dari tahun ke tahun untuk mengantisipasi tonggak penting (karier, keluarga, dan tempat tinggal).',
    instructions: [
      'Gambarkan garis horizontal sederhana bertuliskan tahun ke-1 hingga tahun ke-5.',
      'Plotkan peristiwa penting yang diharapkan terjadi di setiap tahun (misal: penyelesaian studi, promosi karier, kepindahan, atau persiapan pensiun dini).',
      'Periksa apakah ada tahun yang terlalu padat beban emosional/finansialnya dan sesuaikan ritmenya secara realistis.',
    ],
    expectedBenefit: 'Memberikan gambaran besar tentang ritme hidup sehingga langkah-langkah harian terasa mantap dan tenang.',
    estimatedDuration: '45 Menit',
    suggestedFrequency: 'Setahun sekali',
    relevantQuestions: ['Q18', 'Q20'],
    tags: ['timeline', 'milestones', 'strategic_planning'],
    generatePersonalizedIntro: (a, b) =>
      `Garis waktu 5 tahunan ini memberi kalian peta jalan yang menenangkan, sehingga setiap tahap kehidupan dapat dilalui dengan kesiapan penuh.`,
  },
  {
    activityId: 'fut_future_budget_date',
    categoryCode: 'future',
    title: 'Future Budget Date',
    baseDescription: 'Merencanakan implikasi keuangan dari impian jangka panjang kalian agar setiap cita-cita memiliki pijakan aksi nyata.',
    instructions: [
      'Pilih 3 cita-cita jangka panjang dari peta impian kalian.',
      'Lakukan riset perkiraan dana yang dibutuhkan untuk masing-masing tujuan tersebut.',
      'Tentukan langkah awal yang bisa diambil dalam 30 hari ke depan (misal membuka tabungan khusus atau konsultasi profesional).',
    ],
    expectedBenefit: 'Mencegah impian masa depan hanya berhenti sebagai angan-angan dengan memberi fondasi finansial yang konkret.',
    estimatedDuration: '45 Menit',
    suggestedFrequency: 'Setiap 3–6 bulan',
    relevantQuestions: ['Q20', 'Q21'],
    tags: ['financial_action', 'goal_funding', 'empowerment'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini mengawinkan visi masa depan yang luhur dengan tindakan praktis yang terukur demi mewujudkan impian kalian.`,
  },
  {
    activityId: 'fut_career_vision_discussion',
    categoryCode: 'future',
    title: 'Career Vision Discussion',
    baseDescription: 'Mendukung ambisi dan cita-cita profesional masing-masing serta menyelaraskan dampaknya terhadap kehidupan rumah tangga.',
    instructions: [
      'Ceritakan aspirasi karier atau usaha kalian dalam 3 tahun ke depan: apa capaian yang paling ingin diraih?',
      'Diskusikan bagaimana kalian bisa saling memberikan dukungan praktis dan mental di rumah saat periode kerja padat tiba.',
      'Sepakati bagaimana menyikapi peluang mutasi kerja atau perubahan arah karier dengan tetap mengutamakan kebersamaan.',
    ],
    expectedBenefit: 'Menjadi supporter nomor satu bagi pertumbuhan pasangan tanpa merasa tersaingi atau diabaikan.',
    estimatedDuration: '40 Menit',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q19', 'Q18'],
    tags: ['career_support', 'professional_growth', 'mutual_cheerleader'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian saling peduli terhadap kemajuan pasangan, diskusi ini memastikan karier ${a} dan ${b} berkembang seiring dengan kehangatan rumah tangga.`,
  },
  {
    activityId: 'fut_dream_home_planning',
    categoryCode: 'future',
    title: 'Dream Home Planning',
    baseDescription: 'Mendiskusikan kriteria tempat tinggal ideal: lokasi, suasana lingkungan, dan rasa aman yang ingin dihadirkan di rumah masa depan.',
    instructions: [
      'Bahas preferensi tempat tinggal (kota besar, pinggiran kota yang tenang, dekat alam, atau dekat keluarga besar).',
      'Tuliskan 3 hal non-negosiasi yang harus ada di tempat tinggal masa depan kalian (misal: ventilasi udara baik, keamanan lingkungan, akses fasilitas).',
      'Riset opsi realistis dan simpan referensi tersebut dalam folder impian bersama.',
    ],
    expectedBenefit: 'Menyatukan preferensi tempat bertumbuh keluarga dan mencegah gesekan seputar keputusan domisili di kemudian hari.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setiap 6–12 bulan',
    relevantQuestions: ['Q19', 'Q18'],
    tags: ['housing', 'nesting', 'sanctuary'],
    generatePersonalizedIntro: (a, b) =>
      `Membicarakan konsep rumah impian memperkuat visi ${a} dan ${b} tentang tempat bernaung yang aman dan penuh damai.`,
  },
  {
    activityId: 'fut_life_milestone_mapping',
    categoryCode: 'future',
    title: 'Life Milestone Mapping',
    baseDescription: 'Merayakan tonggak pencapaian yang telah berhasil dilalui dan merumuskan tonggak berikutnya dengan rasa syukur.',
    instructions: [
      'Tuliskan kembali 3 tonggak pencapaian terbesar yang sudah berhasil kalian lewati bersama hingga hari ini.',
      'Apresiasi ketangguhan dan kekompakan kalian saat melalui masa-masa sulit tersebut.',
      'Definisikan tonggak berikutnya yang ingin diraih dalam kurun waktu 12 bulan ke depan.',
    ],
    expectedBenefit: 'Mengingatkan diri bahwa kalian adalah tim yang tangguh dan mampu melewati rintangan bersama.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setiap ulang tahun hubungan atau akhir tahun',
    relevantQuestions: ['Q18', 'Q21'],
    tags: ['resilience', 'milestones', 'gratitude'],
    generatePersonalizedIntro: (a, b) =>
      `Mengingat kembali tonggak sejarah perjuangan kalian menumbuhkan keyakinan kuat bahwa masa depan kalian berada di tangan yang tepat.`,
  },
  {
    activityId: 'fut_shared_goal_prioritization',
    categoryCode: 'future',
    title: 'Shared Goal Prioritization',
    baseDescription: 'Menyaring beragam keinginan masa depan dan menetapkan 1 prioritas tunggal yang menjadi fokus utama kuartal ini.',
    instructions: [
      'Kumpulkan semua rencana yang sedang ada di kepala kalian.',
      'Pilih hanya 1 target utama yang jika berhasil dicapai, akan memberikan dampak positif terbesar bagi hubungan berdua.',
      'Curahkan energi, tabungan, dan doa bersama untuk menyukseskan prioritas tunggal tersebut.',
    ],
    expectedBenefit: 'Menghindari rasa lelah akibat terlalu banyak target simultan (*goal overload*) dan mempercepat pencapaian nyata.',
    estimatedDuration: '25 Menit',
    suggestedFrequency: 'Setiap awal kuartal (3 bulan sekali)',
    relevantQuestions: ['Q18', 'Q20'],
    tags: ['focus', 'quarterly_sprint', 'execution'],
    generatePersonalizedIntro: (a, b) =>
      `Fokus pada satu prioritas strategis ini membuat langkah ${a} dan ${b} jauh lebih ringan, efektif, dan bertenaga.`,
  },
  {
    activityId: 'fut_future_travel_planning',
    categoryCode: 'future',
    title: 'Future Travel Planning',
    baseDescription: 'Merancang rencana perjalanan bermakna ke tempat yang memperluas wawasan spiritual, budaya, atau rekreasi berdua.',
    instructions: [
      'Pilih satu destinasi impian yang ingin dikunjungi dalam 1–2 tahun mendatang.',
      'Riset bersama keunikan tempat tersebut, budaya lokal, dan pengalaman istimewa apa yang ingin dirasakan berdua.',
      'Buat tabungan celengan perjalanan khusus dan tetapkan target bulan keberangkatan.',
    ],
    expectedBenefit: 'Menghadirkan titik antisipasi kebahagiaan yang dinantikan di masa depan dan menyegarkan wawasan bersama.',
    estimatedDuration: '40 Menit',
    suggestedFrequency: 'Setahun sekali',
    relevantQuestions: ['Q18', 'Q19'],
    tags: ['travel_goals', 'shared_adventure', 'horizon'],
    generatePersonalizedIntro: (a, b) =>
      `Merancang perjalanan impian ini memberi kalian jangkar kegembiraan yang manis untuk dinantikan dan diwujudkan berdua.`,
  },
  {
    activityId: 'fut_life_vision_board',
    categoryCode: 'future',
    title: 'Life Vision Board',
    baseDescription: 'Memvisualisasikan kehidupan impian bersama menggunakan gambar, kutipan inspiratif, dan simbol-simbol harapan di kanvas visual.',
    instructions: [
      'Kumpulkan gambar atau foto yang mewakili suasana masa depan yang kalian dambakan (suasana keluarga, karya, kedamaian batin).',
      'Susun bersama di sebuah papan atau kolase digital.',
      'Ceritakan alasan di balik setiap gambar yang dipilih dan rasakan energi positif yang mengalir dari visualisasi tersebut.',
    ],
    expectedBenefit: 'Mengaktifkan pikiran bawah sadar dan menyatukan intuisi visual tentang masa depan yang indah.',
    estimatedDuration: '45 Menit',
    suggestedFrequency: 'Setahun sekali',
    relevantQuestions: ['Q18', 'Q21'],
    tags: ['visualization', 'creative_couple', 'inspiration'],
    generatePersonalizedIntro: (a, b) =>
      `Kolase visual ini menjadi cermin terang dari impian bersama ${a} dan ${b} yang siap kalian wujudkan langkah demi langkah.`,
  },
  {
    activityId: 'fut_our_next_chapter',
    categoryCode: 'future',
    title: 'Our Next Chapter',
    baseDescription: 'Refleksi mendalam tentang babak kehidupan yang sedang ditutup dan babak baru yang siap dimulai bersama.',
    instructions: [
      'Diskusikan apa saja pelajaran terbesar yang kalian petik dari tahun-tahun sebelumnya.',
      'Tuliskan satu judul bab untuk babak hidup kalian berikutnya (misal: "Bab Membangun Kemandirian" atau "Bab Kedamaian dan Karya").',
      'Ucapkan doa dan komitmen untuk saling memegang tangan erat di babak baru tersebut.',
    ],
    expectedBenefit: 'Memberikan makna filosofis yang mendalam pada setiap fase pertumbuhan hubungan kalian.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Saat perayaan pergantian tahun atau momen ulang tahun hubungan',
    relevantQuestions: ['Q18', 'Q21'],
    tags: ['meaning', 'chapter_turn', 'deep_reflection'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini merangkum kedewasaan perjalanan kalian dan membuka babak kehidupan baru dengan penuh optimisme dan ketenangan batin.`,
  },

  // =========================================================================
  // CATEGORY F — EMOTIONAL NEEDS (10 ACTIVITIES)
  // =========================================================================
  {
    activityId: 'emo_heartfelt_appreciation',
    categoryCode: 'emotional',
    title: 'Heartfelt Appreciation Exchange',
    baseDescription: 'Pertukaran pengakuan tulus tentang kualitas karakter pasangan yang paling membuatmu kagum dan merasa beruntung memilikinya.',
    instructions: [
      'Sebutkan 3 sifat karakter pasangan yang paling kamu kagumi (misal: kesabaran, kejujuran, kehangatan, atau ketekunannya).',
      'Ceritakan satu momen nyata di mana sifat tersebut terlihat jelas dan menyentuh hatimu.',
      'Tatap mata pasangan saat menyampaikannya dan rasakan resonansi rasa terima kasih tersebut.',
    ],
    expectedBenefit: 'Meningkatkan rasa berharga pasangan (*self-worth*) dan mengukuhkan rasa syukur memiliki satu sama lain.',
    estimatedDuration: '20 Menit',
    suggestedFrequency: 'Dua minggu sekali',
    relevantQuestions: ['Q22', 'Q26'],
    tags: ['character_appreciation', 'heartfelt', 'affirmation'],
    generatePersonalizedIntro: (a, b) =>
      `Karena kalian menghargai ungkapan kasih yang tulus, apresiasi karakter ini memperdalam rasa saling kagum dan rasa aman emosional ${a} dan ${b}.`,
  },
  {
    activityId: 'emo_small_things_matter',
    categoryCode: 'emotional',
    title: 'Small Things That Matter',
    baseDescription: 'Mengidentifikasi tindakan-tindakan kecil harian yang paling efektif membuat pasangan merasa dicintai dan diperhatikan.',
    instructions: [
      'Tuliskan masing-masing 5 hal kecil yang jika dilakukan pasangan, membuat hatimu langsung merasa hangat (misal: dibuatkan minuman hangat, digenggam tangannya saat berjalan, atau dipeluk saat bangun pagi).',
      'Saling tukar daftar dan simpan di catatan ponsel.',
      'Pilih satu hal dari daftar pasangan untuk dipraktikkan tanpa diminta besok pagi.',
    ],
    expectedBenefit: 'Menghilangkan tebak-tebakan dalam memenuhi kebutuhan emosional dan menghidupkan perhatian yang tepat sasaran.',
    estimatedDuration: '20 Menit',
    suggestedFrequency: 'Setiap 3 bulan',
    relevantQuestions: ['Q23', 'Q24'],
    tags: ['daily_gestures', 'thoughtfulness', 'care'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini mempermudah kalian saling mencintai lewat bahasa tindakan kecil yang paling bermakna bagi hati pasangan.`,
  },
  {
    activityId: 'emo_emotional_checkin',
    categoryCode: 'emotional',
    title: 'Emotional Check-in',
    baseDescription: 'Pertanyaan pembuka harian untuk mengetahui kondisi tangki emosional pasangan: apakah sedang penuh, cukup, atau butuh diisi ulang.',
    instructions: [
      'Tanyakan dengan lembut: "Di skala 1 sampai 10, seberapa penuh baterai emosimu hari ini?"',
      'Jika nilainya di bawah 7, tanyakan kelanjutannya: "Apa yang membuat bateraimu terserap, dan bagaimana aku bisa membantumu mengisi ulangnya malam ini?"',
      'Hadirkan perhatian penuh tanpa menghakimi atau menyalahkan kelelahannya.',
    ],
    expectedBenefit: 'Mencegah ledakan emosi tak terduga dengan memonitor kelelahan batin secara proaktif.',
    estimatedDuration: '10–15 Menit',
    suggestedFrequency: 'Setiap hari atau 3 kali seminggu',
    relevantQuestions: ['Q25', 'Q26'],
    tags: ['emotional_battery', 'daily_care', 'proactive'],
    generatePersonalizedIntro: (a, b) =>
      `Karena ${a} dan ${b} peka terhadap kondisi emosi pasangan, ritual cek baterai emosi ini menjadi radar kasih sayang yang sangat menenangkan.`,
  },
  {
    activityId: 'emo_favorite_memory',
    categoryCode: 'emotional',
    title: 'My Favorite Memory',
    baseDescription: 'Mengingat dan menceritakan kembali momen paling manis atau paling mengharukan dalam perjalanan cinta kalian.',
    instructions: [
      'Pilih satu momen masa lalu di mana kamu merasa sangat dicintai, sangat dekat, atau sangat bangga pada pasangan.',
      'Ceritakan detail momen tersebut: apa yang kamu rasakan, suasana tempat saat itu, dan mengapa memori itu begitu berharga bagimu.',
      'Nikmati kehangatan nostalgia yang kembali menyala di antara kalian.',
    ],
    expectedBenefit: 'Menghidupkan kembali getaran cinta awal dan memperkokoh narasi positif sejarah hubungan.',
    estimatedDuration: '25 Menit',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q22', 'Q26'],
    tags: ['nostalgia', 'fondness_and_admiration', 'bonding'],
    generatePersonalizedIntro: (a, b) =>
      `Mengingat kembali memori favorit mempertegas ikatan batin kalian dan membuktikan betapa indahnya perjalanan yang telah kalian bangun bersama.`,
  },
  {
    activityId: 'emo_acts_of_care_challenge',
    categoryCode: 'emotional',
    title: 'Acts of Care Challenge',
    baseDescription: 'Tantangan satu minggu melakukan satu kebaikan tersembunyi setiap hari untuk meringankan hari pasangan tanpa diminta.',
    instructions: [
      'Selama 7 hari ke depan, lakukan satu tindakan kepedulian nyata setiap hari (menyiapkan pakaian, merapikan barang, atau menyelipkan pesan manis).',
      'Lakukan tanpa mengharapkan pujian instan atau mencatat pamrih.',
      'Di akhir minggu, luangkan waktu untuk saling memeluk dan berterima kasih atas kehangatan yang dirasakan.',
    ],
    expectedBenefit: 'Menumbuhkan budaya melayani dan mengasihi lewat aksi nyata dalam kehidupan rumah tangga.',
    estimatedDuration: '7 Hari aksi (evaluasi 15 menit)',
    suggestedFrequency: 'Dua bulan sekali',
    relevantQuestions: ['Q24', 'Q23'],
    tags: ['acts_of_service', 'selfless_care', 'habit'],
    generatePersonalizedIntro: (a, b) =>
      `Tantangan kebaikan harian ini menerjemahkan cinta ke dalam bahasa perbuatan nyata yang menyentuh relung hati terdalam pasangan.`,
  },
  {
    activityId: 'emo_gratitude_journal_two',
    categoryCode: 'emotional',
    title: 'Gratitude Journal for Two',
    baseDescription: 'Buku catatan kecil bersama di mana kalian bergantian menuliskan satu hal yang disyukuri dari pasangan setiap harinya.',
    instructions: [
      'Siapkan satu buku catatan kecil atau notes digital bersama.',
      'Tuliskan satu kalimat singkat setiap malam: "Hari ini aku bersyukur padamu karena..."',
      'Biarkan pasangan membacanya sebelum tidur atau saat memulai hari di pagi berikutnya.',
    ],
    expectedBenefit: 'Membiasakan mata batin untuk selalu mencari kebaikan pasangan daripada terpaku pada kekurangannya.',
    estimatedDuration: '5 Menit setiap hari',
    suggestedFrequency: 'Harian atau 3 kali seminggu',
    relevantQuestions: ['Q22', 'Q24'],
    tags: ['gratitude_habit', 'positive_bias', 'micro_moments'],
    generatePersonalizedIntro: (a, b) =>
      `Jurnal rasa syukur ini merajut kebiasaan melihat sisi terbaik pasangan dan mengalirkan ketenteraman batin setiap hari.`,
  },
  {
    activityId: 'emo_what_makes_feel_supported',
    categoryCode: 'emotional',
    title: 'What Makes Me Feel Supported?',
    baseDescription: 'Percakapan terpandu untuk mengklarifikasi jenis dukungan yang paling dibutuhkan saat menghadapi masa-masa stres atau tekanan hidup.',
    instructions: [
      'Bahas pertanyaan: "Ketika aku sedang tertekan oleh pekerjaan atau masalah luar, apakah aku lebih butuh didengarkan, butuh pelukan tanpa kata, butuh bantuan praktis, atau butuh waktu hening sejenak?"',
      'Saling catat kebutuhan dukungan pasangan agar tidak salah memberikan respon saat stres melanda.',
      'Sepakati kata kunci aman yang bisa diucapkan saat butuh bantuan emosional.',
    ],
    expectedBenefit: 'Mencegah niat baik menolong yang justru terasa membebani karena tidak sesuai dengan kebutuhan spesifik pasangan.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q24', 'Q25'],
    tags: ['support_styles', 'stress_response', 'empathy'],
    generatePersonalizedIntro: (a, b) =>
      `Mengetahui cara tepat mendukung pasangan saat lelah menjadikan ${a} dan ${b} tempat bernaung paling menenangkan di kala badai hidup datang.`,
  },
  {
    activityId: 'emo_reconnection_date',
    categoryCode: 'emotional',
    title: 'Reconnection Date',
    baseDescription: 'Kencan istimewa yang didesain khusus untuk memulihkan keintiman emosional setelah melewati periode kesibukan yang menyita waktu.',
    instructions: [
      'Pilih tempat yang sunyi dan intim (restoran tenang, teras rumah malam hari, atau tepi danau).',
      'Fokus percakapan 100% pada perasaan dan kebersamaan kalian, larang topik pekerjaan atau masalah logistik rumah tangga.',
      'Genggam tangan pasangan dan ucapkan kembali komitmen kasih sayang kalian berdua.',
    ],
    expectedBenefit: 'Mengisi ulang tangki cinta yang sempat terkuras oleh kesibukan hidup modern.',
    estimatedDuration: '2 Jam',
    suggestedFrequency: 'Sebulan sekali',
    relevantQuestions: ['Q23', 'Q26'],
    tags: ['deep_intimacy', 'recalibration', 'romance'],
    generatePersonalizedIntro: (a, b) =>
      `Kencan rekoneksi ini menjadi oasis penyejuk yang menyatukan kembali getaran cinta ${a} dan ${b} di tengah deru kesibukan harian.`,
  },
  {
    activityId: 'emo_love_in_everyday_moments',
    categoryCode: 'emotional',
    title: 'Love in Everyday Moments',
    baseDescription: 'Menemukan dan merayakan keindahan cinta dalam momen-momen paling sederhana: saat mencuci piring, menyeduh teh, atau menyapa di pintu.',
    instructions: [
      'Tatap mata pasangan saat berpapasan di rumah dan berikan senyuman tulus atau sentuhan lembut di pundak.',
      'Praktikkan ritual pelukan 30 detik setiap kali bertemu kembali setelah seharian beraktivitas terpisah.',
      'Rasakan detak jantung dan ketenangan fisik yang mengalir dari kehadiran pasangan.',
    ],
    expectedBenefit: 'Menghadirkan keintiman organik tanpa harus menunggu momen liburan atau perayaan mewah.',
    estimatedDuration: 'Momen 1–2 menit sepanjang hari',
    suggestedFrequency: 'Setiap hari',
    relevantQuestions: ['Q23', 'Q25'],
    tags: ['physical_affection', 'micro_connections', 'presence'],
    generatePersonalizedIntro: (a, b) =>
      `Merawat kehangatan dalam momen-momen kecil harian membuktikan bahwa cinta sejati bertumbuh subur di tengah kesederhanaan hidup.`,
  },
  {
    activityId: 'emo_emotional_needs_convo',
    categoryCode: 'emotional',
    title: 'Emotional Needs Conversation',
    baseDescription: 'Dialog jujur dan terbuka mengenai kebutuhan rasa aman, kehangatan fisik, dan pengakuan batin yang ingin dipenuhi bersama.',
    instructions: [
      'Ungkapkan dengan bahasa yang lembut: "Hal yang membuatku merasa paling aman dan dicintai di sampingmu adalah..."',
      'Tanyakan dengan rendah hati: "Apakah ada kebutuhan hatimu yang akhir-akhir ini terasa kurang terperhatikan olehku?"',
      'Dengarkan jawabannya dengan hati terbuka tanpa sikap defensif.',
    ],
    expectedBenefit: 'Mencegah kekosongan emosional dan merawat kepekaan batin terhadap perubahan kebutuhan pasangan.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Setiap 3 bulan',
    relevantQuestions: ['Q26', 'Q25'],
    tags: ['vulnerability', 'emotional_safety', 'dialogue'],
    generatePersonalizedIntro: (a, b) =>
      `Dialog kebutuhan emosional ini mencerminkan keberanian dan kedewasaan ${a} dan ${b} untuk saling menjaga ruang batin yang aman dan terpercaya.`,
  },

  // =========================================================================
  // CATEGORY G — CONFLICT MANAGEMENT (10 ACTIVITIES)
  // =========================================================================
  {
    activityId: 'conf_conflict_agreement',
    categoryCode: 'conflict',
    title: 'Our Conflict Agreement',
    baseDescription: 'Menyusun piagam etika beradu argumen: apa saja hal yang pantang dilakukan saat emosi meninggi demi menjaga kehormatan bersama.',
    instructions: [
      'Diskusikan perilaku apa saja yang paling melukai saat bertengkar (misal: membentak, mendiamkan berhari-hari, atau mengungkit masa lalu).',
      'Sepakati daftar pantangan bersama: (1) Pantang menggunakan kata kasar, (2) Pantang mengancam perpisahan, (3) Pantang menyerang keluarga pasangan.',
      'Tuliskan piagam ini dan sepakati untuk saling mengingatkan dengan lembut jika salah satu mulai tergelincir.',
    ],
    expectedBenefit: 'Menjaga pertengkaran tetap berada di koridor yang sehat dan tidak merusak fondasi rasa hormat.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Sekali dibuat, dievaluasi setiap 6 bulan',
    relevantQuestions: ['Q29', 'Q30'],
    tags: ['fair_fighting', 'ground_rules', 'dignity'],
    generatePersonalizedIntro: (a, b) =>
      `Karena ${a} dan ${b} menghargai penyelesaian masalah yang bermartabat, piagam etika ini akan melindungi hubungan kalian dari kata-kata yang melukai.`,
  },
  {
    activityId: 'conf_understanding_before_responding',
    categoryCode: 'conflict',
    title: 'Understanding Before Responding',
    baseDescription: 'Latihan meredam refleks membela diri dengan memastikan kamu memahami sudut pandang pasangan sebelum merespons argumennya.',
    instructions: [
      'Saat terjadi silang pendapat, wajibkan diri mengulang argumen pasangan terlebih dahulu: "Jadi yang membuatmu merasa keberatan adalah... Apakah aku benar?"',
      'Hanya boleh menyampaikan sudut pandang pribadimu setelah pasangan mengonfirmasi bahwa intisari masalahnya sudah kamu pahami dengan benar.',
      'Perhatikan bagaimana tensi ketegangan langsung mereda ketika pasangan merasa didengarkan.',
    ],
    expectedBenefit: 'Menghilangkan debat kusir yang saling silang dan mempercepat penemuan solusi bersama.',
    estimatedDuration: '15 Menit saat diskusi',
    suggestedFrequency: 'Setiap kali ada perbedaan pandangan penting',
    relevantQuestions: ['Q27', 'Q30'],
    tags: ['de-escalation', 'mirroring', 'calm_dialogue'],
    generatePersonalizedIntro: (a, b) =>
      `Membiasakan memahami sebelum merespons mengubah adu argumen menjadi proses kolaborasi mencari solusi terbaik berdua.`,
  },
  {
    activityId: 'conf_pause_and_reconnect',
    categoryCode: 'conflict',
    title: 'Pause and Reconnect Practice',
    baseDescription: 'Menyepakati sinyal jeda waktu pendinginan (*time-out*) saat detak jantung meningkat di tengah perdebatan sengit.',
    instructions: [
      'Sepakati satu kata sinyal jeda (misal: "Waktu Jeda" atau "Tarik Napas Dulu").',
      'Ketika sinyal diucapkan, pembicaraan wajib dihentikan sementara selama 20–30 menit untuk meredakan fisiologis tubuh.',
      'Gunakan waktu jeda untuk minum air dingin, menarik napas dalam, dan mengingat kembali cinta pada pasangan (bukan untuk merancang serangan balik).',
      'Kembali ke meja diskusi tepat waktu setelah 30 menit dengan kepala dingin.',
    ],
    expectedBenefit: 'Mencegah fenomena pembajakan emosi (*emotional flooding*) yang memicu keluarnya kata-kata yang disesali seumur hidup.',
    estimatedDuration: '20–30 Menit jeda',
    suggestedFrequency: 'Dipraktikkan saat situasi memanas',
    relevantQuestions: ['Q27', 'Q29'],
    tags: ['time_out', 'emotional_regulation', 'flooding_prevention'],
    generatePersonalizedIntro: (a, b) =>
      `Latihan jeda pendinginan ini menjaga kejernihan akal sehat ${a} dan ${b} sehingga perbedaan pendapat tidak berubah menjadi badai emosi.`,
  },
  {
    activityId: 'conf_problem_solving_together',
    categoryCode: 'conflict',
    title: 'Problem-Solving Together',
    baseDescription: 'Mengubah pola pikir dari "Aku vs Kamu" menjadi "Kita Berdua Melawan Masalah".',
    instructions: [
      'Tuliskan inti masalah di secarik kertas yang diletakkan di tengah meja.',
      'Duduk berdampingan menghadap kertas tersebut (secara simbolis menandakan kalian berada di tim yang sama melawan masalah di depan).',
      'Brainstorm minimal 3 alternatif jalan tengah di mana kedua belah pihak sama-sama mengalah demi kebaikan bersama.',
      'Pilih satu solusi untuk diuji coba selama 14 hari ke depan.',
    ],
    expectedBenefit: 'Menghilangkan mentalitas ingin menang sendiri dan memperkuat identitas tim yang solid.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Saat menghadapi keputusan rumit',
    relevantQuestions: ['Q30', 'Q28'],
    tags: ['team_mindset', 'collaboration', 'solution_oriented'],
    generatePersonalizedIntro: (a, b) =>
      `Pendekatan ini menyatukan kekuatan ${a} dan ${b} sebagai mitra kerja sama yang bahu-membahu menaklukkan tantangan hidup.`,
  },
  {
    activityId: 'conf_perspective_exchange',
    categoryCode: 'conflict',
    title: 'The Perspective Exchange',
    baseDescription: 'Latihan bermain peran di mana masing-masing mencoba membela dan menyuarakan sudut pandang pasangannya.',
    instructions: [
      'Pilih satu topik perbedaan pendapat yang belum tuntas.',
      'Lakukan tukar peran: partner A berbicara mewakili perasaan dan argumen partner B, demikian sebaliknya.',
      'Sampaikan argumen pasangan dengan penuh rasa hormat dan kesungguhan hati.',
      'Diskusikan bagaimana rasanya berdiri di posisi pasangan setelah latihan selesai.',
    ],
    expectedBenefit: 'Membuka mata batin terhadap validitas rasa pasangan dan mengikis ego pribadi.',
    estimatedDuration: '25 Menit',
    suggestedFrequency: 'Saat ada kebuntuan argumen',
    relevantQuestions: ['Q28', 'Q30'],
    tags: ['role_reversal', 'deep_empathy', 'perspective_taking'],
    generatePersonalizedIntro: (a, b) =>
      `Pertukaran sudut pandang ini mengasah empati tertinggi kalian untuk melihat melampaui ego dan merasakan kebenaran perasaan pasangan.`,
  },
  {
    activityId: 'conf_repair_conversation',
    categoryCode: 'conflict',
    title: 'Repair Conversation',
    baseDescription: 'Sesi rekonsiliasi pasca-pertengkaran untuk saling meminta maaf, memulihkan kehangatan, dan memetik hikmah bersama.',
    instructions: [
      'Tunggu hingga emosi benar-benar tenang sebelum memulai sesi ini.',
      'Akui bagian kesalahan pribadi terlebih dahulu: "Aku minta maaf karena tadi reaksiku terlalu keras ketika..."',
      'Fokus pada perbaikan hubungan daripada mencari siapa yang paling bersalah.',
      'Akhiri dengan pelukan rekonsiliasi dan sepakati cara mencegah hal serupa terulang.',
    ],
    expectedBenefit: 'Mencegah luka pertengkaran membekas menjadi dendam tersembunyi dan mempercepat pemulihan keintiman.',
    estimatedDuration: '20 Menit',
    suggestedFrequency: 'Pasca-perdebatan penting',
    relevantQuestions: ['Q28', 'Q29'],
    tags: ['repair_attempt', 'apology', 'reconciliation'],
    generatePersonalizedIntro: (a, b) =>
      `Kemampuan melakukan rekonsiliasi yang tulus adalah tanda kedewasaan tertinggi dalam hubungan ${a} dan ${b}.`,
  },
  {
    activityId: 'conf_what_helps_calm_down',
    categoryCode: 'conflict',
    title: 'What Helps Me Calm Down?',
    baseDescription: 'Saling membagikan hal-hal konkret yang bisa membantu menenangkan sistem saraf masing-masing saat sedang kesal atau cemas.',
    instructions: [
      'Bahas bersama: "Ketika aku sedang sangat marah atau tegang, hal yang paling membantuku tenang adalah... (misal: dibawakan segelas air, dibiarkan sendiri 15 menit, atau dielus punggungnya tanpa nasihat)."',
      'Catat panduan menenangkan pasangan ini agar siap dipraktikkan saat situasi genting.',
      'Hormati perbedaan mekanisme regulasi diri masing-masing.',
    ],
    expectedBenefit: 'Menghindari tindakan yang keliru yang justru menambah kepanikan atau amarah pasangan.',
    estimatedDuration: '25 Menit',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q27', 'Q29'],
    tags: ['emotional_regulation', 'soothing', 'nervous_system'],
    generatePersonalizedIntro: (a, b) =>
      `Memahami cara menenangkan hati pasangan adalah bekal berharga bagi ${a} dan ${b} untuk menjadi penyejuk di tengah ketegangan hidup.`,
  },
  {
    activityId: 'conf_difficult_convo_practice',
    categoryCode: 'conflict',
    title: 'Difficult Conversation Practice',
    baseDescription: 'Panduan langkah demi langkah untuk membuka percakapan mengenai topik sensitif tanpa memicu pertahanan diri.',
    instructions: [
      'Pilih waktu yang tenang di mana kalian berdua tidak sedang lelah atau lapar (*HALT check: Hungry, Angry, Lonely, Tired*).',
      'Awali dengan apresiasi positif: "Aku sangat menghargai komitmen kita, dan ada satu hal kecil yang ingin kubicarakan agar hubungan kita makin nyaman..."',
      'Fokus pada perilaku spesifik, bukan menilai kepribadian pasangan.',
      'Dengarkan tanggapan pasangan dengan sabar tanpa langsung menyanggah.',
    ],
    expectedBenefit: 'Menjadikan topik sulit bisa dibicarakan dengan tenang, dewasa, dan solutif.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Saat ada topik sensitif yang perlu diluruskan',
    relevantQuestions: ['Q27', 'Q30'],
    tags: ['difficult_conversations', 'gentle_start_up', 'courage'],
    generatePersonalizedIntro: (a, b) =>
      `Aktivitas ini melatih keberanian kalian menyentuh topik sensitif dengan kelembutan yang memperkuat rasa percaya timbal balik.`,
  },
  {
    activityId: 'conf_fair_disagreement_rules',
    categoryCode: 'conflict',
    title: 'Our Fair Disagreement Rules',
    baseDescription: 'Mengevaluasi dan memperbarui aturan main berdiskusi agar selalu mengedepankan solusi dan keadilan bersama.',
    instructions: [
      'Tinjau kembali perdebatan terakhir kalian: apa yang berhasil meredakan situasi dan apa yang sempat memperburuk keadaan?',
      'Sepakati aturan baru: batasi diskusi hanya pada 1 masalah dalam satu waktu (dilarang menumpuk banyak masalah sekaligus).',
      'Terapkan batas waktu maksimal 30 menit untuk satu sesi diskusi agar tidak melelahkan pikiran.',
    ],
    expectedBenefit: 'Menghindarkan perdebatan dari keletihan emosional yang berlarut-larut.',
    estimatedDuration: '20 Menit evaluasi',
    suggestedFrequency: 'Setiap 6 bulan',
    relevantQuestions: ['Q29', 'Q30'],
    tags: ['boundaries', 'fairness', 'constructive'],
    generatePersonalizedIntro: (a, b) =>
      `Aturan main yang adil memastikan setiap perbedaan diselesaikan secara elegan tanpa menguras energi batin kalian.`,
  },
  {
    activityId: 'conf_learning_from_past_conflicts',
    categoryCode: 'conflict',
    title: 'Learning From Past Conflicts',
    baseDescription: 'Membedah pertengkaran masa lalu yang sudah selesai untuk mengambil hikmah dan pola pemicu (*triggers*) yang bisa diantisipasi ke depan.',
    instructions: [
      'Pilih satu perselisihan masa lalu yang sudah mereda dan tidak lagi emosional.',
      'Analisis bersama: "Apa pemicu awal yang membuat kita salah paham saat itu? Apa kebutuhan yang belum terpenuhi di balik amarah tersebut?"',
      'Sepakati tanda peringatan dini agar pemicu yang sama tidak menimbulkan konflik berulang di masa depan.',
    ],
    expectedBenefit: 'Mengubah luka masa lalu menjadi kebijaksanaan yang memperkokoh kematangan relasi.',
    estimatedDuration: '30 Menit',
    suggestedFrequency: 'Dua kali setahun',
    relevantQuestions: ['Q28', 'Q30'],
    tags: ['post_mortem', 'wisdom', 'pattern_breaking'],
    generatePersonalizedIntro: (a, b) =>
      `Mengambil hikmah dari pengalaman masa lalu membuktikan kedewasaan ${a} dan ${b} untuk terus tumbuh menjadi pasangan yang semakin bijak.`,
  },
];

/**
 * Intelligent Personalized Activity Selector
 * Selects exactly THREE distinct, relevant, and personalized activities for a given strength category.
 * Enforces diversity across categories and avoids duplicate activity IDs in the same report.
 */
export function selectPersonalizedActivitiesForCategory(
  categoryCode: string,
  categoryScore: number,
  categoryQuestions: any[],
  nameA: string,
  nameB: string,
  usedActivityIds: Set<string>
): RecommendedActivity[] {
  // 1. Filter activity templates for this category
  const categoryTemplates = ACTIVITY_LIBRARY.filter(
    (item) => item.categoryCode === categoryCode
  );

  if (categoryTemplates.length === 0) {
    return [];
  }

  // 2. Score relevance of each activity based on the couple's answers
  const scoredTemplates = categoryTemplates.map((template) => {
    let score = 0;

    // Check relevant questions
    categoryQuestions.forEach((q) => {
      if (template.relevantQuestions.includes(q.questionCode)) {
        // High similarity or both high agreements boost activity score
        if (q.similarity >= 75) score += 3;
        if (q.status === 'both_high') score += 2;
        if (q.status === 'both_low') score += 1;
      }
    });

    // Penalize if already used globally in another category
    if (usedActivityIds.has(template.activityId)) {
      score -= 100;
    }

    return {
      template,
      score,
    };
  });

  // Sort descending by calculated score
  scoredTemplates.sort((a, b) => b.score - a.score);

  // 3. Pick top 3 distinct templates
  const selectedTemplates: ActivityTemplate[] = [];
  for (const item of scoredTemplates) {
    if (!usedActivityIds.has(item.template.activityId)) {
      selectedTemplates.push(item.template);
      usedActivityIds.add(item.template.activityId);
      if (selectedTemplates.length === 3) break;
    }
  }

  // Fallback if less than 3 (rare, but ensure exactly 3)
  if (selectedTemplates.length < 3) {
    for (const item of scoredTemplates) {
      if (!selectedTemplates.some((t) => t.activityId === item.template.activityId)) {
        selectedTemplates.push(item.template);
        usedActivityIds.add(item.template.activityId);
        if (selectedTemplates.length === 3) break;
      }
    }
  }

  // 4. Transform to RecommendedActivity with personalized intro and category name
  const catNameMap: Record<string, string> = {
    communication: 'Komunikasi',
    financial: 'Finansial',
    family: 'Keluarga & Anak',
    lifestyle: 'Gaya Hidup',
    future: 'Visi Masa Depan',
    emotional: 'Kebutuhan Emosional',
    conflict: 'Manajemen Konflik',
  };

  return selectedTemplates.map((tpl) => ({
    activityId: tpl.activityId,
    categoryCode: tpl.categoryCode,
    categoryName: catNameMap[tpl.categoryCode] || tpl.categoryCode,
    title: tpl.title,
    description: tpl.baseDescription,
    instructions: tpl.instructions,
    expectedBenefit: tpl.expectedBenefit,
    estimatedDuration: tpl.estimatedDuration,
    suggestedFrequency: tpl.suggestedFrequency,
    relevantQuestions: tpl.relevantQuestions,
    tags: tpl.tags,
    personalizedIntro: tpl.generatePersonalizedIntro(nameA, nameB),
  }));
}
