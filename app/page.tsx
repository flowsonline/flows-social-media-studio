'use client';

import Link from 'next/link';
import { usePlanGate } from '@/components/PlanGate';

export default function Home() {
  const { member, gate } = usePlanGate();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card p-8">
        <h1 className="text-4xl font-extrabold">FLOWS Social Media Studio</h1>
        <p className="opacity-80 mt-3">Seamless with your Flows Image Generator. Gated by your Wix membership plans.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/studio" className="btn">Open Studio</Link>
          <Link href="/gallery" className="btn">Gallery</Link>
          <Link href="/ads" className="btn">Ad Strategy</Link>
        </div>
        <div className="mt-6 text-sm opacity-70">
          {member ? <>Logged in as <b>{member?.profile?.nickname || member?.loginEmail}</b> — plan: <b>{gate}</b></> : <>Not logged in. <Link className="underline" href="/login">Log in</Link></>}
        </div>
      </div>
      <div className="card p-8">
        <h2 className="text-2xl font-bold">What’s inside</h2>
        <ul className="mt-3 space-y-2 list-disc list-inside opacity-90">
          <li>Canvas editor (text, shapes, stickers, image import)</li>
          <li>Auto palettes from your generated images</li>
          <li>Asset tagging & search</li>
          <li>Cross‑posting API stubs + scheduler</li>
          <li>AI Ad Strategy & AI Analytics</li>
        </ul>
      </div>
    </div>
  );
}
