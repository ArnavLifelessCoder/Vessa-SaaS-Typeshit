import { repurposeContent } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceContent, platforms } = body;

    if (!sourceContent || typeof sourceContent !== 'string') {
      return Response.json(
        { error: 'Source content is required' },
        { status: 400 }
      );
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return Response.json(
        { error: 'At least one platform must be selected' },
        { status: 400 }
      );
    }

    const result = await repurposeContent(sourceContent, platforms);
    return Response.json(result);
  } catch (error) {
    console.error('Content repurpose error:', error);
    return Response.json(
      { error: 'Failed to repurpose content. Please try again.' },
      { status: 500 }
    );
  }
}
