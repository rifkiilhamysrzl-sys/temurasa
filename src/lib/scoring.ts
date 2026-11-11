import { QUESTION_INTERPRETATIONS } from './interpretations';
import { detectRelationshipPatterns, DetectedPattern } from './patterns';
import { generateThirtyDayChallenge, ChallengeWeek } from './challenge';
import { selectPersonalizedActivitiesForCategory, RecommendedActivity } from './activityLibrary';
import { generatePersonalizedJourney, PersonalizedRelationshipJourney } from './insightsEngine';

export interface RawAnswer {
  questionId: string;
  questionCode: string;
  questionText: string;
  categoryCode: string;
  categoryName: string;
  answerA: number;
  answerB: number;
}

export interface QuestionAnalysis {
  questionCode: string;
  questionText: string;
  categoryCode: string;
  categoryName: string;
  answerA: number;
  answerB: number;
  difference: number;
  similarity: number;
  sharedResponseLevel: number; // (answerA + answerB) / 2
  status: 'both_high' | 'both_low' | 'divergent' | 'neutral';
  interpretation: string;
  discussionPrompt: string;
  suggestedAction: string;
}

export interface DetailedCategoryReport {
  categoryCode: string;
  categoryName: string;
  score: number;
  questionCount: number;
  overviewAnalysis: string;
  strengths: string[];
  growthAreas: string[];
  actionSuggestions: string[];
  conversationStarters: string[];
  questions: QuestionAnalysis[];
}

export interface ComprehensiveReport {
  overallScore: number;
  overallInterpretation: string;
  relationshipOverview: {
    summary: string;
    keyObservations: string[];
    primaryDiscussionPriority: string;
  };
  strongestConnections: Array<{
    categoryCode: string;
    categoryName: string;
    score: number;
    title: string;
    explanation: string;
    practicalActivity: string;
    activities: RecommendedActivity[];
  }>;
  areasToUnderstand: Array<{
    categoryName: string;
    title: string;
    differenceExplanation: string;
    potentialImplications: string;
    discussionSuggestions: string;
  }>;
  sevenDimensionAnalysis: DetailedCategoryReport[];
  relationshipDynamics: DetectedPattern[];
  financialInsights: {
    overview: string;
    differencesAnalysis: string;
    sharedOpportunities: string;
    prompts: string[];
    monthlyCheckInRoutine: string;
  };
  communicationPatterns: {
    overview: string;
    directnessAnalysis: string;
    listeningVsSolving: string;
    prompts: string[];
  };
  futureVision: {
    overview: string;
    alignmentAnalysis: string;
    fiveYearExercise: string;
    prompts: string[];
  };
  personalizedRecommendations: Array<{
    category: string;
    recommendation: string;
    context: string;
    priority: 'Tinggi' | 'Sedang' | 'Rutin';
  }>;
  conversationStarters: Array<{
    category: string;
    prompt: string;
    whyItMatters: string;
  }>;
  thirtyDayChallenge: ChallengeWeek[];
  disclaimer: string;
  personalizedJourney?: PersonalizedRelationshipJourney;
  perjalananMemahami?: PersonalizedRelationshipJourney;

  // Legacy-compatible fields for backward compatibility
  categoryScores: any[];
  sharedPerspectives: any[];
  differentPerspectives: any[];
  discussionPrompts: any[];
  actionPlans: any[];
}

/**
 * Calculates similarity for a single question based on Part 12:
 * (4 - abs(A - B)) / 4 * 100
 */
export function calculateQuestionSimilarity(ansA: number, ansB: number): number {
  const diff = Math.abs(ansA - ansB);
  return Math.round(((4 - diff) / 4) * 100);
}

/**
 * Main Advanced Relationship Insight Engine
 */
export function calculateCoupleCompatibility(
  rawAnswers: RawAnswer[],
  nameA = 'Partner A',
  nameB = 'Partner B'
): ComprehensiveReport {
  const DISCLAIMER =
    'Laporan ini dirancang untuk tujuan refleksi dan edukasi relasional pasangan. Ini bukan asesmen psikologis klinis, diagnosis, atau pengganti konseling pernikahan profesional.';

  // 1. Group answers by category
  const categoriesMap: Record<string, RawAnswer[]> = {};
  for (const item of rawAnswers) {
    if (!categoriesMap[item.categoryCode]) {
      categoriesMap[item.categoryCode] = [];
    }
    categoriesMap[item.categoryCode].push(item);
  }

  const categoryOrder = [
    'communication',
    'financial',
    'family',
    'lifestyle',
    'future',
    'emotional',
    'conflict',
  ];

  const categoryReports: DetailedCategoryReport[] = [];
  const allQuestionAnalyses: QuestionAnalysis[] = [];
  const questionScoreMap: Record<string, any> = {};

  for (const catCode of categoryOrder) {
    const list = categoriesMap[catCode] || [];
    if (list.length === 0) continue;

    let catSimilaritySum = 0;
    const catQuestions: QuestionAnalysis[] = [];

    for (const ans of list) {
      const diff = Math.abs(ans.answerA - ans.answerB);
      const similarity = calculateQuestionSimilarity(ans.answerA, ans.answerB);
      const sharedResponseLevel = (ans.answerA + ans.answerB) / 2;
      catSimilaritySum += similarity;

      // Determine response pattern status
      let status: 'both_high' | 'both_low' | 'divergent' | 'neutral' = 'neutral';
      let interpretation = '';
      const lib = QUESTION_INTERPRETATIONS[ans.questionCode];

      if (ans.answerA >= 4 && ans.answerB >= 4) {
        status = 'both_high';
        interpretation = lib ? lib.bothHighInterpretation : 'Kalian berdua sama-sama memiliki preferensi tinggi pada aspek ini.';
      } else if (ans.answerA <= 2 && ans.answerB <= 2) {
        status = 'both_low';
        interpretation = lib ? lib.bothLowInterpretation : 'Kalian berdua sama-sama memiliki kesepakatan rendah atau kehati-hatian pada aspek ini.';
      } else if (diff >= 2) {
        status = 'divergent';
        const higher = ans.answerA > ans.answerB ? nameA : nameB;
        const lower = ans.answerA > ans.answerB ? nameB : nameA;
        interpretation = lib ? lib.divergentInterpretation(higher, lower) : `Terdapat perbedaan pandangan: ${higher} memiliki preferensi lebih tinggi dibandingkan ${lower}.`;
      } else {
        status = 'neutral';
        interpretation = lib ? lib.neutralInterpretation : 'Tanggapan kalian mencerminkan fleksibilitas atau penyesuaian tergantung konteks situasi.';
      }

      const qAnalysis: QuestionAnalysis = {
        questionCode: ans.questionCode,
        questionText: ans.questionText,
        categoryCode: ans.categoryCode,
        categoryName: ans.categoryName,
        answerA: ans.answerA,
        answerB: ans.answerB,
        difference: diff,
        similarity,
        sharedResponseLevel,
        status,
        interpretation,
        discussionPrompt: lib ? lib.discussionPrompt : `Bagaimana pandangan kita masing-masing mengenai: "${ans.questionText}"?`,
        suggestedAction: lib ? lib.suggestedAction : 'Luangkan waktu untuk saling mendengarkan harapan di area ini.',
      };

      catQuestions.push(qAnalysis);
      allQuestionAnalyses.push(qAnalysis);
      questionScoreMap[ans.questionCode] = {
        answerA: ans.answerA,
        answerB: ans.answerB,
        similarity,
        average: sharedResponseLevel,
        diff,
      };
    }

    const avgCatScore = Math.round(catSimilaritySum / list.length);

    // Build category-specific deep analysis
    let catOverview = '';
    const strengths: string[] = [];
    const growthAreas: string[] = [];
    const actionSuggestions: string[] = [];
    const conversationStarters: string[] = [];

    // Category synthesis
    catQuestions.forEach((q) => {
      if (q.status === 'both_high' || q.similarity === 100) {
        strengths.push(q.interpretation);
      } else if (q.status === 'divergent' || q.difference >= 2) {
        growthAreas.push(q.interpretation);
      }
      actionSuggestions.push(q.suggestedAction);
      conversationStarters.push(q.discussionPrompt);
    });

    if (avgCatScore >= 80) {
      catOverview = `Kalian menunjukkan keselarasan yang sangat tinggi (${avgCatScore}%) dalam dimensi ${list[0]?.categoryName}. Sebagian besar perspektif kalian berjalan seirama dan saling memperkuat rasa aman. Tantangan utama di area ini hanyalah menjaga konsistensi dan tidak menganggap remeh komunikasi harian.`;
    } else if (avgCatScore >= 60) {
      catOverview = `Dimensi ${list[0]?.categoryName} kalian berada pada tingkat keselarasan yang sehat (${avgCatScore}%). Kalian berbagi nilai-nilai dasar yang sejalan, dengan beberapa variasi preferensi praktis yang membutuhkan kesepakatan dan negosiasi yang santun.`;
    } else {
      catOverview = `Dimensi ${list[0]?.categoryName} (${avgCatScore}%) merupakan titik eksplorasi paling bermakna dalam hubungan kalian. Perbedaan jawaban di area ini bukan tanda ketidakcocokan, melainkan petunjuk konkret mengenai topik percakapan mendalam yang perlu segera dibuka berdua.`;
    }

    categoryReports.push({
      categoryCode: catCode,
      categoryName: list[0]?.categoryName || catCode,
      score: avgCatScore,
      questionCount: list.length,
      overviewAnalysis: catOverview,
      strengths: strengths.slice(0, 3),
      growthAreas: growthAreas.length > 0 ? growthAreas.slice(0, 3) : ['Tidak ditemukan perbedaan tajam; lanjutkan kebiasaan saling mendengar yang sudah baik.'],
      actionSuggestions: Array.from(new Set(actionSuggestions)).slice(0, 3),
      conversationStarters: Array.from(new Set(conversationStarters)).slice(0, 3),
      questions: catQuestions,
    });
  }

  // Overall Score (unweighted mean of 7 categories)
  const overallScoreSum = categoryReports.reduce((acc, cat) => acc + cat.score, 0);
  const overallScore = categoryReports.length > 0
    ? Math.round(overallScoreSum / categoryReports.length)
    : 0;

  // A. Relationship Overview (150-200 words)
  let overallInterpretation = '';
  if (overallScore >= 80) {
    overallInterpretation = `Hasil asesmen menunjukkan tingkat keselarasan preferensi yang sangat kuat antara ${nameA} dan ${nameB} (${overallScore}%). Kalian memiliki fondasi kesamaan cara pandang yang kokoh di sebagian besar dimensi kehidupan, terutama dalam merancang masa depan dan merawat koneksi emosional. Kekuatan terbesar kalian adalah kemampuan berbagi nilai inti yang seirama, sehingga banyak keputusan hidup dapat diambil tanpa perdebatan yang menguras energi.`;
  } else if (overallScore >= 65) {
    overallInterpretation = `Asesmen ini menunjukkan tingkat keselarasan preferensi yang sehat dan dinamis antara ${nameA} dan ${nameB} (${overallScore}%). Kalian memiliki banyak titik temu yang mempererat kebersamaan, berdampingan dengan beberapa perbedaan ritme kerja dan gaya komunikasi yang menarik untuk dieksplorasi. Perbedaan ini mencerminkan keunikan latar belakang masing-masing yang, jika disikapi dengan rasa ingin tahu dan empati, akan menjadi pelengkap yang saling mendewasakan.`;
  } else {
    overallInterpretation = `Hasil refleksi ini mengidentifikasi lanskap hubungan yang kaya dengan variasi perspektif antara ${nameA} dan ${nameB} (${overallScore}%). Skor keselarasan ini bukan tolok ukur kualitas cinta atau prediksi masa depan, melainkan cermin objektif dari cara pandang kalian saat ini. Kalian memiliki area-area eksplorasi yang sangat jelas di mana pembicaraan jujur, kesabaran mendengarkan, dan kesepakatan kompromi akan menjadi kunci utama membangun keharmonisan bersama.`;
  }

  const sortedCategories = [...categoryReports].sort((a, b) => b.score - a.score);
  const topCategories = sortedCategories.slice(0, 3);
  const lowestCategories = [...categoryReports].sort((a, b) => a.score - b.score).slice(0, 3);

  const keyObservations = [
    `Pilar koneksi terkuat kalian terletak pada dimensi ${topCategories.map((c) => c.categoryName).join(' dan ')}, di mana kalian memiliki intuisi dan harapan yang sangat sejalan.`,
    `Area yang paling membutuhkan penyelarasan ritme dan definisi bersama berada pada dimensi ${lowestCategories.map((c) => c.categoryName).join(' serta ')}.`,
    `Gaya kalian merespons situasi menunjukkan bahwa perbedaan bukanlah ancaman, melainkan pintu gerbang untuk saling mengenal lapis kedewasaan masing-masing secara lebih utuh.`,
  ];

  const primaryDiscussionPriority = `Prioritas obrolan terdekat untuk ${nameA} dan ${nameB} adalah menyelaraskan ekspektasi di area ${lowestCategories[0]?.categoryName || 'Komunikasi'}, dengan fokus mendengarkan tanpa terburu-buru membela diri.`;

  // B. Strongest Connections (Top 3) with Advanced Activity Recommendation Engine
  const usedActivityIds = new Set<string>();
  const strongestConnections = topCategories.map((cat) => {
    // Select exactly 3 distinct, non-duplicate, highly personalized activities
    const activities = selectPersonalizedActivitiesForCategory(
      cat.categoryCode,
      cat.score,
      cat.questions,
      nameA,
      nameB,
      usedActivityIds
    );

    const primaryActivity = activities[0];
    const practicalActivity = primaryActivity
      ? `${primaryActivity.title}: ${primaryActivity.personalizedIntro || primaryActivity.description}`
      : `Luangkan waktu berdua untuk memperkuat keselarasan dalam dimensi ${cat.categoryName}.`;

    return {
      categoryCode: cat.categoryCode,
      categoryName: cat.categoryName,
      score: cat.score,
      title: `Harmoni dalam ${cat.categoryName} (${cat.score}%)`,
      explanation: `Kalian menunjukkan pemahaman yang sangat matang di area ${cat.categoryName}. Keselarasan ini memberikan rasa aman emosional yang tinggi dan menjadi jangkar stabilitas ketika kalian menghadapi tantangan di luar rumah.`,
      practicalActivity,
      activities,
    };
  });

  // C. Areas to Understand (Top 3 Most Meaningful Differences)
  const sortedQuestionsByDiff = [...allQuestionAnalyses].sort((a, b) => b.difference - a.difference);
  const topDifferences = sortedQuestionsByDiff.filter((q) => q.difference >= 1).slice(0, 3);

  const areasToUnderstand = topDifferences.map((item) => {
    return {
      categoryName: item.categoryName,
      title: `Variasi Perspektif: "${item.questionText}"`,
      differenceExplanation: item.interpretation,
      potentialImplications: `Jika dibiarkan tanpa obrolan terbuka, perbedaan ini dapat memicu asumsi keliru—misalnya mengira pasangan tidak peduli atau terlalu menuntut, padahal ini hanyalah perbedaan kebutuhan psikologis.`,
      discussionSuggestions: item.discussionPrompt,
    };
  });

  // E. Relationship Dynamics Pattern Engine
  const relationshipDynamics = detectRelationshipPatterns(questionScoreMap, nameA, nameB);

  // F. Financial Compatibility Insights
  const finQuestions = categoryReports.find((c) => c.categoryCode === 'financial')?.questions || [];
  const finOverview = `Kecocokan finansial kalian berada pada angka ${categoryReports.find((c) => c.categoryCode === 'financial')?.score || 70}%. Pola ini menunjukkan bagaimana kalian mengombinasikan keinginan menabung, keterbukaan liabilitas, dan batasan belanja mandiri.`;
  const finDifferences = finQuestions.filter((q) => q.difference >= 2).map((q) => q.interpretation).join(' ') ||
    'Tidak ada perbedaan tajam dalam tata kelola uang dasar; kalian sama-sama menghargai musyawarah dan keterbukaan.';
  const finOpportunities = 'Kalian memiliki peluang emas untuk menyusun anggaran bulanan bersama dengan pembagian pos yang seimbang antara tabungan masa depan dan pos pengalaman hidup.';
  const finPrompts = [
    'Berapa batas nominal rupiah pengeluaran yang menurut kita wajib dikonfirmasikan berdua terlebih dahulu?',
    'Bagaimana cara kita menyeimbangkan antara menabung untuk rasa aman dan menikmati penghasilan saat ini?',
    'Apa satu target finansial atau aset yang paling ingin kita miliki bersama dalam 3 tahun ke depan?',
  ];
  const finRoutine = 'Sesi Kopi Finansial Bulanan: Luangkan 20 menit di awal bulan setiap setelah gajian untuk meninjau arus kas santai tanpa saling mengkritik pengeluaran pribadi.';

  // G. Communication Patterns
  const commOverview = `Pola komunikasi kalian mencatat keselarasan ${categoryReports.find((c) => c.categoryCode === 'communication')?.score || 75}%. Komunikasi yang sehat bukan berarti tidak pernah berselisih, melainkan memiliki keterampilan memperbaiki hubungan (*repair attempts*) dengan lekas setelah salah paham terjadi.`;
  const commDirectness = allQuestionAnalyses.find((q) => q.questionCode === 'Q01')?.interpretation || '';
  const commListening = allQuestionAnalyses.find((q) => q.questionCode === 'Q05')?.interpretation || '';
  const commPrompts = [
    'Kalimat seperti apa yang paling membuatmu merasa didengar saat kamu sedang lelah bercerita?',
    'Apa tanda halus yang bisa kamu berikan ketika kamu sedang butuh waktu untuk menenangkan pikiran?',
    'Bagaimana cara terbaik untuk menyampaikan kritik atau hal yang kurang nyaman tanpa membuatmu merasa diserang?',
  ];

  // H. Shared Future Vision
  const futureOverview = `Keselarasan visi masa depan kalian tercatat di level ${categoryReports.find((c) => c.categoryCode === 'future')?.score || 80}%. Memiliki kompas bersama adalah jaminan bahwa seiring bertambahnya usia, kalian melangkah ke arah yang sama dan saling menguatkan mimpi masing-masing.`;
  const futureAlignment = allQuestionAnalyses.find((q) => q.questionCode === 'Q22')?.interpretation || '';
  const futureExercise = 'Latihan "Surat dari Masa Depan": Masing-masing menuliskan satu paragraf tentang bagaimana gambaran kehidupan rumah tangga ideal kalian di usia pernikahan ke-5, lalu tukar dan baca bersama.';
  const futurePrompts = [
    'Jika kita merangkum kehidupan masa depan kita dalam 3 kata kunci, apa 3 kata pilihanmu?',
    'Bagaimana aku bisa menjadi pendukung terbaik bagi karier dan ambisi pribadimu tahun ini?',
    'Apakah ada impian perjalanan atau tempat tinggal yang sangat ingin kamu jelajahi bersama?',
  ];

  // I. Personalized Recommendations (At least 10)
  const personalizedRecommendations: Array<{ category: string; recommendation: string; context: string; priority: 'Tinggi' | 'Sedang' | 'Rutin' }> = [];

  // Top differences get High priority
  topDifferences.forEach((diff) => {
    personalizedRecommendations.push({
      category: diff.categoryName,
      recommendation: diff.suggestedAction,
      context: `Diturunkan dari perbedaan jawaban pada: "${diff.questionText}"`,
      priority: 'Tinggi',
    });
  });

  // Top strengths get Routine/Maintenance priority
  topCategories.forEach((cat) => {
    personalizedRecommendations.push({
      category: cat.categoryName,
      recommendation: cat.actionSuggestions[0] || 'Pertahankan kebiasaan komunikasi yang sudah berjalan baik.',
      context: `Merawat kekuatan keselarasan tinggi (${cat.score}%) di dimensi ${cat.categoryName}.`,
      priority: 'Rutin',
    });
  });

  // Additional tailored recommendations to reach >= 10
  const standardRecommendations = [
    {
      category: 'Komunikasi',
      recommendation: 'Terapkan jeda 20 menit saat suasana mulai panas, dan pastikan pihak yang meminta jeda berkomitmen melanjutkan pembicaraan setelah tenang.',
      context: 'Mencegah eskalasi kata-kata tajam yang disesali saat emosi memuncak.',
      priority: 'Tinggi' as const,
    },
    {
      category: 'Finansial',
      recommendation: 'Sepakati batas nominal belanja mandiri (Threshold Limit) yang tidak memerlukan izin pasangan.',
      context: 'Menjaga otonomi dan kebahagiaan kecil tanpa mengurangi transparansi keuangan rumah tangga.',
      priority: 'Sedang' as const,
    },
    {
      category: 'Gaya Hidup',
      recommendation: 'Alokasikan waktu "Me-Time Terjadwal" di akhir pekan agar kebutuhan bersosialisasi dan kebutuhan sendiri seimbang.',
      context: 'Menghargai kebutuhan memulihkan energi pribadi masing-masing pasangan.',
      priority: 'Sedang' as const,
    },
    {
      category: 'Keluarga & Anak',
      recommendation: 'Rumuskan batasan sehat mengenai hal-hal apa saja yang merupakan hak privasi internal rumah tangga dari keluarga besar.',
      context: 'Memperkokoh kedaulatan keluarga inti baru.',
      priority: 'Tinggi' as const,
    },
    {
      category: 'Kebutuhan Emosional',
      recommendation: 'Kirimkan minimal 1 pesan apresiasi spesifik setiap hari mengenai hal kecil yang dilakukan pasangan.',
      context: 'Menjaga tangki cinta emosional selalu terisi dalam rutinitas harian.',
      priority: 'Rutin' as const,
    },
  ];

  standardRecommendations.forEach((rec) => {
    if (personalizedRecommendations.length < 12) {
      personalizedRecommendations.push(rec);
    }
  });

  // J. Conversation Starters (At least 15 questions)
  const conversationStartersList: Array<{ category: string; prompt: string; whyItMatters: string }> = [];

  categoryReports.forEach((cat) => {
    cat.conversationStarters.forEach((prompt) => {
      if (conversationStartersList.length < 18) {
        conversationStartersList.push({
          category: cat.categoryName,
          prompt,
          whyItMatters: `Membantu memperdalam saling pengertian pada dimensi ${cat.categoryName}.`,
        });
      }
    });
  });

  // K. 30-Day Couple Challenge
  const thirtyDayChallenge = generateThirtyDayChallenge(
    lowestCategories.map((c) => c.categoryCode),
    nameA,
    nameB
  );

  // Backward compatibility structures
  const legacyShared = topCategories.map((c) => ({
    title: `Keselarasan dalam ${c.categoryName}`,
    description: c.strengths[0] || `Kalian memiliki keselarasan kuat di dimensi ${c.categoryName}.`,
    categoryName: c.categoryName,
    questionText: c.questions[0]?.questionText || '',
    score: c.score,
  }));

  const legacyDiff = topDifferences.map((d) => ({
    title: `Titik Eksplorasi: ${d.categoryName}`,
    description: d.interpretation,
    categoryName: d.categoryName,
    questionText: d.questionText,
    difference: d.difference,
    score: d.similarity,
    explorationTip: d.suggestedAction,
  }));

  const legacyPrompts = conversationStartersList.slice(0, 3).map((p) => ({
    categoryName: p.category,
    prompt: p.prompt,
    context: p.whyItMatters,
  }));

  const legacyActions = personalizedRecommendations.slice(0, 3).map((r) => ({
    categoryName: r.category,
    action: r.recommendation,
    timing: r.priority === 'Tinggi' ? 'Minggu Ini' : 'Rutin Mingguan',
  }));

  // Generate Advanced Personalized Journey (Perjalanan Memahami Satu Sama Lain)
  const personalizedJourney = generatePersonalizedJourney(
    rawAnswers,
    nameA,
    nameB,
    categoryReports.map((c) => ({
      categoryCode: c.categoryCode,
      categoryName: c.categoryName,
      score: c.score,
    }))
  );

  return {
    overallScore,
    overallInterpretation,
    personalizedJourney,
    perjalananMemahami: personalizedJourney,
    relationshipOverview: {
      summary: overallInterpretation,
      keyObservations,
      primaryDiscussionPriority,
    },
    strongestConnections,
    areasToUnderstand,
    sevenDimensionAnalysis: categoryReports,
    relationshipDynamics,
    financialInsights: {
      overview: finOverview,
      differencesAnalysis: finDifferences,
      sharedOpportunities: finOpportunities,
      prompts: finPrompts,
      monthlyCheckInRoutine: finRoutine,
    },
    communicationPatterns: {
      overview: commOverview,
      directnessAnalysis: commDirectness,
      listeningVsSolving: commListening,
      prompts: commPrompts,
    },
    futureVision: {
      overview: futureOverview,
      alignmentAnalysis: futureAlignment,
      fiveYearExercise: futureExercise,
      prompts: futurePrompts,
    },
    personalizedRecommendations,
    conversationStarters: conversationStartersList,
    thirtyDayChallenge,
    disclaimer: DISCLAIMER,

    // Legacy fields
    categoryScores: categoryReports.map((c) => ({
      categoryCode: c.categoryCode,
      categoryName: c.categoryName,
      score: c.score,
      questionCount: c.questionCount,
      summary: c.overviewAnalysis,
      questions: c.questions,
    })),
    sharedPerspectives: legacyShared,
    differentPerspectives: legacyDiff,
    discussionPrompts: legacyPrompts,
    actionPlans: legacyActions,
  };
}
