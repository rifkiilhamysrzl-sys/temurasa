import { prisma } from '@/lib/prisma';
import { createMayarInvoice, getMayarInvoiceDetail, MayarInvoiceDetail } from '@/lib/mayar';

export interface CreatePersonalityPaymentParams {
  testCode: string;
  payerName: string;
  payerEmail: string;
  payerMobile: string;
  appBaseUrl?: string;
}

export interface PersonalityPaymentInitResult {
  paymentId: string;
  transactionId: string;
  amount: number;
  currency: string;
  gateway: 'mayar' | 'simulator';
  redirectUrl?: string;
  invoiceId?: string;
  isSimulator: boolean;
}

/**
 * Generate unique internal transaction ID for personality test report:
 * TRX-PERS-{timestamp}-{random}
 */
export function generatePersonalityTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRX-PERS-${timestamp}-${randomStr}`;
}

/**
 * Initialize payment for Personality Report (IDR 12,000)
 */
export async function initializePersonalityPayment({
  testCode,
  payerName,
  payerEmail,
  payerMobile,
  appBaseUrl,
}: CreatePersonalityPaymentParams): Promise<PersonalityPaymentInitResult> {
  const test = await prisma.personalityTest.findUnique({
    where: { testCode: testCode.toUpperCase() },
  });

  if (!test) {
    throw new Error('Sesi tes kepribadian tidak ditemukan.');
  }

  if (test.paymentStatus === 'paid') {
    throw new Error('Laporan lengkap untuk tes ini sudah terbuka / lunas.');
  }

  // Check recent pending payment within 30 minutes
  const recentPending = await prisma.personalityPayment.findFirst({
    where: {
      testId: test.id,
      paymentStatus: 'pending',
      createdAt: {
        gte: new Date(Date.now() - 30 * 60 * 1000),
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const transactionId = recentPending ? recentPending.transactionId : generatePersonalityTransactionId();
  const amount = 12000;
  const currency = 'IDR';

  const baseUrl =
    appBaseUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://www.temurasa.live';

  const mayarApiKey = process.env.MAYAR_API_KEY?.trim();

  // 1. Mayar API V2 Integration
  if (mayarApiKey && mayarApiKey.length > 0) {
    let cleanMobile = payerMobile ? payerMobile.replace(/[^0-9]/g, '') : '';
    if (cleanMobile.startsWith('62')) {
      cleanMobile = '0' + cleanMobile.slice(2);
    }
    if (!cleanMobile || cleanMobile.length < 10) {
      throw new Error('Nomor HP wajib diisi minimal 10 digit untuk pembayaran Mayar.');
    }

    const cleanEmail = payerEmail ? payerEmail.trim().toLowerCase() : '';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Alamat email valid wajib diisi untuk bukti pembayaran.');
    }

    const cleanName = payerName ? payerName.trim() : '';
    if (!cleanName || cleanName.length < 3) {
      throw new Error('Mohon masukkan nama lengkap untuk keperluan invoice pembayaran.');
    }

    const redirectUrl = `${baseUrl}/personality/payment/success?testCode=${encodeURIComponent(test.testCode)}&trx=${encodeURIComponent(transactionId)}`;
    const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const invoice = await createMayarInvoice({
      name: cleanName,
      email: cleanEmail,
      mobile: cleanMobile,
      description: 'Temurasa — Laporan Lengkap Kepribadian & Pasangan Ideal',
      expiredAt,
      items: [
        {
          quantity: 1,
          rate: amount,
          description: 'Temurasa — Laporan Kepribadian & Pasangan Ideal (Rp12.000)',
        },
      ],
      redirectUrl,
      extraData: {
        transactionId,
        testCode: test.testCode,
        idProd: transactionId,
        noCustomer: test.testCode,
        type: 'personality_report',
      },
    });

    const payment = await prisma.personalityPayment.upsert({
      where: { transactionId },
      update: {
        paymentStatus: 'pending',
        gatewayName: 'mayar',
        gatewayTransactionId: invoice.id,
      },
      create: {
        testId: test.id,
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

  // 2. Simulator mode fallback when MAYAR_API_KEY is not configured
  const payment = await prisma.personalityPayment.upsert({
    where: { transactionId },
    update: {
      paymentStatus: 'pending',
      gatewayName: 'simulator',
    },
    create: {
      testId: test.id,
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
    redirectUrl: `/personality/payment/simulate?testCode=${encodeURIComponent(test.testCode)}&trx=${encodeURIComponent(transactionId)}`,
    isSimulator: true,
  };
}

/**
 * Atomically marks personality payment successful and unlocks the test report
 */
export async function markPersonalityPaymentSuccessful(
  transactionId: string,
  paymentMethod: string = 'MAYAR',
  gatewayPayload: any = {}
) {
  const payment = await prisma.personalityPayment.findUnique({
    where: { transactionId },
    include: { test: true },
  });

  if (!payment) {
    throw new Error(`Transaksi kepribadian ${transactionId} tidak ditemukan.`);
  }

  if (payment.paymentStatus === 'paid') {
    return { status: 'already_paid', testCode: payment.test.testCode };
  }

  const result = await prisma.$transaction(async (tx) => {
    const updateResult = await tx.personalityPayment.updateMany({
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
      return { status: 'already_processed', testCode: payment.test.testCode };
    }

    await tx.personalityTest.update({
      where: { id: payment.testId },
      data: {
        paymentStatus: 'paid',
      },
    });

    return { status: 'success', testCode: payment.test.testCode };
  });

  return result;
}

/**
 * Verifies Mayar payment directly with Mayar API V2 (Server-to-Server)
 * and atomically unlocks the personality report if paid.
 */
export async function verifyAndUnlockPersonalityMayarPayment(
  transactionId: string,
  testCode: string,
  optionalInvoiceId?: string
) {
  const payment = await prisma.personalityPayment.findUnique({
    where: { transactionId },
    include: { test: true },
  });

  if (!payment) {
    throw new Error('Transaksi pembayaran tidak ditemukan.');
  }

  if (payment.test.testCode.toUpperCase() !== testCode.toUpperCase()) {
    throw new Error('Kode tes kepribadian tidak cocok dengan data transaksi.');
  }

  if (payment.paymentStatus === 'paid') {
    return { isPaid: true, status: 'already_paid', testCode: payment.test.testCode };
  }

  const invoiceId = optionalInvoiceId || payment.gatewayTransactionId;
  if (!invoiceId) {
    throw new Error('Identitas invoice Mayar belum terdaftar untuk transaksi ini.');
  }

  const invoiceDetail: MayarInvoiceDetail = await getMayarInvoiceDetail(invoiceId);

  const isPaid = invoiceDetail.status === 'paid';
  const isAmountValid = invoiceDetail.amount === payment.amount;

  if (!isPaid) {
    return {
      isPaid: false,
      status: invoiceDetail.status || 'unpaid',
      message: 'Pembayaran belum diselesaikan di Mayar.',
      testCode: payment.test.testCode,
    };
  }

  if (!isAmountValid) {
    throw new Error(
      `Nominal pembayaran di Mayar (${invoiceDetail.amount}) tidak sesuai dengan tagihan (${payment.amount}).`
    );
  }

  const paymentMethod =
    invoiceDetail.transactions?.[0]?.paymentMethod || 'MAYAR_VERIFIED';

  const unlockResult = await markPersonalityPaymentSuccessful(
    transactionId,
    paymentMethod,
    invoiceDetail
  );

  return {
    isPaid: true,
    ...unlockResult,
  };
}
