import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret') || request.headers.get('x-admin-secret');
    const configuredSecret = process.env.ADMIN_SECRET || 'twogether_admin_secret_key';

    if (secret !== configuredSecret) {
      return NextResponse.json({ error: 'Akses admin tidak diizinkan.' }, { status: 401 });
    }

    const [totalRooms, totalParticipants, completedParticipants, paidPayments, recentRooms, recentPayments, questions] =
      await Promise.all([
        prisma.coupleRoom.count(),
        prisma.participant.count(),
        prisma.participant.count({ where: { completionStatus: 'completed' } }),
        prisma.payment.findMany({ where: { paymentStatus: 'paid' } }),
        prisma.coupleRoom.findMany({
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            participants: {
              select: {
                displayName: true,
                role: true,
                completionStatus: true,
              },
            },
          },
        }),
        prisma.payment.findMany({
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            room: {
              select: { roomCode: true },
            },
          },
        }),
        prisma.question.findMany({
          orderBy: { questionOrder: 'asc' },
          include: { category: true },
        }),
      ]);

    const totalRevenue = paidPayments.reduce((acc, p) => acc + p.amount, 0);
    const completedRoomsCount = await prisma.coupleRoom.count({
      where: { assessmentStatus: 'completed' },
    });
    const paidRoomsCount = paidPayments.length;
    const conversionRate = totalRooms > 0 ? Math.round((paidRoomsCount / totalRooms) * 100) : 0;

    return NextResponse.json({
      metrics: {
        totalRooms,
        totalParticipants,
        completedRooms: completedRoomsCount,
        pendingRooms: totalRooms - completedRoomsCount,
        completedParticipants,
        paidRooms: paidRoomsCount,
        totalRevenue,
        conversionRate,
      },
      recentRooms,
      recentPayments,
      questions,
    });
  } catch (error: any) {
    console.error('Admin metrics error:', error);
    return NextResponse.json({ error: 'Gagal memuat data admin.' }, { status: 500 });
  }
}
