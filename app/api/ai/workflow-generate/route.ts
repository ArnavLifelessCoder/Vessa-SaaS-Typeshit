import { generateWorkflow } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessType, clientName, clientGoals, budget } = body;

    if (!businessType || !clientName || !clientGoals) {
      return Response.json(
        { error: 'Business type, client name, and client goals are required' },
        { status: 400 }
      );
    }

    const result = await generateWorkflow(businessType, clientName, clientGoals, budget);
    return Response.json(result);
  } catch (error) {
    console.error('Workflow generation error:', error);
    return Response.json(
      { error: 'Failed to generate workflow. Please try again.' },
      { status: 500 }
    );
  }
}
