import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { questionOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            categoryCode: true,
            categoryName: true,
            description: true,
            displayOrder: true,
          },
        },
      },
    });

    return NextResponse.json({
      questions,
      total: questions.length,
    });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Gagal memuat pertanyaan.' },
      { status: 500 }
    );
  }
}
