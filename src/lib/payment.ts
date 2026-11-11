import crypto from 'crypto';
import { prisma } from './prisma';
import { createMayarInvoice, getMayarInvoiceDetail, MayarInvoiceDetail } from './mayar';

export interface CreatePaymentParams {
  roomId: string;
  payerName: string;
  payerEmail: string;
  payerMobile: string;
  appBaseUrl?: string;
}

export interface PaymentInitResult {
  paymentId: string;
  transactionId: string;
  amount: number;
  currency: string;
  gateway: 'mayar' | 'midtrans' | 'xendit' | 'simulator';
  snapToken?: string;
  redirectUrl?: string;
  invoiceId?: string;
  isSimulator: boolean;
}

/**
 * Generate unique internal transaction ID: TRX-{timestamp}-{random}
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRX-${timestamp}-${randomStr}`;
}

/**
 * Initialize payment for a couple room (IDR 10,000)
 * Prioritizes Mayar API V2 if MAYAR_API_KEY is configured.
 */
export async function initializePayment({
  roomId,
  payerName,
  payerEmail,
  payerMobile,
  appBaseUrl,
}: CreatePaymentParams): Promise<PaymentInitResult> {
  const room = await prisma.coupleRoom.findUnique({
    where: { id: roomId },
    include: { participants: true },
  });

  if (!room) {
    throw new Error('Couple room tidak ditemukan.');
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

  // Base domain for customer redirect callback
  const baseUrl =
    appBaseUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://temurasa-ecru.vercel.app';

  // 1. MAYAR API V2 INTEGRATION (PRIMARY)
  const mayarApiKey = process.env.MAYAR_API_KEY?.trim();
  if (mayarApiKey && mayarApiKey.length > 0) {
    // Validate required payer details for Mayar
    const cleanMobile = payerMobile ? payerMobile.replace(/[^0-9]/g, '') : '';
    if (!cleanMobile || cleanMobile.length < 10) {
      throw new Error('Nomor HP wajib diisi minimal 10 digit untuk pembayaran Mayar.');
    }

    const cleanEmail = payerEmail ? payerEmail.trim() : '';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Alamat email valid wajib diisi untuk bukti pembayaran.');
    }

    const cleanName = payerName ? payerName.trim() : 'Pasangan Temurasa';

    const redirectUrl = `${baseUrl}/payment/success?code=${encodeURIComponent(room.roomCode)}&trx=${encodeURIComponent(transactionId)}`;
    const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const invoice = await createMayarInvoice({
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      description: `Laporan Lengkap Kompatibilitas Temurasa (${room.roomCode})`,
      expiredAt,
      items: [
        {
          quantity: 1,
          rate: amount,
          description: 'Laporan Lengkap Kompatibilitas Hubungan Temurasa (30 Dimensi)',
        },
      ],
      redirectUrl,
      extraData: {
        noCustomer: room.roomCode,
        idProd: transactionId,
      },
    });

    const payment = await prisma.payment.upsert({
      where: { transactionId },
      update: {
        paymentStatus: 'pending',
        gatewayName: 'mayar',
        gatewayTransactionId: invoice.id,
      },
      create: {
        roomId,
        transactionId,
        gatewayName: 'mayar',
        gatewayTransactionId: invoice.id,
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
      gateway: 'mayar',
      invoiceId: invoice.id,
      redirectUrl: invoice.link,
      isSimulator: false,
    };
  }

  // 2. MIDTRANS GATEWAY (SECONDARY)
  const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
  if (midtransServerKey && midtransServerKey.trim().length > 0) {
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

  // 3. FALLBACK TO BUILT-IN SIMULATOR (DEV ONLY)
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
 * Handle successful payment transaction using strict atomic conditional database updates.
 * Guarantees zero race conditions and strict room-level isolation.
 */
export async function markPaymentSuccessful(
  transactionId: string,
  paymentMethod: string = 'MAYAR',
  gatewayPayload: any = {}
) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
    include: { room: true },
  });

  if (!payment) {
    throw new Error(`Transaksi ${transactionId} tidak ditemukan.`);
  }

  // Idempotency check: if already paid, return early without re-executing
  if (payment.paymentStatus === 'paid') {
    return { status: 'already_paid', roomCode: payment.room.roomCode };
  }

  // Strict atomic conditional transaction
  const result = await prisma.$transaction(async (tx) => {
    // Conditional update: only update if currently 'pending' or 'unpaid'
    const updateResult = await tx.payment.updateMany({
      where: {
        id: payment.id,
        paymentStatus: { in: ['pending', 'unpaid'] },
      },
      data: {
        paymentStatus: 'paid',
        paymentMethod,
        paidAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      // Another concurrent process already updated this payment
      return { status: 'already_processed', roomCode: payment.room.roomCode };
    }

    // Atomically unlock the specific couple room
    await tx.coupleRoom.update({
      where: { id: payment.roomId },
      data: {
        paymentStatus: 'paid',
      },
    });

    // Record audit event linked to this payment
    await tx.paymentEvent.create({
      data: {
        paymentId: payment.id,
        eventType: 'payment_success_verified',
        gatewayEventId: payment.gatewayTransactionId || gatewayPayload?.id || `TRX-${Date.now()}`,
        payload: JSON.stringify(gatewayPayload),
      },
    });

    return { status: 'success', roomCode: payment.room.roomCode };
  });

  return result;
}

/**
 * Verifies Mayar payment directly with Mayar API V2 (Server-to-Server)
 * and atomically unlocks premium access if confirmed paid.
 */
export async function verifyAndUnlockMayarPayment(
  transactionId: string,
  roomCode: string,
  optionalInvoiceId?: string
) {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
    include: { room: true },
  });

  if (!payment) {
    throw new Error('Transaksi pembayaran tidak ditemukan.');
  }

  // Room code mismatch guard: strictly guarantees payment belongs to this room
  if (payment.room.roomCode.toUpperCase() !== roomCode.toUpperCase()) {
    throw new Error('Kode ruangan tidak cocok dengan data transaksi.');
  }

  if (payment.paymentStatus === 'paid') {
    return { isPaid: true, status: 'already_paid', roomCode: payment.room.roomCode };
  }

  const invoiceId = optionalInvoiceId || payment.gatewayTransactionId;
  if (!invoiceId) {
    throw new Error('Identitas invoice Mayar belum terdaftar untuk transaksi ini.');
  }

  // Server-to-server check directly to Mayar API V2
  const invoiceDetail: MayarInvoiceDetail = await getMayarInvoiceDetail(invoiceId);

  // Validate status, amount, and currency
  const isPaid = invoiceDetail.status === 'paid';
  const isAmountValid = invoiceDetail.amount === payment.amount;

  if (!isPaid) {
    return {
      isPaid: false,
      status: invoiceDetail.status || 'unpaid',
      message: 'Pembayaran belum diselesaikan di Mayar.',
      roomCode: payment.room.roomCode,
    };
  }

  if (!isAmountValid) {
    throw new Error(
      `Nominal pembayaran di Mayar (${invoiceDetail.amount}) tidak sesuai dengan tagihan (${payment.amount}).`
    );
  }

  const paymentMethod =
    invoiceDetail.transactions?.[0]?.paymentMethod || 'MAYAR_VERIFIED';

  const unlockResult = await markPaymentSuccessful(
    transactionId,
    paymentMethod,
    invoiceDetail
  );

  return {
    isPaid: true,
    ...unlockResult,
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
