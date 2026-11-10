const { PrismaClient } = require('@prisma/client');
const { calculateCoupleCompatibility } = require('./dist-test/scoring.js');
const { ACTIVITY_LIBRARY } = require('./dist-test/activityLibrary.js');

const prisma = new PrismaClient();

async function runActivityValidation() {
  console.log('======================================================================');
  console.log('TWOgether — PERSONALIZED ACTIVITY RECOMMENDATION ENGINE TEST SUITE');
  console.log('Testing 70 Activities Library, 5 Simulated Couples, Diversity Rules');
  console.log('======================================================================\n');

  // 1. Verify Library Size & Structure
  console.log('--- TEST 1: Activity Library Verification ---');
  console.log(`[PASS] Total Activities in Library: ${ACTIVITY_LIBRARY.length} (Requirement: >= 70)`);
  if (ACTIVITY_LIBRARY.length < 70) {
    throw new Error(`Activity library has ${ACTIVITY_LIBRARY.length} activities, expected >= 70`);
  }

  const categoryCounts = {};
  const allIds = new Set();
  const allTitles = new Set();
  ACTIVITY_LIBRARY.forEach((act) => {
    categoryCounts[act.categoryCode] = (categoryCounts[act.categoryCode] || 0) + 1;
    if (allIds.has(act.activityId)) {
      throw new Error(`Duplicate activity ID found: ${act.activityId}`);
    }
    allIds.add(act.activityId);
    if (allTitles.has(act.title)) {
      throw new Error(`Duplicate activity title found: ${act.title}`);
    }
    allTitles.add(act.title);
  });

  const categories = ['communication', 'financial', 'family', 'lifestyle', 'future', 'emotional', 'conflict'];
  categories.forEach((cat) => {
    const count = categoryCounts[cat] || 0;
    console.log(`   * Category [${cat}]: ${count} distinct activities`);
    if (count < 10) {
      throw new Error(`Category ${cat} has only ${count} activities, expected >= 10`);
    }
  });
  console.log('[PASS] All 7 categories have at least 10 distinct activities (100% unique IDs & titles).\n');

  // Fetch 30 questions from database
  const questions = await prisma.question.findMany({
    orderBy: { questionOrder: 'asc' },
    include: { category: true },
  });
  if (questions.length !== 30) {
    throw new Error(`Expected 30 questions in DB, got ${questions.length}`);
  }

  // -------------------------------------------------------------------------
  // 5 SIMULATED COUPLES (TEST SPECIFICATIONS)
  // -------------------------------------------------------------------------
  const couplesToTest = [
    {
      key: 'coupleA',
      name: 'Couple A (High Communication, Future Vision, Financial Alignment)',
      nameA: 'Adit',
      nameB: 'Nadia',
      answersA: {
        Q01: 5, Q02: 5, Q03: 5, Q04: 4, Q05: 4, // High Comm
        Q06: 5, Q07: 5, Q08: 4, Q09: 5,         // High Fin
        Q10: 4, Q11: 4, Q12: 3, Q13: 4,         // Family
        Q14: 4, Q15: 3, Q16: 4, Q17: 4,         // Lifestyle
        Q18: 5, Q19: 5, Q20: 5, Q21: 5,         // High Future
        Q22: 4, Q23: 4, Q24: 4, Q25: 4, Q26: 4, // Emotional
        Q27: 4, Q28: 4, Q29: 4, Q30: 4          // Conflict
      },
      answersB: {
        Q01: 5, Q02: 5, Q03: 4, Q04: 4, Q05: 4, // High Comm
        Q06: 5, Q07: 5, Q08: 4, Q09: 5,         // High Fin
        Q10: 4, Q11: 4, Q12: 4, Q13: 4,         // Family
        Q14: 4, Q15: 4, Q16: 4, Q17: 4,         // Lifestyle
        Q18: 5, Q19: 5, Q20: 5, Q21: 5,         // High Future
        Q22: 4, Q23: 4, Q24: 4, Q25: 4, Q26: 4, // Emotional
        Q27: 4, Q28: 4, Q29: 4, Q30: 4          // Conflict
      }
    },
    {
      key: 'coupleB',
      name: 'Couple B (High Independence, Different Comm & Financial Priorities)',
      nameA: 'Bram',
      nameB: 'Clara',
      answersA: {
        Q01: 5, Q02: 5, Q03: 4, Q04: 1, Q05: 1, // Bram direct & needs instant check-in
        Q06: 5, Q07: 5, Q08: 1, Q09: 5,         // Bram strict saver
        Q10: 3, Q11: 4, Q12: 4, Q13: 4,         // Family
        Q14: 2, Q15: 5, Q16: 4, Q17: 5,         // High independence (Q15=5)
        Q18: 4, Q19: 3, Q20: 4, Q21: 4,         // Future
        Q22: 3, Q23: 4, Q24: 4, Q25: 3, Q26: 4, // Emotional
        Q27: 5, Q28: 2, Q29: 3, Q30: 3          // Conflict
      },
      answersB: {
        Q01: 2, Q02: 2, Q03: 2, Q04: 5, Q05: 5, // Clara needs space & listening
        Q06: 1, Q07: 1, Q08: 5, Q09: 1,         // Clara lifestyle spending
        Q10: 3, Q11: 4, Q12: 4, Q13: 4,         // Family
        Q14: 2, Q15: 5, Q16: 4, Q17: 5,         // High independence (Q15=5)
        Q18: 4, Q19: 3, Q20: 4, Q21: 4,         // Future
        Q22: 3, Q23: 4, Q24: 4, Q25: 3, Q26: 4, // Emotional
        Q27: 2, Q28: 4, Q29: 4, Q30: 4          // Conflict
      }
    },
    {
      key: 'coupleC',
      name: 'Couple C (High Family & Emotional Alignment, Moderate Lifestyle)',
      nameA: 'Chandra',
      nameB: 'Dewi',
      answersA: {
        Q01: 4, Q02: 3, Q03: 3, Q04: 3, Q05: 4, // Comm
        Q06: 3, Q07: 4, Q08: 3, Q09: 4,         // Fin
        Q10: 5, Q11: 5, Q12: 5, Q13: 5,         // High Family
        Q14: 4, Q15: 3, Q16: 2, Q17: 3,         // Moderate Lifestyle
        Q18: 4, Q19: 3, Q20: 4, Q21: 3,         // Future
        Q22: 5, Q23: 5, Q24: 5, Q25: 5, Q26: 5, // High Emotional
        Q27: 3, Q28: 4, Q29: 4, Q30: 3          // Conflict
      },
      answersB: {
        Q01: 3, Q02: 4, Q03: 4, Q04: 3, Q05: 4, // Comm
        Q06: 4, Q07: 4, Q08: 3, Q09: 3,         // Fin
        Q10: 5, Q11: 5, Q12: 5, Q13: 5,         // High Family
        Q14: 3, Q15: 4, Q16: 4, Q17: 4,         // Moderate Lifestyle
        Q18: 3, Q19: 4, Q20: 3, Q21: 4,         // Future
        Q22: 5, Q23: 5, Q24: 5, Q25: 5, Q26: 5, // High Emotional
        Q27: 4, Q28: 4, Q29: 4, Q30: 4          // Conflict
      }
    },
    {
      key: 'coupleD',
      name: 'Couple D (High Conflict Alignment, Different Emotional Expression)',
      nameA: 'Danu',
      nameB: 'Erika',
      answersA: {
        Q01: 4, Q02: 4, Q03: 4, Q04: 3, Q05: 4, // Comm
        Q06: 4, Q07: 4, Q08: 3, Q09: 4,         // Fin
        Q10: 4, Q11: 4, Q12: 4, Q13: 4,         // Family
        Q14: 4, Q15: 4, Q16: 3, Q17: 4,         // Lifestyle
        Q18: 4, Q19: 4, Q20: 4, Q21: 4,         // Future
        Q22: 5, Q23: 5, Q24: 1, Q25: 5, Q26: 5, // Words & Touch vs Acts of Service
        Q27: 5, Q28: 5, Q29: 5, Q30: 5          // High Conflict Management
      },
      answersB: {
        Q01: 4, Q02: 4, Q03: 4, Q04: 3, Q05: 4, // Comm
        Q06: 4, Q07: 4, Q08: 3, Q09: 4,         // Fin
        Q10: 4, Q11: 4, Q12: 4, Q13: 4,         // Family
        Q14: 4, Q15: 4, Q16: 3, Q17: 4,         // Lifestyle
        Q18: 4, Q19: 4, Q20: 4, Q21: 4,         // Future
        Q22: 2, Q23: 1, Q24: 5, Q25: 2, Q26: 2, // Practical action only
        Q27: 5, Q28: 5, Q29: 5, Q30: 5          // High Conflict Management
      }
    },
    {
      key: 'coupleE',
      name: 'Couple E (Mixed Varied Scores Across 7 Dimensions)',
      nameA: 'Eko',
      nameB: 'Fitri',
      answersA: {
        Q01: 4, Q02: 3, Q03: 5, Q04: 2, Q05: 4,
        Q06: 4, Q07: 3, Q08: 4, Q09: 3,
        Q10: 5, Q11: 4, Q12: 3, Q13: 4,
        Q14: 4, Q15: 5, Q16: 2, Q17: 4,
        Q18: 4, Q19: 3, Q20: 4, Q21: 3,
        Q22: 4, Q23: 3, Q24: 4, Q25: 4, Q26: 3,
        Q27: 4, Q28: 3, Q29: 4, Q30: 3
      },
      answersB: {
        Q01: 3, Q02: 4, Q03: 4, Q04: 3, Q05: 4,
        Q06: 3, Q07: 4, Q08: 3, Q09: 4,
        Q10: 4, Q11: 4, Q12: 4, Q13: 4,
        Q14: 3, Q15: 4, Q16: 3, Q17: 4,
        Q18: 3, Q19: 4, Q20: 3, Q21: 4,
        Q22: 3, Q23: 4, Q24: 3, Q25: 4, Q26: 4,
        Q27: 3, Q28: 4, Q29: 3, Q30: 4
      }
    }
  ];

  console.log('--- TEST 2: Validating 5 Simulated Couple Profiles ---');
  const allGeneratedActivitySets = [];

  for (const c of couplesToTest) {
    console.log(`\nTesting ${c.name}:`);
    const rawAnswers = questions.map((q) => ({
      questionId: q.id,
      questionCode: q.questionCode,
      questionText: q.questionText,
      categoryCode: q.category.categoryCode,
      categoryName: q.category.categoryName,
      answerA: c.answersA[q.questionCode] || 3,
      answerB: c.answersB[q.questionCode] || 3,
    }));

    const report = calculateCoupleCompatibility(rawAnswers, c.nameA, c.nameB);
    console.log(`[PASS] Overall Score: ${report.overallScore}%`);
    console.log(`[PASS] Top 3 Strength Categories:`, report.strongestConnections.map((s) => `${s.categoryName} (${s.score}%)`).join(', '));

    const reportActivityIds = new Set();
    const coupleActivities = [];

    // Verify each strength category has exactly 3 activities
    if (report.strongestConnections.length !== 3) {
      throw new Error(`Expected 3 strength categories, got ${report.strongestConnections.length}`);
    }

    report.strongestConnections.forEach((catConn, catIdx) => {
      console.log(`   Pilar #${catIdx + 1}: ${catConn.categoryName} (${catConn.score}%)`);
      if (!catConn.activities || catConn.activities.length !== 3) {
        throw new Error(`Category ${catConn.categoryName} did not receive exactly 3 activities! Got ${catConn.activities?.length}`);
      }

      catConn.activities.forEach((act, actIdx) => {
        // 1. Check ID uniqueness within this report
        if (reportActivityIds.has(act.activityId)) {
          throw new Error(`Duplicate activity ID within report: ${act.activityId}`);
        }
        reportActivityIds.add(act.activityId);
        coupleActivities.push(act.activityId);

        // 2. Check category membership
        if (act.categoryCode !== catConn.categoryCode) {
          throw new Error(`Activity ${act.title} has category ${act.categoryCode}, expected ${catConn.categoryCode}`);
        }

        // 3. Check property presence
        if (!act.title || !act.instructions || act.instructions.length < 2 || !act.estimatedDuration || !act.suggestedFrequency || !act.expectedBenefit) {
          throw new Error(`Activity ${act.activityId} is missing required fields!`);
        }

        // 4. Check for generic repeated text
        const fullText = `${act.title} ${act.personalizedIntro} ${act.description}`;
        if (fullText.includes('saling mengapresiasi kekompakan kalian di area')) {
          throw new Error(`Generic placeholder detected in activity: ${act.title}`);
        }

        console.log(`      * [Aktivitas 0${actIdx + 1}] "${act.title}" — Durasi: ${act.estimatedDuration} | Frekuensi: ${act.suggestedFrequency}`);
        console.log(`        Intro: "${(act.personalizedIntro || act.description).slice(0, 90)}..."`);
      });
    });

    console.log(`[PASS] Total Distinct Activities in Report: ${reportActivityIds.size} / 9 (100% unique per report)`);
    allGeneratedActivitySets.push({ name: c.key, activities: coupleActivities });
  }

  // -------------------------------------------------------------------------
  // TEST 3: Inter-Couple Diversity
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 3: Inter-Couple Diversity Verification ---');
  let pairChecks = 0;
  for (let i = 0; i < allGeneratedActivitySets.length; i++) {
    for (let j = i + 1; j < allGeneratedActivitySets.length; j++) {
      const a = allGeneratedActivitySets[i];
      const b = allGeneratedActivitySets[j];
      const overlap = a.activities.filter((id) => b.activities.includes(id));
      pairChecks++;
      console.log(`Comparison [${a.name}] vs [${b.name}]: ${overlap.length} shared activities out of 9.`);
      if (overlap.length === 9) {
        throw new Error(`Couples ${a.name} and ${b.name} received 100% identical activities! Recommendations are not personalized.`);
      }
    }
  }
  console.log(`[PASS] All ${pairChecks} couple comparisons showed meaningful differentiation based on assessment scores.`);

  console.log('\n======================================================================');
  console.log('>>> ALL PERSONALIZED ACTIVITY RECOMMENDATION TESTS PASSED 100%! <<<');
  console.log('======================================================================\n');
}

runActivityValidation()
  .catch((e) => {
    console.error('Validation Failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
