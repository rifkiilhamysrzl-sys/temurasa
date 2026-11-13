import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ARCHETYPES } from '@/lib/personality/archetypes';
import { ArchetypeCode } from '@/lib/personality/types';

export async function GET(
  request: Request,
  { params }: { params: { testCode: string } }
) {
  try {
    const rawTestCode = params?.testCode;
    if (!rawTestCode) {
      return NextResponse.json({ error: 'Kode tes tidak valid.' }, { status: 400 });
    }

    const testCode = rawTestCode.toUpperCase();

    const test = await prisma.personalityTest.findUnique({
      where: { testCode },
      include: {
        result: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Data tes tidak ditemukan.' }, { status: 404 });
    }

    if (!test.result) {
      return NextResponse.json(
        { error: 'Hasil tes belum tersedia atau tes belum diselesaikan.' },
        { status: 400 }
      );
    }

    const isPaid = test.paymentStatus === 'paid';

    // Parse stored result JSONs
    let freePreview: any = null;
    let fullReport: any = null;
    let dimensionScores: any = [];
    let marriageReadiness: any = null;

    try {
      freePreview = JSON.parse(test.result.freePreview);
    } catch (e) {
      freePreview = null;
    }

    try {
      dimensionScores = JSON.parse(test.result.dimensionScores);
    } catch (e) {
      dimensionScores = [];
    }

    try {
      marriageReadiness = JSON.parse(test.result.marriageReadiness);
    } catch (e) {
      marriageReadiness = null;
    }

    if (isPaid && test.result.fullReport) {
      try {
        fullReport = JSON.parse(test.result.fullReport);
      } catch (e) {
        fullReport = null;
      }
    }

    const primaryType =
      ARCHETYPES[test.result.primaryTypeCode as ArchetypeCode] ||
      ARCHETYPES.secure_lover;
    const secondaryType =
      ARCHETYPES[test.result.secondaryTypeCode as ArchetypeCode] ||
      ARCHETYPES.best_friend;

    return NextResponse.json({
      testCode: test.testCode,
      userName: test.userName,
      status: test.status,
      paymentStatus: test.paymentStatus,
      isPaid,
      primaryType,
      secondaryType,
      dimensionScores,
      marriageReadiness,
      freePreview: freePreview || {
        primaryType,
        secondaryType,
        shortDescription: primaryType.shortDescription,
        relationshipCharacteristics: primaryType.coreCharacteristics.slice(0, 3),
        personalInsight: `Sebagai ${primaryType.title}, kekuatan terbesarmu adalah ketulusan dan kemampuan memberikan rasa aman bagi pasangan.`,
        marriageHorizonLabel: marriageReadiness?.targetHorizonLabel || 'Belum ada target',
      },
      fullReport: isPaid ? fullReport : null,
      generatedAt: test.result.generatedAt,
    });
  } catch (error: any) {
    console.error('Error fetching personality result:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memuat hasil tes kepribadian.' },
      { status: 500 }
    );
  }
}
