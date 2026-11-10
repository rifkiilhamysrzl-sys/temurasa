export interface QuestionInterpretationItem {
  questionId: string;
  category: string;
  categoryName: string;
  questionText: string;
  highAlignmentInterpretation: string;
  lowAlignmentInterpretation: string;
  bothHighInterpretation: string;
  bothLowInterpretation: string;
  divergentInterpretation: (higherPerson: string, lowerPerson: string) => string;
  neutralInterpretation: string;
  discussionPrompt: string;
  suggestedAction: string;
}

export const QUESTION_INTERPRETATIONS: Record<string, QuestionInterpretationItem> = {
  // ==========================================
  // CATEGORY 1: COMMUNICATION STYLE (Q01 - Q05)
  // ==========================================
  Q01: {
    questionId: 'Q01',
    category: 'communication',
    categoryName: 'Gaya Komunikasi',
    questionText: 'Saya lebih suka membicarakan masalah secara langsung daripada memendamnya.',
    highAlignmentInterpretation:
      'Kalian berdua memiliki kecenderungan yang selaras dalam keterusterangan komunikasi saat menghadapi masalah, yang meminimalkan penumpukan kekecewaan terpendam.',
    lowAlignmentInterpretation:
      'Terdapat perbedaan ritme dalam menghadapi masalah: salah satu pihak terdorong untuk segera berterus-terang, sementara yang lain membutuhkan waktu internal sebelum siap membicarakannya.',
    bothHighInterpretation:
      'Kalian berdua sepakat mengutamakan keterusterangan langsung. Ini adalah modal komunikasi yang sangat terbuka, namun perlu diimbangi dengan kelembutan agar keterusterangan tidak terasa menyerang.',
    bothLowInterpretation:
      'Kalian berdua cenderung berhati-hati atau menahan pembicaraan saat ada ganjalan. Penting untuk membangun rasa aman agar masalah tidak dibiarkan berlarut-larut tanpa penyelesaian.',
    divergentInterpretation: (high, low) =>
      `${high} lebih terdorong membicarakan masalah saat itu juga, sedangkan ${low} cenderung memproses perasaan terlebih dahulu. Tanpa kesepakatan waktu bicara, ${high} bisa merasa diabaikan, dan ${low} bisa merasa terdesak.`,
    neutralInterpretation:
      'Salah satu atau kedua pasangan bersikap fleksibel tergantung konteks situasi dan bobot masalah sebelum memutuskan untuk membicarakannya secara langsung.',
    discussionPrompt:
      'Bagaimana cara terbaik memberi tahu pasangan ketika kita sedang merasa terganggu oleh sesuatu tanpa membuat suasana menjadi tegang?',
    suggestedAction:
      'Sepakati aturan "Jeda 30 Menit": Jika salah satu butuh waktu, beri jeda maksimal 30–60 menit lalu kembali berdiskusi secara tenang.',
  },

  Q02: {
    questionId: 'Q02',
    category: 'communication',
    categoryName: 'Gaya Komunikasi',
    questionText: 'Saya merasa penting untuk saling memberikan kabar sepanjang hari.',
    highAlignmentInterpretation:
      'Kalian memiliki ekspektasi yang serupa mengenai frekuensi kabar harian, sehingga mengurangi kecemasan atau perasaan terabaikan di tengah kesibukan.',
    lowAlignmentInterpretation:
      'Terdapat variasi dalam kebutuhan koneksi harian: satu pihak menganggap kabar berkala sebagai bentuk perhatian utama, sementara pihak lain lebih berfokus pada pekerjaan saat beraktivitas.',
    bothHighInterpretation:
      'Bagi kalian, bertukar kabar sepanjang hari adalah simbol kedekatan dan rasa aman. Ini memperkuat koneksi emosional harian kalian.',
    bothLowInterpretation:
      'Kalian berdua merasa nyaman tanpa harus saling berkabar secara intens sepanjang hari, dan lebih menikmati momen berbagi cerita saat bertemu di penghujung hari.',
    divergentInterpretation: (high, low) =>
      `${high} memandang kabar harian sebagai wujud rasa aman dan kasih sayang, sedangkan ${low} merasa fokus bekerja tanpa gangguan gawai bukan berarti berkurangnya perhatian.`,
    neutralInterpretation:
      'Kebutuhan berkabar kalian cukup adaptif bergantung pada padatnya jadwal harian masing-masing.',
    discussionPrompt:
      'Berapa frekuensi kabar harian yang membuat kita berdua tetap merasa terhubung tanpa merasa terbebani oleh gawai?',
    suggestedAction:
      'Sepakati "Anchor Check-ins": Cukup 2 momen kunci (misal: pesan singkat di waktu makan siang dan menjelang pulang kerja).',
  },

  Q03: {
    questionId: 'Q03',
    category: 'communication',
    categoryName: 'Gaya Komunikasi',
    questionText: 'Saya nyaman menyampaikan sesuatu yang tidak saya sukai dari pasangan.',
    highAlignmentInterpretation:
      'Tingkat kenyamanan yang seimbang dalam memberikan umpan balik konstruktif tanpa rasa takut berlebihan akan penolakan.',
    lowAlignmentInterpretation:
      'Ada perbedaan dalam kemudahan menyampaikan kritik: satu pihak merasa leluasa mengutarakan hal yang mengganjal, sementara yang lain merasa ragu atau khawatir memicu konflik.',
    bothHighInterpretation:
      'Kalian berdua memiliki keberanian emosional untuk saling mengingatkan. Fondasi ini kokoh jika selalu disampaikan dengan bahasa yang menghargai dan berorientasi solusi.',
    bothLowInterpretation:
      'Kalian berdua cenderung menahan diri untuk tidak mengkritik pasangan demi menjaga keharmonisan, yang terkadang bisa berujung pada kelelahan emosional terselubung.',
    divergentInterpretation: (high, low) =>
      `${high} merasa nyaman mengutarakan hal yang kurang disukai, sementara ${low} merasa lebih sensitif atau berhati-hati. ${high} perlu memperhatikan nada bicara agar tidak terkesan mengoreksi terus-menerus.`,
    neutralInterpretation:
      'Kenyamanan menyampaikan kritik sangat bergantung pada suasana hati pasangan dan pemilihan momen yang tepat.',
    discussionPrompt:
      'Kalimat atau pendekatan seperti apa yang membuatmu merasa dihargai saat menerima masukan tentang kebiasaan yang perlu diperbaiki?',
    suggestedAction:
      'Terapkan metode "Kritik Berbasis Apresiasi": Awali dengan mengapresiasi niat baik pasangan sebelum menyampaikan hal yang ingin diselaraskan.',
  },

  Q04: {
    questionId: 'Q04',
    category: 'communication',
    categoryName: 'Gaya Komunikasi',
    questionText: 'Saya lebih suka menyelesaikan kesalahpahaman secepat mungkin daripada menunggu suasana membaik.',
    highAlignmentInterpretation:
      'Kalian memiliki preferensi tempo penyelesaian konflik yang seirama, baik sama-sama ingin lekas beres atau sama-sama paham pentingnya jeda.',
    lowAlignmentInterpretation:
      'Perbedaan tempo resolusi: pihak yang ingin lekas selesai mengalami kecemasan saat konflik ditunda, sedangkan pihak yang ingin suasana membaik membutuhkan penurunan hormon stres sebelum dapat berpikir jernih.',
    bothHighInterpretation:
      'Kalian sama-sama tidak tahan membiarkan kesalahpahaman menggantung. Pastikan emosi sudah cukup reda agar pembahasan cepat tidak berubah menjadi perdebatan sengit.',
    bothLowInterpretation:
      'Kalian berdua sepakat bahwa waktu pendinginan (*cooling down*) sangat penting sebelum duduk bersama meluruskan kesalahpahaman.',
    divergentInterpretation: (high, low) =>
      `${high} ingin segera meluruskan masalah agar pikiran tenang, sementara ${low} merasa pembicaraan yang dipaksakan saat tensi tinggi hanya akan memperkeruh suasana.`,
    neutralInterpretation:
      'Kalian fleksibel menimbang apakah masalah tersebut bersifat genting untuk segera diselesaikan atau lebih baik menunggu hingga kepala dingin.',
    discussionPrompt:
      'Ketika kita berselisih, apa tanda bahwa salah satu dari kita sedang butuh waktu jeda sebelum melanjutkan obrolan?',
    suggestedAction:
      'Gunakan "Sinyal Jeda Berbatas": Sepakati bahwa jeda boleh diambil asalkan pihak yang meminta jeda berkomitmen menentukan jam berapa obrolan dilanjutkan hari itu.',
  },

  Q05: {
    questionId: 'Q05',
    category: 'communication',
    categoryName: 'Gaya Komunikasi',
    questionText: 'Saya merasa pasangan perlu mendengarkan terlebih dahulu sebelum memberikan solusi ketika saya sedang bercerita.',
    highAlignmentInterpretation:
      'Kalian memiliki pemahaman yang selaras mengenai nilai empati aktif: mendengarkan untuk memvalidasi perasaan sebelum melompat ke saran logis.',
    lowAlignmentInterpretation:
      'Terdapat perbedaan naluri respons: satu pihak sangat membutuhkan validasi emosional dan ruang didengar, sementara pihak lain secara otomatis ingin memperbaiki masalah dengan segera menawarkan solusi teknis.',
    bothHighInterpretation:
      'Kalian berdua memandang kehadiran emosional dan pendengaran penuh perhatian sebagai bentuk dukungan terbaik saat bercerita.',
    bothLowInterpretation:
      'Kalian berdua tipe praktis yang cenderung menyukai solusi cepat dan tindakan konkret ketika bercerita tentang masalah.',
    divergentInterpretation: (high, low) =>
      `${high} sangat membutuhkan kehadiran telinga yang mendengarkan tanpa dihakimi, sementara ${low} berniat baik membantu dengan segera memberikan jalan keluar yang terkadang terasa terburu-buru bagi ${high}.`,
    neutralInterpretation:
      'Kebutuhan antara didengar atau diberi solusi tergantung pada jenis masalah yang sedang dihadapi.',
    discussionPrompt:
      'Saat aku pulang membawa cerita yang melelahkan, kalimat apa yang paling ingin kamu dengar dariku sebelum kita membahas solusinya?',
    suggestedAction:
      'Praktikkan pertanyaan ajaib sebelum merespons: "Kamu ingin aku sekadar mendengarkan dan memelukmu, atau kamu ingin kita mencari solusinya bersama?"',
  },

  // ==========================================
  // CATEGORY 2: FINANCIAL COMPATIBILITY (Q06 - Q10)
  // ==========================================
  Q06: {
    questionId: 'Q06',
    category: 'financial',
    categoryName: 'Kecocokan Finansial',
    questionText: 'Saya merasa penting memiliki tabungan pribadi meskipun sudah memiliki pasangan.',
    highAlignmentInterpretation:
      'Keselarasan dalam memandang batas otonomi finansial pribadi di samping keuangan bersama keluarga.',
    lowAlignmentInterpretation:
      'Perbedaan filosofi rekening: satu pihak memprioritaskan rasa aman lewat kepemilikan dana otonom pribadi, sementara pihak lain lebih condong ke penyatuan aset sepenuhnya.',
    bothHighInterpretation:
      'Kalian berdua sepakat bahwa memiliki ruang tabungan pribadi adalah hal sehat yang memberi rasa aman dan kebebasan individu tanpa mengurangi komitmen bersama.',
    bothLowInterpretation:
      'Kalian berdua lebih condong pada penyatuan keuangan secara total tanpa merasa perlu memisahkan rekening pribadi.',
    divergentInterpretation: (high, low) =>
      `${high} merasa tabungan pribadi adalah fondasi kemandirian dan proteksi diri, sedangkan ${low} memandang keterbukaan dan penyatuan dana sebagai simbol kebersamaan utuh.`,
    neutralInterpretation:
      'Kalian memandang proporsi tabungan pribadi dan bersama dapat diatur secara kondisional sesuai kesepakatan anggaran.',
    discussionPrompt:
      'Berapa persentase atau batas nominal uang yang nyaman untuk kita kelola masing-masing sebagai dana pribadi tanpa perlu persetujuan pasangan?',
    suggestedAction:
      'Susun skema "Tiga Pos Keuangan": Rekening Bersama Kebutuhan Rumah Tangga, Rekening Investasi Masa Depan, dan Rekening Pribadi Masing-masing untuk hobi/otonomi.',
  },

  Q07: {
    questionId: 'Q07',
    category: 'financial',
    categoryName: 'Kecocokan Finansial',
    questionText: 'Saya lebih suka merencanakan pengeluaran besar bersama pasangan sebelum mengambil keputusan.',
    highAlignmentInterpretation:
      'Tingkat komitmen yang tinggi dalam musyawarah pengeluaran besar, mencegah syok finansial dan menjaga rasa saling percaya.',
    lowAlignmentInterpretation:
      'Perbedaan ambang batas transparansi: perlu menyepakati berapa batas nominal pembelian yang memerlukan diskusi bersama terlebih dahulu.',
    bothHighInterpretation:
      'Kalian berdua sangat menjunjung tinggi prinsip konsultasi bersama sebelum membelanjakan uang untuk pos besar. Ini pilar transparansi yang sangat solid.',
    bothLowInterpretation:
      'Kalian memiliki fleksibilitas tinggi dan saling percaya pada penilaian masing-masing dalam memutuskan pembelian tanpa harus berdiskusi secara mendetail.',
    divergentInterpretation: (high, low) =>
      `${high} memandang musyawarah sebelum belanja besar sebagai bentuk rasa hormat kemitraan, sedangkan ${low} merasa memiliki hak diskresi lebih luas jika dana tersebut berasal dari penghasilannya.`,
    neutralInterpretation:
      'Kalian sepakat perlunya diskusi bersama untuk barang tertentu, namun tetap memberi ruang keputusan mandiri pada pos rutin.',
    discussionPrompt:
      'Berapa nominal rupiah pembelian yang menurut kita wajib dibicarakan berdua sebelum digesek atau ditransfer?',
    suggestedAction:
      'Tentukan "Threshold Limit" (misal: di atas Rp1.000.000 wajib konfirmasi berdua terlebih dahulu).',
  },

  Q08: {
    questionId: 'Q08',
    category: 'financial',
    categoryName: 'Kecocokan Finansial',
    questionText: 'Saya merasa penting memiliki target investasi atau tabungan jangka panjang bersama.',
    highAlignmentInterpretation:
      'Keselarasan motivasi untuk membangun fondasi masa depan, kepemilikan aset, dan ketahanan finansial jangka panjang.',
    lowAlignmentInterpretation:
      'Perbedaan orientasi waktu finansial: satu pihak fokus pada target masa depan (5–10 tahun), pihak lain lebih mengutamakan arus kas dan kenyamanan masa kini.',
    bothHighInterpretation:
      'Kalian memiliki visi visioner yang sama untuk berinvestasi dan menabung bersama demi stabilitas masa depan.',
    bothLowInterpretation:
      'Kalian belum terlalu memprioritaskan instrumen investasi formal bersama dan lebih memilih pendekatan keuangan yang mengalir.',
    divergentInterpretation: (high, low) =>
      `${high} bersemangat menyusun target investasi masa depan, sementara ${low} merasa fokus saat ini sebaiknya dialokasikan untuk pemenuhan kebutuhan dan stabilitas jangka pendek.`,
    neutralInterpretation:
      'Kalian menyadari pentingnya investasi, namun masih mencari instrumen dan tempo waktu yang paling realistis.',
    discussionPrompt:
      'Apa satu impian besar kita dalam 5 tahun ke depan (rumah, dana pendidikan, atau bisnis) yang ingin mulai kita danai bersama bulan ini?',
    suggestedAction:
      'Buka rekening autodebet investasi bersama setiap tanggal gajian untuk target konkret tertentu.',
  },

  Q09: {
    questionId: 'Q09',
    category: 'financial',
    categoryName: 'Kecocokan Finansial',
    questionText: 'Saya nyaman jika pasangan mengetahui kondisi keuangan saya secara terbuka, termasuk utang dan kewajiban finansial.',
    highAlignmentInterpretation:
      'Tingkat kejujuran dan transparansi finansial yang tinggi, yang merupakan penangkal paling efektif terhadap ketidaksetiaan finansial (*financial infidelity*).',
    lowAlignmentInterpretation:
      'Ada rasa cemas atau ketidaknyamanan untuk membuka seluruh liabilitas atau utang keluarga, yang memerlukan ruang percakapan tanpa penghakiman.',
    bothHighInterpretation:
      'Kalian berdua percaya pada transparansi radikal mengenai pendapatan, utang, dan kewajiban keluarga. Ini menciptakan rasa aman emosional yang luar biasa.',
    bothLowInterpretation:
      'Kalian sama-sama menjaga batas privasi yang ketat seputar utang atau kewajiban finansial individu.',
    divergentInterpretation: (high, low) =>
      `${high} sangat terbuka dan mengharapkan pasangan melakukan hal yang sama, sementara ${low} merasa ada hal finansial tertentu yang ingin diselesaikan sendiri tanpa ingin membebani pasangan.`,
    neutralInterpretation:
      'Kalian terbuka pada hal-hal pokok, namun merasa rincian detail kewajiban sekunder tidak selalu harus dipaparkan setiap waktu.',
    discussionPrompt:
      'Apakah ada kewajiban cicilan, tanggungan keluarga, atau kekhawatiran finansial yang belum sempat kita ceritakan satu sama lain secara santai?',
    suggestedAction:
      'Jadwalkan sesi "Financial Transparency Day" satu kali dalam setahun untuk meninjau neraca aset dan liabilitas berdua tanpa saling menyalahkan.',
  },

  Q10: {
    questionId: 'Q10',
    category: 'financial',
    categoryName: 'Kecocokan Finansial',
    questionText: 'Saya lebih memilih mengutamakan keamanan finansial daripada meningkatkan gaya hidup ketika penghasilan bertambah.',
    highAlignmentInterpretation:
      'Kesamaan nilai dalam meredam bahaya *lifestyle creep* (inflasi gaya hidup) demi memprioritaskan ketahanan dana darurat.',
    lowAlignmentInterpretation:
      'Perbedaan prioritas penghargaan diri: satu pihak ingin mengunci kenaikan gaji ke instrumen tabungan, pihak lain merasa kenaikan pendapatan layak dinikmati untuk peningkatan kualitas hidup dan pengalaman.',
    bothHighInterpretation:
      'Kalian berdua adalah penjaga stabilitas finansial yang bijak. Kenaikan pendapatan akan menjadi benteng pertahanan yang kuat bagi keluarga kalian.',
    bothLowInterpretation:
      'Kalian berdua sepakat bahwa peningkatan penghasilan harus diiringi dengan peningkatan kenyamanan hidup, liburan, dan pengalaman baru.',
    divergentInterpretation: (high, low) =>
      `${high} memprioritaskan dana darurat dan proteksi masa depan, sedangkan ${low} merasa menikmati hasil kerja keras saat ini sama pentingnya agar tidak kehilangan momen kebahagiaan hidup.`,
    neutralInterpretation:
      'Kalian menyeimbangkan antara menambah porsi tabungan sekaligus menyisihkan sebagian kecil untuk merayakan pencapaian.',
    discussionPrompt:
      'Jika pendapatan kita meningkat 30%, berapa porsi yang ideal menurutmu untuk ditabung vs untuk meningkatkan kenyamanan hidup kita?',
    suggestedAction:
      'Terapkan formula 70/30 saat bonus atau kenaikan gaji tiba: 70% masuk tabungan/investasi, 30% bebas dipakai untuk *reward* gaya hidup.',
  },

  // ==========================================
  // CATEGORY 3: FAMILY & CHILDREN (Q11 - Q14)
  // ==========================================
  Q11: {
    questionId: 'Q11',
    category: 'family',
    categoryName: 'Keluarga & Anak',
    questionText: 'Saya ingin memiliki anak dalam kehidupan pernikahan.',
    highAlignmentInterpretation:
      'Kesamaan visi mendasar mengenai kehadiran anak dalam biduk rumah tangga.',
    lowAlignmentInterpretation:
      'Perbedaan atau keraguan mendasar mengenai kehadiran anak, yang merupakan salah satu keputusan hidup paling menentukan dan membutuhkan percakapan mendalam sejak dini.',
    bothHighInterpretation:
      'Kalian berdua memiliki impian bersama untuk menyambut dan membesarkan anak dalam kehidupan pernikahan.',
    bothLowInterpretation:
      'Kalian berdua selaras dalam preferensi untuk menjalani kehidupan berdua (*childfree*) atau memusatkan fokus hidup pada bidang lain.',
    divergentInterpretation: (high, low) =>
      `${high} memiliki keinginan yang kuat untuk memiliki anak, sedangkan ${low} masih merasa ragu, khawatir, atau memiliki preferensi berbeda. Ini adalah topik bernilai tinggi yang wajib dieksplorasi secara jujur tanpa paksaan.`,
    neutralInterpretation:
      'Salah satu atau kedua pasangan masih mempertimbangkan faktor kesiapan mental, karier, dan finansial sebelum menentukan keputusan pasti mengenai anak.',
    discussionPrompt:
      'Bagaimana bayanganmu mengenai kehadiran anak dalam rutinitas harian kita, dan apa kekhawatiran terbesarmu terkait peran orang tua?',
    suggestedAction:
      'Luangkan satu waktu khusus untuk berdiskusi santai mengenai kesiapan mental, finansial, dan kesepakatan waktu yang realistis terkait rencana momongan.',
  },

  Q12: {
    questionId: 'Q12',
    category: 'family',
    categoryName: 'Keluarga & Anak',
    questionText: 'Saya merasa keputusan mengenai pola asuh anak harus dibicarakan dan disepakati bersama.',
    highAlignmentInterpretation:
      'Tingkat komitmen kemitraan yang tinggi dalam pengasuhan (*co-parenting*), mencegah kebingungan aturan pada anak.',
    lowAlignmentInterpretation:
      'Perbedaan ekspektasi mengenai pembagian peran pola asuh: risiko terjadinya pola asuh terpisah di mana satu pihak merasa menjadi penanggung jawab tunggal.',
    bothHighInterpretation:
      'Kalian berdua sangat meyakini bahwa ayah dan ibu adalah satu tim kompak yang wajib menyamakan suara di hadapan anak.',
    bothLowInterpretation:
      'Kalian cenderung membiarkan pengasuhan mengalir secara alami sesuai naluri masing-masing tanpa terlalu banyak aturan yang kaku.',
    divergentInterpretation: (high, low) =>
      `${high} memandang kesepakatan aturan asuh secara detail adalah keharusan, sedangkan ${low} merasa pengasuhan bisa disesuaikan secara spontan tergantung situasi.`,
    neutralInterpretation:
      'Kalian sepakat pada prinsip-prinsip moral utama, namun fleksibel dalam penerapan disiplin harian.',
    discussionPrompt:
      'Nilai atau tradisi masa kecil apa dari orang tua kita yang ingin kita teruskan ke anak, dan apa yang ingin kita ubah?',
    suggestedAction:
      'Sepakati prinsip "Satu Suara di Depan Anak": Jika ada perbedaan pendapat soal pola asuh, bicarakan berdua di balik pintu kamar, bukan di depan anak.',
  },

  Q13: {
    questionId: 'Q13',
    category: 'family',
    categoryName: 'Keluarga & Anak',
    questionText: 'Saya ingin tetap memiliki waktu berkualitas dengan pasangan meskipun sudah memiliki anak.',
    highAlignmentInterpretation:
      'Kesadaran yang sangat baik bahwa kesehatan hubungan suami-istri adalah fondasi utama bagi kebahagiaan anak.',
    lowAlignmentInterpretation:
      'Perbedaan prioritas pasca memiliki anak: satu pihak ingin menjaga romantisme pernikahan, pihak lain khawatir waktu berdua akan mengorbankan perhatian penuh kepada anak.',
    bothHighInterpretation:
      'Kalian berdua paham betul bahwa pernikahan tidak boleh "tenggelam" saat anak lahir. Menjaga *quality time* berdua adalah investasi terbaik untuk anak.',
    bothLowInterpretation:
      'Kalian berdua bersiap mencurahkan 100% energi untuk anak pada fase-fase awal dan tidak terlalu memusingkan ketiadaan waktu pacaran.',
    divergentInterpretation: (high, low) =>
      `${high} menyadari perlunya waktu berdua agar cinta tetap bernyawa, sedangkan ${low} merasa seluruh perhatian secara alami harus berpusat pada kebutuhan buah hati.`,
    neutralInterpretation:
      'Kalian memahami pentingnya waktu berdua, namun realistis melihat keterbatasan energi dan dukungan *support system*.',
    discussionPrompt:
      'Bagaimana cara kita menjaga agar kita tetap menjadi pasangan yang romantis, bukan hanya rekan kerja yang mengurus rumah dan anak?',
    suggestedAction:
      'Rencanakan ritual "Micro-Dates": Luangkan 20 menit mengobrol santai sambil minum teh di teras setelah anak tidur di malam hari.',
  },

  Q14: {
    questionId: 'Q14',
    category: 'family',
    categoryName: 'Keluarga & Anak',
    questionText: 'Saya merasa penting menetapkan batasan yang sehat antara kehidupan rumah tangga dan keluarga besar.',
    highAlignmentInterpretation:
      'Kesamaan pemahaman dalam menjaga kedaulatan rumah tangga baru dari campur tangan berlebihan keluarga besar.',
    lowAlignmentInterpretation:
      'Perbedaan relasi dengan orang tua/mertua: satu pihak mengutamakan privasi dan independensi inti, pihak lain sangat terikat pada tradisi dan saran keluarga besar.',
    bothHighInterpretation:
      'Kalian berdua sepakat bahwa rumah tangga kalian adalah entitas independen yang harus memiliki batas sehat dan keputusan mutlak di tangan berdua.',
    bothLowInterpretation:
      'Kalian berdua memiliki keterikatan erat dan sangat terbuka menerima keterlibatan keluarga besar dalam keputusan keluarga.',
    divergentInterpretation: (high, low) =>
      `${high} merasa keputusan rumah tangga harus steril dari intervensi luar, sementara ${low} merasa masukan orang tua adalah wujud berbakti yang tidak boleh ditolak secara kaku.`,
    neutralInterpretation:
      'Kalian menghargai saran keluarga besar selama tidak melanggar kesepakatan prinsipil yang telah kalian buat berdua.',
    discussionPrompt:
      'Di area apa kita paling membutuhkan privasi penuh, dan bagaimana cara kita bersikap santun namun tegas jika ada saran keluarga besar yang kurang cocok?',
    suggestedAction:
      'Rumuskan "Aturan Tamu & Keputusan": Segala urusan keuangan dan pola asuh diputuskan berdua; kunjungan keluarga disepakati bersama.',
  },

  // ==========================================
  // CATEGORY 4: LIFESTYLE COMPATIBILITY (Q15 - Q18)
  // ==========================================
  Q15: {
    questionId: 'Q15',
    category: 'lifestyle',
    categoryName: 'Gaya Hidup',
    questionText: 'Saya lebih suka menghabiskan waktu luang bersama pasangan daripada melakukan aktivitas sendiri.',
    highAlignmentInterpretation:
      'Kalian memiliki kebutuhan kebersamaan (*togetherness*) yang seimbang saat akhir pekan dan libur.',
    lowAlignmentInterpretation:
      'Perbedaan energi sosial: satu pihak mengisi ulang energi (*recharge*) melalui kebersamaan dengan pasangan, pihak lain membutuhkan waktu soliter (*solitude*).',
    bothHighInterpretation:
      'Kalian berdua adalah tipe pasangan yang sangat senang beraktivitas berdua ke mana pun kalian pergi.',
    bothLowInterpretation:
      'Kalian berdua sama-sama mandiri dan menikmati waktu untuk hobi atau kesibukan masing-masing tanpa merasa saling menjauh.',
    divergentInterpretation: (high, low) =>
      `${high} merasa waktu luang paling bermakna jika dihabiskan berdua, sedangkan ${low} membutuhkan momen sendiri untuk memulihkan energi mental tanpa ada tuntutan interaksi.`,
    neutralInterpretation:
      'Kalian menikmati kombinasi yang seimbang antara waktu kencan dan waktu menjalankan agenda masing-masing.',
    discussionPrompt:
      'Berapa banyak porsi waktu di akhir pekan yang ingin kita habiskan bersama, dan berapa banyak yang ingin kita gunakan untuk me-time?',
    suggestedAction:
      'Bagi akhir pekan: Sabtu sore untuk kencan bersama, Minggu pagi untuk hobi atau istirahat mandiri masing-masing.',
  },

  Q16: {
    questionId: 'Q16',
    category: 'lifestyle',
    categoryName: 'Gaya Hidup',
    questionText: 'Saya menikmati aktivitas baru seperti traveling, mencoba makanan, atau mengeksplorasi tempat baru bersama pasangan.',
    highAlignmentInterpretation:
      'Tingkat antusiasme eksplorasi dan jiwa petualangan yang selaras dalam menikmati hal-hal baru.',
    lowAlignmentInterpretation:
      'Variasi antara jiwa petualang dan pencinta kenyamanan rumah: satu pihak haus pengalaman baru, pihak lain lebih menyukai kenyamanan tempat yang sudah akrab.',
    bothHighInterpretation:
      'Kalian berdua memiliki jiwa petualang yang membara. Menjelajahi tempat baru akan menjadi sumber kebahagiaan terbesar hubungan kalian.',
    bothLowInterpretation:
      'Kalian berdua tipe "homebody" yang menemukan kenyamanan mendalam dalam ketenangan rumah dan tempat-tempat yang sudah akrab.',
    divergentInterpretation: (high, low) =>
      `${high} bersemangat mencoba hal baru dan bepergian, sementara ${low} merasa kenyamanan di rumah atau tempat langganan lebih menenangkan dan hemat energi.`,
    neutralInterpretation:
      'Kalian suka berlibur dan mencoba hal baru sesekali, namun tetap menghargai rutinitas santai di rumah.',
    discussionPrompt:
      'Apa satu destinasi atau pengalaman baru yang belum pernah kita coba dan ingin kita wujudkan dalam 6 bulan ke depan?',
    suggestedAction:
      'Buat "Bucket List Toples": Tulis 10 aktivitas baru di kertas kecil, lalu cabut satu setiap awal bulan untuk dicoba bersama.',
  },

  Q17: {
    questionId: 'Q17',
    category: 'lifestyle',
    categoryName: 'Gaya Hidup',
    questionText: 'Saya merasa penting memiliki rutinitas dan kebiasaan sehari-hari yang teratur.',
    highAlignmentInterpretation:
      'Kesamaan ritme keteraturan hidup harian, waktu bangun tidur, dan pengelolaan tugas rumah tangga.',
    lowAlignmentInterpretation:
      'Perbedaan struktur hidup: pihak yang teratur merasa tenang dengan jadwal pasti, pihak yang spontan merasa terkekang oleh rutinitas yang terlalu kaku.',
    bothHighInterpretation:
      'Kalian berdua menyukai keteraturan, jadwal yang jelas, dan rutinitas terorganisir. Rumah tangga kalian akan berjalan sangat efisien.',
    bothLowInterpretation:
      'Kalian berdua fleksibel, spontan, dan tidak suka terikat oleh jadwal harian yang terlalu kaku.',
    divergentInterpretation: (high, low) =>
      `${high} merasa nyaman dengan rutinitas terjadwal, sedangkan ${low} lebih spontan dan adaptif mengikuti alur hari. ${high} perlu belajar relaks, dan ${low} perlu menghargai komitmen waktu.`,
    neutralInterpretation:
      'Kalian memiliki beberapa rutinitas pokok (seperti jam kerja), namun membiarkan waktu senggang berjalan fleksibel.',
    discussionPrompt:
      'Rutinitas pagi atau malam apa yang paling membuat harimu terasa damai dan teratur?',
    suggestedAction:
      'Terapkan "Pondasi Teratur, Akhir Pekan Bebas": Disiplin pada rutinitas Senin–Jumat, dan biarkan Sabtu–Minggu mengalir spontan.',
  },

  Q18: {
    questionId: 'Q18',
    category: 'lifestyle',
    categoryName: 'Gaya Hidup',
    questionText: 'Saya membutuhkan waktu pribadi untuk menjalankan hobi atau aktivitas sendiri meskipun sedang berada dalam hubungan.',
    highAlignmentInterpretation:
      'Saling menghormati batas individualitas dan pemahaman bahwa memiliki hobi sendiri justru menyehatkan hubungan berdua.',
    lowAlignmentInterpretation:
      'Satu pihak sangat menjunjung tinggi ruang pribadi untuk hobi, sementara pihak lain merasa hubungan yang ideal adalah melakukan segala hal bersama-sama.',
    bothHighInterpretation:
      'Kalian berdua sangat matang dalam menghargai ruang pribadi masing-masing. Kalian tidak kehilangan jati diri di dalam hubungan.',
    bothLowInterpretation:
      'Kalian lebih suka mengintegrasikan seluruh hobi dan kegiatan luang menjadi kegiatan bersama.',
    divergentInterpretation: (high, low) =>
      `${high} sangat membutuhkan waktu tersendiri untuk hobinya agar merasa utuh, sedangkan ${low} bisa salah paham mengira ${high} bosan menghabiskan waktu bersamanya.`,
    neutralInterpretation:
      'Kalian memandang hobi pribadi dapat dijalankan secara fleksibel tanpa harus mengorbankan kebersamaan.',
    discussionPrompt:
      'Hobi atau minat apa yang paling ingin kamu terus jalani secara mandiri tanpa merasa bersalah meninggalkan pasangan?',
    suggestedAction:
      'Jadwalkan "Me-Time Protected Hours": 2–3 jam dalam seminggu di mana masing-masing bebas melakukan hobinya tanpa interupsi.',
  },

  // ==========================================
  // CATEGORY 5: FUTURE VISION (Q19 - Q22)
  // ==========================================
  Q19: {
    questionId: 'Q19',
    category: 'future',
    categoryName: 'Visi Masa Depan',
    questionText: 'Saya ingin memiliki tujuan finansial bersama pasangan untuk 5–10 tahun ke depan.',
    highAlignmentInterpretation:
      'Keselarasan dalam memproyeksikan target masa depan, tabungan pensiun, dan arah kesejahteraan jangka panjang.',
    lowAlignmentInterpretation:
      'Perbedaan horizon waktu: satu pihak merencanakan dekade ke depan, pihak lain memilih fokus mengeksekusi rencana tahunan.',
    bothHighInterpretation:
      'Kalian memiliki visi jangka panjang yang sangat kuat dan ambisius untuk membangun masa depan bersama secara terukur.',
    bothLowInterpretation:
      'Kalian lebih menyukai pendekatan bertahap tahun demi tahun daripada mematok target 10 tahun yang terasa terlalu jauh.',
    divergentInterpretation: (high, low) =>
      `${high} terbiasa berpikir strategis 5–10 tahun ke depan, sementara ${low} merasa masa depan terlalu banyak ketidakpastian sehingga lebih nyaman fokus pada target 1 tahun ke depan.`,
    neutralInterpretation:
      'Kalian memiliki gambaran umum masa depan, namun belum menuangkannya ke dalam rencana angka finansial yang detail.',
    discussionPrompt:
      'Di mana dan seperti apa kehidupan ideal yang kita inginkan saat usia kita bertambah 7 tahun dari sekarang?',
    suggestedAction:
      'Buat dokumen satu halaman "Roadmap 5 Tahun": Tuliskan target tempat tinggal, tabungan, dan pengalaman yang ingin diraih.',
  },

  Q20: {
    questionId: 'Q20',
    category: 'future',
    categoryName: 'Visi Masa Depan',
    questionText: 'Saya bersedia mempertimbangkan perubahan kota atau negara jika hal tersebut memberikan peluang lebih baik bagi keluarga.',
    highAlignmentInterpretation:
      'Tingkat fleksibilitas geografis dan kesiapan beradaptasi dengan relokasi demi kemajuan karier atau keluarga.',
    lowAlignmentInterpretation:
      'Perbedaan keterikatan tempat: satu pihak siap merantau demi peluang emas, pihak lain memiliki akar emosional/keluarga yang kuat di kota saat ini.',
    bothHighInterpretation:
      'Kalian berdua memiliki mentalitas perantau yang fleksibel dan siap melangkah ke mana pun peluang terbaik membawa keluarga kalian.',
    bothLowInterpretation:
      'Kalian berdua sangat mencintai kota tempat tinggal saat ini dan memprioritaskan kedekatan dengan lingkaran yang sudah ada.',
    divergentInterpretation: (high, low) =>
      `${high} terbuka untuk pindah kota atau negara demi lompatan peluang, sedangkan ${low} merasa kenyamanan jaringan sosial, keluarga besar, dan stabilitas lokasi saat ini sulit tergantikan.`,
    neutralInterpretation:
      'Kalian bersedia mempertimbangkan relokasi hanya jika tawarannya sangat luar biasa dan tidak merugikan kenyamanan keluarga.',
    discussionPrompt:
      'Kriteria peluang seperti apa yang membuat kita rela mengemas koper dan pindah ke kota atau negara baru?',
    suggestedAction:
      'Diskusikan "Daftar Kota/Wilayah Non-Negosiasi" dan syarat mutlak yang harus dipenuhi sebelum memutuskan relokasi.',
  },

  Q21: {
    questionId: 'Q21',
    category: 'future',
    categoryName: 'Visi Masa Depan',
    questionText: 'Saya ingin pasangan saya tetap mendukung perkembangan karier dan ambisi pribadi saya.',
    highAlignmentInterpretation:
      'Tingkat saling dukung yang tinggi terhadap aktualisasi diri dan pencapaian profesional masing-masing.',
    lowAlignmentInterpretation:
      'Kekhawatiran bahwa ambisi karier salah satu pihak akan menuntut pengorbanan waktu keluarga atau peran domestik.',
    bothHighInterpretation:
      'Kalian adalah pasangan "Power Team" yang saling menjadi pemandu sorak terbesar untuk kesuksesan karier dan mimpi masing-masing.',
    bothLowInterpretation:
      'Kalian memandang karier sekadar sarana nafkah dan sepakat bahwa ambisi pribadi tidak boleh menyita energi keluarga.',
    divergentInterpretation: (high, low) =>
      `${high} memiliki ambisi karier yang tinggi dan membutuhkan dorongan penuh, sementara ${low} khawatir ambisi tersebut akan menyita porsi kehangatan dan waktu bersama.`,
    neutralInterpretation:
      'Kalian saling mendukung karier secara wajar selama jam kerja tidak melanggar batas kesehatan dan kebersamaan.',
    discussionPrompt:
      'Apa satu target karier atau pencapaian pribadimu dalam 2 tahun ke depan yang paling membutuhkan dukunganku?',
    suggestedAction:
      'Lakukan sesi refleksi karier semesteran untuk menanyakan: "Apakah jam kerjaku belakangan ini membuatmu merasa sendirian?"',
  },

  Q22: {
    questionId: 'Q22',
    category: 'future',
    categoryName: 'Visi Masa Depan',
    questionText: 'Saya merasa penting memiliki gambaran yang sama mengenai kehidupan yang ingin kami bangun di masa depan.',
    highAlignmentInterpretation:
      'Keselarasan filosofis mengenai makna hidup bahagia dan nilai inti rumah tangga yang ingin dibangun.',
    lowAlignmentInterpretation:
      'Perbedaan definisi mengenai gambaran hidup ideal: perlu menyelaraskan apakah fokus hidup pada pencapaian materi, ketenangan, atau kontribusi sosial.',
    bothHighInterpretation:
      'Kalian berdua memandang kesamaan kompas hidup sebagai komitmen mutlak agar tidak berjalan ke arah yang berlawanan di tengah jalan.',
    bothLowInterpretation:
      'Kalian percaya bahwa perbedaan arah dan pandangan hidup justru memperkaya dinamika tanpa harus dipaksakan seragam.',
    divergentInterpretation: (high, low) =>
      `${high} membutuhkan kejelasan visi hidup bersama yang tegas, sementara ${low} merasa hidup dijalani mengalir saja mengikuti dinamika yang berkembang.`,
    neutralInterpretation:
      'Kalian memiliki nilai moral yang sama, namun membiarkan detail teknis masa depan berkembang secara lentur.',
    discussionPrompt:
      'Jika kamu merangkum kehidupan ideal rumah tangga kita dalam 3 kata nilai (misal: damai, bertumbuh, petualangan), apa 3 kata pilihanmu?',
    suggestedAction:
      'Tuliskan "Visi Bersama TWOgether" dan simpan di catatan gawai berdua sebagai pengingat saat menghadapi persimpangan keputusan.',
  },

  // ==========================================
  // CATEGORY 6: EMOTIONAL NEEDS (Q23 - Q26)
  // ==========================================
  Q23: {
    questionId: 'Q23',
    category: 'emotional',
    categoryName: 'Kebutuhan Emosional',
    questionText: 'Saya membutuhkan ungkapan kasih sayang secara verbal dari pasangan.',
    highAlignmentInterpretation:
      'Kesamaan kebutuhan bahasa kasih kata-kata penegasan (*words of affirmation*) untuk merasa dicintai.',
    lowAlignmentInterpretation:
      'Perbedaan ekspresi kasih: satu pihak membutuhkan ungkapan verbal ("aku sayang kamu"), pihak lain mengekspresikannya melalui tindakan nyata atau pelayanan tanpa banyak kata.',
    bothHighInterpretation:
      'Kalian berdua sangat menghargai pujian, kalimat manis, dan penegasan verbal. Saling memuji akan menjadi bahan bakar kebahagiaan harian kalian.',
    bothLowInterpretation:
      'Kalian berdua tidak terlalu membutuhkan kata-kata manis dan lebih percaya pada bukti perbuatan nyata dalam keseharian.',
    divergentInterpretation: (high, low) =>
      `${high} merasa hatinya penuh saat mendengar kata cinta dan pujian verbal, sementara ${low} merasa perbuatan nyata sudah cukup berbicara tanpa perlu diucapkan berulang kali.`,
    neutralInterpretation:
      'Kata-kata manis menyenangkan bagi kalian, namun bukan satu-satunya tolok ukur rasa cinta.',
    discussionPrompt:
      'Kapan terakhir kali sebuah kalimat dariku membuatmu merasa sangat dicintai dan dihargai?',
    suggestedAction:
      'Kirimkan minimal satu pesan singkat apresiasi tak terduga setiap hari (misal: "Terima kasih ya sudah berjuang hari ini").',
  },

  Q24: {
    questionId: 'Q24',
    category: 'emotional',
    categoryName: 'Kebutuhan Emosional',
    questionText: 'Saya merasa diperhatikan ketika pasangan mengingat hal-hal kecil tentang diri saya.',
    highAlignmentInterpretation:
      'Kepekaan bersama terhadap detail-detail intim (makanan favorit, jadwal penting, cerita masa lalu) sebagai bukti perhatian tulus.',
    lowAlignmentInterpretation:
      'Satu pihak sangat tersentuh oleh perhatian pada detail kecil, sementara pihak lain berfokus pada gambaran besar dan terkadang lupa pada rincian remeh.',
    bothHighInterpretation:
      'Bagi kalian, cinta tercermin dalam detail terkecil: mengingat kopi kesukaan, lagu favorit, atau hal yang sedang dicemaskan.',
    bothLowInterpretation:
      'Kalian berdua santai dan tidak menuntut pasangan harus mengingat setiap detail kecil dalam rutinitas.',
    divergentInterpretation: (high, low) =>
      `${high} merasa sangat disayangi ketika hal kecil tentangnya diingat, sedangkan ${low} bukan tipe pencatat detail alami dan membutuhkan bantuan pengingat tanpa bermaksud cuek.`,
    neutralInterpretation:
      'Mengingat hal kecil terasa menyenangkan, namun kalian memaklumi jika pasangan sesekali lupa karena beban pikiran.',
    discussionPrompt:
      'Hal kecil apa tentang dirimu yang paling ingin kamu tahu bahwa aku selalu memperhatikannya?',
    suggestedAction:
      'Gunakan aplikasi catatan bersama untuk mencatat hal-hal favorit pasangan (makanan, ukuran baju, impian kecil).',
  },

  Q25: {
    questionId: 'Q25',
    category: 'emotional',
    categoryName: 'Kebutuhan Emosional',
    questionText: 'Saya membutuhkan dukungan emosional dari pasangan ketika sedang menghadapi masa sulit.',
    highAlignmentInterpretation:
      'Tingkat ketergantungan yang sehat pada pasangan sebagai tempat bersandar utama saat badai kehidupan menerpa.',
    lowAlignmentInterpretation:
      'Perbedaan mekanisme *coping*: satu pihak membutuhkan pelukan dan kehadiran emosional pasangan, pihak lain cenderung menarik diri ke "gua pertapaan" untuk menenangkan diri sendiri terlebih dahulu.',
    bothHighInterpretation:
      'Kalian adalah pelabuhan aman (*safe haven*) bagi satu sama lain saat dunia di luar sedang terasa berat dan melelahkan.',
    bothLowInterpretation:
      'Kalian terbiasa mandiri menyelesaikan beban emosional masing-masing sebelum kembali berinteraksi dengan pasangan.',
    divergentInterpretation: (high, low) =>
      `${high} sangat membutuhkan kehadiran dan validasi pasangan saat terluka, sedangkan ${low} cenderung ingin menyendiri terlebih dahulu untuk memproses rasa sakitnya.`,
    neutralInterpretation:
      'Kalian mencari dukungan pasangan saat masalahnya sangat besar, namun mengatasi masalah ringan secara mandiri.',
    discussionPrompt:
      'Bentuk dukungan emosional seperti apa yang paling kamu butuhkan dariku saat harimu sedang sangat kacau?',
    suggestedAction:
      'Terapkan "Teknik Kehadiran Tanpa Beban": Berikan pelukan hangat 20 detik tanpa mendesak pasangan harus langsung bercerita jika belum siap.',
  },

  Q26: {
    questionId: 'Q26',
    category: 'emotional',
    categoryName: 'Kebutuhan Emosional',
    questionText: 'Saya merasa penting untuk tetap menjaga romantisme meskipun hubungan sudah berlangsung lama.',
    highAlignmentInterpretation:
      'Kesadaran aktif bahwa romantisme bukan terjadi secara kebetulan, melainkan dirawat secara sengaja sepanjang usia pernikahan.',
    lowAlignmentInterpretation:
      'Satu pihak merindukan percikan kencan dan kejutan manis, sementara pihak lain merasa hubungan yang matang cukup berpijak pada kenyamanan persahabatan yang tenang.',
    bothHighInterpretation:
      'Kalian berdua menolak membiarkan hubungan menjadi hambar. Menjaga romantisme, kencan, dan kejutan adalah komitmen hidup kalian.',
    bothLowInterpretation:
      'Kalian merasa kenyamanan persahabatan yang tenang dan stabil jauh lebih penting daripada drama gestur romantis.',
    divergentInterpretation: (high, low) =>
      `${high} mendambakan gestur romantis dan perlakuan manis yang terus dirawat, sementara ${low} merasa cinta yang dewasa cukup ditunjukkan lewat kesetiaan dan tanggung jawab sehari-hari.`,
    neutralInterpretation:
      'Kalian menikmati momen romantis sesekali pada hari ulang tahun atau perayaan penting, tanpa merasa harus melakukannya setiap minggu.',
    discussionPrompt:
      'Momen kencan seperti apa yang paling kamu rindukan untuk kita ulangi bersama seperti saat awal masa pendekatan dulu?',
    suggestedAction:
      'Jadwalkan "Kencan Dua Mingguan": Bergantian merencanakan kencan kejutan setiap dua minggu sekali tanpa melibatkan urusan pekerjaan.',
  },

  // ==========================================
  // CATEGORY 7: CONFLICT MANAGEMENT (Q27 - Q30)
  // ==========================================
  Q27: {
    questionId: 'Q27',
    category: 'conflict',
    categoryName: 'Manajemen Konflik',
    questionText: 'Saya bisa mengakui kesalahan dan meminta maaf ketika memang melakukan kesalahan.',
    highAlignmentInterpretation:
      'Kematangan ego dan kerendahan hati untuk meminta maaf, yang merupakan faktor prediksi terkuat dalam keberhasilan perbaikan hubungan (*repair attempt*).',
    lowAlignmentInterpretation:
      'Hambatan defensif: kesulitan mengakui kesalahan sering kali berakar dari rasa takut disalahkan sepenuhnya atau gengsi emosional.',
    bothHighInterpretation:
      'Kalian berdua memiliki kedewasaan luar biasa untuk meredam ego, mengakui kekeliruan, dan meminta maaf dengan tulus. Ini modal penyembuh konflik tercepat.',
    bothLowInterpretation:
      'Kalian berdua cenderung defensif atau gengsi untuk mengucapkan kata maaf secara langsung, dan lebih memilih berdamai melalui perubahan sikap.',
    divergentInterpretation: (high, low) =>
      `${high} mudah meminta maaf demi memulihkan kedamaian, sedangkan ${low} membutuhkan waktu lebih lama untuk menurunkan pertahanan ego sebelum mampu mengakui kesalahannya.`,
    neutralInterpretation:
      'Kalian dapat meminta maaf saat situasinya jelas, namun bisa bersikap alot saat sama-sama merasa berada di pihak yang benar.',
    discussionPrompt:
      'Apa yang membuat kata maaf terkadang terasa begitu berat untuk diucapkan saat kita sedang berselisih paham?',
    suggestedAction:
      'Praktikkan aturan emas: "Meminta maaf bukan berarti kamu yang salah 100%, melainkan kamu menghargai hubungan ini lebih tinggi daripada egomu."',
  },

  Q28: {
    questionId: 'Q28',
    category: 'conflict',
    categoryName: 'Manajemen Konflik',
    questionText: 'Saya lebih memilih mencari solusi bersama daripada berusaha membuktikan siapa yang benar.',
    highAlignmentInterpretation:
      'Orientasi "Kita vs Masalah" (bukan "Aku vs Kamu"), landasan utama dalam resolusi konflik kolaboratif.',
    lowAlignmentInterpretation:
      'Jebakan debat: kecenderungan untuk saling adu argumen demi membuktikan pihak mana yang lebih benar, yang sering kali menghabiskan energi emosional.',
    bothHighInterpretation:
      'Kalian berdua berfokus pada penyelesaian masalah dan perdamaian bersama. Tidak ada yang terobsesi menjadi pemenang di atas kekalahan pasangan.',
    bothLowInterpretation:
      'Kalian sama-sama kritis dan memiliki dorongan kuat untuk mempertahankan kebenaran logika argumen masing-masing saat berselisih.',
    divergentInterpretation: (high, low) =>
      `${high} ingin segera merangkul solusi damai, sementara ${low} terdorong untuk membedah fakta secara rinci demi memastikan logikanya dipahami dengan benar.`,
    neutralInterpretation:
      'Kalian berusaha mencari solusi, namun sesekali masih terjebak ingin mempertahankan argumen pada topik-topik yang sensitif.',
    discussionPrompt:
      'Bagaimana cara kita mengingatkan diri sendiri saat berdebat bahwa tujuannya adalah menyelesaikan masalah, bukan mengalahkan pasangan?',
    suggestedAction:
      'Saat argumen memanas, ucapkan mantra bersama: "Ingat, kita berada di tim yang sama melawan masalah ini."',
  },

  Q29: {
    questionId: 'Q29',
    category: 'conflict',
    categoryName: 'Manajemen Konflik',
    questionText: 'Saya membutuhkan waktu sendiri untuk menenangkan diri sebelum membicarakan konflik yang terjadi.',
    highAlignmentInterpretation:
      'Kesamaan ritme regulasi emosi: kalian berdua sama-sama paham perlunya jeda pendinginan sebelum berbicara.',
    lowAlignmentInterpretation:
      'Pola klasik *Pursuer-Distancer* (Mengejar vs Menarik Diri): satu pihak butuh jeda menenangkan diri, pihak lain merasa cemas dan mendesak bicara saat itu juga.',
    bothHighInterpretation:
      'Kalian berdua sepakat bahwa jeda menenangkan diri adalah obat mujarab untuk mencegah kata-kata tajam yang disesali di kemudian hari.',
    bothLowInterpretation:
      'Kalian berdua tipe ekspresif yang lebih suka menuntaskan perdebatan secara maraton tanpa perlu berpisah ruangan.',
    divergentInterpretation: (high, low) =>
      `${high} sangat membutuhkan ruang sendiri untuk menurunkan detak jantung dan emosi, sedangkan ${low} merasa cemas ketika ditinggal diam dan ingin segera membereskannya.`,
    neutralInterpretation:
      'Kalian bisa berdiskusi langsung untuk masalah ringan, namun membutuhkan jeda beberapa menit saat emosi mulai memuncak.',
    discussionPrompt:
      'Berapa lama waktu jeda yang biasanya kamu butuhkan untuk kembali tenang, dan apa jaminan yang bisa kuberikan agar kamu tidak merasa diabaikan?',
    suggestedAction:
      'Sepakati "Batas Waktu Jeda": "Aku butuh waktu 30 menit untuk tenang. Setelah itu, kita pasti lanjutkan obrolan ini."',
  },

  Q30: {
    questionId: 'Q30',
    category: 'conflict',
    categoryName: 'Manajemen Konflik',
    questionText: 'Saya percaya bahwa perbedaan pendapat dapat diselesaikan tanpa harus saling menyakiti.',
    highAlignmentInterpretation:
      'Komitmen moral bersama terhadap batasan aman dalam berkonflik: menolak kata-kata kasar, sarkasme, dan kekerasan emosional.',
    lowAlignmentInterpretation:
      'Kekhawatiran akan intensitas konflik: perlu memperkuat komitmen agar perbedaan pendapat tidak merosot menjadi saling merendahkan atau menyerang pribadi.',
    bothHighInterpretation:
      'Kalian berdua memegang teguh prinsip bahwa perselisihan tidak boleh menjadi alasan untuk merusak martabat dan melukai hati pasangan.',
    bothLowInterpretation:
      'Kalian merasa dalam perdebatan sengit, percikan emosi yang tajam terkadang sulit dihindarkan.',
    divergentInterpretation: (high, low) =>
      `${high} sangat memprioritaskan kelembutan dan pantang berkata tajam, sementara ${low} saat marah terkadang melepaskan kekesalan secara spontan yang bisa terasa melukai bagi ${high}.`,
    neutralInterpretation:
      'Kalian selalu berniat menjaga kata-kata, meskipun terkadang nada bicara meninggi saat kelelahan.',
    discussionPrompt:
      'Batas apa yang sama sekali tidak boleh dilanggar saat kita sedang marah (misal: memaki, membanting pintu, mengungkit masa lalu)?',
    suggestedAction:
      'Tuliskan "Pakta Perdamaian Pasangan": Tiga hal terlarang saat berkonflik (tidak mencela fisik/keluarga, tidak memaki, dan tidak mengancam berpisah).',
  },
};
