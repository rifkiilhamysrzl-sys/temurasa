import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCoupleCompatibility, RawAnswer } from '@/lib/scoring';

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

    // If payment is NOT paid, return locked preview only
    if (room.paymentStatus !== 'paid') {
      return NextResponse.json({
        isPaid: false,
        roomCode: room.roomCode,
        coupleNames,
        assessmentStatus: room.assessmentStatus,
        paymentStatus: room.paymentStatus,
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

    // Payment is verified and paid: return full unlocked report
    if (!room.result) {
      return NextResponse.json(
        { error: 'Hasil kalkulasi sedang diproses. Silakan muat ulang beberapa saat lagi.' },
        { status: 202 }
      );
    }

    const result = room.result;
    let detailed = result.detailedReport ? JSON.parse(result.detailedReport) : null;

    // If detailedReport is not yet stored, dynamically compute it from raw answers
    if (!detailed && participantA && participantB) {
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

      detailed = calculateCoupleCompatibility(
        rawAnswers,
        participantA.displayName,
        participantB.displayName
      );

      // Persist for next requests
      await prisma.result.update({
        where: { id: result.id },
        data: {
          detailedReport: JSON.stringify(detailed),
        },
      });
    }

    return NextResponse.json({
      isPaid: true,
      roomCode: room.roomCode,
      coupleNames,
      assessmentStatus: room.assessmentStatus,
      paymentStatus: room.paymentStatus,
      overallScore: result.overallScore,
      detailedReport: detailed,
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
