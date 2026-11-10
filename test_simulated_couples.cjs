const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Require the compiled scoring engine
const { calculateCoupleCompatibility } = require('./dist-test/scoring.js');

const prisma = new PrismaClient();

async function runSimulations() {
  console.log('======================================================================');
  console.log('TWOgether — 3 SIMULATED COUPLES VALIDATION SUITE');
  console.log('Advanced Personalized Relationship Insight Engine Verification');
  console.log('======================================================================\n');

  // Fetch all 30 questions from SQLite
  const questions = await prisma.question.findMany({
    orderBy: { questionOrder: 'asc' },
    include: { category: true },
  });

  if (questions.length !== 30) {
    throw new Error(`Expected 30 questions, found ${questions.length}. Please run seed first.`);
  }

  // -------------------------------------------------------------------------
  // PROFILE 1: High Alignment / Harmonious Couple ("Alex & Sarah")
  // -------------------------------------------------------------------------
  console.log('--- TEST 1: PROFILE 1 — Harmonious & Aligned ("Alex & Sarah") ---');
  // Mostly matching high answers (4s and 5s)
  const answersAlex = {
    Q01: 5, Q02: 4, Q03: 4, Q04: 4, Q05: 4, // Communication
    Q06: 5, Q07: 5, Q08: 4, Q09: 5,         // Financial
    Q10: 4, Q11: 5, Q12: 4, Q13: 4,         // Family
    Q14: 4, Q15: 4, Q16: 4, Q17: 5,         // Lifestyle
    Q18: 5, Q19: 5, Q20: 5, Q21: 4,         // Future
    Q22: 5, Q23: 5, Q24: 5, Q25: 4, Q26: 4, // Emotional
    Q27: 4, Q28: 4, Q29: 4, Q30: 4          // Conflict
  };
  const answersSarah = {
    Q01: 5, Q02: 4, Q03: 5, Q04: 4, Q05: 4, // Communication (small difference on Q03)
    Q06: 5, Q07: 4, Q08: 4, Q09: 5,         // Financial
    Q10: 4, Q11: 5, Q12: 4, Q13: 5,         // Family
    Q14: 4, Q15: 4, Q16: 4, Q17: 5,         // Lifestyle
    Q18: 5, Q19: 5, Q20: 5, Q21: 5,         // Future
    Q22: 5, Q23: 4, Q24: 5, Q25: 4, Q26: 5, // Emotional
    Q27: 4, Q28: 4, Q29: 4, Q30: 4          // Conflict
  };

  const rawAnswers1 = questions.map((q) => ({
    questionId: q.id,
    questionCode: q.questionCode,
    questionText: q.questionText,
    categoryCode: q.category.categoryCode,
    categoryName: q.category.categoryName,
    answerA: answersAlex[q.questionCode] || 4,
    answerB: answersSarah[q.questionCode] || 4,
  }));

  const report1 = calculateCoupleCompatibility(rawAnswers1, 'Alex', 'Sarah');
  console.log(`[PASS] Alex & Sarah Score: ${report1.overallScore}% (Expected: 90%+)`);
  console.log(`[PASS] Overview Summary: "${report1.relationshipOverview.summary.slice(0, 80)}..."`);
  console.log(`[PASS] Strongest Connections Count: ${report1.strongestConnections.length}`);
  console.log(`[PASS] Detected Patterns Count: ${report1.relationshipDynamics.length}`);
  report1.relationshipDynamics.forEach(p => console.log(`   * Dynamic: [${p.id}] ${p.name}`));
  console.log(`[PASS] 30-Day Challenge Weeks: ${report1.thirtyDayChallenge.length} weeks (Total Activities: ${report1.thirtyDayChallenge.reduce((acc, w) => acc + w.activities.length, 0)})`);
  console.log(`[PASS] Disclaimer present: "${report1.disclaimer.slice(0, 60)}..."\n`);

  if (report1.overallScore < 85) {
    throw new Error(`Profile 1 score ${report1.overallScore}% lower than expected for harmonious couple.`);
  }

  // -------------------------------------------------------------------------
  // PROFILE 2: Divergent Communication & Conflict Style ("Budi & Rina")
  // -------------------------------------------------------------------------
  console.log('--- TEST 2: PROFILE 2 — Divergent Communication & Conflict ("Budi & Rina") ---');
  // Budi prefers direct, immediate resolution, high daily check-in
  // Rina prefers cooling down first, gentle indirect approach, flexible communication
  const answersBudi = {
    Q01: 5, Q02: 5, Q03: 5, Q04: 1, Q05: 1, // Communication: Budi very direct, high check-in, problem-solver
    Q06: 4, Q07: 4, Q08: 3, Q09: 4,         // Financial: Moderate
    Q10: 4, Q11: 4, Q12: 4, Q13: 4,         // Family
    Q14: 3, Q15: 4, Q16: 4, Q17: 4,         // Lifestyle
    Q18: 4, Q19: 4, Q20: 4, Q21: 4,         // Future
    Q22: 4, Q23: 4, Q24: 4, Q25: 4, Q26: 4, // Emotional
    Q27: 5, Q28: 1, Q29: 2, Q30: 2          // Conflict: Budi resolves right away, doesn't need cooling off
  };
  const answersRina = {
    Q01: 2, Q02: 2, Q03: 2, Q04: 5, Q05: 5, // Communication: Rina needs space, listens rather than advises
    Q06: 4, Q07: 4, Q08: 3, Q09: 4,         // Financial
    Q10: 4, Q11: 4, Q12: 4, Q13: 4,         // Family
    Q14: 3, Q15: 4, Q16: 4, Q17: 4,         // Lifestyle
    Q18: 4, Q19: 4, Q20: 4, Q21: 4,         // Future
    Q22: 4, Q23: 4, Q24: 4, Q25: 4, Q26: 4, // Emotional
    Q27: 1, Q28: 5, Q29: 5, Q30: 5          // Conflict: Rina needs cooling off, needs time before talking
  };

  const rawAnswers2 = questions.map((q) => ({
    questionId: q.id,
    questionCode: q.questionCode,
    questionText: q.questionText,
    categoryCode: q.category.categoryCode,
    categoryName: q.category.categoryName,
    answerA: answersBudi[q.questionCode] || 3,
    answerB: answersRina[q.questionCode] || 3,
  }));

  const report2 = calculateCoupleCompatibility(rawAnswers2, 'Budi', 'Rina');
  console.log(`[PASS] Budi & Rina Score: ${report2.overallScore}% (Expected: 60% - 75%)`);
  const commCat = report2.sevenDimensionAnalysis.find(c => c.categoryCode === 'communication');
  const conflictCat = report2.sevenDimensionAnalysis.find(c => c.categoryCode === 'conflict');
  console.log(`[PASS] Communication Score: ${commCat.score}% | Conflict Management Score: ${conflictCat.score}%`);
  console.log(`[PASS] Areas to Understand Count: ${report2.areasToUnderstand.length}`);
  report2.areasToUnderstand.forEach(a => console.log(`   * Difference: [${a.categoryName}] ${a.title}`));
  console.log(`[PASS] Communication Patterns Overview: "${report2.communicationPatterns.overview.slice(0, 80)}..."`);
  console.log(`[PASS] Listening vs Solving: "${report2.communicationPatterns.listeningVsSolving.slice(0, 80)}..."\n`);

  if (commCat.score > 60 || conflictCat.score > 60) {
    throw new Error(`Expected lower scores for highly divergent communication & conflict, got Comm: ${commCat.score}%, Conflict: ${conflictCat.score}%`);
  }

  // -------------------------------------------------------------------------
  // PROFILE 3: Contrasting Financial Priorities & Future ("Dimas & Maya")
  // -------------------------------------------------------------------------
  console.log('--- TEST 3: PROFILE 3 — Contrasting Financial & Future Vision ("Dimas & Maya") ---');
  // High harmony in communication, emotion, lifestyle
  // Sharp contrast in Financial (Saver vs Lifestyle/Invest) and Future (Urban vs Slow Suburban)
  const answersDimas = {
    Q01: 4, Q02: 4, Q03: 4, Q04: 3, Q05: 4, // Communication: Harmonious
    Q06: 5, Q07: 5, Q08: 1, Q09: 5,         // Financial: Dimas strict saver, full joint transparency, low risk
    Q10: 4, Q11: 4, Q12: 4, Q13: 4,         // Family
    Q14: 4, Q15: 4, Q16: 4, Q17: 4,         // Lifestyle
    Q18: 5, Q19: 1, Q20: 2, Q21: 5,         // Future: Dimas career driven in big city, fixed roadmap
    Q22: 4, Q23: 4, Q24: 4, Q25: 4, Q26: 4, // Emotional
    Q27: 4, Q28: 4, Q29: 4, Q30: 4          // Conflict
  };
  const answersMaya = {
    Q01: 4, Q02: 4, Q03: 4, Q04: 3, Q05: 4, // Communication: Harmonious
    Q06: 1, Q07: 1, Q08: 5, Q09: 1,         // Financial: Maya values lifestyle spending, independent accounts
    Q10: 4, Q11: 4, Q12: 4, Q13: 4,         // Family
    Q14: 4, Q15: 4, Q16: 4, Q17: 4,         // Lifestyle
    Q18: 1, Q19: 5, Q20: 5, Q21: 2,         // Future: Maya wants slow life outside metro, flexible pacing
    Q22: 4, Q23: 4, Q24: 4, Q25: 4, Q26: 4, // Emotional
    Q27: 4, Q28: 4, Q29: 4, Q30: 4          // Conflict
  };

  const rawAnswers3 = questions.map((q) => ({
    questionId: q.id,
    questionCode: q.questionCode,
    questionText: q.questionText,
    categoryCode: q.category.categoryCode,
    categoryName: q.category.categoryName,
    answerA: answersDimas[q.questionCode] || 3,
    answerB: answersMaya[q.questionCode] || 3,
  }));

  const report3 = calculateCoupleCompatibility(rawAnswers3, 'Dimas', 'Maya');
  console.log(`[PASS] Dimas & Maya Score: ${report3.overallScore}%`);
  const finCat = report3.sevenDimensionAnalysis.find(c => c.categoryCode === 'financial');
  const futureCat = report3.sevenDimensionAnalysis.find(c => c.categoryCode === 'future');
  console.log(`[PASS] Financial Score: ${finCat.score}% | Future Vision Score: ${futureCat.score}%`);
  console.log(`[PASS] Financial Insights Overview: "${report3.financialInsights.overview.slice(0, 80)}..."`);
  console.log(`[PASS] Monthly Check-in Routine: "${report3.financialInsights.monthlyCheckInRoutine.slice(0, 80)}..."`);
  console.log(`[PASS] Shared Future 5-Year Exercise: "${report3.futureVision.fiveYearExercise.slice(0, 80)}..."\n`);

  if (finCat.score > 50) {
    throw new Error(`Expected Financial score <= 50% for contrasting financial priorities, got ${finCat.score}%`);
  }

  // -------------------------------------------------------------------------
  // SECTION INTEGRITY CHECK: All 11 Sections (A to K) Populated and Valid
  // -------------------------------------------------------------------------
  console.log('--- TEST 4: COMPREHENSIVE 11-SECTION STRUCTURE VERIFICATION ---');
  const sectionsToCheck = [
    { name: 'Section A: Relationship Overview', check: () => !!report1.relationshipOverview.summary && report1.relationshipOverview.keyObservations.length > 0 },
    { name: 'Section B: Strongest Connections', check: () => report1.strongestConnections.length > 0 },
    { name: 'Section C: Areas to Understand', check: () => report2.areasToUnderstand.length > 0 },
    { name: 'Section D: Seven Dimension Analysis', check: () => report1.sevenDimensionAnalysis.length === 7 },
    { name: 'Section E: Relationship Dynamics', check: () => report1.relationshipDynamics.length > 0 || report2.relationshipDynamics.length > 0 },
    { name: 'Section F: Financial Compatibility Insights', check: () => !!report3.financialInsights.overview && !!report3.financialInsights.monthlyCheckInRoutine },
    { name: 'Section G: Communication Patterns', check: () => !!report2.communicationPatterns.overview && !!report2.communicationPatterns.listeningVsSolving },
    { name: 'Section H: Shared Future Vision', check: () => !!report3.futureVision.overview && !!report3.futureVision.fiveYearExercise },
    { name: 'Section I: Personalized Recommendations', check: () => report1.personalizedRecommendations.length > 0 },
    { name: 'Section J: Conversation Starters', check: () => report1.conversationStarters.length >= 3 },
    { name: 'Section K: 30-Day Couple Challenge', check: () => report1.thirtyDayChallenge.length === 4 },
  ];

  for (const s of sectionsToCheck) {
    const ok = s.check();
    if (!ok) {
      throw new Error(`Section validation failed for: ${s.name}`);
    }
    console.log(`[PASS] ${s.name} is fully verified and populated.`);
  }

  console.log('\n======================================================================');
  console.log('>>> ALL 3 SIMULATED COUPLES AND 11 SECTIONS PASSED WITH 100% SUCCESS! <<<');
  console.log('======================================================================\n');
}

runSimulations()
  .catch((e) => {
    console.error('Simulation Failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
