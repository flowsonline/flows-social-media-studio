'use client';

import { useEffect, useState } from 'react';
import { getWixClient } from '@/lib/wixClient';
import Link from 'next/link';

export default function Callback() {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string|undefined>();

  useEffect(() => {
    const run = async () => {
      try {
        const wix = getWixClient();
        const stored = localStorage.getItem('wix-oauth');
        const data = stored ? JSON.parse(stored) : undefined;
        const { memberTokens, sessionToken } = await wix.auth.parseFromUrl();
        if (memberTokens) {
          // Persist tokens in SDK
          wix.auth.setTokens(memberTokens);
          setOk(true);
          // Return to original URL if present
          const dest = data?.originalUri || '/';
          window.location.replace(dest);
        } else {
          setError('No tokens returned');
        }
      } catch (e:any) {
        setError(e?.message || 'Login failed');
      }
    };
    run();
  }, []);

  if (error) {
    return <div className="max-w-lg mx-auto mt-24 p-8 card">
      <h1 className="text-2xl font-semibold text-red-400">Login error</h1>
      <p className="mt-3">{error}</p>
      <Link className="btn mt-6" href="/login">Try again</Link>
    </div>;
  }

  return <div className="max-w-lg mx-auto mt-24 p-8 card">Completing login…</div>;
}
