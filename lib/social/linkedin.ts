export const enabled = false;
const accessToken = process.env.LINKEDIN_ACCESS_TOKEN || '';
const organizationUrn = process.env.LINKEDIN_ORGANIZATION_URN || ''; // e.g., urn:li:organization:123

export async function postLinkedIn({ text, imageUrl }: { text: string; imageUrl?: string; }) {
  if (!enabled) return { ok: false, reason: 'disabled' };

  const headers = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
  // Simplified text post
  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      author: organizationUrn || 'urn:li:person:me',
      lifecycleState: 'PUBLISHED',
      specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: 'NONE' } },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    })
  });
  return { ok: res.ok, data: await res.json() };
}
