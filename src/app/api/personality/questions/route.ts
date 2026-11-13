import { NextResponse } from 'next/server';
import { PERSONALITY_QUESTIONS } from '@/lib/personality/questions';

export async function GET() {
  return NextResponse.json({
    total: PERSONALITY_QUESTIONS.length,
    questions: PERSONALITY_QUESTIONS.map((q) => ({
      id: q.id,
      dimension: q.dimension,
      dimensionName: q.dimensionName,
      scenario: q.scenario,
      questionText: q.questionText,
      options: q.options.map((o) => ({
        id: o.id,
        label: o.label,
        sublabel: o.sublabel,
      })),
    })),
  });
}
