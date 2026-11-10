import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { initializePayment } from '@/lib/payment';
import { checkRateLimit, getClientIp, sanitizeText } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`payment_create_${ip}`, 15, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan pembayaran. Silakan tunggu sebentar.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const roomCode = (body.roomCode || '').trim().toUpperCase();
    const payerName = sanitizeText(body.payerName || '', 50) || 'Pasangan Temurasa';

    if (!roomCode) {
      return NextResponse.json(
        { error: 'Kode ruangan diperlukan.' },
        { status: 400 }
      );
    }

    const room = await prisma.coupleRoom.findUnique({
      where: { roomCode },
      include: {
        participants: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Ruangan tidak ditemukan.' },
        { status: 404 }
      );
    }

    // Check if both participants completed
    const bothCompleted =
      room.participants.length === 2 &&
      room.participants.every((p) => p.completionStatus === 'completed');

    if (!bothCompleted) {
      return NextResponse.json(
        { error: 'Kedua pasangan harus menyelesaikan 30 pertanyaan sebelum pembayaran.' },
        { status: 400 }
      );
    }

    if (room.paymentStatus === 'paid') {
      return NextResponse.json({
        isAlreadyPaid: true,
        message: 'Laporan ini sudah berhasil dibuka.',
      });
    }

    const paymentResult = await initializePayment({
      roomId: room.id,
      payerName,
    });

    return NextResponse.json({
      success: true,
      ...paymentResult,
    });
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memulai proses pembayaran.' },
      { status: 500 }
    );
  }
}
