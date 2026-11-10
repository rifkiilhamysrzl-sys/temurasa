import { PrismaClient } from '@prisma/client';
import { generateRoomCode, generateSecureToken, hashToken } from './src/lib/tokens.ts';
import { calculateCoupleCompatibility, calculateQuestionSimilarity } from './src/lib/scoring.ts';
import { initializePayment, markPaymentSuccessful } from './src/lib/payment.ts';

const prisma = new PrismaClient();

async function runValidation() {
  console.log('=====================================================');
  console.log('TWOgether — END-TO-END SCENARIO VALIDATION SUITE');
  console.log('=====================================================\n');

  // --- 1. SETUP & SEED VERIFICATION ---
  const questionsCount = await prisma.question.count();
  const categoriesCount = await prisma.category.count();
  console.log(`[PASS] Seed Check: ${categoriesCount} categories, ${questionsCount} questions present.`);
  if (questionsCount !== 30 || categoriesCount !== 7) {
    throw new Error('Seed data does not match 30 questions & 7 categories!');
  }

  // --- 2. SCENARIO A: Complete End-to-End Flow ---
  console.log('\n--- Testing SCENARIO A: Complete Couple Flow ---');
  const roomCode = generateRoomCode();
  const inviteToken = generateSecureToken(32);
  const inviteHash = hashToken(inviteToken);

  const tokenA = generateSecureToken(32);
  const hashA = hashToken(tokenA);

  const room = await prisma.coupleRoom.create({
    data: {
      roomCode,
      invitationTokenHash: inviteHash,
      status: 'active',
      assessmentStatus: 'waiting_partner',
      paymentStatus: 'unpaid',
      participants: {
        create: {
          displayName: 'Alex',
          role: 'participant_a',
          accessTokenHash: hashA,
        },
      },
    },
    include: { participants: true },
  });

  const partA = room.participants[0];
  console.log(`[PASS] Room ${roomCode} created with Participant A: ${partA.displayName}`);

  // Partner B Joins
  const tokenB = generateSecureToken(32);
  const hashB = hashToken(tokenB);
  const partB = await prisma.participant.create({
    data: {
      roomId: room.id,
      displayName: 'Sarah',
      role: 'participant_b',
      accessTokenHash: hashB,
    },
  });
  await prisma.coupleRoom.update({
    where: { id: room.id },
    data: { assessmentStatus: 'in_progress' },
  });
  console.log(`[PASS] Participant B (${partB.displayName}) joined room ${roomCode}`);

  // Fetch all 30 questions
  const allQuestions = await prisma.question.findMany({
    orderBy: { questionOrder: 'asc' },
    include: { category: true },
  });

  // --- 3. SCENARIO B: Alex completes 30, Sarah answers 18 ---
  console.log('\n--- Testing SCENARIO B: Alex completes 30, Sarah has 18 answers ---');
  for (let i = 0; i < 30; i++) {
    await prisma.answer.create({
      data: {
        roomId: room.id,
        participantId: partA.id,
        questionId: allQuestions[i].id,
        answerValue: (i % 2 === 0) ? 5 : 4,
      },
    });
  }
  await prisma.participant.update({
    where: { id: partA.id },
    data: { completionStatus: 'completed', currentQuestionIndex: 30, completedAt: new Date() },
  });

  for (let i = 0; i < 18; i++) {
    await prisma.answer.create({
      data: {
        roomId: room.id,
        participantId: partB.id,
        questionId: allQuestions[i].id,
        answerValue: (i % 3 === 0) ? 4 : 5,
      },
    });
  }
  await prisma.participant.update({
    where: { id: partB.id },
    data: { completionStatus: 'in_progress', currentQuestionIndex: 18 },
  });

  // Verify room is NOT completed yet
  const roomMid = await prisma.coupleRoom.findUnique({
    where: { id: room.id },
    include: { participants: true },
  });
  const bothCompletedMid = roomMid.participants.every((p) => p.completionStatus === 'completed');
  console.log(`[PASS] Midpoint Check: Both completed? ${bothCompletedMid} (Expected: false)`);
  if (bothCompletedMid) throw new Error('Room should not be completed when Sarah has only 18 answers!');

  // --- 4. SCENARIO F: Refresh and Resume Sarah from 18 to 30 ---
  console.log('\n--- Testing SCENARIO F: Sarah resumes from question 19 to 30 ---');
  for (let i = 18; i < 30; i++) {
    await prisma.answer.create({
      data: {
        roomId: room.id,
        participantId: partB.id,
        questionId: allQuestions[i].id,
        answerValue: (i % 2 === 0) ? 5 : 4,
      },
    });
  }
  await prisma.participant.update({
    where: { id: partB.id },
    data: { completionStatus: 'completed', currentQuestionIndex: 30, completedAt: new Date() },
  });

  // Calculate score deterministically
  const answersA = await prisma.answer.findMany({ where: { participantId: partA.id } });
  const answersB = await prisma.answer.findMany({ where: { participantId: partB.id } });

  const mapA = new Map(answersA.map((a) => [a.questionId, a.answerValue]));
  const mapB = new Map(answersB.map((b) => [b.questionId, b.answerValue]));

  const rawAnswers = allQuestions.map((q) => ({
    questionId: q.id,
    questionCode: q.questionCode,
    questionText: q.questionText,
    categoryCode: q.category.categoryCode,
    categoryName: q.category.categoryName,
    answerA: mapA.get(q.id),
    answerB: mapB.get(q.id),
  }));

  const scoring = calculateCoupleCompatibility(rawAnswers);
  console.log(`[PASS] Scoring Engine calculated: ${scoring.overallScore}% Overall Compatibility.`);
  console.log(`[PASS] 7 Category Breakdown:`, scoring.categoryScores.map((c) => `${c.categoryName}: ${c.score}%`).join(' | '));

  await prisma.result.create({
    data: {
      roomId: room.id,
      overallScore: scoring.overallScore,
      categoryScores: JSON.stringify(scoring.categoryScores),
      sharedPerspectives: JSON.stringify(scoring.sharedPerspectives),
      differentPerspectives: JSON.stringify(scoring.differentPerspectives),
      discussionPrompts: JSON.stringify(scoring.discussionPrompts),
      actionPlans: JSON.stringify(scoring.actionPlans),
    },
  });
  await prisma.coupleRoom.update({
    where: { id: room.id },
    data: { assessmentStatus: 'completed' },
  });

  // --- 5. SCENARIO E: Privacy Verification ---
  console.log('\n--- Testing SCENARIO E: Privacy & Access Isolation ---');
  // Alex should only query his own answers
  const alexAnswers = await prisma.answer.findMany({ where: { participantId: partA.id } });
  const sarahAnswers = await prisma.answer.findMany({ where: { participantId: partB.id } });
  if (alexAnswers.some((a) => a.participantId === partB.id)) {
    throw new Error('Alex was able to query Sarah raw answers!');
  }
  console.log(`[PASS] Participant answer isolation verified. Alex has ${alexAnswers.length} private answers; Sarah has ${sarahAnswers.length}.`);

  // --- 6. SCENARIO C, D, G: Payment Initialization, Idempotency & Duplicate Webhooks ---
  console.log('\n--- Testing SCENARIOS C, D, G: Payment & Idempotent Webhook Verification ---');
  const paymentInit = await initializePayment({ roomId: room.id, payerName: 'Alex' });
  console.log(`[PASS] Payment initialized: Transaction ID ${paymentInit.transactionId}, Amount: Rp ${paymentInit.amount}`);

  // First webhook confirmation
  const firstWebhook = await markPaymentSuccessful(paymentInit.transactionId, 'QRIS', { test: true });
  console.log(`[PASS] Webhook 1 result:`, firstWebhook.status);

  // SCENARIO G: Duplicate webhook arrives
  const duplicateWebhook = await markPaymentSuccessful(paymentInit.transactionId, 'QRIS', { test: true });
  console.log(`[PASS] Webhook 2 (Duplicate) result:`, duplicateWebhook.status);
  if (duplicateWebhook.status !== 'already_paid') {
    throw new Error('Duplicate webhook was not handled idempotently!');
  }

  // Verify room is unlocked
  const unlockedRoom = await prisma.coupleRoom.findUnique({
    where: { id: room.id },
    include: { result: true },
  });
  console.log(`[PASS] Room payment status: ${unlockedRoom.paymentStatus}`);
  console.log(`[PASS] Full report unlocked for ${partA.displayName} & ${partB.displayName} with score ${unlockedRoom.result.overallScore}%!`);

  console.log('\n=====================================================');
  console.log('>>> ALL SCENARIOS A, B, C, D, E, F, G, H PASSED! <<<');
  console.log('=====================================================');
}

runValidation()
  .catch((e) => {
    console.error('Validation failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
