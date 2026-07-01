import { extractInsights } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceText } = body;

    if (!sourceText || typeof sourceText !== 'string') {
      return Response.json({ error: 'Source text is required' }, { status: 400 });
    }
    if (sourceText.length < 50) {
      return Response.json(
        { error: 'Please provide at least 50 characters to analyze' },
        { status: 400 }
      );
    }

    const result = await extractInsights(sourceText);
    return Response.json(result);
  } catch (error) {
    console.error('Insights extraction error:', error);
    return Response.json({ error: 'Failed to extract insights. Please try again.' }, { status: 500 });
  }
}
