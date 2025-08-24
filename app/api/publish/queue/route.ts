import { NextRequest, NextResponse } from 'next/server';

type Item = { id: string; platform: string; payload: any; runAt: number };
const Q: Item[] = [];

function id() { return Math.random().toString(36).slice(2); }

export async function POST(req: NextRequest) {
  const { platform, payload, runAt } = await req.json();
  const item = { id: id(), platform, payload, runAt: runAt || Date.now() };
  Q.push(item);
  return NextResponse.json({ ok: true, item });
}

export async function GET() {
  return NextResponse.json({ queue: Q });
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id');
  const idx = Q.findIndex(i=>i.id===id);
  if (idx>-1) Q.splice(idx,1);
  return NextResponse.json({ ok: true });
}

// Export for cron
export const _internalQueue = Q;
