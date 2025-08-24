'use client';

import { useEffect, useState } from 'react';
import { getWixClient } from '@/lib/wixClient';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const redirectUri = process.env.NEXT_PUBLIC_WIX_REDIRECT_URI!;

  async function startLogin() {
    setLoading(true);
    const wix = getWixClient();

    // Generate PKCE + state
    const odata = wix.auth.generateOAuthData({
      redirectUri,
      originalUri: window.location.origin + '/',
    });
    localStorage.setItem('wix-oauth', JSON.stringify(odata));

    // Get Wix-managed login URL and redirect
    const { authUrl } = await wix.auth.getAuthUrl(odata);
    window.location.href = authUrl!;
  }

  return (
    <div className="max-w-lg mx-auto mt-24 p-8 card">
      <h1 className="text-3xl font-bold mb-4">Sign in with Wix</h1>
      <p className="opacity-80 mb-6">Use your FLOWS website account to access the Social Media Studio.</p>
      <button onClick={startLogin} className="btn w-full" disabled={loading}>
        {loading ? 'Redirecting…' : 'Continue with Wix'}
      </button>
    </div>
  );
}
