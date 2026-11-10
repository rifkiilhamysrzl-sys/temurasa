export interface DetectedPattern {
  id: string;
  name: string;
  tagline: string;
  description: string;
  supportingQuestionIds: string[];
  evidenceExplanation: string;
  constructiveTip: string;
}

interface QuestionScoreMap {
  [qId: string]: {
    answerA: number;
    answerB: number;
    similarity: number;
    average: number;
    diff: number;
  };
}

/**
 * Detects evidence-grounded relationship dynamic patterns across 30 questions.
 * Minimum 2 relevant questions required per pattern.
 */
export function detectRelationshipPatterns(
  scores: QuestionScoreMap,
  nameA: string,
  nameB: string
): DetectedPattern[] {
  const patterns: DetectedPattern[] = [];

  // Helper check
  const getQ = (id: string) => scores[id];

  // Pattern 1: Shared Future Builders
  // Evidenced by Q19 (5-10 yr goals), Q21 (career support), Q22 (shared life vision)
  const q19 = getQ('Q19');
  const q21 = getQ('Q21');
  const q22 = getQ('Q22');
  if (q19 && q21 && q22) {
    const avgSim = (q19.similarity + q21.similarity + q22.similarity) / 3;
    const avgLevel = (q19.average + q21.average + q22.average) / 3;
    if (avgSim >= 75 && avgLevel >= 3.8) {
      patterns.push({
        id: 'shared_future_builders',
        name: 'Shared Future Builders (Pembangun Visi Bersama)',
        tagline: 'Arah jangka panjang dan saling dukung karier yang seirama.',
        description: `Kalian berdua memiliki kompas masa depan yang sangat selaras. ${nameA} dan ${nameB} saling memberi ruang bertumbuh bagi ambisi profesional masing-masing, sekaligus memiliki kesepakatan kuat tentang cita-cita 5–10 tahun ke depan.`,
        supportingQuestionIds: ['Q19', 'Q21', 'Q22'],
        evidenceExplanation: `Didukung oleh kesamaan skor tinggi pada target finansial jangka panjang (Q19: ${q19.similarity}%), dukungan karier (Q21: ${q21.similarity}%), dan keselarasan gambaran masa depan (Q22: ${q22.similarity}%).`,
        constructiveTip:
          'Pertahankan keselarasan ini dengan melakukan sesi evaluasi peta jalan hidup (*life roadmap*) setiap pergantian tahun.',
      });
    }
  }

  // Pattern 2: Financial Planning Alignment
  // Evidenced by Q06 (personal savings), Q07 (joint big spending), Q08 (investment targets), Q09 (debt transparency), Q10 (security vs lifestyle)
  const q06 = getQ('Q06');
  const q07 = getQ('Q07');
  const q08 = getQ('Q08');
  const q09 = getQ('Q09');
  const q10 = getQ('Q10');
  if (q07 && q08 && q09 && q10) {
    const avgSim = (q07.similarity + q08.similarity + q09.similarity + q10.similarity) / 4;
    const avgLevel = (q07.average + q08.average + q09.average + q10.average) / 4;
    if (avgSim >= 75 && avgLevel >= 3.7) {
      patterns.push({
        id: 'financial_planning_alignment',
        name: 'Financial Planning Harmony (Keselarasan Tata Finansial)',
        tagline: 'Keterbukaan anggaran dan kehati-hatian finansial yang saling melengkapi.',
        description: `Kalian memandang uang bukan sebagai sumber perselisihan, melainkan sarana bersama untuk membangun rasa aman. Terdapat keterbukaan tinggi mengenai utang, komitmen musyawarah belanja besar, dan fokus perlindungan aset.`,
        supportingQuestionIds: ['Q07', 'Q08', 'Q09', 'Q10'],
        evidenceExplanation: `Skor keselarasan tinggi pada musyawarah pengeluaran besar (Q07: ${q07.similarity}%), target investasi (Q08: ${q08.similarity}%), dan transparansi utang/kewajiban (Q09: ${q09.similarity}%).`,
        constructiveTip:
          'Gunakan keharmonisan ini untuk mulai menyusun portofolio aset bersama yang terdiversifikasi.',
      });
    } else if (q07.diff >= 2 || q10.diff >= 2 || q06.diff >= 2) {
      // Pattern 2B: Different Financial Priorities
      patterns.push({
        id: 'different_financial_priorities',
        name: 'Complementary Financial Perspectives (Prioritas Finansial Berbeda)',
        tagline: 'Keseimbangan antara perlindungan dana masa depan dan kenyamanan saat ini.',
        description: `Salah satu pihak lebih mengutamakan benteng keamanan dan tabungan otonom, sementara pihak lain lebih mementingkan fleksibilitas pemanfaatan dana untuk pengalaman hidup. Ini adalah polaritas yang wajar dan dapat saling melengkapi jika memiliki batasan nominal yang disepakati.`,
        supportingQuestionIds: ['Q06', 'Q07', 'Q10'].filter((id) => scores[id] && scores[id].diff >= 1),
        evidenceExplanation: `Terdeteksi perbedaan sudut pandang pada otonomi tabungan pribadi (Q06 diff: ${scores['Q06']?.diff}) dan prioritas keamanan vs gaya hidup (Q10 diff: ${scores['Q10']?.diff}).`,
        constructiveTip:
          'Tetapkan angka batas belanja tanpa persetujuan (*threshold limit*) dan alokasikan pos hiburan tetap setiap bulan.',
      });
    }
  }

  // Pattern 3: Quality Time Seekers vs Independent Rhythm
  // Evidenced by Q13 (couple time post-kids), Q15 (togetherness in free time), Q18 (personal hobby time)
  const q13 = getQ('Q13');
  const q15 = getQ('Q15');
  const q18 = getQ('Q18');
  if (q13 && q15 && q18) {
    if (q15.similarity >= 75 && q15.average >= 4.0 && q13.average >= 4.0) {
      patterns.push({
        id: 'quality_time_seekers',
        name: 'Deep Togetherness Seekers (Pencari Kehangatan Kebersamaan)',
        tagline: 'Menemukan kebahagiaan terbesar saat menghabiskan momen berdua.',
        description: `Bagi kalian, kehadiran fisik dan aktivitas bersama adalah jangkar utama ikatan cinta. Kalian sama-sama memprioritaskan waktu kencan berdua dan merasa paling terisi energinya ketika melakukan aktivitas berdampingan.`,
        supportingQuestionIds: ['Q13', 'Q15'],
        evidenceExplanation: `Didukung oleh kesamaan preferensi menghabiskan waktu luang bersama (Q15: ${q15.similarity}%) dan komitmen menjaga waktu berdua pasca memiliki anak (Q13: ${q13.similarity}%).`,
        constructiveTip:
          'Tetap berikan toleransi lembut jika di kemudian hari salah satu pihak sesekali membutuhkan waktu tenang untuk hobi pribadi.',
      });
    } else if (q18.average >= 3.8 && (q15.diff >= 2 || q18.similarity >= 75)) {
      patterns.push({
        id: 'healthy_autonomy_partners',
        name: 'Healthy Autonomy Partners (Mitra yang Menghargai Ruang Mandiri)',
        tagline: 'Keseimbangan sehat antara ruang hobi mandiri dan kehangatan hubungan.',
        description: `Kalian memahami bahwa mencintai pasangan tidak berarti harus kehilangan jati diri pribadi. Memberi ruang me-time untuk hobi justru menjadi sumber energi segar yang dibawa pulang ke dalam kehangatan hubungan.`,
        supportingQuestionIds: ['Q15', 'Q18'],
        evidenceExplanation: `Didukung oleh nilai tinggi pada kebutuhan waktu pribadi untuk hobi (Q18: rata-rata ${q18.average}) dan kesadaran akan pembagian waktu senggang (Q15).`,
        constructiveTip:
          'Kunci sukses pola ini adalah komunikasi apresiatif: pastikan waktu sendiri tidak dipersepsikan sebagai penolakan terhadap pasangan.',
      });
    }
  }

  // Pattern 4: Communication & Conflict Timing Dynamics
  // Evidenced by Q01 (direct discussion), Q04 (quick resolution), Q29 (cooling down need)
  const q01 = getQ('Q01');
  const q04 = getQ('Q04');
  const q27 = getQ('Q27');
  const q28 = getQ('Q28');
  const q29 = getQ('Q29');
  const q30 = getQ('Q30');
  if (q01 && q04 && q29) {
    if (q04.diff >= 2 || q29.diff >= 2 || q01.diff >= 2) {
      patterns.push({
        id: 'different_conflict_timing',
        name: 'Different Processing Rhythms (Perbedaan Tempo Regulasi Emosi)',
        tagline: 'Satu pihak ingin segera menuntaskan masalah, pihak lain membutuhkan waktu pendinginan.',
        description: `Saat terjadi ketegangan, salah satu dari kalian merasa cemas jika masalah dibiarkan menggantung dan ingin lekas membereskannya, sementara pasangan membutuhkan penurunan detak jantung dan ketenangan pikiran sebelum sanggup berbicara secara jernih.`,
        supportingQuestionIds: ['Q01', 'Q04', 'Q29'].filter((id) => scores[id] && scores[id].diff >= 1),
        evidenceExplanation: `Terlihat variasi pada preferensi penyelesaian cepat (Q04 diff: ${q04.diff}) dan kebutuhan waktu sendiri untuk menenangkan diri (Q29 diff: ${q29.diff}).`,
        constructiveTip:
          'Terapkan aturan jeda terikat waktu: pihak yang butuh tenang wajib menentukan jam pasti kapan obrolan dilanjutkan hari itu.',
      });
    } else if (q27 && q28 && q30 && q27.similarity >= 75 && q28.similarity >= 75 && q30.similarity >= 75) {
      patterns.push({
        id: 'constructive_repair_team',
        name: 'Constructive Repair Team (Penyelesai Konflik yang Dewasa)',
        tagline: 'Fokus pada solusi bersama dan kerendahan hati untuk meminta maaf.',
        description: `Kalian memiliki kedewasaan emosional yang tinggi dalam berkonflik. Alih-alih saling menyalahkan atau berdebat mencari siapa yang paling benar, kalian memusatkan energi untuk berdamai, saling meminta maaf, dan menjaga martabat pasangan.`,
        supportingQuestionIds: ['Q27', 'Q28', 'Q30'],
        evidenceExplanation: `Skor keselarasan sangat tinggi pada kesediaan meminta maaf (Q27: ${scores['Q27']?.similarity}%), orientasi solusi (Q28: ${scores['Q28']?.similarity}%), dan keyakinan damai tanpa melukai (Q30: ${scores['Q30']?.similarity}%).`,
        constructiveTip:
          'Jadikan kematangan ini benteng perlindungan keluarga saat menghadapi stresor eksternal yang berat.',
      });
    }
  }

  // Pattern 5: Shared Family & Parenting Vision
  // Evidenced by Q11 (having children), Q12 (shared parenting), Q14 (healthy extended family boundaries)
  const q11 = getQ('Q11');
  const q12 = getQ('Q12');
  const q14 = getQ('Q14');
  if (q11 && q12 && q14) {
    if (q11.similarity >= 75 && q12.similarity >= 75 && q14.similarity >= 75 && q12.average >= 3.8) {
      patterns.push({
        id: 'shared_family_vision',
        name: 'Unified Family Foundation (Fondasi Keluarga yang Padu)',
        tagline: 'Kekompakan peran pengasuhan anak dan kedaulatan rumah tangga yang jelas.',
        description: `Kalian memandang rumah tangga sebagai sebuah unit otonom yang kokoh. Terdapat kesepakatan kuat untuk mengasuh anak dengan satu suara, serta batasan yang sehat dan santun terhadap intervensi keluarga besar.`,
        supportingQuestionIds: ['Q11', 'Q12', 'Q14'],
        evidenceExplanation: `Keselarasan tinggi pada keinginan momongan (Q11: ${q11.similarity}%), kesepakatan pola asuh (Q12: ${q12.similarity}%), dan batasan keluarga besar (Q14: ${q14.similarity}%).`,
        constructiveTip:
          'Rumuskan tradisi kecil keluarga inti kalian sendiri yang unik dan membedakannya dari keluarga besar masing-masing.',
      });
    } else if (q11.diff >= 2) {
      patterns.push({
        id: 'critical_children_discussion',
        name: 'Key Family Horizon Exploration (Eksplorasi Keinginan Anak)',
        tagline: 'Topik penting seputar kesiapan mental, finansial, dan keinginan memiliki momongan.',
        description: `Terdapat perbedaan tingkat kepastian atau keinginan mengenai kehadiran anak dalam pernikahan. Ini adalah topik bernilai krusial yang perlu didiskusikan secara terbuka, penuh empati, dan tanpa saling memaksakan kehendak.`,
        supportingQuestionIds: ['Q11', 'Q12'],
        evidenceExplanation: `Terdeteksi perbedaan jawaban pada keinginan memiliki anak (Q11: ${nameA}=${q11.answerA}, ${nameB}=${q11.answerB}, perbedaan skor: ${q11.diff}).`,
        constructiveTip:
          'Bahas topik ini dalam suasana santai tanpa target kesimpulan instan; dengarkan apa saja harapan dan kekhawatiran pasangan.',
      });
    }
  }

  // Pattern 6: Attentive Emotional Bond
  // Evidenced by Q23 (verbal affection), Q24 (remembering details), Q25 (support in hard times), Q26 (romance maintenance)
  const q23 = getQ('Q23');
  const q24 = getQ('Q24');
  const q25 = getQ('Q25');
  const q26 = getQ('Q26');
  if (q23 && q24 && q25 && q26) {
    if (q25.similarity >= 75 && q26.similarity >= 75 && q25.average >= 4.0) {
      patterns.push({
        id: 'attentive_emotional_sanctuary',
        name: 'Emotional Sanctuary (Tempat Bersandar Emosional yang Hangat)',
        tagline: 'Saling menjadi pelindung rasa aman dan perawat romantisme.',
        description: `Kalian berdua memandang satu sama lain sebagai tempat berlabuh utama saat dunia di luar sedang terasa bising atau berat. Ada komitmen tulus untuk tidak membiarkan rasa cinta memudar ditelan rutinitas harian.`,
        supportingQuestionIds: ['Q25', 'Q26'],
        evidenceExplanation: `Nilai tinggi pada kebutuhan dukungan emosional saat masa sulit (Q25: ${q25.similarity}%) dan tekad merawat romantisme jangka panjang (Q26: ${q26.similarity}%).`,
        constructiveTip:
          'Rayakan hari jadi atau pencapaian kecil secara konsisten sebagai tanda syukur atas perjalanan cinta kalian.',
      });
    }
  }

  // Ensure between 2 and 5 patterns returned
  return patterns.slice(0, 5);
}
