import { optimizeSeo } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, pageType } = body;

    if (!topic || typeof topic !== 'string') {
      return Response.json({ error: 'A topic or target keyword is required' }, { status: 400 });
    }

    const result = await optimizeSeo(topic, pageType || 'Blog post');
    return Response.json(result);
  } catch (error) {
    console.error('SEO optimize error:', error);
    return Response.json({ error: 'Failed to build the SEO plan. Please try again.' }, { status: 500 });
  }
}
