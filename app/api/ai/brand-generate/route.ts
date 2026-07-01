import { generateBrand } from '@/lib/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, vibe } = body;

    if (!description || typeof description !== 'string') {
      return Response.json({ error: 'A business description is required' }, { status: 400 });
    }

    const result = await generateBrand(description, vibe || 'Modern and professional');
    return Response.json(result);
  } catch (error) {
    console.error('Brand generate error:', error);
    return Response.json({ error: 'Failed to generate brand identity. Please try again.' }, { status: 500 });
  }
}
