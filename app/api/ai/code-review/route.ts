import { reviewCode } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code || typeof code !== 'string') {
      return Response.json({ error: 'Code is required' }, { status: 400 });
    }
    if (code.length < 20) {
      return Response.json({ error: 'Please paste a bit more code to review' }, { status: 400 });
    }

    const result = await reviewCode(code, language || 'Auto-detect');
    return Response.json(result);
  } catch (error) {
    console.error('Code review error:', error);
    return Response.json({ error: 'Failed to review the code. Please try again.' }, { status: 500 });
  }
}
