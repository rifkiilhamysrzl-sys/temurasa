import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAndUnlockPersonalityMayarPayment } from '@/lib/personality/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testCode, transactionId, invoiceId } = body;

    if (!testCode || !transactionId) {
      return NextResponse.json(
        { error: 'testCode dan transactionId wajib disertakan.' },
        { status: 400 }
      );
    }

    // 1. Check if already marked as paid
    const payment = await prisma.personalityPayment.findUnique({
      where: { transactionId },
      include: { test: true },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan.' },
        { status: 404 }
      );
    }

    if (payment.paymentStatus === 'paid' || payment.test.paymentStatus === 'paid') {
      return NextResponse.json({
        isPaid: true,
        status: 'already_paid',
        testCode: payment.test.testCode,
      });
    }

    // 2. If Mayar API Key is set, verify directly with Mayar API V2
    const mayarApiKey = process.env.MAYAR_API_KEY?.trim();
    if (mayarApiKey && mayarApiKey.length > 0) {
      const verifyResult = await verifyAndUnlockPersonalityMayarPayment(
        transactionId,
        testCode,
        invoiceId || payment.gatewayTransactionId || undefined
      );

      return NextResponse.json(verifyResult);
    }

    return NextResponse.json({
      isPaid: false,
      status: payment.paymentStatus,
      message: 'Status pembayaran masih pending.',
    });
  } catch (error: any) {
    console.error('Error verifying personality payment:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memverifikasi status pembayaran.' },
      { status: 500 }
    );
  }
}
