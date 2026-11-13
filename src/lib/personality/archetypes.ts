import { ArchetypeCode, ArchetypeDefinition } from './types';

export const ARCHETYPES: Record<ArchetypeCode, ArchetypeDefinition> = {
  secure_lover: {
    code: 'secure_lover',
    number: 1,
    title: 'The Secure Lover',
    indonesianTitle: 'Pencinta Hangat & Stabil',
    tagline: 'Mencintai tanpa rasa takut, memberi ruang tanpa keraguan.',
    quote: '“Cinta yang sejati tidak mengikat, melainkan menjadi dermaga yang menenangkan.”',
    shortDescription:
      'Kamu memiliki fondasi emosional yang matang, nyaman dengan keintiman, sekaligus menghargai kemandirian pasangan tanpa rasa cemas berlebihan.',
    fullProfile:
      'Sebagai The Secure Lover, kamu memandang cinta sebagai ruang aman untuk bertumbuh bersama. Kamu tidak mudah panik saat terjadi jarak atau jeda, dan memiliki kemampuan alami untuk mengekspresikan kasih sayang secara konsisten tanpa manipulasi emosi.',
    coreCharacteristics: [
      'Memiliki rasa aman internal yang kuat dalam hubungan',
      'Terbuka mengungkapkan perasaan tanpa takut dihakimi',
      'Mampu menjadi pendengar empatik sekaligus penenang suasana',
      'Menghormati batasan pribadi tanpa merasa ditolak',
    ],
    emotionalNeeds: [
      'Konsistensi dan kejelasan niat dalam hubungan',
      'Rasa saling percaya yang tidak menuntut pembuktian berlebihan',
      'Kehangatan emosional yang tulus dan tidak bersyarat',
    ],
    communicationStyle:
      'Jujur, tenang, asertif, dan berfokus pada solusi konstruktif saat menghadapi silang pendapat.',
    relationshipStrengths: [
      'Memberikan stabilitas emosional yang menenangkan bagi pasangan',
      'Tidak mudah tersulut drama emosional yang tidak perlu',
      'Mendorong pasangan menjadi diri sendiri seutuhnya',
    ],
    potentialChallenges: [
      'Bisa terlalu sabar atau lambat menyadari jika pasangan memanfaatkan ketenanganmu',
      'Terkadang berasumsi pasangan memiliki tingkat kematangan emosi yang sama sepertimu',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang menghargai keterbukaan, memiliki kedewasaan emosi, dan tidak memainkan permainan tarik-ulur.',
    recommendedPartnerTraits: [
      'Emosional matang dan tidak impulsif',
      'Transparan dan jujur mengenai harapan masa depan',
      'Menghargai komunikasi dua arah yang setara',
      'Memiliki komitmen yang stabil dan konsisten',
    ],
    growthRecommendations: [
      'Tetap tetapkan batasan tegas jika pasangan berulang kali mengabaikan kebutuhanmu',
      'Ajak pasangan yang lebih cemas untuk memahami bahwa jeda bukan berarti hilangnya rasa sayang',
      'Terus rawat keintiman spontan agar hubungan tidak terasa terlalu rutin',
    ],
    relationshipBlueprint:
      'Pondasi hubungan didasarkan pada rasa saling percaya mendalam, komunikasi terbuka setiap hari, dan komitmen bersama untuk saling menyokong mimpi masing-masing.',
  },

  best_friend: {
    code: 'best_friend',
    number: 2,
    title: 'The Best Friend',
    indonesianTitle: 'Sahabat Sejati dalam Cinta',
    tagline: 'Cinta terbaik tumbuh dari persahabatan yang tulus dan penuh tawa.',
    quote: '“Kekasih yang hebat adalah sahabat terbaik yang bisa diajak menertawakan dunia bersama.”',
    shortDescription:
      'Bagimu, fondasi cinta paling kokoh adalah persahabatan sejati—di mana kamu bisa menjadi dirimu apa adanya, berbagi tawa, dan melalui hari bersama tanpa kepalsuan.',
    fullProfile:
      'The Best Friend menempatkan kenyamanan, kesamaan nilai, dan kedekatan alami di atas formalitas asmara. Kamu mendambakan pasangan yang bisa diajak berbicara tentang apa saja, mulai dari hal konyol hingga mimpi terbesar tanpa rasa canggung.',
    coreCharacteristics: [
      'Sangat menghargai kenyamanan dan keakraban dalam kebersamaan',
      'Suka berbagi cerita keseharian dan hobi bersama',
      'Menyelesaikan ketegangan dengan humor sehat dan obrolan santai',
      'Setia kawan dan selalu siap menjadi pendukung nomor satu pasangan',
    ],
    emotionalNeeds: [
      'Rasa diterima sepenuhnya tanpa perlu berpura-pura sempurna',
      'Waktu berkualitas bersama untuk bercengkerama dan tertawa',
      'Pasangan yang juga berfungsi sebagai rekan seperjuangan hidup',
    ],
    communicationStyle:
      'Kasual, hangat, mengalir tanpa filter berlebihan, dan sarat dengan humor serta empati.',
    relationshipStrengths: [
      'Hubungan terasa ringan, menyenangkan, dan tidak melelahkan',
      'Pasangan merasa sangat nyaman menjadi diri sendiri di dekatmu',
      'Mudah mencairkan suasana kaku dan menjaga hubungan tetap segar',
    ],
    potentialChallenges: [
      'Risiko hilangnya percikan romansa jika hubungan terlalu diperlakukan seperti pertemanan biasa',
      'Kadang ragu membicarakan isu sensitif karena khawatir merusak keakraban santai',
    ],
    idealPartnerCharacteristics:
      'Seseorang yang santai, memiliki selera humor yang sefrekuensi, tulus, dan mampu menjadi rekan diskusi sekaligus tempat berbagi rasa.',
    recommendedPartnerTraits: [
      'Memiliki rasa humor yang hangat dan tidak mudah tersinggung',
      'Suka menghabiskan waktu bersama untuk hal-hal sederhana',
      'Pendengar yang suportif dan antusias terhadap ceritamu',
      'Mampu menyeimbangkan obrolan santai dengan romantisme yang manis',
    ],
    growthRecommendations: [
      'Sisipkan momen romantis khusus agar percikan asmara tetap menyala',
      'Jangan takut mengangkat percakapan serius mengenai masa depan dan komitmen',
      'Belajarlah mengekspresikan kerentanan yang lebih mendalam, bukan hanya keceriaan',
    ],
    relationshipBlueprint:
      'Sebuah kemitraan hidup yang penuh tawa, saling mendukung dalam suka dan duka, serta selalu merasa pulang saat berada di sisi pasangan.',
  },

  deep_soul: {
    code: 'deep_soul',
    number: 3,
    title: 'The Deep Soul',
    indonesianTitle: 'Pencari Kedalaman & Jiwa',
    tagline: 'Tidak puas dengan permukaan; mendambakan koneksi batin yang utuh.',
    quote: '“Bicaralah padaku tentang hal-hal yang membuat jiwamu terjaga di tengah malam.”',
    shortDescription:
      'Kamu mendambakan keintiman emosional dan intelektual yang mendalam. Obrolan basa-basi terasa hampa; kamu ingin menyelami makna, mimpi, dan isi hati pasangan.',
    fullProfile:
      'Sebagai The Deep Soul, kamu memiliki kepekaan rasa yang tinggi dan intuisi yang tajam. Hubungan bagimu bukan sekadar status sosial atau kebiasaan, melainkan pertemuan dua jiwa yang saling memahami tanpa kata-kata berlebih.',
    coreCharacteristics: [
      'Mencari makna dan kedalaman dalam setiap interaksi',
      'Sangat peka terhadap perubahan nada bicara dan emosi pasangan',
      'Menghargai percakapan larut malam tentang eksistensi, luka batin, dan harapan',
      'Memiliki loyalitas emosional yang sangat mendalam ketika sudah percaya',
    ],
    emotionalNeeds: [
      'Validasi terhadap perasaan dan pemikiran filosofismu',
      'Kehadiran batin yang utuh saat berbicara, bukan sekadar kehadiran fisik',
      'Kejujuran mutlak dan keterbukaan tanpa rahasia emosional',
    ],
    communicationStyle:
      'Mendalam, penuh perasaan, penuh metafora reflektif, dan mengutamakan keintiman tatap muka.',
    relationshipStrengths: [
      'Mampu membuat pasangan merasa benar-benar dilihat dan didengarkan',
      'Menciptakan ikatan batin yang sangat kuat dan sulit tergantikan',
      'Mendorong refleksi diri dan pertumbuhan spiritual pasangan',
    ],
    potentialChallenges: [
      'Bisa merasa kesepian jika pasangan memiliki gaya komunikasi yang lebih praktis',
      'Kecenderungan untuk overthinking terhadap detail kecil atau perubahan sikap pasangan',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang sabar, bersedia membuka hati secara jujur, mampu menghargai keheningan bermakna, dan tidak takut pada kedalaman emosi.',
    recommendedPartnerTraits: [
      'Peka secara emosional dan tidak antipati terhadap perasaan mendalam',
      'Mampu diajak bertukar pikiran tentang filosofi hidup dan masa depan',
      'Konsisten dan mampu memberikan rasa kepastian batin',
      'Menghargai ruang refleksi diri',
    ],
    growthRecommendations: [
      'Belajarlah menikmati hal-hal praktis dan sederhana tanpa selalu mencari makna tersembunyi',
      'Komunikasikan perasaan secara langsung daripada berharap pasangan membaca pikiranmu',
      'Beri ruang bagi pasangan yang mengekspresikan cinta melalui tindakan nyata, bukan hanya kata-kata puitis',
    ],
    relationshipBlueprint:
      'Hubungan yang kaya akan dialog batin, saling merawat luka masa lalu, dan berjalan bergandengan menuju keselarasan spiritual serta emosional.',
  },

  explorer: {
    code: 'explorer',
    number: 4,
    title: 'The Explorer',
    indonesianTitle: 'Petualang Cinta Dinamis',
    tagline: 'Cinta adalah petualangan tanpa batas untuk dijelajahi bersama.',
    quote: '“Dunia ini terlalu luas untuk dijelajahi sendiri; mari kita temukan tempat-tempat baru bersama.”',
    shortDescription:
      'Kamu berjiwa bebas, antusias terhadap hal baru, dan mendambakan pasangan yang berani keluar dari zona nyaman untuk menjelajahi dunia dan pengalaman baru bersama.',
    fullProfile:
      'The Explorer memandang hubungan sebagai perjalanan yang dinamis dan menginspirasi. Rutinitas yang monoton bisa membuatmu jenuh; kamu berkembang dalam hubungan yang memberi ruang untuk eksplorasi, spontanitas, dan pembelajaran bersama.',
    coreCharacteristics: [
      'Penuh rasa ingin tahu dan selalu bersemangat mencoba pengalaman baru',
      'Sangat menghargai kebebasan berpikir dan fleksibilitas rencana',
      'Menularkan energi positif dan optimisme dalam hubungan',
      'Membawa kesegaran dan mencegah hubungan terjebak dalam kebosanan',
    ],
    emotionalNeeds: [
      'Pasangan yang antusias diajak bertualang dan mencoba hal baru',
      'Tidak merasa terkekang atau dibatasi oleh aturan kaku yang tidak beralasan',
      'Dukungan terhadap gairah eksplorasi pribadi',
    ],
    communicationStyle:
      'Antusias, terbuka, spontan, ekspresif, dan berorientasi pada ide-ide segar.',
    relationshipStrengths: [
      'Hubungan selalu dinamis, kaya cerita, dan tidak pernah membosankan',
      'Mampu mengubah tantangan menjadi petualangan yang mendewasakan',
      'Mendorong pasangan untuk lebih berani mencoba hal-hal yang belum pernah mereka rasakan',
    ],
    potentialChallenges: [
      'Bisa terasa tidak sabar menghadapi rutinitas rumah tangga yang stabil dan berulang',
      'Terkadang menghindari komitmen terstruktur karena takut kehilangan kemerdekaan diri',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang memiliki jiwa petualang atau setidaknya berpikiran terbuka, suportif terhadap petualangan baru, dan mampu menjadi jangkar saat kamu butuh istirahat.',
    recommendedPartnerTraits: [
      'Fleksibel, adaptif, dan berani menghadapi ketidakpastian',
      'Memiliki rasa penasaran intelektual dan antusiasme hidup tinggi',
      'Tidak posesif atau mudah curiga terhadap kebebasan pasangan',
      'Mampu menyeimbangkan spontanitas dengan tanggung jawab praktis',
    ],
    growthRecommendations: [
      'Sadari bahwa stabilitas dan rutinitas juga merupakan bentuk cinta yang berharga',
      'Ajak pasangan berdiskusi sebelum mengambil keputusan spontan yang berdampak besar',
      'Temukan keindahan dalam momen-momen tenang dan hening di rumah bersama',
    ],
    relationshipBlueprint:
      'Sebuah perjalanan dua insan yang saling menginspirasi untuk melangkah keluar dari batas, mengumpulkan kenangan di berbagai penjuru dunia, sembari tetap menjaga janji setia.',
  },

  home_builder: {
    code: 'home_builder',
    number: 5,
    title: 'The Home Builder',
    indonesianTitle: 'Pembangun Rumah Tangga Hangat',
    tagline: 'Membangun surga kecil di dunia berlandaskan kehangatan dan ketenangan.',
    quote: '“Rumah bukanlah tempat tinggal semata, melainkan tempat di mana hati kita saling menemukan damai.”',
    shortDescription:
      'Kamu mendambakan kehangatan keluarga, stabilitas, tradisi bersama, dan kehidupan rumah tangga yang damai, teratur, dan penuh kasih sayang.',
    fullProfile:
      'The Home Builder memiliki naluri alami untuk merawat, menyatukan, dan menciptakan tempat berlindung yang nyaman bagi orang-orang tercinta. Kamu sangat mengutamakan kebersamaan keluarga, perencanaan jangka panjang, dan rasa aman finansial maupun emosional.',
    coreCharacteristics: [
      'Sangat berorientasi pada keluarga, rumah tangga, dan masa depan anak',
      'Menikmati menciptakan kenyamanan rumah (kebersamaan meja makan, tradisi keluarga)',
      'Memiliki komitmen yang kokoh dan dapat diandalkan dalam jangka panjang',
      'Penuh perhatian pada kebutuhan fisik dan emosional pasangan di keseharian',
    ],
    emotionalNeeds: [
      'Kepastian dan komitmen nyata menuju pernikahan yang terencana',
      'Apresiasi terhadap usaha merawat keharmonisan keluarga',
      'Pasangan yang bertanggung jawab dan memprioritaskan keluarga',
    ],
    communicationStyle:
      'Penuh perhatian, hangat, teratur, dan fokus pada kesejahteraan bersama.',
    relationshipStrengths: [
      'Menciptakan lingkungan keluarga yang harmonis, stabil, dan aman',
      'Pasangan merasa sangat dirawat dan dihargai di setiap detail kecil',
      'Memiliki visi yang jelas dan realistis dalam membangun rumah tangga masa depan',
    ],
    potentialChallenges: [
      'Bisa merasa cemas jika pasangan kurang memiliki rencana matang atau terlalu santai',
      'Terkadang terlalu sibuk merawat urusan rumah hingga melupakan kebutuhan diri sendiri',
    ],
    idealPartnerCharacteristics:
      'Seseorang yang setia, bertanggung jawab, memiliki visi kekeluargaan yang sejalan, dan siap berkomitmen untuk masa depan bersama.',
    recommendedPartnerTraits: [
      'Berorientasi keluarga dan menyayangi anak-anak',
      'Stabil secara finansial atau memiliki etos kerja yang bertanggung jawab',
      'Suka menghabiskan waktu bersama di rumah',
      'Dapat diandalkan dalam pembagian peran rumah tangga',
    ],
    growthRecommendations: [
      'Beri ruang bagi spontanitas dan jangan terlalu kaku pada jadwal atau ekspektasi rumah tangga',
      'Ingatlah untuk tetap merawat identitas dan hobi pribadimu di luar peran keluarga',
      'Bicarakan ekspektasi finansial dan peran keluarga secara transparan sejak awal',
    ],
    relationshipBlueprint:
      'Fondasi rumah tangga yang kokoh di atas nilai-nilai kekeluargaan, saling menjaga kehormatan pasangan, dan menciptakan generasi penerus dalam lingkungan penuh cinta.',
  },

  affectionate_heart: {
    code: 'affectionate_heart',
    number: 6,
    title: 'The Affectionate Heart',
    indonesianTitle: 'Hati Penuh Kelembutan & Sentuhan',
    tagline: 'Cinta harus dirasakan secara nyata melalui kelembutan, sentuhan, dan kehadiran.',
    quote: '“Genggaman tangan di waktu sulit berbicara lebih keras dari seribu kata janji.”',
    shortDescription:
      'Kamu mengekspresikan dan menerima cinta melalui kelembutan fisik, tatapan penuh kasih, pelukan hangat, dan bahasa cinta yang sangat ekspresif.',
    fullProfile:
      'Bagi The Affectionate Heart, cinta adalah kehangatan yang dialami tubuh dan jiwa. Kamu merasa paling dicintai saat pasangan hadir secara utuh, menggenggam tanganmu, memberikan pelukan spontan, dan tidak ragu menunjukkan rasa sayangnya di setiap kesempatan.',
    coreCharacteristics: [
      'Sangat ekspresif dalam memberikan sentuhan fisik dan pelukan hangat',
      'Penuh kelembutan dalam bertutur kata dan bersikap',
      'Menginginkan kedekatan fisik dan emosional yang intens',
      'Peka terhadap bahasa tubuh dan sentuhan pasangan',
    ],
    emotionalNeeds: [
      'Sentuhan fisik yang hangat dan konsisten (gandengan tangan, pelukan hangat)',
      'Kata-kata penegasan cinta yang manis dan tulus',
      'Kepastian bahwa kamu diinginkan dan disayangi setiap hari',
    ],
    communicationStyle:
      'Manis, ekspresif, hangat, dan sering diiringi dengan sentuhan fisik atau nada bicara lembut.',
    relationshipStrengths: [
      'Menciptakan keintiman fisik dan emosional yang sangat erat dan hangat',
      'Pasangan tidak pernah merasa ragu apakah mereka dicintai atau tidak',
      'Mampu meredakan stres pasangan melalui pelukan dan kehadiran fisik yang menenangkan',
    ],
    potentialChallenges: [
      'Bisa merasa ditolak atau tidak dicintai jika pasangan sedang lelah dan butuh jarak fisik',
      'Terkadang kesulitan memahami pasangan yang bahasa kasihnya lebih berupa tindakan logis',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang hangat secara afeksi, tidak kaku atau dingin, dan menyukai sentuhan kasih sayang sehari-hari.',
    recommendedPartnerTraits: [
      'Hangat, ramah, dan nyaman dengan kontak fisik yang penuh kasih',
      'Tidak segan menunjukkan rasa sayang di hadapan orang terdekat',
      'Peka terhadap kebutuhan sentuhan dan penegasan emosional',
      'Mampu memberikan pelukan menenangkan saat kamu merasa sedih',
    ],
    growthRecommendations: [
      'Pahami bahwa saat pasangan butuh ruang pribadi, itu bukan tanda hilangnya rasa sayang',
      'Belajarlah mengenali bahasa kasih lain yang diberikan pasangan (seperti bantuan praktis atau kata-kata)',
      'Komunikasikan kebutuhan pelukanmu secara langsung tanpa rasa bersalah',
    ],
    relationshipBlueprint:
      'Hubungan yang senantiasa diwarnai kemesraan, kelembutan tatapan, dan pelukan erat yang menjadi obat penawar kepenatan dunia.',
  },

  romantic_dreamer: {
    code: 'romantic_dreamer',
    number: 7,
    title: 'The Romantic Dreamer',
    indonesianTitle: 'Pemimpi Romantis & Idealis',
    tagline: 'Percaya bahwa cinta sejati adalah keajaiban yang layak dirayakan.',
    quote: '“Cinta bukan sekadar realitas biasa; ia adalah puisi yang kita tulis bersama setiap hari.”',
    shortDescription:
      'Kamu adalah pribadi yang percaya pada kekuatan cinta sejati, takdir indah, kejutan manis, dan momen-momen romantis yang membuat hati bergetar.',
    fullProfile:
      'The Romantic Dreamer membawa keindahan sastra ke dalam dunia nyata. Kamu menyukai detail-detail manis: surat cinta, perayaan hari penting, kencan berpendar lilin, dan momen kebersamaan yang terasa magis. Kamu melihat potensi terbaik dalam diri pasangan dan hubungan.',
    coreCharacteristics: [
      'Sangat menghargai estetika cinta dan momen-momen puitis',
      'Suka memberikan kejutan manis dan hadiah penuh makna personal',
      'Melihat pasangan dengan kacamata apresiasi dan kekaguman tinggi',
      'Setia pada cita-cita cinta yang mendalam dan bermartabat',
    ],
    emotionalNeeds: [
      'Upaya sadar dari pasangan untuk merawat romantisme',
      'Apresiasi terhadap kejutan atau kata-kata manis yang kamu siapkan',
      'Rasa dikagumi dan diperlakukan sebagai sosok istimewa',
    ],
    communicationStyle:
      'Puitis, penuh sanjungan tulus, ekspresif, dan berorientasi pada rasa syukur atas kehadiran pasangan.',
    relationshipStrengths: [
      'Membuat pasangan merasa seperti tokoh utama dalam kisah cinta yang indah',
      'Menjaga hubungan tetap berwarna, inspiratif, dan tidak pernah membosankan',
      'Memiliki ketulusan hati yang memancarkan aura positif',
    ],
    potentialChallenges: [
      'Bisa kecewa ketika realitas kehidupan sehari-hari tidak sesuai ekspektasi romansa ideal',
      'Terkadang menolak melihat kekurangan pasangan di awal hubungan (fase kacamata kuda)',
    ],
    idealPartnerCharacteristics:
      'Seseorang yang mengapresiasi romantisme, tidak mengejek ketulusanmu, dan mampu menjadi penyeimbang yang membumi tanpa memadamkan mimpimu.',
    recommendedPartnerTraits: [
      'Menghargai perayaan momen-momen spesial bersama',
      'Tulus dalam memuji dan menunjukkan apresiasi',
      'Stabil dan membumi untuk membantu mengarungi realitas praktis',
      'Memiliki pandangan positif terhadap pernikahan jangka panjang',
    ],
    growthRecommendations: [
      'Rangkul sisi praktis hubungan: mencuci piring bersama juga merupakan bentuk cinta yang nyata',
      'Sadari bahwa konflik kecil bukan berarti hubunganmu telah kehilangan sihirnya',
      'Beri ruang bagi pasangan untuk tidak selalu berada dalam kondisi romantis sempurna',
    ],
    relationshipBlueprint:
      'Sebuah kisah cinta yang dirawat dengan kekaguman abadi, perayaan hari-hari istimewa, dan tekad bersama untuk selalu jatuh cinta pada orang yang sama berulang kali.',
  },

  power_partner: {
    code: 'power_partner',
    number: 8,
    title: 'The Power Partner',
    indonesianTitle: 'Mitra Setara & Ambisius',
    tagline: 'Dua orang hebat yang bersatu menjadi tim tak terkalahkan.',
    quote: '“Bersama kita tidak saling memperlambat, melainkan saling mempercepat langkah menuju puncak.”',
    shortDescription:
      'Kamu memandang cinta sebagai aliansi strategis dan emosional yang setara. Kamu menginginkan pasangan yang sama-sama berdaya, ambisius, dan saling menopang karier serta visi besar.',
    fullProfile:
      'The Power Partner mencari kawan seperjuangan di puncak kehidupan. Kamu menghargai kompetensi, efisiensi, dan etos kerja tinggi. Hubungan bagimu adalah kemitraan yang saling memberdayakan di mana 1 + 1 bukan 2, melainkan 11.',
    coreCharacteristics: [
      'Sangat berorientasi pada tujuan, prestasi, dan pertumbuhan profesional',
      'Mendambakan kesetaraan intelektual dan kemandirian dalam hubungan',
      'Menyukai diskusi berbobot tentang karier, investasi, dan proyek masa depan',
      'Tegas, suportif tanpa pamrih, dan tidak mudah terintimidasi',
    ],
    emotionalNeeds: [
      'Rasa saling hormat terhadap kecerdasan, profesi, dan integritas pasangan',
      'Dukungan penuh saat mengejar ambisi besar',
      'Kemitraan yang seimbang tanpa ada pihak yang merasa ditinggalkan atau mengecilkan diri',
    ],
    communicationStyle:
      'Tegas, logis, terstruktur, langsung pada inti permasalahan, dan berfokus pada hasil.',
    relationshipStrengths: [
      'Mampu membangun stabilitas finansial dan aset keluarga yang sangat kuat',
      'Saling menjadi mentor dan pendorong terbesar bagi kesuksesan pasangan',
      'Sangat efektif dalam menyelesaikan masalah-masalah praktis dan krisis',
    ],
    potentialChallenges: [
      'Hubungan bisa terasa seperti ruang rapat kerja jika melupakan kelembutan emosional',
      'Kecenderungan untuk bersaing secara halus jika salah satu mencapai kesuksesan lebih cepat',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang memiliki mimpi besar, mandiri, percaya diri, menghormati kesibukanmu, dan siap bergandengan tangan menaklukkan tantangan hidup.',
    recommendedPartnerTraits: [
      'Percaya diri tinggi dan tidak terancam oleh prestasimu',
      'Memiliki etos kerja tinggi dan visi finansial yang cerdas',
      'Mampu diajak bertukar pikiran logis dan strategis',
      'Mampu mengingatkanmu untuk meluangkan waktu istirahat dan bermesraan',
    ],
    growthRecommendations: [
      'Sisihkan waktu tanpa gadget dan tanpa topik bisnis untuk sekadar menikmati keheningan berdua',
      'Latihlah kerentanan emosional: pasanganmu ingin mencintai hatimu, bukan hanya prestasimu',
      'Rayakan kemenangan kecil bersama tanpa langsung terburu-buru menuju target berikutnya',
    ],
    relationshipBlueprint:
      'Aliansi cinta yang kokoh dan berwibawa, di mana kedua insan saling mendampingi di panggung kesuksesan sembari menjadi sandaran terhangat di balik pintu rumah.',
  },

  thoughtful_mind: {
    code: 'thoughtful_mind',
    number: 9,
    title: 'The Thoughtful Mind',
    indonesianTitle: 'Pemikir Bijak & Penuh Pertimbangan',
    tagline: 'Cinta yang bijak dibangun di atas pemahaman, kesabaran, dan pertimbangan matang.',
    quote: '“Sebelum berbicara, dengarkanlah; sebelum memutuskan, pahamilah kedalaman konsekuensinya.”',
    shortDescription:
      'Kamu menyikapi cinta dengan kedewasaan berpikir, analisis yang tenang, kehati-hatian, dan komitmen yang tidak diambil secara gegabah.',
    fullProfile:
      'The Thoughtful Mind tidak mudah terbawa gelombang emosi sesaat. Kamu menimbang setiap langkah dengan bijak, menghargai fakta dan kejelasan, serta selalu berusaha adil dalam melihat sudut pandang pasangan saat terjadi konflik.',
    coreCharacteristics: [
      'Sangat analitis, tenang, dan objektif dalam menyikapi persoalan',
      'Tidak mudah membuat keputusan terburu-buru dalam komitmen',
      'Memperhatikan kebutuhan pasangan melalui tindakan solutif yang nyata',
      'Dapat dipercaya dan memegang teguh prinsip keadilan',
    ],
    emotionalNeeds: [
      'Waktu jeda untuk mencerna informasi dan perasaan sebelum merespons',
      'Kejelasan logika di balik tindakan dan keputusan bersama',
      'Rasa dihargai atas ketenangan dan kebijaksanaan yang kamu tawarkan',
    ],
    communicationStyle:
      'Sistematis, terukur, penuh pertimbangan, menghindari kata-kata menyakitkan, dan berorientasi pada fakta.',
    relationshipStrengths: [
      'Menjadi penenang badai saat hubungan menghadapi ketidakpastian',
      'Jarang sekali menyesal atas kata-kata yang diucapkan karena selalu dipikirkan matang-matang',
      'Sangat handal dalam merencanakan masa depan yang terukur dan aman',
    ],
    potentialChallenges: [
      'Bisa terkesan dingin atau lambat merespons bagi pasangan yang sangat emosional',
      'Terlalu lama menimbang hingga melewatkan momen spontanitas yang manis',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang sabar, menghargai kebutuhanmu untuk berpikir, memiliki kehangatan emosi yang melengkapi ketenanganmu, dan berkomunikasi dengan jelas.',
    recommendedPartnerTraits: [
      'Sabar dan tidak memaksakan jawaban instan saat berdiskusi',
      'Memiliki kecerdasan emosional yang hangat untuk menyeimbangkan analisismu',
      'Menghargai kejujuran intelektual dan etika',
      'Mampu mengajakmu keluar dari pikiran untuk merasakan keindahan saat ini',
    ],
    growthRecommendations: [
      'Ungkapkan bahwa kamu sedang mencerna masalah, agar pasangan tidak merasa diabaikan saat kamu hening',
      'Sadari bahwa cinta terkadang membutuhkan lompatan iman, bukan sekadar kalkulasi probabilitas',
      'Luangkan waktu untuk memanjakan emosi tanpa harus selalu mencari solusi rasional',
    ],
    relationshipBlueprint:
      'Sebuah bahtera rumah tangga yang kokoh terhindar dari karang bahaya berkat kemudi yang bijak, dibangun di atas dialog adil dan prinsip hidup yang teruji waktu.',
  },

  gentle_soul: {
    code: 'gentle_soul',
    number: 10,
    title: 'The Gentle Soul',
    indonesianTitle: 'Jiwa Lembut & Penuh Kedamaian',
    tagline: 'Menciptakan keheningan damai di tengah hiruk pikuk dunia.',
    quote: '“Kelembutan bukanlah kelemahan, melainkan kekuatan terbesar untuk meluluhkan hati yang keras.”',
    shortDescription:
      'Kamu memiliki kelembutan hati yang luar biasa, tidak menyukai konflik kasar, penuh kesabaran, dan memancarkan ketenangan yang meneduhkan bagi siapa pun di dekatmu.',
    fullProfile:
      'The Gentle Soul adalah oasis ketenangan dalam badai kehidupan. Kamu tidak suka berteriak, bersaing, atau memaksakan kehendak. Pendekatanmu pada cinta didasari oleh kelembutan sikap, penerimaan tanpa syarat, dan keinginan tulus untuk membuat pasangan merasa aman.',
    coreCharacteristics: [
      'Sangat pemaaf, sabar, dan enggan memperpanjang pertengkaran',
      'Memancarkan aura menyejukkan yang membuat pasangan merasa tenang',
      'Peka terhadap suasana hati orang lain dan berusaha tidak menyakiti',
      'Menghargai kesederhanaan hidup dan keheningan yang berkualitas',
    ],
    emotionalNeeds: [
      'Perlakuan yang lembut dan tidak intimidatif dari pasangan',
      'Lingkungan hubungan yang bebas dari nada tinggi dan teriakan',
      'Rasa aman bahwa kamu dihargai dan tidak akan diabaikan',
    ],
    communicationStyle:
      'Lembut, santun, tidak konfrontatif, penuh pertimbangan perasaan, dan menenangkan.',
    relationshipStrengths: [
      'Mampu meredakan amarah pasangan yang meledak-ledak hanya dengan kehadiran dan kelembutan',
      'Menciptakan rumah tangga yang bebas dari kekerasan verbal maupun emosional',
      'Sangat setia dan tulus dalam mencintai',
    ],
    potentialChallenges: [
      'Cenderung memendam perasaan tidak nyaman demi menghindari konflik (people pleasing)',
      'Bisa dimanfaatkan oleh pribadi yang dominan jika tidak memiliki batasan tegas',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang melindungi tanpa mendominasi, memiliki tutur kata yang santun, sabar, dan menghargai kelembutanmu sebagai permata langka.',
    recommendedPartnerTraits: [
      'Pelindung yang penuh empati dan tidak pernah bersikap kasar',
      'Mampu mendengarkan secara aktif saat kamu perlahan mengungkapkan unek-unek',
      'Menghargai kesederhanaan dan ketenangan rumah tangga',
      'Mendorongmu untuk lebih berani menyuarakan keinginan pribadi',
    ],
    growthRecommendations: [
      'Belajarlah menyatakan ketidaksetujuan secara asertif: mengatakan "tidak" adalah hakmu',
      'Ingatlah bahwa konflik konstruktif diperlukan agar masalah tidak membusuk di bawah karpet',
      'Yakini bahwa nilaimu tidak berkurang ketika kamu mempertahankan batasan dirimu',
    ],
    relationshipBlueprint:
      'Rumah tangga yang dipenuhi aroma ketenangan, saling bertutur kata dengan sopan santun, dan menjadi tempat berteduh terindah dari kebisingan dunia luar.',
  },

  playful_heart: {
    code: 'playful_heart',
    number: 11,
    title: 'The Playful Heart',
    indonesianTitle: 'Pencerah Suasana & Ceria',
    tagline: 'Hidup ini terlalu singkat untuk dijalani tanpa tawa dan canda bersama.',
    quote: '“Ketika kita bisa menertawakan hal konyol bersama, tak ada beban yang terlalu berat untuk dipikul.”',
    shortDescription:
      'Kamu membawa keceriaan, tawa, canda, dan energi ringan ke dalam hubungan. Kamu ahli mencairkan ketegangan dan membuat setiap hari terasa menyenangkan.',
    fullProfile:
      'The Playful Heart memiliki jiwa muda yang tidak pernah pudar. Bagimu, cinta tidak boleh terasa seperti beban berat atau kurikulum formal. Kamu menyukai lelucon pribadi, kejutan usil yang manis, dan kemampuan untuk melihat sisi lucu dari situasi yang sulit.',
    coreCharacteristics: [
      'Sangat ceria, humoris, dan pandai mencairkan suasana kaku',
      'Menyukai aktivitas menyenangkan dan spontanitas bersama pasangan',
      'Tidak mudah menyimpan dendam atau larut dalam kesedihan berlarut-larut',
      'Mampu mengurangi stres pasangan melalui tawa dan hiburan hangat',
    ],
    emotionalNeeds: [
      'Pasangan yang tidak terlalu kaku dan bisa diajak bercanda',
      'Ruang untuk bersikap konyol tanpa takut dinilai tidak dewasa',
      'Apresiasi terhadap usahamu membawa keceriaan di rumah',
    ],
    communicationStyle:
      'Ceria, ekspresif, penuh humor, menggunakan lelucon internal, dan santai.',
    relationshipStrengths: [
      'Rumah tangga dipenuhi tawa dan terhindar dari suasana tegang yang mencekam',
      'Anak-anak dan pasangan merasa sangat terhibur dan bahagia berada di dekatmu',
      'Mampu melalui masa-masa krisis dengan semangat optimis yang menular',
    ],
    potentialChallenges: [
      'Terkadang menggunakan lelucon untuk mengalihkan topik saat harus membicarakan masalah serius',
      'Bisa dianggap tidak serius oleh pasangan jika tidak menempatkan canda pada waktu yang tepat',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang bisa tertawa lepas bersamamu, menghargai jiwamu yang ceria, namun juga mampu dengan lembut mengajakmu duduk untuk obrolan serius saat diperlukan.',
    recommendedPartnerTraits: [
      'Memiliki selera humor yang sehat dan suka tertawa',
      'Tidak kaku, berpikiran terbuka, dan ramah',
      'Mampu membedakan kapan waktu bercanda dan kapan waktu bersikap serius',
      'Mampu menjadi jangkar yang menstabilkan saat energimu meluap-luap',
    ],
    growthRecommendations: [
      'Akui dan hadapi emosi sedih atau serius secara langsung tanpa terburu-buru membungkusnya dengan lelucon',
      'Tanyakan pada pasangan apakah mereka butuh solusi, empati mendalam, atau sekadar dihibur',
      'Tunjukkan sisi kedewasaan dan tanggung jawabmu dalam komitmen jangka panjang',
    ],
    relationshipBlueprint:
      'Keluarga yang penuh dengan kehangatan tawa, permainan bersama anak-anak, dan kebiasaan selalu mencari celah kegembiraan di setiap sudut kehidupan.',
  },

  independent_spirit: {
    code: 'independent_spirit',
    number: 12,
    title: 'The Independent Spirit',
    indonesianTitle: 'Pribadi Merdeka & Berdikari',
    tagline: 'Dua pribadi utuh yang memilih berdampingan, bukan saling melengkapi kepincangan.',
    quote: '“Aku tidak membutuhkanmu untuk melengkapi diriku; aku memilihmu untuk merayakan keutuhan kita.”',
    shortDescription:
      'Kamu sangat mandiri, memiliki kehidupan pribadi yang kokoh, dan menghargai ruang privat ("me time") baik untuk dirimu sendiri maupun pasangan.',
    fullProfile:
      'The Independent Spirit menolak ketergantungan emosional yang mencekik (kodependensi). Kamu memandang hubungan yang sehat sebagai persatuan dua individu yang sudah selesai dengan dirinya sendiri, yang bersama-sama saling memperkaya hidup tanpa kehilangan jati diri.',
    coreCharacteristics: [
      'Sangat mandiri dalam mengambil keputusan dan mengelola emosi',
      'Menghargai ruang pribadi, karier, pertemanan, dan hobi masing-masing',
      'Tidak posesif dan sangat mempercayai komitmen pasangan',
      'Mendorong pasangan untuk mandiri dan mengejar mimpi pribadinya',
    ],
    emotionalNeeds: [
      'Ruang bernapas dan waktu sendiri tanpa dicurigai atau diinterogasi',
      'Pasangan yang memiliki kehidupan dan ambisinya sendiri di luar hubungan',
      'Rasa saling percaya tanpa perlu saling memantau setiap menit',
    ],
    communicationStyle:
      'Langsung, percaya diri, lugas, menghargai privasi, dan tidak menuntut perhatian berlebihan.',
    relationshipStrengths: [
      'Hubungan bebas dari kecemburuan buta dan keposesifan yang melelahkan',
      'Pasangan memiliki kebebasan penuh untuk terus berkembang menjadi dirinya sendiri',
      'Kedua belah pihak saling menghormati batas dan integritas pribadi',
    ],
    potentialChallenges: [
      'Bisa terkesan berjarak atau tidak membutuhkan pasangan jika terlalu berdikari',
      'Terkadang kesulitan meminta bantuan saat sedang berada di titik terlemah',
    ],
    idealPartnerCharacteristics:
      'Seseorang yang percaya diri, memiliki dunia dan minatnya sendiri, tidak bergantung secara emosional (clingy), dan menghormati kemandirianmu.',
    recommendedPartnerTraits: [
      'Mandiri dan aman dengan dirinya sendiri (tidak insecure)',
      'Memiliki kesibukan positif dan gairah hidup pribadi',
      'Memahami bahwa "me time" adalah kebutuhan untuk mengisi ulang energi, bukan penolakan',
      'Tulus menawarkan bantuan tanpa membuatmu merasa terikat utang budi',
    ],
    growthRecommendations: [
      'Beranilah bersandar pada pasangan saat kamu lelah: membiarkan pasangan membantumu adalah bentuk keintiman',
      'Beri kepastian verbal bahwa kemandirianmu bukan berarti kamu tidak menyayangi pasangan',
      'Jadwalkan waktu berkualitas khusus berdua agar tidak berjalan di jalur paralel tanpa titik temu',
    ],
    relationshipBlueprint:
      'Sebuah kemitraan elegan dua insan berdaulat, yang berdiri tegak di atas kaki masing-masing sembari bergandengan tangan menatap cakrawala yang sama.',
  },

  emotional_connector: {
    code: 'emotional_connector',
    number: 13,
    title: 'The Emotional Connector',
    indonesianTitle: 'Penyelaras Rasa & Empatis',
    tagline: 'Jembatan empati yang mampu merasakan getaran hati terdalam pasangan.',
    quote: '“Mendengarkan bukan sekadar menyimak kata-kata, melainkan merasakan apa yang tidak terucap.”',
    shortDescription:
      'Kamu memiliki kecerdasan emosional dan empati luar biasa. Kamu mampu merasakan suasana hati pasangan bahkan sebelum mereka mengucapkannya.',
    fullProfile:
      'The Emotional Connector adalah ahli penyelaras rasa. Kamu mengutamakan keintiman emosional, percakapan dari hati ke hati, dan keterhubungan batin. Kamu selalu siap hadir memberikan pundak dan pelukan saat pasangan sedang kewalahan menghadapi dunia.',
    coreCharacteristics: [
      'Sangat empatik, intuitif, dan peka terhadap perasaan orang lain',
      'Mampu memvalidasi emosi pasangan tanpa terburu-buru menghakimi',
      'Menciptakan ruang aman di mana pasangan bisa menangis dan bercerita tanpa malu',
      'Berusaha menyelesaikan setiap ganjalan emosi sampai tuntas',
    ],
    emotionalNeeds: [
      'Keterbukaan emosional timbal balik (tidak ditutup-tutupi)',
      'Pengakuan atas kepekaan dan pengorbanan perasaanmu',
      'Pasangan yang bersedia diajak duduk dan berbicara saat ada ganjalan',
    ],
    communicationStyle:
      'Hangat, mendengarkan secara aktif, menggunakan kalimat-kalimat validasi, dan penuh empati.',
    relationshipStrengths: [
      'Menghilangkan sekat kesepian dalam hubungan secara total',
      'Mampu memulihkan luka batin pasangan dengan penerimaan penuh kasih',
      'Menciptakan kedekatan emosional yang sangat mendalam dan kokoh',
    ],
    potentialChallenges: [
      'Mudah menyerap stres dan emosi negatif pasangan ke dalam diri sendiri (emotional sponge)',
      'Bisa merasa frustrasi jika pasangan bersikap tertutup atau enggan bercerita',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang jujur dengan perasaannya, bersedia belajar mengekspresikan emosi, dan mampu mengingatkanmu untuk menjaga batasan energi emosionalmu.',
    recommendedPartnerTraits: [
      'Transparan mengenai apa yang sedang dirasakan dan dipikirkan',
      'Menghargai empati dan kepekaan rasa sebagai kelebihan mulia',
      'Mampu menjadi pelindung yang menjaga agar kamu tidak kelelahan emosional',
      'Berkomitmen pada keharmonisan jangka panjang',
    ],
    growthRecommendations: [
      'Tetapkan batas emosi: kamu adalah pasangan, bukan terapis bagi seluruh masalah pasanganmu',
      'Beri waktu pasangan untuk diam dan mencerna perasaannya sendiri sebelum mendesaknya bercerita',
      'Isi ulang energimu dengan aktivitas yang menenangkan batin dan fisikmu',
    ],
    relationshipBlueprint:
      'Hubungan yang sarat dengan pemahaman tanpa kata, saling merawat kesehatan mental bersama, dan menjadi pelabuhan emosional paling aman di bumi.',
  },

  future_planner: {
    code: 'future_planner',
    number: 14,
    title: 'The Future Planner',
    indonesianTitle: 'Perancang Masa Depan Terstruktur',
    tagline: 'Cinta sejati memiliki arah, peta jalan, dan rencana nyata yang terwujud.',
    quote: '“Sebuah mimpi tanpa rencana hanyalah angan-angan; mari kita bangun masa depan langkah demi langkah.”',
    shortDescription:
      'Kamu visioner, terorganisir, dan fokus pada peta jalan masa depan: tabungan pernikahan, hunian, karier, dan tujuan hidup bersama yang terstruktur rapi.',
    fullProfile:
      'Bagi The Future Planner, cinta sejati dibuktikan dengan keseriusan merancang masa depan. Kamu tidak suka hubungan yang mengambang tanpa kejelasan status atau timeline. Kamu menyukai perencanaan matang, pembagian tugas yang adil, dan kepastian langkah demi langkah.',
    coreCharacteristics: [
      'Memiliki visi jangka panjang (5–10 tahun) yang jelas dan terukur',
      'Sangat menghargai komitmen, tepat waktu, dan keteraturan',
      'Ahli dalam menyusun rencana pernikahan, anggaran keluarga, dan tabungan masa depan',
      'Dapat diandalkan sepenuhnya dalam mengeksekusi rencana penting',
    ],
    emotionalNeeds: [
      'Kejelasan komitmen dan timeline menuju jenjang pernikahan',
      'Pasangan yang sejalan dalam kedisiplinan finansial dan arah hidup',
      'Rasa tenang yang lahir dari persiapan matang dan tidak serba dadakan',
    ],
    communicationStyle:
      'Terstruktur, jelas, berorientasi tujuan, transparan mengenai angka dan jadwal, serta lugas.',
    relationshipStrengths: [
      'Menjamin masa depan keluarga yang terencana, aman, dan minim kejutan finansial buruk',
      'Pasangan merasa tenang karena memiliki nakhoda yang tahu persis arah pelayaran',
      'Sangat konsisten antara ucapan dan tindakan nyata',
    ],
    potentialChallenges: [
      'Bisa merasa cemas atau stres tinggi jika rencana tiba-tiba berubah di luar kendali',
      'Terkadang terlalu kaku dan lupa menikmati keindahan proses saat ini',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang bertanggung jawab, memiliki etos kerja baik, menghargai keteraturan, namun juga fleksibel dan mampu membantumu rileks saat rencana bergeser.',
    recommendedPartnerTraits: [
      'Jujur, transparan mengenai kondisi finansial dan visi hidup',
      'Komitmen tinggi pada janji dan timeline yang telah disepakati',
      'Fleksibel dan tenang saat menghadapi perubahan tak terduga',
      'Mampu menghargai kerja kerasmu dalam merencanakan masa depan bersama',
    ],
    growthRecommendations: [
      'Ingatlah bahwa hidup penuh dengan ketidakpastian; belajarlah berdamai dengan perubahan rencana',
      'Nikmati hari ini: kebahagiaan bukan hanya ada di garis akhir, melainkan di sepanjang perjalanan',
      'Jangan biarkan obrolan tentang anggaran menenggelamkan obrolan manis tentang perasaan',
    ],
    relationshipBlueprint:
      'Sebuah bahtera rumah tangga yang kokoh terpandu oleh kompas visi bersama, memiliki pilar finansial yang sehat, dan berhasil mewujudkan setiap impian yang pernah dicatat berdua.',
  },

  supportive_partner: {
    code: 'supportive_partner',
    number: 15,
    title: 'The Supportive Partner',
    indonesianTitle: 'Penyangga Penuh Dedikasi',
    tagline: 'Kekuatan terbesar adalah menjadi sayap pendukung bagi impian pasangan.',
    quote: '“Keberhasilanmu adalah kebahagiaanku; aku akan selalu berdiri di sudutmu untuk menyemangati.”',
    shortDescription:
      'Kamu adalah pendukung nomor satu pasangan, penuh dedikasi, bangga melihat keberhasilan orang yang dicintai, dan selalu siap sedia menopang di masa sulit.',
    fullProfile:
      'The Supportive Partner adalah suporter paling setia. Kamu tidak memiliki rasa iri terhadap kemajuan pasangan; justru kebahagiaan terbesarmu adalah melihat pasangan mekar dan mencapai potensi terbaiknya. Kamu siap menjadi pendengar setia, penyedia bantuan praktis, dan tempat bersandar.',
    coreCharacteristics: [
      'Sangat suportif, berdedikasi tinggi, dan murah hati dalam memberi bantuan',
      'Bangga merayakan pencapaian pasangan di depan keluarga dan sahabat',
      'Selalu siap membantu menyelesaikan kesulitan pasangan dengan tulus',
      'Menjadi penopang emosional paling kokoh di saat krisis melanda',
    ],
    emotionalNeeds: [
      'Apresiasi dan pengakuan tulus bahwa bantuanmu berarti bagi pasangan',
      'Dukungan balik yang setara saat giliranmu menghadapi masa sulit',
      'Kepastian bahwa kamu dicintai bukan hanya karena apa yang kamu berikan',
    ],
    communicationStyle:
      'Penuh dorongan positif, optimis, menguatkan, mendengarkan dengan sabar, dan penuh kasih.',
    relationshipStrengths: [
      'Pasangan merasa memiliki kekuatan ganda untuk menaklukkan tantangan hidup',
      'Menciptakan ikatan kesetiaan yang sangat mendalam dan saling melindungi',
      'Suasana hubungan penuh dengan saling menghargai dan aura positif',
    ],
    potentialChallenges: [
      'Bisa mengabaikan impian dan kebutuhan diri sendiri demi mendahulukan pasangan',
      'Risiko merasa lelah batin jika pasangan tidak peka untuk memberikan dukungan balik',
    ],
    idealPartnerCharacteristics:
      'Seseorang yang mengapresiasi ketulusanmu, tidak memanfaatkan kebaikanmu, dan secara aktif menanyakan serta mendukung impian pribadimu.',
    recommendedPartnerTraits: [
      'Tahu berterima kasih dan tidak menganggap pengorbananmu sebagai hal biasa',
      'Memiliki rasa tanggung jawab untuk turut mendukung balik mimpimu',
      'Peka saat energimu mulai terkuras dan memintamu untuk beristirahat',
      'Menghargai kesetaraan hak dalam rumah tangga',
    ],
    growthRecommendations: [
      'Tetap kejar mimpi dan aspirasi pribadimu: kamu juga berhak menjadi bintang di hidupmu',
      'Jangan ragu menyatakan saat kamu butuh disemangati dan dimanjakan',
      'Belajarlah sesekali menolak jika permintaan pasangan melebihi kapasitas energimu',
    ],
    relationshipBlueprint:
      'Hubungan yang sarat dengan sinergi saling mengangkat, di mana kedua insan silih berganti menjadi sayap pelindung dan pendorong impian satu sama lain.',
  },

  loyal_heart: {
    code: 'loyal_heart',
    number: 16,
    title: 'The Loyal Heart',
    indonesianTitle: 'Penjaga Kesetiaan Teguh',
    tagline: 'Kesetiaan dan integritas adalah harga mati dalam sebuah ikatan suci.',
    quote: '“Di dunia yang penuh dengan opsi sementara, kesetiaan sejati adalah keberanian paling berharga.”',
    shortDescription:
      'Kamu memegang teguh komitmen, sangat setia, dapat dipercaya 100%, dan menolak segala bentuk pengkhianatan atau ketidakterusterangan dalam hubungan.',
    fullProfile:
      'Bagi The Loyal Heart, janji adalah ikatan sakral. Kamu tidak mudah berganti arah atau tergiur oleh rumput tetangga. Ketika kamu telah memilih seseorang, kamu berkomitmen untuk berdiri di sisinya dalam keadaan sehat maupun sakit, kaya maupun miskin.',
    coreCharacteristics: [
      'Tingkat integritas, kejujuran, dan kesetiaan yang luar biasa tinggi',
      'Dapat diandalkan dalam segala situasi tanpa perlu diawasi',
      'Membela dan menjaga kehormatan pasangan di hadapan orang lain',
      'Konsisten dan memegang teguh janji yang pernah diucapkan',
    ],
    emotionalNeeds: [
      'Kesetiaan mutlak dan transparansi tanpa rahasia dari pasangan',
      'Kepastian bahwa pasangan memiliki dedikasi yang sama kuatnya',
      'Rasa aman bahwa hubungan ini dibangun untuk selamanya, bukan coba-coba',
    ],
    communicationStyle:
      'Jujur, lurus, berintegritas, tidak berbelit-belit, dan menjaga komitmen kata-kata.',
    relationshipStrengths: [
      'Memberikan rasa aman tertinggi: pasangan tidak pernah perlu takut diselingkuhi',
      'Menjadi tiang penyangga yang kokoh saat badai godaan atau krisis hidup menerpa',
      'Menciptakan reputasi keluarga yang terhormat dan berwibawa',
    ],
    potentialChallenges: [
      'Sangat sulit memaafkan atau melupakan jika sekali saja kepercayaanmu dikhianati',
      'Bisa bertahan terlalu lama dalam hubungan yang tidak sehat karena rasa loyalitas yang membabi buta',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang memiliki integritas moral tinggi, setia, transparan, dan memandang pernikahan sebagai ikatan suci seumur hidup.',
    recommendedPartnerTraits: [
      'Setia, berintegritas, dan menjauhi perilaku yang memicu kecurigaan',
      'Menghormati batasan dengan lawan jenis setelah berkomitmen',
      'Transparan dalam urusan pertemanan, ponsel, dan masa lalu',
      'Memiliki komitmen jangka panjang yang tak tergoyahkan',
    ],
    growthRecommendations: [
      'Sadari bahwa pasangan adalah manusia yang bisa melakukan kesalahan kecil yang tidak disengaja',
      'Bedakan antara khilaf komunikasi yang wajar dengan pengkhianatan nilai prinsipil',
      'Ingatlah bahwa kesetiaanmu harus diberikan kepada orang yang juga menghargai dan menyayangimu',
    ],
    relationshipBlueprint:
      'Sebuah mahligai pernikahan yang abadi dan kokoh bak karang di lautan, tak goyah oleh musim, menjadi saksi kesetiaan dua hati hingga usia senja.',
  },

  creative_soul: {
    code: 'creative_soul',
    number: 17,
    title: 'The Creative Soul',
    indonesianTitle: 'Pencinta Ekspresif & Unik',
    tagline: 'Menciptakan gaya hubungan unik yang mendobrak kebiasaan klise.',
    quote: '“Cinta kita tidak harus meniru orang lain; mari kita ciptakan ritme dan keindahan kita sendiri.”',
    shortDescription:
      'Kamu ekspresif, orisinal, menyukai hal-hal unik, dan ingin membangun gaya hubungan yang autentik serta tidak terikat pada norma konvensional yang kaku.',
    fullProfile:
      'The Creative Soul memandang hubungan sebagai karya seni yang terus hidup. Kamu menyukai ekspresi cinta yang tidak biasa: playlist musik rahasia, kencan artistik, proyek kolaborasi bersama, dan cara berkomunikasi yang penuh warna dan imajinasi.',
    coreCharacteristics: [
      'Sangat ekspresif, imajinatif, dan menyukai orisinalitas dalam hubungan',
      'Menghindari hubungan yang kaku, klise, atau sekadar ikut-ikutan tren',
      'Suka menciptakan tradisi-tradisi unik yang hanya dimengerti berdua',
      'Menghargai keunikan dan kekurangan unik yang ada pada diri pasangan',
    ],
    emotionalNeeds: [
      'Kebebasan untuk mengekspresikan diri tanpa dihakimi "aneh" atau "berlebihan"',
      'Apresiasi terhadap karya, ide, atau sentuhan kreatif yang kamu bawa ke hubungan',
      'Pasangan yang berpikiran terbuka dan tidak memaksakan standar sosial kaku',
    ],
    communicationStyle:
      'Ekspresif, artistik, penuh metafora unik, kaya emosi, dan tidak membosankan.',
    relationshipStrengths: [
      'Hubungan memiliki identitas yang sangat kuat, autentik, dan berkesan',
      'Membawa warna, inspirasi seni, dan kesegaran cara pandang ke dalam hidup pasangan',
      'Mendorong pasangan untuk mencintai sisi unik dan otentik dalam diri mereka sendiri',
    ],
    potentialChallenges: [
      'Bisa merasa bosan dengan urusan administratif atau praktis sehari-hari',
      'Terkadang suasana hati (mood) mudah berubah tergantung aliran inspirasi dan emosi',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang mengagumi kreativitasmu, berpikiran luas, mengapresiasi keunikanmu, dan dengan sabar membantumu mengurus sisi logistik praktis.',
    recommendedPartnerTraits: [
      'Berpikiran terbuka, toleran, dan tidak mudah menghakimi perbedaan',
      'Menghargai seni, musik, estetika, atau gagasan-gagasan baru',
      'Mampu menjadi jangkar yang menstabilkan saat mood kreatifmu sedang turun',
      'Bangga memiliki pasangan yang berbeda dari orang kebanyakan',
    ],
    growthRecommendations: [
      'Rangkul tanggung jawab rutin dengan sentuhan kreatifmu daripada menghindarinya',
      'Bicarakan kebutuhanmu secara jelas saat mood sedang sensitif agar pasangan tidak salah paham',
      'Hargai cara pasangan yang mungkin lebih konvensional dalam menunjukkan rasa sayangnya',
    ],
    relationshipBlueprint:
      'Kisah cinta penuh warna yang tidak meniru cetak biru siapa pun, diwarnai proyek kreatif bersama, rumah penuh seni, dan kebebasan menjadi diri sejati.',
  },

  honest_communicator: {
    code: 'honest_communicator',
    number: 18,
    title: 'The Honest Communicator',
    indonesianTitle: 'Komunikator Jujur & Terbuka',
    tagline: 'Kebenaran yang disampaikan dengan bijak adalah fondasi tertinggi kedewasaan.',
    quote: '“Kejujuran mungkin terasa pahit sesaat, namun kebohongan dan asumsi akan meracuni selamanya.”',
    shortDescription:
      'Kamu menjunjung tinggi kejujuran, transparansi, komunikasi langsung tanpa kode-kodean, dan keberanian membicarakan isu sulit demi kebaikan bersama.',
    fullProfile:
      'The Honest Communicator anti terhadap manipulasi emosi, tebak-tebakan, atau mendiamkan pasangan (silent treatment). Kamu percaya bahwa masalah apa pun bisa dipecahkan jika kedua belah pihak mau duduk bersama dan berbicara secara jujur, dewasa, dan terbuka.',
    coreCharacteristics: [
      'Selalu terus terang dan tidak suka memakai sindiran atau kode-kode samar',
      'Berani mengangkat percakapan sulit demi kesehatan hubungan jangka panjang',
      'Transparan mengenai isi pikiran, perasaan, dan ekspektasi pribadi',
      'Menghargai pasangan yang berani jujur meski kebenaran itu tidak mudah didengar',
    ],
    emotionalNeeds: [
      'Komunikasi langsung tanpa kode atau perlakuan diam (silent treatment)',
      'Transparansi penuh mengenai perasaan, keuangan, dan masa lalu',
      'Pasangan yang tidak defensif saat diajak berdiskusi tentang evaluasi hubungan',
    ],
    communicationStyle:
      'Asertif, lugas, transparan, objektif, tanpa basa-basi manipulatif, dan berorientasi pada penyelesaian.',
    relationshipStrengths: [
      'Hubungan bebas dari penumpukan racun emosional dan dendam terpendam',
      'Masalah diselesaikan dengan cepat dan tuntas tanpa berlarut-larut berhari-hari',
      'Pasangan selalu tahu dengan pasti posisi dan perasaanmu tanpa perlu menebak-nebak',
    ],
    potentialChallenges: [
      'Keterusteranganmu bisa terasa terlalu tajam jika tidak diimbangi dengan kelembutan tutur kata',
      'Terkadang tidak sabar menghadapi pasangan yang butuh waktu lebih lama untuk mengungkapkan isi hatinya',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang dewasa secara mental, tidak mudah tersinggung oleh kejujuran, mau mendengarkan kritik membangun, dan berkomunikasi secara lugas.',
    recommendedPartnerTraits: [
      'Dewasa, matang emosi, dan tidak gampang baper (defensif)',
      'Berani mengutarakan apa yang dirasakan tanpa sembunyi di balik silent treatment',
      'Mampu mengimbangi keterusteranganmu dengan kehangatan dan kelembutan',
      'Menjunjung tinggi transparansi dalam segala aspek kehidupan',
    ],
    growthRecommendations: [
      'Perhatikan intonasi dan waktu saat menyampaikan kebenaran: kejujuran tanpa empati adalah kekasaran',
      'Beri ruang bagi pasangan yang butuh waktu menenangkan diri sebelum siap berbicara',
      'Pujilah kejujuran pasangan saat mereka berani mengakui kesalahan kecil padamu',
    ],
    relationshipBlueprint:
      'Sebuah hubungan yang bersih, jernih laksana air pegunungan, di mana tidak ada rahasia kelam, tidak ada kepura-puraan, dan kedua insan selalu saling percaya sepenuhnya.',
  },

  peace_keeper: {
    code: 'peace_keeper',
    number: 19,
    title: 'The Peace Keeper',
    indonesianTitle: 'Penjaga Harmoni & Kesejukan',
    tagline: 'Harmoni adalah berkah terbesar; ketenangan hati adalah tujuan tertinggi.',
    quote: '“Menang dalam argumen tidak ada artinya jika itu meremukkan hati orang yang kita cintai.”',
    shortDescription:
      'Kamu memprioritaskan harmoni, ketenangan, kompromi sehat, dan mampu menjadi jembatan penengah yang mendinginkan suasana saat terjadi ketegangan.',
    fullProfile:
      'The Peace Keeper adalah pembawa kesejukan. Kamu memiliki bakat alami untuk melihat berbagai sisi dari satu persoalan dan mencari titik tengah yang adil bagi kedua belah pihak. Kamu menghindari drama yang tidak perlu dan berusaha agar rumah tangga selalu menjadi tempat yang damai.',
    coreCharacteristics: [
      'Sangat terampil dalam mediasi dan mencari jalan tengah (win-win solution)',
      'Tenang, tidak mudah terprovokasi, dan mampu meredam emosi yang memanas',
      'Memprioritaskan kenyamanan emosional bersama di atas ego pribadi',
      'Fleksibel, ramah, dan sangat mudah diajak bekerja sama',
    ],
    emotionalNeeds: [
      'Suasana hubungan yang damai, rukun, dan minim pertikaian kasar',
      'Pasangan yang mau berkompromi dan tidak memaksakan kehendak sepihak',
      'Apresiasi atas pengorbananmu dalam menjaga keharmonisan',
    ],
    communicationStyle:
      'Menenangkan, diplomatis, penuh kompromi, santun, dan menghindari konfrontasi agresif.',
    relationshipStrengths: [
      'Hubungan terasa sangat damai, sejuk, dan minim drama melelahkan',
      'Mampu menyelesaikan perselisihan keluarga besar dengan sangat bijak dan santun',
      'Pasangan merasa didengar dan diakomodasi kepentingannya dengan adil',
    ],
    potentialChallenges: [
      'Kecenderungan mengorbankan kebutuhan pribadi demi menjaga perdamaian semu',
      'Menunda membicarakan isu penting karena takut memicu ketegangan',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang berkepala dingin, adil, tidak egois, menghargai kompromi, dan peka menanyakan apa yang sebenarnya kamu rasakan di balik sikap tenangmu.',
    recommendedPartnerTraits: [
      'Tenang, berkepala dingin, dan tidak gemar membesar-besarkan masalah',
      'Menghargai kesetaraan dan siap berkompromi demi kebaikan bersama',
      'Secara aktif mendorongmu untuk menyuarakan apa yang kamu inginkan',
      'Memiliki rasa hormat yang tinggi terhadap privasi dan kedamaian rumah tangga',
    ],
    growthRecommendations: [
      'Ingatlah bahwa perselisihan kecil yang diselesaikan dengan jujur lebih sehat daripada perdamaian palsu',
      'Jangan biarkan dirimu selalu menjadi pihak yang mengalah: kebutuhanmu sama pentingnya',
      'Ungkapkan rasa kesal secara wajar sebelum menumpuk menjadi kepahitan batin',
    ],
    relationshipBlueprint:
      'Mahligai rumah tangga yang senantiasa dinaungi kesejukan damai, saling memaafkan sebelum matahari terbenam, dan menjadi surga ketenteraman bagi seluruh penghuninya.',
  },

  growth_partner: {
    code: 'growth_partner',
    number: 20,
    title: 'The Growth Partner',
    indonesianTitle: 'Pendorong Bertumbuh Bersama',
    tagline: 'Cinta sejati adalah katalisator untuk saling berevolusi menjadi versi terbaik.',
    quote: '“Aku mencintaimu apa adanya hari ini, dan aku mencintai seluruh potensi luar biasa yang sedang kamu tuju.”',
    shortDescription:
      'Kamu berfokus pada perkembangan diri, saling menginspirasi, membaca buku, belajar hal baru, dan menjadikan hubungan sebagai sarana evolusi emosi serta spiritual.',
    fullProfile:
      'The Growth Partner memandang hubungan sebagai ruang belajar seumur hidup. Bagimu, cinta bukanlah keadaan statis yang berhenti saat menikah, melainkan proses bertumbuh yang dinamis. Kamu senang merefleksikan diri, memperbaiki pola komunikasi, dan saling mendukung proses belajar pasangan.',
    coreCharacteristics: [
      'Sangat menyukai pembelajaran diri, psikologi hubungan, dan pengembangan karakter',
      'Terbuka terhadap masukan yang membangun dan tidak anti-kritik',
      'Mendorong pasangan untuk menggali potensi terpendam dan belajar hal baru',
      'Melihat setiap krisis hubungan sebagai peluang untuk naik kelas bersama',
    ],
    emotionalNeeds: [
      'Pasangan yang memiliki kemauan untuk belajar, berefleksi, dan bertumbuh',
      'Keterbukaan terhadap evaluasi hubungan secara berkala yang sehat',
      'Rasa saling menginspirasi dalam kebaikan dan kebijaksanaan hidup',
    ],
    communicationStyle:
      'Reflektif, menginspirasi, analitis, suportif terhadap proses belajar, dan visioner.',
    relationshipStrengths: [
      'Hubungan tidak pernah stagnan atau aus dimakan usia karena selalu ada pembaruan diri',
      'Mampu menyelesaikan masalah dengan kacamata pembelajaran dan kedewasaan',
      'Kedua pasangan saling bertransformasi menjadi versi terbaik dari diri mereka masing-masing',
    ],
    potentialChallenges: [
      'Bisa terkesan menuntut atau menggurui jika pasangan sedang butuh diterima apa adanya tanpa dorongan untuk berubah',
      'Terkadang terlalu fokus pada proses perbaikan hingga lupa merayakan pencapaian saat ini',
    ],
    idealPartnerCharacteristics:
      'Pasangan yang berpikiran terbuka (growth mindset), gemar membaca atau belajar, tidak defensif saat berdiskusi, dan bersemangat mengembangkan kualitas hidup.',
    recommendedPartnerTraits: [
      'Memiliki growth mindset dan rendah hati untuk terus belajar',
      'Mampu diajak merefleksikan hubungan secara berkala tanpa merasa diserang',
      'Suportif terhadap kelas, buku, atau seminar yang kamu ikuti',
      'Mampu mengingatkanmu untuk menerima kelemahan manusiawi dengan penuh kasih sayang',
    ],
    growthRecommendations: [
      'Peluklah pasangan apa adanya saat ini sebelum mendorongnya untuk bertumbuh lebih jauh',
      'Sadari bahwa setiap orang memiliki ritme dan kecepatan belajar yang berbeda',
      'Jangan jadikan hubungan seperti proyek pelatihan: nikmati juga kebersamaan tanpa agenda perbaikan',
    ],
    relationshipBlueprint:
      'Perjalanan dua jiwa yang saling mengasah bak pedang mustika, berevolusi bersama dalam kebijaksanaan, dan meninggalkan warisan keteladanan yang menginspirasi generasi mendatang.',
  },
};
