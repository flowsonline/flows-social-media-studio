import { NextRequest, NextResponse } from 'next/server';
import { fetchGallery } from '@/lib/flows';

export async function GET(req: NextRequest) {
  const page = Number(new URL(req.url).searchParams.get('page') || '1');
  const data = await fetchGallery(page);
  return NextResponse.json(data);
}
