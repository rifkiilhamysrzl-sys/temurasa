import crypto from 'crypto';
import { prisma } from './prisma';

export interface CreatePaymentParams {
  roomId: string;
  payerName?: string;
  payerEmail?: string;
}

export interface PaymentInitResult {
  paymentId: string;
  transactionId: string;
  amount: number;
  currency: string;
  gateway: 'midtrans' | 'xendit' | 'simulator';
  snapToken?: string;
  redirectUrl?: string;
  isSimulator: boolean;
}

/**
 * Generate unique transaction ID: TWO-{timestamp}-{random}
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRX-${timestamp}-${randomStr}`;
}

/**
 * Initialize payment for a couple room (IDR 10,000)
 */
export async function initializePayment({
  roomId,
  payerName = 'Pasangan TWOgether',
  payerEmail = 'support@twogether.app',
}: CreatePaymentParams): Promise<PaymentInitResult> {
  const room = await prisma.coupleRoom.findUnique({
    where: { id: roomId },
    include: { participants: true },
  });

  if (!room) {
    throw new Error('Couple room not found');
  }

  if (room.paymentStatus === 'paid') {
    throw new Error('Laporan untuk ruangan ini sudah terbuka / lunas.');
  }

  // Check if there is an existing pending payment created within the last 30 minutes
  const recentPending = await prisma.payment.findFirst({
    where: {
      roomId,
      paymentStatus: 'pending',
      createdAt: {
        gte: new Date(Date.now() - 30 * 60 * 1000),
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const transactionId = recentPending ? recentPending.transactionId : generateTransactionId();
  const amount = 10000;
  const currency = 'IDR';

  // Determine Gateway based on environment
  const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
  const xenditApiKey = process.env.XENDIT_API_KEY;

  if (midtransServerKey && midtransServerKey.trim().length > 0) {
    // Real Midtrans Snap API call
    try {
      const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
      const endpoint = isProduction
        ? 'https://app.midtrans.com/snap/v1/transactions'
        : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

      const authHeader = 'Basic ' + Buffer.from(midtransServerKey + ':').toString('base64');
      const payload = {
        transaction_details: {
          order_id: transactionId,
          gross_amount: amount,
        },
        credit_card: {
          secure: true,
        },
        item_details: [
          {
            id: 'TWO-REPORT-FULL',
            price: amount,
            quantity: 1,
            name: 'TWOgether Couple Compatibility Report',
          },
        ],
        customer_details: {
          first_name: payerName,
          email: payerEmail,
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Midtrans API error:', errorData);
        throw new Error('Failed to create Midtrans transaction');
      }

      const snapData = await res.json();

      const payment = await prisma.payment.upsert({
        where: { transactionId },
        update: {
          paymentStatus: 'pending',
          gatewayTransactionId: snapData.token,
        },
        create: {
          roomId,
          transactionId,
          gatewayName: 'midtrans',
          gatewayTransactionId: snapData.token,
          amount,
          currency,
          paymentStatus: 'pending',
        },
      });

      return {
        paymentId: payment.id,
        transactionId,
        amount,
        currency,
        gateway: 'midtrans',
        snapToken: snapData.token,
        redirectUrl: snapData.redirect_url,
        isSimulator: false,
      };
    } catch (err) {
      console.warn('Midtrans creation failed or not configured, falling back to simulator:', err);
    }
  }

  // Fallback to Built-in Simulator / Sandbox
  const payment = await prisma.payment.upsert({
    where: { transactionId },
    update: {
      paymentStatus: 'pending',
    },
    create: {
      roomId,
      transactionId,
      gatewayName: 'simulator',
      amount,
      currency,
      paymentStatus: 'pending',
    },
  });

  return {
    paymentId: payment.id,
    transactionId,
    amount,
    currency,
    gateway: 'simulator',
    redirectUrl: `/payment/simulate?trx=${transactionId}`,
    isSimulator: true,
  };
}

/**
 * Verifies Midtrans SHA-512 signature:
 * SHA512(order_id + status_code + gross_amount + server_key)
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  receivedSignature: string
): boolean {
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');
  return hash.toLowerCase() === receivedSignature.toLowerCase();
}

/**
 * Handle successful payment transaction idempotently
 */
export async function markPaymentSuccessful(
  transactionId: string,
  paymentMethod: string = 'QRIS',
  gatewayPayload: any = {}
) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
    include: { room: true },
  });

  if (!payment) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  // Idempotency check: if already paid, return without duplicating
  if (payment.paymentStatus === 'paid') {
    return { status: 'already_paid', roomCode: payment.room.roomCode };
  }

  // Transactionally update payment, room status, and record event
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: 'paid',
        paymentMethod,
        paidAt: new Date(),
      },
    }),
    prisma.coupleRoom.update({
      where: { id: payment.roomId },
      data: {
        paymentStatus: 'paid',
      },
    }),
    prisma.paymentEvent.create({
      data: {
        paymentId: payment.id,
        eventType: 'payment_success',
        gatewayEventId: gatewayPayload?.transaction_id || `SIM-${Date.now()}`,
        payload: JSON.stringify(gatewayPayload),
      },
    }),
  ]);

  return { status: 'success', roomCode: payment.room.roomCode };
}
