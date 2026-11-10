import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMidtransSignature, markPaymentSuccessful } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('Payment webhook received:', payload);

    // 1. Check for Midtrans Webhook Notification
    if (payload.order_id && payload.signature_key && payload.status_code) {
      const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
      const orderId = payload.order_id;
      const statusCode = payload.status_code;
      const grossAmount = payload.gross_amount;
      const receivedSignature = payload.signature_key;

      if (serverKey) {
        const isValid = verifyMidtransSignature(
          orderId,
          statusCode,
          grossAmount,
          serverKey,
          receivedSignature
        );

        if (!isValid) {
          console.warn('Invalid Midtrans signature rejected');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }
      }

      const transactionStatus = payload.transaction_status;
      const fraudStatus = payload.fraud_status;

      if (
        transactionStatus === 'settlement' ||
        (transactionStatus === 'capture' && fraudStatus === 'accept')
      ) {
        await markPaymentSuccessful(orderId, payload.payment_type || 'midtrans', payload);
        return NextResponse.json({ status: 'ok', message: 'Payment verified and unlocked' });
      } else if (
        transactionStatus === 'cancel' ||
        transactionStatus === 'deny' ||
        transactionStatus === 'expire'
      ) {
        await prisma.payment.updateMany({
          where: { transactionId: orderId },
          data: { paymentStatus: 'failed' },
        });
        return NextResponse.json({ status: 'ok', message: 'Payment marked as failed/expired' });
      }

      return NextResponse.json({ status: 'pending', message: 'Payment status pending' });
    }

    // 2. Check for Xendit Webhook Notification
    if (payload.external_id && payload.status) {
      const externalId = payload.external_id;
      const xenditToken = process.env.XENDIT_WEBHOOK_TOKEN;

      // Verify Xendit token header if configured
      const callbackToken = request.headers.get('x-callback-token');
      if (xenditToken && callbackToken !== xenditToken) {
        return NextResponse.json({ error: 'Invalid callback token' }, { status: 403 });
      }

      if (payload.status === 'PAID' || payload.status === 'SETTLED') {
        await markPaymentSuccessful(externalId, payload.payment_method || 'xendit', payload);
        return NextResponse.json({ status: 'ok' });
      }

      return NextResponse.json({ status: 'ignored' });
    }

    return NextResponse.json({ error: 'Unrecognized webhook format' }, { status: 400 });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
