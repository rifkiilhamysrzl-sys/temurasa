import { NextResponse } from 'next/server';
import { markPersonalityPaymentSuccessful } from '@/lib/personality/payment';

export async function POST(request: Request) {
  try {
    // Simulator endpoint must be disabled in live production
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.ENABLE_PAYMENT_SIMULATOR !== 'true'
    ) {
      return NextResponse.json(
        { error: 'Simulasi pembayaran dinonaktifkan dalam mode live production.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: 'transactionId wajib disertakan.' },
        { status: 400 }
      );
    }

    const result = await markPersonalityPaymentSuccessful(
      transactionId,
      'SIMULATOR',
      { simulated: true, timestamp: new Date().toISOString() }
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Error simulating personality payment:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal simulasi pembayaran.' },
      { status: 500 }
    );
  }
}
