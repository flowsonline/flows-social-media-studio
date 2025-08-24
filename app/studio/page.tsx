'use client';

import { useEffect, useState } from 'react';
import StudioEditor from '@/components/StudioEditor';
import PlanGate from '@/components/PlanGate';

export default function StudioPage() {
  const [palette, setPalette] = useState<string[]>([]);
  const [sample, setSample] = useState<string>('');

  useEffect(()=>{
    // Try to pull first gallery image palette
    fetch('/api/flows/gallery').then(r=>r.json()).then(async (data)=>{
      const first = data.images?.[0]?.url || data.images?.[0]?.imageUrl;
      if (first) {
        setSample(first);
        const p = await fetch('/api/flows/palette?imageUrl='+encodeURIComponent(first)).then(r=>r.json());
        setPalette(p.colors || []);
      }
    }).catch(()=>{});
  },[]);

  return (
    <PlanGate need="creator">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Studio Editor</h1>
        <p className="opacity-80">Preset sizes for IG/FB/TikTok/LinkedIn/X. Pull palettes from your generated images.</p>
      </div>
      <StudioEditor palette={palette} />
    </PlanGate>
  );
}
