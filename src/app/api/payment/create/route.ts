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
    const payerName = sanitizeText(body.payerName || '', 50).trim();
    const payerEmail = (body.payerEmail || '').trim().toLowerCase();
    const payerMobile = (body.payerMobile || '').trim().replace(/[^0-9]/g, '');

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

    // Strict validation of payer details (Mayar V2 requires min 3 chars name)
    if (!payerName || payerName.length < 3) {
      return NextResponse.json(
        { error: 'Mohon masukkan nama lengkap untuk keperluan invoice pembayaran.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!payerEmail || !emailRegex.test(payerEmail)) {
      return NextResponse.json(
        { error: 'Alamat email pembayar tidak valid. Mohon masukkan email yang benar untuk bukti invoice.' },
        { status: 400 }
      );
    }

    let normalizedMobile = payerMobile;
    if (normalizedMobile.startsWith('62')) {
      normalizedMobile = '0' + normalizedMobile.slice(2);
    }

    if (!normalizedMobile || normalizedMobile.length < 10 || normalizedMobile.length > 15) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp / HP wajib diisi minimal 10 digit angka valid (contoh: 081234567890).' },
        { status: 400 }
      );
    }

    // Derive app base URL
    const host = request.headers.get('host') || 'temurasa-ecru.vercel.app';
    const proto = host.includes('localhost') ? 'http' : 'https';
    const appBaseUrl = `${proto}://${host}`;

    const paymentResult = await initializePayment({
      roomId: room.id,
      payerName,
      payerEmail,
      payerMobile: normalizedMobile,
      appBaseUrl,
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
