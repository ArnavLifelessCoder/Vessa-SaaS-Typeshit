import { generateProposal } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, prospect, projectDetails } = body;

    if (!service || !prospect || !projectDetails) {
      return Response.json(
        { error: 'Service, prospect, and project details are required' },
        { status: 400 }
      );
    }

    const result = await generateProposal(service, prospect, projectDetails);
    return Response.json(result);
  } catch (error) {
    console.error('Proposal generation error:', error);
    return Response.json({ error: 'Failed to generate proposal. Please try again.' }, { status: 500 });
  }
}
