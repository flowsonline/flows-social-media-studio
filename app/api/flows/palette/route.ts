import { NextRequest, NextResponse } from 'next/server';
import { fetchPaletteForImage } from '@/lib/flows';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get('imageUrl');
  if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 });
  const data = await fetchPaletteForImage(imageUrl);
  return NextResponse.json(data);
}
