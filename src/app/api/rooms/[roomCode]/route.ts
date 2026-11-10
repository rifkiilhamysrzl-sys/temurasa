import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/tokens';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { roomCode: string } }
) {
  try {
    const rawParam = (params.roomCode || '').trim();
    const cleaned = rawParam.replace(/\s+/g, '-').toUpperCase();
    const formattedCode = cleaned.startsWith('TWO-')
      ? cleaned
      : cleaned.length <= 8
      ? `TWO-${cleaned.replace(/^TWO-?/, '')}`
      : cleaned;

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // 1. Try finding by roomCode
    let room = await prisma.coupleRoom.findUnique({
      where: { roomCode: formattedCode },
      include: {
        participants: {
          select: {
            id: true,
            displayName: true,
            role: true,
            completionStatus: true,
            currentQuestionIndex: true,
            completedAt: true,
            accessTokenHash: true,
          },
        },
      },
    });

    // 2. If not found by roomCode, try finding by invitationToken
    if (!room && rawParam.length >= 16) {
      const tokenHash = hashToken(rawParam);
      room = await prisma.coupleRoom.findUnique({
        where: { invitationTokenHash: tokenHash },
        include: {
          participants: {
            select: {
              id: true,
              displayName: true,
              role: true,
              completionStatus: true,
              currentQuestionIndex: true,
              completedAt: true,
              accessTokenHash: true,
            },
          },
        },
      });
    }

    if (!room) {
      return NextResponse.json(
        { error: 'Couple room tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Determine current caller role if token provided
    let currentParticipantRole: string | null = null;
    if (token) {
      const hashed = hashToken(token);
      const match = room.participants.find((p) => p.accessTokenHash === hashed);
      if (match) {
        currentParticipantRole = match.role;
      }
    }

    // Return sanitized participant information without sensitive hashes
    const sanitizedParticipants = room.participants.map((p) => ({
      id: p.id,
      displayName: p.displayName,
      role: p.role,
      completionStatus: p.completionStatus,
      currentQuestionIndex: p.currentQuestionIndex,
      completedAt: p.completedAt,
      isCurrentUser: currentParticipantRole === p.role,
    }));

    const roomPayload = {
      roomCode: room.roomCode,
      status: room.status,
      assessmentStatus: room.assessmentStatus,
      paymentStatus: room.paymentStatus,
      participants: sanitizedParticipants,
      isFullyJoined: sanitizedParticipants.length === 2,
      isBothCompleted:
        sanitizedParticipants.length === 2 &&
        sanitizedParticipants.every((p) => p.completionStatus === 'completed'),
    };

    return NextResponse.json({
      ...roomPayload,
      room: roomPayload,
    });
  } catch (error: any) {
    console.error('Error fetching room status:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil status room.' },
      { status: 500 }
    );
  }
}
