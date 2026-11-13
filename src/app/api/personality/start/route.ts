import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userName, userEmail, userGender, targetMarriage } = body;

    const trimmedName = typeof userName === 'string' ? userName.trim() : '';
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { error: 'Mohon masukkan nama atau panggilan kamu (minimal 2 karakter).' },
        { status: 400 }
      );
    }

    // Generate unique test code: PRS-XXXXX
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const testCode = `PRS-${randomHex}`;

    // Generate session access token
    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const test = await prisma.personalityTest.create({
      data: {
        testCode,
        accessTokenHash: tokenHash,
        userName: trimmedName,
        userEmail: typeof userEmail === 'string' ? userEmail.trim().toLowerCase() : null,
        userGender: typeof userGender === 'string' ? userGender : null,
        targetMarriage: typeof targetMarriage === 'string' ? targetMarriage : null,
        status: 'in_progress',
        paymentStatus: 'unpaid',
      },
    });

    return NextResponse.json({
      success: true,
      testCode: test.testCode,
      accessToken: rawToken,
      userName: test.userName,
    });
  } catch (error: any) {
    console.error('Error starting personality test:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memulai tes kepribadian.' },
      { status: 500 }
    );
  }
}
