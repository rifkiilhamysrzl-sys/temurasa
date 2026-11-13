import { NextResponse } from 'next/server';
import { initializePersonalityPayment } from '@/lib/personality/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testCode, payerName, payerEmail, payerMobile } = body;

    if (!testCode) {
      return NextResponse.json(
        { error: 'Kode tes kepribadian wajib disertakan.' },
        { status: 400 }
      );
    }

    // Strict validation of payer details (Mayar V2 requirements)
    const cleanName = typeof payerName === 'string' ? payerName.trim() : '';
    if (!cleanName || cleanName.length < 3) {
      return NextResponse.json(
        { error: 'Mohon masukkan nama lengkap untuk keperluan invoice pembayaran.' },
        { status: 400 }
      );
    }

    const cleanEmail = typeof payerEmail === 'string' ? payerEmail.trim().toLowerCase() : '';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Alamat email valid wajib diisi untuk bukti pembayaran.' },
        { status: 400 }
      );
    }

    let cleanMobile = typeof payerMobile === 'string' ? payerMobile.replace(/[^0-9]/g, '') : '';
    if (cleanMobile.startsWith('62')) {
      cleanMobile = '0' + cleanMobile.slice(2);
    }

    if (!cleanMobile || cleanMobile.length < 10 || cleanMobile.length > 15) {
      return NextResponse.json(
        { error: 'Nomor WhatsApp / HP wajib diisi minimal 10 digit angka valid (contoh: 081234567890).' },
        { status: 400 }
      );
    }

    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const appBaseUrl = host ? `${protocol}://${host}` : undefined;

    const paymentResult = await initializePersonalityPayment({
      testCode: testCode.toUpperCase(),
      payerName: cleanName,
      payerEmail: cleanEmail,
      payerMobile: cleanMobile,
      appBaseUrl,
    });

    return NextResponse.json({
      success: true,
      ...paymentResult,
    });
  } catch (error: any) {
    console.error('Error creating personality payment:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal membuat tagihan pembayaran.' },
      { status: 400 }
    );
  }
}
