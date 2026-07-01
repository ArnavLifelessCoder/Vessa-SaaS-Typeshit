import { draftReplies } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalMessage, intent } = body;

    if (!originalMessage || typeof originalMessage !== 'string') {
      return Response.json({ error: 'The original message is required' }, { status: 400 });
    }
    if (!intent || typeof intent !== 'string') {
      return Response.json({ error: 'Please describe how you want to reply' }, { status: 400 });
    }

    const result = await draftReplies(originalMessage, intent);
    return Response.json(result);
  } catch (error) {
    console.error('Reply draft error:', error);
    return Response.json({ error: 'Failed to draft replies. Please try again.' }, { status: 500 });
  }
}
