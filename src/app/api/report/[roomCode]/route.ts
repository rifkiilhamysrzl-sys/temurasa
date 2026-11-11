import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCoupleCompatibility, RawAnswer } from '@/lib/scoring';
import { getCompatibilityTitle } from '@/lib/compatibilityTitles';
import { generatePersonalizedJourney } from '@/lib/insightsEngine';
import { hashToken } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { roomCode: string } }
) {
  try {
    const roomCode = params.roomCode.toUpperCase();

    const room = await prisma.coupleRoom.findUnique({
      where: { roomCode },
      include: {
        participants: {
          select: {
            id: true,
            displayName: true,
            role: true,
            completionStatus: true,
            accessTokenHash: true,
          },
        },
        result: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Couple room tidak ditemukan.' },
        { status: 404 }
      );
    }

    const participantA = room.participants.find((p) => p.role === 'participant_a');
    const participantB = room.participants.find((p) => p.role === 'participant_b');

    const coupleNames = {
      participantA: participantA?.displayName || 'Partner A',
      participantB: participantB?.displayName || 'Partner B',
    };

    // Caller participant authentication via session/token
    const authHeader = request.headers.get('Authorization') || '';
    const rawToken =
      authHeader.replace(/^Bearer\s+/i, '').trim() ||
      request.headers.get('x-access-token')?.trim() ||
      new URL(request.url).searchParams.get('token')?.trim() ||
      '';

    let callerParticipant = null;
    if (rawToken) {
      const hashed = hashToken(rawToken);
      callerParticipant =
        room.participants.find((p) => p.accessTokenHash === hashed) || null;
    }

    // If payment is NOT paid, return locked preview only
    if (room.paymentStatus !== 'paid') {
      return NextResponse.json({
        isPaid: false,
        roomCode: room.roomCode,
        coupleNames,
        assessmentStatus: room.assessmentStatus,
        paymentStatus: room.paymentStatus,
        callerRole: callerParticipant?.role || null,
        previewDimensions: [
          { name: 'Komunikasi', icon: 'chat' },
          { name: 'Finansial', icon: 'coins' },
          { name: 'Keluarga & Anak', icon: 'family' },
          { name: 'Gaya Hidup', icon: 'lifestyle' },
          { name: 'Visi Masa Depan', icon: 'compass' },
          { name: 'Kebutuhan Emosional', icon: 'heart' },
          { name: 'Manajemen Konflik', icon: 'shield' },
        ],
        message: 'Laporan lengkap terkunci. Selesaikan pembayaran IDR 10.000 untuk membuka hasil bersama.',
      });
    }

    // Security Guard: Only authenticated Participant A or Participant B can view full report
    if (!callerParticipant) {
      return NextResponse.json({
        isPaid: true,
        isAuthorized: false,
        roomCode: room.roomCode,
        coupleNames,
        message: 'Laporan lengkap telah lunas. Akses privat ini hanya dapat dibuka melalui sesi pasangan yang terdaftar di ruangan ini.',
      });
    }

    // Payment is verified and paid: return full unlocked report
    if (!room.result) {
      return NextResponse.json(
        { error: 'Hasil kalkulasi sedang diproses. Silakan muat ulang beberapa saat lagi.' },
        { status: 202 }
      );
    }

    const result = room.result;
    let detailed = result.detailedReport ? JSON.parse(result.detailedReport) : null;

    // Always compute/refresh personalizedJourney from raw answers to ensure zero duplicate statements
    // and provide diverse, specialized advice across all 6 subsections.
    if (participantA && participantB) {
      const allQuestions = await prisma.question.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { questionOrder: 'asc' },
      });

      const answersA = await prisma.answer.findMany({ where: { participantId: participantA.id } });
      const answersB = await prisma.answer.findMany({ where: { participantId: participantB.id } });

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

      if (rawAnswers.length > 0) {
        const catScores = result.categoryScores ? JSON.parse(result.categoryScores) : [];
        const freshJourney = generatePersonalizedJourney(
          rawAnswers,
          participantA.displayName,
          participantB.displayName,
          catScores
        );

        if (!detailed) {
          detailed = calculateCoupleCompatibility(
            rawAnswers,
            participantA.displayName,
            participantB.displayName
          );
        }
        detailed.personalizedJourney = freshJourney;
        detailed.perjalananMemahami = freshJourney;

        // Persist updated report
        await prisma.result.update({
          where: { id: result.id },
          data: {
            detailedReport: JSON.stringify(detailed),
          },
        });
      }
    }

    const titleInfo = getCompatibilityTitle(result.overallScore);

    return NextResponse.json({
      isPaid: true,
      roomCode: room.roomCode,
      coupleNames,
      assessmentStatus: room.assessmentStatus,
      paymentStatus: room.paymentStatus,
      overallScore: result.overallScore,
      compatibilityTitle: titleInfo.title,
      compatibilityDescription: titleInfo.description,
      detailedReport: detailed,
      personalizedJourney: detailed?.personalizedJourney || detailed?.perjalananMemahami,
      perjalananMemahami: detailed?.personalizedJourney || detailed?.perjalananMemahami,
      categoryScores: JSON.parse(result.categoryScores),
      sharedPerspectives: JSON.parse(result.sharedPerspectives),
      differentPerspectives: JSON.parse(result.differentPerspectives),
      discussionPrompts: JSON.parse(result.discussionPrompts),
      actionPlans: JSON.parse(result.actionPlans),
      generatedAt: result.generatedAt,
    });
  } catch (error: any) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Gagal memuat laporan kecocokan.' },
      { status: 500 }
    );
  }
}
