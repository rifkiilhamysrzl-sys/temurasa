import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePersonalityResult, RawAnswerInput } from '@/lib/personality/scoring';
import { PERSONALITY_QUESTIONS } from '@/lib/personality/questions';
import { ARCHETYPES } from '@/lib/personality/archetypes';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testCode, answers } = body;

    if (!testCode) {
      return NextResponse.json({ error: 'testCode diperlukan.' }, { status: 400 });
    }

    const test = await prisma.personalityTest.findUnique({
      where: { testCode: testCode.toUpperCase() },
      include: {
        answers: true,
        result: true,
      },
    });

    if (!test) {
      return NextResponse.json({ error: 'Tes tidak ditemukan.' }, { status: 404 });
    }

    // Format answers into RawAnswerInput
    let rawAnswers: RawAnswerInput[] = [];

    if (Array.isArray(answers) && answers.length > 0) {
      rawAnswers = answers.map((a: any) => ({
        questionIndex: a.questionIndex,
        selectedOptionId: a.selectedOptionId,
      }));
    } else if (typeof answers === 'object' && answers !== null && Object.keys(answers).length > 0) {
      rawAnswers = Object.entries(answers).map(([idx, optId]) => ({
        questionIndex: Number(idx),
        selectedOptionId: String(optId),
      }));
    } else if (test.answers.length > 0) {
      rawAnswers = test.answers.map((a) => ({
        questionIndex: a.questionIndex,
        selectedOptionId: a.optionValue,
      }));
    }

    if (rawAnswers.length < 20) {
      return NextResponse.json(
        { error: 'Mohon lengkapi seluruh pertanyaan sebelum melihat hasil.' },
        { status: 400 }
      );
    }

    // Save/update any answers in database
    for (const ans of rawAnswers) {
      const q = PERSONALITY_QUESTIONS.find((item) => item.id === ans.questionIndex);
      const dimension = q ? q.dimension : 'general';

      await prisma.personalityAnswer.upsert({
        where: {
          testId_questionIndex: {
            testId: test.id,
            questionIndex: ans.questionIndex,
          },
        },
        update: {
          dimension,
          optionValue: ans.selectedOptionId,
        },
        create: {
          testId: test.id,
          questionIndex: ans.questionIndex,
          dimension,
          selectedOption: 0,
          optionValue: ans.selectedOptionId,
        },
      });
    }

    // Run scoring engine
    const calculated = calculatePersonalityResult(test.userName, rawAnswers);

    // Save or update PersonalityResult
    const savedResult = await prisma.personalityResult.upsert({
      where: { testId: test.id },
      update: {
        primaryType: calculated.freePreview.primaryType.title,
        primaryTypeCode: calculated.primaryTypeCode,
        secondaryType: calculated.freePreview.secondaryType.title,
        secondaryTypeCode: calculated.secondaryTypeCode,
        dimensionScores: JSON.stringify(calculated.dimensionScores),
        personalityProfile: JSON.stringify(calculated.fullReport.personalityProfile),
        freePreview: JSON.stringify(calculated.freePreview),
        fullReport: JSON.stringify(calculated.fullReport),
        marriageReadiness: JSON.stringify(calculated.marriageReadiness),
      },
      create: {
        testId: test.id,
        primaryType: calculated.freePreview.primaryType.title,
        primaryTypeCode: calculated.primaryTypeCode,
        secondaryType: calculated.freePreview.secondaryType.title,
        secondaryTypeCode: calculated.secondaryTypeCode,
        dimensionScores: JSON.stringify(calculated.dimensionScores),
        personalityProfile: JSON.stringify(calculated.fullReport.personalityProfile),
        freePreview: JSON.stringify(calculated.freePreview),
        fullReport: JSON.stringify(calculated.fullReport),
        marriageReadiness: JSON.stringify(calculated.marriageReadiness),
      },
    });

    // Mark test status as completed
    await prisma.personalityTest.update({
      where: { id: test.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        targetMarriage: calculated.marriageReadiness.targetHorizon,
      },
    });

    return NextResponse.json({
      success: true,
      testCode: test.testCode,
      userName: test.userName,
      primaryType: calculated.freePreview.primaryType,
      secondaryType: calculated.freePreview.secondaryType,
      dimensionScores: calculated.dimensionScores,
      freePreview: calculated.freePreview,
      marriageReadiness: calculated.marriageReadiness,
      paymentStatus: test.paymentStatus,
      isPaid: test.paymentStatus === 'paid',
    });
  } catch (error: any) {
    console.error('Error submitting personality test:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menghitung hasil tes kepribadian.' },
      { status: 500 }
    );
  }
}
