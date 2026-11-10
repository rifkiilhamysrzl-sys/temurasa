import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRoomCode, generateSecureToken, hashToken } from '@/lib/tokens';
import { checkRateLimit, getClientIp, sanitizeText } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`room_create_${ip}`, 15, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan pembuatan ruangan. Silakan tunggu beberapa saat.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const yourName = sanitizeText(body.yourName || '', 50);
    const partnerName = sanitizeText(body.partnerName || '', 50);
    const email = body.email ? sanitizeText(body.email, 100) : null;

    if (!yourName || yourName.length < 2 || yourName.length > 50) {
      return NextResponse.json(
        { error: 'Nama Anda wajib diisi (antara 2 hingga 50 karakter).' },
        { status: 400 }
      );
    }

    if (!partnerName || partnerName.length < 2 || partnerName.length > 50) {
      return NextResponse.json(
        { error: 'Nama Pasangan wajib diisi (antara 2 hingga 50 karakter).' },
        { status: 400 }
      );
    }

    // Generate room code and secure tokens
    let roomCode = generateRoomCode();
    // Ensure roomCode uniqueness
    let existing = await prisma.coupleRoom.findUnique({ where: { roomCode } });
    while (existing) {
      roomCode = generateRoomCode();
      existing = await prisma.coupleRoom.findUnique({ where: { roomCode } });
    }

    const invitationToken = generateSecureToken(32);
    const invitationTokenHash = hashToken(invitationToken);

    const accessTokenA = generateSecureToken(32);
    const accessTokenHashA = hashToken(accessTokenA);

    // Create CoupleRoom and Participant A in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const room = await tx.coupleRoom.create({
        data: {
          roomCode,
          invitationTokenHash,
          status: 'active',
          assessmentStatus: 'waiting_partner',
          paymentStatus: 'unpaid',
        },
      });

      const participantA = await tx.participant.create({
        data: {
          roomId: room.id,
          displayName: yourName,
          email,
          role: 'participant_a',
          accessTokenHash: accessTokenHashA,
          completionStatus: 'not_started',
          currentQuestionIndex: 0,
          consentToSharedReport: true,
        },
      });

      return { room, participantA };
    });

    return NextResponse.json({
      success: true,
      roomCode: result.room.roomCode,
      invitationToken,
      accessToken: accessTokenA,
      participant: {
        id: result.participantA.id,
        displayName: result.participantA.displayName,
        partnerNameSuggested: partnerName,
        role: result.participantA.role,
      },
    });
  } catch (error: any) {
    console.error('Error creating couple room:', error);
    return NextResponse.json(
      { error: 'Gagal membuat couple room. Silakan coba beberapa saat lagi.' },
      { status: 500 }
    );
  }
}
