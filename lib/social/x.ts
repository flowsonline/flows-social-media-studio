export const enabled = false;
const bearer = process.env.X_BEARER_TOKEN || '';

export async function postX({ text }: { text: string; }) {
  if (!enabled) return { ok: false, reason: 'disabled' };
  const res = await fetch('https://api.x.com/2/tweets', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${bearer}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return { ok: res.ok, data: await res.json() };
}
