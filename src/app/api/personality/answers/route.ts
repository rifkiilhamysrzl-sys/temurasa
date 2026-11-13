import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { PERSONALITY_QUESTIONS } from '@/lib/personality/questions';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const testCode = url.searchParams.get('testCode')?.toUpperCase();

    if (!testCode) {
      return NextResponse.json({ error: 'testCode diperlukan.' }, { status: 400 });
    }

    const test = await prisma.personalityTest.findUnique({
      where: { testCode },
      include: {
        answers: {
          orderBy: { questionIndex: 'asc' },
        },
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Tes tidak ditemukan.' }, { status: 404 });
    }

    const answerMap: Record<number, string> = {};
    for (const ans of test.answers) {
      answerMap[ans.questionIndex] = ans.optionValue;
    }

    return NextResponse.json({
      testCode: test.testCode,
      userName: test.userName,
      status: test.status,
      paymentStatus: test.paymentStatus,
      answers: answerMap,
    });
  } catch (error: any) {
    console.error('Error fetching answers:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memuat jawaban.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testCode, answers } = body;

    if (!testCode) {
      return NextResponse.json({ error: 'testCode diperlukan.' }, { status: 400 });
    }

    const test = await prisma.personalityTest.findUnique({
      where: { testCode: testCode.toUpperCase() },
    });

    if (!test) {
      return NextResponse.json({ error: 'Tes tidak ditemukan.' }, { status: 404 });
    }

    // answers can be an array: [{ questionIndex, selectedOptionId }] or object { 1: "1a" }
    const answerEntries: Array<{ questionIndex: number; selectedOptionId: string }> = Array.isArray(answers)
      ? answers
      : Object.entries(answers || {}).map(([idx, optId]) => ({
          questionIndex: Number(idx),
          selectedOptionId: String(optId),
        }));

    // Upsert each answer
    for (const entry of answerEntries) {
      const qNum = entry.questionIndex;
      const question = PERSONALITY_QUESTIONS.find((q) => q.id === qNum);
      const dimension = question ? question.dimension : 'general';

      await prisma.personalityAnswer.upsert({
        where: {
          testId_questionIndex: {
            testId: test.id,
            questionIndex: qNum,
          },
        },
        update: {
          dimension,
          selectedOption: 0,
          optionValue: entry.selectedOptionId,
        },
        create: {
          testId: test.id,
          questionIndex: qNum,
          dimension,
          selectedOption: 0,
          optionValue: entry.selectedOptionId,
        },
      });
    }

    return NextResponse.json({ success: true, count: answerEntries.length });
  } catch (error: any) {
    console.error('Error saving answers:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan jawaban.' },
      { status: 500 }
    );
  }
}
