import { NextResponse } from 'next/server';
import { _internalQueue as Q } from '@/app/api/publish/queue/route';
import { postFacebookImage } from '@/lib/social/facebook';
import { postInstagramImage } from '@/lib/social/instagram';
import { postLinkedIn } from '@/lib/social/linkedin';
import { postX } from '@/lib/social/x';

export async function GET() {
  const now = Date.now();
  const due = Q.filter(i => i.runAt <= now);
  let results: any[] = [];

  for (const job of due) {
    let res: any = { ok: false, data: { reason: 'unsupported' } };
    try {
      if (job.platform === 'facebook') res = await postFacebookImage(job.payload);
      if (job.platform === 'instagram') res = await postInstagramImage(job.payload);
      if (job.platform === 'linkedin') res = await postLinkedIn(job.payload);
      if (job.platform === 'x') res = await postX(job.payload);
    } catch (e: any) {
      res = { ok: false, error: e?.message };
    }
    results.push({ id: job.id, platform: job.platform, res });
  }

  // remove processed
  for (const j of due) {
    const idx = Q.findIndex(x => x.id === j.id);
    if (idx > -1) Q.splice(idx, 1);
  }

  return NextResponse.json({ processed: results });
}
