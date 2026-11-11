import { NextResponse } from 'next/server';
import { verifyAndUnlockMayarPayment } from '@/lib/payment';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`payment_verify_${ip}`, 30, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan verifikasi. Mohon tunggu sebentar.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const roomCode = (body.roomCode || '').trim().toUpperCase();
    const transactionId = (body.transactionId || '').trim();
    const invoiceId = (body.invoiceId || '').trim() || undefined;

    if (!roomCode || !transactionId) {
      return NextResponse.json(
        { error: 'Kode ruangan dan ID transaksi diperlukan untuk verifikasi.' },
        { status: 400 }
      );
    }

    const verificationResult = await verifyAndUnlockMayarPayment(
      transactionId,
      roomCode,
      invoiceId
    );

    return NextResponse.json({
      success: true,
      ...verificationResult,
    });
  } catch (error: any) {
    console.error('Error during payment verification:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memverifikasi status pembayaran.' },
      { status: 400 }
    );
  }
}
