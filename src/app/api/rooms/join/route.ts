import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSecureToken, hashToken } from '@/lib/tokens';
import { checkRateLimit, getClientIp, sanitizeText } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`room_join_${ip}`, 30, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan bergabung. Silakan tunggu beberapa saat.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const invitationToken = (body.invitationToken || '').trim();
    const roomCodeInput = (body.roomCode || '').trim().toUpperCase();
    const yourName = sanitizeText(body.yourName || '', 50);
    const email = body.email ? sanitizeText(body.email, 100) : null;

    if (!invitationToken && !roomCodeInput) {
      return NextResponse.json(
        { error: 'Token undangan atau Room ID wajib disediakan.' },
        { status: 400 }
      );
    }

    if (!yourName || yourName.length < 2 || yourName.length > 50) {
      return NextResponse.json(
        { error: 'Nama Anda wajib diisi (antara 2 hingga 50 karakter).' },
        { status: 400 }
      );
    }

    let room = null;

    if (invitationToken) {
      const invitationTokenHash = hashToken(invitationToken);
      room = await prisma.coupleRoom.findUnique({
        where: { invitationTokenHash },
        include: {
          participants: true,
        },
      });
    } else if (roomCodeInput) {
      const formattedCode = roomCodeInput.startsWith('TWO-')
        ? roomCodeInput
        : `TWO-${roomCodeInput}`;

      room = await prisma.coupleRoom.findUnique({
        where: { roomCode: formattedCode },
        include: {
          participants: true,
        },
      });
    }

    if (!room) {
      return NextResponse.json(
        { error: 'Ruangan atau undangan tidak ditemukan.' },
        { status: 404 }
      );
    }

    if (room.status !== 'active') {
      return NextResponse.json(
        { error: 'Ruangan ini sudah tidak aktif.' },
        { status: 403 }
      );
    }

    // Check if participant B already exists
    const participantBExists = room.participants.some(
      (p) => p.role === 'participant_b'
    );

    if (participantBExists) {
      return NextResponse.json(
        { error: 'Ruangan ini sudah terisi penuh (maksimal 2 pasangan).' },
        { status: 409 }
      );
    }

    const accessTokenB = generateSecureToken(32);
    const accessTokenHashB = hashToken(accessTokenB);

    const participantB = await prisma.$transaction(async (tx) => {
      const p = await tx.participant.create({
        data: {
          roomId: room.id,
          displayName: yourName,
          email,
          role: 'participant_b',
          accessTokenHash: accessTokenHashB,
          completionStatus: 'not_started',
          currentQuestionIndex: 0,
          consentToSharedReport: true,
        },
      });

      // Update room assessmentStatus to in_progress
      await tx.coupleRoom.update({
        where: { id: room.id },
        data: {
          assessmentStatus: 'in_progress',
        },
      });

      return p;
    });

    return NextResponse.json({
      success: true,
      roomCode: room.roomCode,
      accessToken: accessTokenB,
      participant: {
        id: participantB.id,
        displayName: participantB.displayName,
        role: participantB.role,
      },
    });
  } catch (error: any) {
    console.error('Error joining couple room:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat bergabung. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
