import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';
import { calculateCoupleCompatibility, RawAnswer } from '@/lib/scoring';

/**
 * GET: Fetch participant's own answers and current progress
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return NextResponse.json(
        { error: 'Token akses tidak disediakan.' },
        { status: 401 }
      );
    }

    const accessTokenHash = hashToken(token);
    const participant = await prisma.participant.findUnique({
      where: { accessTokenHash },
      include: {
        room: true,
        answers: {
          select: {
            questionId: true,
            answerValue: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Sesi peserta tidak valid.' },
        { status: 401 }
      );
    }

    // Map answers by questionId for fast client lookup
    const answersMap: Record<string, number> = {};
    for (const a of participant.answers) {
      answersMap[a.questionId] = a.answerValue;
    }

    return NextResponse.json({
      participant: {
        id: participant.id,
        displayName: participant.displayName,
        role: participant.role,
        completionStatus: participant.completionStatus,
        currentQuestionIndex: participant.currentQuestionIndex,
        completedAt: participant.completedAt,
        roomCode: participant.room.roomCode,
        assessmentStatus: participant.room.assessmentStatus,
      },
      answers: answersMap,
      answeredCount: Object.keys(answersMap).length,
    });
  } catch (error: any) {
    console.error('Error fetching answers:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data jawaban.' },
      { status: 500 }
    );
  }
}

/**
 * POST: Save single answer and update progression
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = (body.accessToken || '').trim();
    const questionId = body.questionId;
    const answerValue = Number(body.answerValue);
    const questionIndex = typeof body.questionIndex === 'number' ? body.questionIndex : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Token akses tidak valid.' },
        { status: 401 }
      );
    }

    if (!questionId || typeof answerValue !== 'number' || answerValue < 1 || answerValue > 5) {
      return NextResponse.json(
        { error: 'Nilai jawaban harus berupa angka 1 sampai 5.' },
        { status: 400 }
      );
    }

    const accessTokenHash = hashToken(token);
    const participant = await prisma.participant.findUnique({
      where: { accessTokenHash },
      include: {
        room: {
          include: {
            participants: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Sesi peserta tidak ditemukan.' },
        { status: 401 }
      );
    }

    // Save or update answer in database
    await prisma.answer.upsert({
      where: {
        participantId_questionId: {
          participantId: participant.id,
          questionId,
        },
      },
      update: {
        answerValue,
        updatedAt: new Date(),
      },
      create: {
        roomId: participant.roomId,
        participantId: participant.id,
        questionId,
        answerValue,
      },
    });

    // Check count of answered questions for this participant
    const totalAnswered = await prisma.answer.count({
      where: { participantId: participant.id },
    });

    const isNowCompleted = totalAnswered >= 30;

    // Update participant progression
    const updatedParticipant = await prisma.participant.update({
      where: { id: participant.id },
      data: {
        currentQuestionIndex: questionIndex !== null ? questionIndex : participant.currentQuestionIndex,
        completionStatus: isNowCompleted ? 'completed' : 'in_progress',
        completedAt: isNowCompleted ? new Date() : participant.completedAt,
      },
    });

    // Check if the other partner is also completed
    const otherParticipant = participant.room.participants.find(
      (p) => p.id !== participant.id
    );

    let bothCompleted = false;

    if (isNowCompleted && otherParticipant && otherParticipant.completionStatus === 'completed') {
      bothCompleted = true;

      // Fetch all answers for both participants with questions and categories
      const allQuestions = await prisma.question.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { questionOrder: 'asc' },
      });

      const participantA = participant.role === 'participant_a' ? participant : otherParticipant;
      const participantB = participant.role === 'participant_b' ? participant : otherParticipant;

      const answersA = await prisma.answer.findMany({
        where: { participantId: participantA.id },
      });
      const answersB = await prisma.answer.findMany({
        where: { participantId: participantB.id },
      });

      const mapA = new Map(answersA.map((a) => [a.questionId, a.answerValue]));
      const mapB = new Map(answersB.map((b) => [b.questionId, b.answerValue]));

      const rawAnswers: RawAnswer[] = [];
      for (const q of allQuestions) {
        const valA = mapA.get(q.id);
        const valB = mapB.get(q.id);
        if (typeof valA === 'number' && typeof valB === 'number') {
          rawAnswers.push({
            questionId: q.id,
            questionCode: q.questionCode,
            questionText: q.questionText,
            categoryCode: q.category.categoryCode,
            categoryName: q.category.categoryName,
            answerA: valA,
            answerB: valB,
          });
        }
      }

      // Compute compatibility scores deterministically with advanced personalization engine
      const scoring = calculateCoupleCompatibility(
        rawAnswers,
        participantA.displayName,
        participantB.displayName
      );

      // Save or update result in database
      await prisma.result.upsert({
        where: { roomId: participant.roomId },
        update: {
          overallScore: scoring.overallScore,
          categoryScores: JSON.stringify(scoring.categoryScores),
          sharedPerspectives: JSON.stringify(scoring.sharedPerspectives),
          differentPerspectives: JSON.stringify(scoring.differentPerspectives),
          discussionPrompts: JSON.stringify(scoring.discussionPrompts),
          actionPlans: JSON.stringify(scoring.actionPlans),
          detailedReport: JSON.stringify(scoring),
          generatedAt: new Date(),
        },
        create: {
          roomId: participant.roomId,
          overallScore: scoring.overallScore,
          categoryScores: JSON.stringify(scoring.categoryScores),
          sharedPerspectives: JSON.stringify(scoring.sharedPerspectives),
          differentPerspectives: JSON.stringify(scoring.differentPerspectives),
          discussionPrompts: JSON.stringify(scoring.discussionPrompts),
          actionPlans: JSON.stringify(scoring.actionPlans),
          detailedReport: JSON.stringify(scoring),
        },
      });

      // Update room assessmentStatus
      await prisma.coupleRoom.update({
        where: { id: participant.roomId },
        data: {
          assessmentStatus: 'completed',
        },
      });
    }

    return NextResponse.json({
      success: true,
      answeredCount: totalAnswered,
      isCompleted: isNowCompleted,
      bothCompleted,
      roomCode: participant.room.roomCode,
    });
  } catch (error: any) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan jawaban. Silakan ulangi.' },
      { status: 500 }
    );
  }
}
