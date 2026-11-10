import { NextResponse } from 'next/server';
import { markPaymentSuccessful } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    // In production with live Midtrans, disable simulator unless explicitly permitted
    if (
      process.env.MIDTRANS_IS_PRODUCTION === 'true' &&
      process.env.ENABLE_PAYMENT_SIMULATOR !== 'true'
    ) {
      return NextResponse.json(
        { error: 'Simulasi pembayaran dinonaktifkan dalam mode live production.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const transactionId = (body.transactionId || '').trim();
    const paymentMethod = body.paymentMethod || 'QRIS';

    if (!transactionId) {
      return NextResponse.json(
        { error: 'ID Transaksi wajib diisi.' },
        { status: 400 }
      );
    }

    const result = await markPaymentSuccessful(transactionId, paymentMethod, {
      simulated: true,
      timestamp: new Date().toISOString(),
      method: paymentMethod,
    });

    return NextResponse.json({
      success: true,
      message: 'Pembayaran simulasi berhasil diverifikasi server.',
      ...result,
    });
  } catch (error: any) {
    console.error('Error simulating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memproses verifikasi pembayaran.' },
      { status: 500 }
    );
  }
}
