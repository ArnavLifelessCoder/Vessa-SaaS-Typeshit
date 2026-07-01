import { reviewContract } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractText } = body;

    if (!contractText || typeof contractText !== 'string') {
      return Response.json(
        { error: 'Contract text is required' },
        { status: 400 }
      );
    }

    if (contractText.length < 50) {
      return Response.json(
        { error: 'Please provide a longer contract text (at least 50 characters)' },
        { status: 400 }
      );
    }

    const result = await reviewContract(contractText);
    return Response.json(result);
  } catch (error) {
    console.error('Contract review error:', error);
    return Response.json(
      { error: 'Failed to review contract. Please try again.' },
      { status: 500 }
    );
  }
}
