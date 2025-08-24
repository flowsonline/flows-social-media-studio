import { z } from 'zod';

export const enabled = false; // set true after configuring tokens
const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';
const pageId = process.env.FACEBOOK_PAGE_ID || '';

export async function postFacebookImage({ caption, imageUrl, scheduledPublishTime }: { caption: string; imageUrl: string; scheduledPublishTime?: number; }) {
  if (!enabled) return { ok: false, reason: 'disabled' };
  const url = `https://graph.facebook.com/v18.0/${pageId}/photos`;
  const body: any = { url: imageUrl, caption, access_token: token };
  if (scheduledPublishTime) { body.published = false; body.scheduled_publish_time = scheduledPublishTime; }
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json();
  return { ok: res.ok, data };
}
