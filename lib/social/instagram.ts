export const enabled = false;
const igBusinessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '';
const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '';

// 2-step: create container, then publish
export async function postInstagramImage({ caption, imageUrl, publishAt }: { caption: string; imageUrl: string; publishAt?: number; }) {
  if (!enabled) return { ok: false, reason: 'disabled' };

  const createUrl = `https://graph.facebook.com/v18.0/${igBusinessId}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${token}`;
  const cr = await fetch(createUrl, { method: 'POST' });
  const cj = await cr.json();
  if (!cr.ok) return { ok: false, data: cj };

  // schedule is only for some endpoints; otherwise publish immediately
  const publishUrl = `https://graph.facebook.com/v18.0/${igBusinessId}/media_publish?creation_id=${cj.id}&access_token=${token}`;
  const pr = await fetch(publishUrl, { method: 'POST' });
  const pj = await pr.json();
  return { ok: pr.ok, data: pj };
}
