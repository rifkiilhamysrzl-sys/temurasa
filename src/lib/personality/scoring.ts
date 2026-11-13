import { ARCHETYPES } from './archetypes';
import { PERSONALITY_QUESTIONS } from './questions';
import {
  ArchetypeCode,
  DimensionCode,
  DimensionScore,
  FreePreviewData,
  FullReportData,
  MarriageReadinessReflection,
} from './types';

export interface RawAnswerInput {
  questionIndex: number; // 0 to 24 (or 1 to 25)
  selectedOptionId: string; // e.g. "1a", "2b"
}

export interface PersonalityCalculationResult {
  primaryTypeCode: ArchetypeCode;
  secondaryTypeCode: ArchetypeCode;
  dimensionScores: DimensionScore[];
  archetypePointsMap: Record<ArchetypeCode, number>;
  freePreview: FreePreviewData;
  fullReport: FullReportData;
  marriageReadiness: MarriageReadinessReflection;
}

export function calculatePersonalityResult(
  userName: string,
  answers: RawAnswerInput[]
): PersonalityCalculationResult {
  // 1. Initialize archetype points accumulator
  const archetypePoints: Record<ArchetypeCode, number> = {
    secure_lover: 0,
    best_friend: 0,
    deep_soul: 0,
    explorer: 0,
    home_builder: 0,
    affectionate_heart: 0,
    romantic_dreamer: 0,
    power_partner: 0,
    thoughtful_mind: 0,
    gentle_soul: 0,
    playful_heart: 0,
    independent_spirit: 0,
    emotional_connector: 0,
    future_planner: 0,
    supportive_partner: 0,
    loyal_heart: 0,
    creative_soul: 0,
    honest_communicator: 0,
    peace_keeper: 0,
    growth_partner: 0,
  };

  // 2. Initialize dimension raw scores
  const dimensionRawScores: Record<DimensionCode, { totalWeight: number; maxWeight: number; count: number }> = {
    emotional_needs: { totalWeight: 0, maxWeight: 0, count: 0 },
    communication_style: { totalWeight: 0, maxWeight: 0, count: 0 },
    affection_expression: { totalWeight: 0, maxWeight: 0, count: 0 },
    independence_space: { totalWeight: 0, maxWeight: 0, count: 0 },
    future_commitment: { totalWeight: 0, maxWeight: 0, count: 0 },
  };

  // Track marriage readiness responses
  let targetMarriageHorizon = 'belum ada target';
  let targetMarriageHorizonCode = 'no_target';
  let emotionalReadinessChoice = '';
  let financialReadinessChoice = '';
  let conflictReadinessChoice = '';
  let visionChoice = '';

  // 3. Process each answer
  const answerMap = new Map<number, string>();
  for (const ans of answers) {
    const qNum = ans.questionIndex <= 25 && ans.questionIndex >= 1 ? ans.questionIndex : ans.questionIndex + 1;
    answerMap.set(qNum, ans.selectedOptionId);
  }

  for (const question of PERSONALITY_QUESTIONS) {
    const selectedOptionId = answerMap.get(question.id);
    const chosenOption =
      question.options.find((o) => o.id === selectedOptionId) || question.options[0]; // fallback to first option if missing

    // Accumulate dimension score
    const dim = question.dimension;
    dimensionRawScores[dim].totalWeight += chosenOption.dimensionWeight;
    dimensionRawScores[dim].maxWeight += 5;
    dimensionRawScores[dim].count += 1;

    // Accumulate archetype points
    for (const [code, pts] of Object.entries(chosenOption.archetypePoints)) {
      if (pts && archetypePoints[code as ArchetypeCode] !== undefined) {
        archetypePoints[code as ArchetypeCode] += pts;
      }
    }

    // Specific Marriage Readiness tracking (Questions 21-25)
    if (question.id === 21) {
      targetMarriageHorizon = chosenOption.label;
      targetMarriageHorizonCode = chosenOption.marriageReadinessTag || 'no_target';
    } else if (question.id === 22) {
      emotionalReadinessChoice = chosenOption.label;
    } else if (question.id === 23) {
      financialReadinessChoice = chosenOption.label;
    } else if (question.id === 24) {
      conflictReadinessChoice = chosenOption.label;
    } else if (question.id === 25) {
      visionChoice = chosenOption.label;
    }
  }

  // 4. Calculate normalized Dimension Scores (0 - 100)
  const dimensionInfo: Record<DimensionCode, { name: string; desc: (score: number) => string }> = {
    emotional_needs: {
      name: 'Emotional Needs',
      desc: (s) =>
        s >= 80
          ? 'Memiliki kesadaran tinggi akan kebutuhan emosional dan mendambakan keintiman batin yang tulus.'
          : 'Cukup tenang dalam mengelola kebutuhan emosional dengan pendekatan yang fleksibel.',
    },
    communication_style: {
      name: 'Communication Style',
      desc: (s) =>
        s >= 80
          ? 'Menjunjung komunikasi asertif, dialog dewasa, dan penyelesaian masalah tanpa manipulasi.'
          : 'Berkomunikasi santai dan mengalir, lebih menyukai suasana percakapan yang tidak menegangkan.',
    },
    affection_expression: {
      name: 'Affection & Love Expression',
      desc: (s) =>
        s >= 80
          ? 'Sangat hangat dan ekspresif dalam menunjukkan rasa kasih sayang melalui tindakan dan kata-kata.'
          : 'Mengekspresikan cinta secara tenang dan bersahaja melalui kehadiran yang konsisten.',
    },
    independence_space: {
      name: 'Independence & Personal Space',
      desc: (s) =>
        s >= 80
          ? 'Memiliki kemandirian emosional yang matang serta menghormati ruang pribadi diri dan pasangan.'
          : 'Lebih menikmati kebersamaan intens dan saling terhubung dalam rutinitas sehari-hari.',
    },
    future_commitment: {
      name: 'Future Vision & Commitment',
      desc: (s) =>
        s >= 80
          ? 'Sangat visioner, memiliki komitmen tinggi, dan berorientasi pada masa depan pernikahan yang kokoh.'
          : 'Menjalani proses hubungan secara mengalir sembari mematangkan kesiapan langkah demi langkah.',
    },
  };

  const dimensionScores: DimensionScore[] = (
    Object.keys(dimensionRawScores) as DimensionCode[]
  ).map((dimKey) => {
    const raw = dimensionRawScores[dimKey];
    const score = Math.round((raw.totalWeight / Math.max(1, raw.maxWeight)) * 100);
    const level: DimensionScore['level'] =
      score >= 80 ? 'Sangat Kuat' : score >= 60 ? 'Seimbang' : 'Berkembang';
    return {
      code: dimKey,
      name: dimensionInfo[dimKey].name,
      score,
      level,
      description: dimensionInfo[dimKey].desc(score),
    };
  });

  // 5. Determine Primary & Secondary Archetypes deterministically
  const sortedArchetypes = (Object.keys(archetypePoints) as ArchetypeCode[]).sort((a, b) => {
    const diff = archetypePoints[b] - archetypePoints[a];
    if (diff !== 0) return diff;
    // Deterministic tie-breaker: index order defined in ARCHETYPES list
    return ARCHETYPES[a].number - ARCHETYPES[b].number;
  });

  const primaryCode = sortedArchetypes[0] || 'secure_lover';
  const secondaryCode = sortedArchetypes[1] || 'best_friend';

  const primaryType = ARCHETYPES[primaryCode];
  const secondaryType = ARCHETYPES[secondaryCode];

  // 6. Generate Marriage Readiness Reflection
  const marriageReadiness: MarriageReadinessReflection = {
    targetHorizon: targetMarriageHorizonCode,
    targetHorizonLabel: targetMarriageHorizon,
    emotionalReadinessText:
      emotionalReadinessChoice ||
      'Memahami bahwa tidak ada manusia yang sempurna dan siap menerima kekurangan pasangan untuk bertumbuh bersama.',
    financialReadinessText:
      financialReadinessChoice ||
      'Menjunjung tinggi transparansi dan kesepakatan bersama dalam mengelola keuangan rumah tangga.',
    commitmentReadinessText:
      conflictReadinessChoice ||
      'Memegang teguh komitmen janji pernikahan dan bersedia merendahkan ego demi keutuhan bersama.',
    conflictReadinessText:
      conflictReadinessChoice ||
      'Siap meredakan ego dan mencari solusi damai saat terjadi perselisihan.',
    visionText:
      visionChoice ||
      'Mendambakan rumah tangga yang tenang, penuh kehangatan, dan menjadi tempat berteduh ternyaman.',
    summaryReflection: `Berdasarkan refleksi pribadimu dengan target pernikahan "${targetMarriageHorizon}", kamu menunjukkan kedewasaan berpikir yang sehat. Kamu memandang pernikahan bukan sekadar status sosial, melainkan ruang suci untuk saling menyempurnakan, merawat komitmen, dan membangun rumah tangga yang membahagiakan kedua belah pihak.`,
  };

  // 7. Generate Free Preview Data
  const personalInsight = `Sebagai seorang ${primaryType.title} dengan sentuhan ${secondaryType.title}, kekuatan terbesarmu dalam cinta adalah kemampuanmu menciptakan rasa aman bagi pasangan sembari tetap menjadi pribadi yang autentik. Pasangan yang tepat akan sangat bersyukur memilikimu karena kamu mencintai dengan kesungguhan hati.`;

  const freePreview: FreePreviewData = {
    primaryType,
    secondaryType,
    shortDescription: primaryType.shortDescription,
    relationshipCharacteristics: primaryType.coreCharacteristics.slice(0, 3),
    personalInsight,
    marriageHorizonLabel: targetMarriageHorizon,
  };

  // 8. Generate Comprehensive 10-Section Full Report
  const fullReport: FullReportData = {
    // 1. Relationship Personality Profile
    personalityProfile: {
      title: `${primaryType.title} × ${secondaryType.title}`,
      primaryAnalysis: primaryType.fullProfile,
      secondaryAnalysis: `Karakter sekundermu sebagai ${secondaryType.title} memberikan sentuhan dinamis: ${secondaryType.shortDescription}`,
      synergyAnalysis: `Perpaduan ini menjadikanmu sosok pasangan yang unik. Di satu sisi kamu memiliki keteguhan ${primaryType.indonesianTitle}, dan di sisi lain kamu diperkaya oleh kehangatan ${secondaryType.indonesianTitle}. Pasanganmu akan merasakan perpaduan antara kestabilan dan kedalaman yang jarang ditemukan.`,
    },

    // 2. Ideal Partner Characteristics
    idealPartnerCharacteristics: {
      summary: primaryType.idealPartnerCharacteristics,
      temperament: `Pribadi yang tenang, tidak reaktif terhadap emosi sesaat, dan mampu mengimbangi ${primaryType.indonesianTitle} dengan kelembutan komunikasi.`,
      chemistryType: `Koneksi yang seimbang antara persahabatan akrab, rasa saling kagum secara intelektual, dan kenyamanan batin saat menghabiskan waktu bersama.`,
    },

    // 3. Recommended Partner Traits
    recommendedPartnerTraits: {
      title: `4 Karakter Calon Pasangan yang Paling Selaras denganmu:`,
      traits: primaryType.recommendedPartnerTraits.map((trait, idx) => ({
        trait,
        why: `Sangat penting untuk melengkapi energimu dan mencegah timbulnya gesekan emosi yang tidak perlu dalam keseharian.`,
      })),
    },

    // 4. Emotional Needs
    emotionalNeeds: {
      summary: `Agar kamu dapat merasa bahagia dan mekar seutuhnya dalam hubungan, kebutuhan-kebutuhan emosional berikut perlu dipenuhi secara konsisten:`,
      primaryNeeds: primaryType.emotionalNeeds,
      whatMakesYouFeelSafe: `Kamu merasa paling aman ketika ada kepastian niat, kata-kata yang selaras dengan tindakan, dan tidak ada ancaman penolakan saat kamu menunjukkan sisi rapuhmu.`,
    },

    // 5. Communication Compatibility
    communicationCompatibility: {
      yourStyle: primaryType.communicationStyle,
      bestComplementaryStyle: `Pasangan dengan gaya komunikasi asertif, santun, tidak defensif, dan bersedia mendengarkan sampai tuntas sebelum merespons.`,
      handlingConflictTogether: `Ketika terjadi silang pendapat, metode terbaik bagi kalian berdua adalah mengambil jeda pendinginan selama 15–30 menit, kemudian kembali duduk bersama untuk membicarakan solusi tanpa saling menyalahkan.`,
    },

    // 6. Relationship Strengths
    relationshipStrengths: {
      summary: `Kelebihan utama yang kamu bawa ke dalam hubungan dan membuat pasangan merasa beruntung memilikimu:`,
      strengths: primaryType.relationshipStrengths,
    },

    // 7. Potential Relationship Challenges
    potentialChallenges: {
      summary: `Setiap kepribadian cinta memiliki blind spot emosional. Mengenalinya sejak dini membantumu mencegah kesalahpahaman:`,
      blindSpots: primaryType.potentialChallenges.map((challenge, idx) => ({
        issue: challenge,
        remedy: primaryType.growthRecommendations[idx] || `Latihlah komunikasi terbuka dan sampaikan apa yang kamu rasakan secara jujur sejak awal.`,
      })),
    },

    // 8. Marriage Readiness Reflection
    marriageReadiness,

    // 9. Personal Growth Recommendations
    personalGrowthRecommendations: {
      summary: `Langkah nyata yang dapat kamu latih mulai hari ini untuk mempersiapkan diri menjadi pasangan hidup idaman:`,
      actionableSteps: primaryType.growthRecommendations,
    },

    // 10. Ideal Relationship Blueprint
    idealRelationshipBlueprint: {
      vision: primaryType.relationshipBlueprint,
      corePillars: [
        'Kejujuran tanpa sekat dan transparansi niat hidup',
        'Saling menghormati batas pribadi sembari merawat kebersamaan intim',
        'Komitmen untuk saling memaafkan dan bertumbuh seumur hidup',
      ],
      dailyRitual:
        'Luangkan waktu 10 menit setiap malam sebelum tidur untuk saling menatap, menanyakan "Bagaimana perasaanmu hari ini?", dan mengucap terima kasih atas kehadiran satu sama lain.',
    },
  };

  return {
    primaryTypeCode: primaryCode,
    secondaryTypeCode: secondaryCode,
    dimensionScores,
    archetypePointsMap: archetypePoints,
    freePreview,
    fullReport,
    marriageReadiness,
  };
}
