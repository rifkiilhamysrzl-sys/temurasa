import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMidtransSignature, markPaymentSuccessful } from '@/lib/payment';
import { getMayarInvoiceDetail } from '@/lib/mayar';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // ========================================================
    // 1. MAYAR WEBHOOK NOTIFICATION (testing or payment.received)
    // ========================================================
    const isMayarEvent =
      payload.event === 'testing' ||
      payload.event === 'payment.received' ||
      payload.event?.startsWith('payment.');

    if (isMayarEvent) {
      // Safe logging without printing sensitive customer contact details
      console.log('[MAYAR_WEBHOOK] Received event:', {
        event: payload.event,
        dataId: payload.data?.id,
        invoiceId: payload.data?.invoiceId,
        amount: payload.data?.amount,
        status: payload.data?.status,
        extraData: payload.data?.extraData,
      });

      // 1. Secret Authentication
      const configuredSecret = process.env.MAYAR_WEBHOOK_SECRET?.trim();
      const url = new URL(request.url);
      const querySecret = url.searchParams.get('secret') || url.searchParams.get('token');
      const headerSecret =
        request.headers.get('x-mayar-secret') ||
        request.headers.get('x-webhook-secret') ||
        request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

      if (configuredSecret) {
        const received = querySecret || headerSecret;
        if (!received || received !== configuredSecret) {
          console.warn('[MAYAR_WEBHOOK] Secret mismatch or missing, rejected.');
          return NextResponse.json({ error: 'Unauthorized webhook secret' }, { status: 403 });
        }
      }

      // 2. Dedicated Handler for Event "testing"
      // Produces simple HTTP 200 acknowledgment without touching database or unlocking access
      if (payload.event === 'testing') {
        console.log('[MAYAR_WEBHOOK] Test event acknowledged successfully.');
        return NextResponse.json(
          {
            statusCode: 200,
            status: 'ok',
            message: 'Webhook test acknowledged successfully.',
            event: 'testing',
          },
          { status: 200 }
        );
      }

      // 3. Only handle official payment.received
      if (payload.event !== 'payment.received') {
        return NextResponse.json({ status: 'ignored', message: `Ignored event: ${payload.event}` });
      }

      // 4. Correlation Identification
      const extraTrxId = payload.data?.extraData?.transactionId || payload.data?.extraData?.idProd;
      const extraRoomCode = payload.data?.extraData?.roomCode || payload.data?.extraData?.noCustomer;
      const dataId = payload.data?.id;
      const invoiceId = payload.data?.invoiceId || payload.data?.paymentLinkId;

      let matchingPayment: any = null;

      // Match by internal transactionId passed in extraData
      if (extraTrxId) {
        matchingPayment = await prisma.payment.findUnique({
          where: { transactionId: extraTrxId },
          include: { room: true },
        });
      }

      // Match by invoice ID stored in gatewayTransactionId
      if (!matchingPayment && invoiceId) {
        matchingPayment = await prisma.payment.findFirst({
          where: { gatewayTransactionId: invoiceId },
          include: { room: true },
        });
      }

      // Match by data.id if it references gatewayTransactionId
      if (!matchingPayment && dataId) {
        matchingPayment = await prisma.payment.findFirst({
          where: { gatewayTransactionId: dataId },
          include: { room: true },
        });
      }

      // Match by roomCode in extraData if single pending payment exists
      if (!matchingPayment && extraRoomCode) {
        const room = await prisma.coupleRoom.findUnique({
          where: { roomCode: extraRoomCode.toUpperCase() },
          include: {
            payments: {
              where: { paymentStatus: 'pending' },
              orderBy: { createdAt: 'desc' },
            },
          },
        });
        if (room && room.payments.length > 0) {
          matchingPayment = { ...room.payments[0], room };
        }
      }

      // 5. UNMATCHED WEBHOOK HANDLING
      // Critical security rule: NEVER unlock room without verified matching identity!
      // Do NOT attempt invalid insert into PaymentEvent without valid paymentId.
      if (!matchingPayment) {
        console.warn(
          '[MAYAR_WEBHOOK_UNMATCHED] Webhook payment.received could not be matched to an active payment record.',
          JSON.stringify({
            dataId,
            invoiceId,
            extraTrxId,
            extraRoomCode,
          })
        );
        return NextResponse.json({
          status: 'unmatched_logged',
          message: 'Webhook recorded but no matching internal transaction found.',
        });
      }

      // 6. ZERO-TRUST SERVER-TO-SERVER VERIFICATION
      const targetInvoiceId = matchingPayment.gatewayTransactionId || invoiceId || dataId;
      if (!targetInvoiceId) {
        console.warn('[MAYAR_WEBHOOK] Matched payment has no gatewayTransactionId.');
        return NextResponse.json(
          { error: 'Payment record lacks Mayar invoice identifier' },
          { status: 400 }
        );
      }

      // Verify directly with Mayar API V2
      const invoiceDetail = await getMayarInvoiceDetail(targetInvoiceId);

      if (invoiceDetail.status !== 'paid') {
        console.warn(
          `[MAYAR_WEBHOOK] Mayar API status is '${invoiceDetail.status}', not 'paid'. Rejecting unlock.`
        );
        return NextResponse.json(
          { error: 'Invoice not confirmed as paid by Mayar server' },
          { status: 400 }
        );
      }

      if (invoiceDetail.amount !== matchingPayment.amount) {
        console.warn(
          `[MAYAR_WEBHOOK] Nominal amount mismatch: Mayar=${invoiceDetail.amount}, DB=${matchingPayment.amount}`
        );
        return NextResponse.json(
          { error: 'Nominal payment amount does not match invoice' },
          { status: 400 }
        );
      }

      // 7. ATOMIC CONDITIONAL UNLOCK
      const paymentMethod =
        invoiceDetail.transactions?.[0]?.paymentMethod || 'MAYAR_WEBHOOK';

      const unlockResult = await markPaymentSuccessful(
        matchingPayment.transactionId,
        paymentMethod,
        invoiceDetail
      );

      return NextResponse.json({
        message: 'Mayar payment verified and room unlocked successfully.',
        ...unlockResult,
      });
    }

    // ========================================================
    // 2. MIDTRANS WEBHOOK NOTIFICATION
    // ========================================================
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

    // ========================================================
    // 3. XENDIT WEBHOOK NOTIFICATION
    // ========================================================
    if (payload.external_id && payload.status) {
      const externalId = payload.external_id;
      const xenditToken = process.env.XENDIT_WEBHOOK_TOKEN;

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
