'use client';

import { createClient, OAuthStrategy } from '@wix/sdk';
import * as members from '@wix/members';
import * as plans from '@wix/pricing-plans';

export function getWixClient() {
  // Default to BYPASS if no Wix client ID found, so zero-config testing works.
  const inferredMode = process.env.NEXT_PUBLIC_WIX_CLIENT_ID ? 'wix' : 'bypass';
  const mode = process.env.NEXT_PUBLIC_AUTH_MODE || inferredMode;

  if (mode === 'bypass') {
    return {
      auth: {
        generateOAuthData: () => ({} as any),
        getAuthUrl: async () => ({ authUrl: '' } as any),
        parseFromUrl: async () => ({}) as any,
        setTokens: () => {}
      },
      members: { getCurrentMember: async () => ({ member: null }) },
      plans: {
        orders: { queryOrders: () => ({ find: async () => ({ items: [] }) }) },
        plans: { queryPlans: () => ({ find: async () => ({ items: [] }) }) }
      }
    } as any;
  }

  const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID!;
  if (!clientId) throw new Error('Missing NEXT_PUBLIC_WIX_CLIENT_ID');
  return createClient({
    auth: OAuthStrategy({ clientId }),
    modules: { members, plans },
  });
}
