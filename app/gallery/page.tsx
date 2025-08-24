'use client';

import GalleryGrid from '@/components/GalleryGrid';
import StudioEditor from '@/components/StudioEditor';
import { useState } from 'react';

export default function GalleryPage() {
  const [picked, setPicked] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);

  async function pick(url: string) {
    setPicked(url);
    const p = await fetch('/api/flows/palette?imageUrl='+encodeURIComponent(url)).then(r=>r.json());
    setPalette(p.colors || []);
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <h1 className="text-3xl font-bold mb-2">Gallery</h1>
        <p className="opacity-80 mb-4">Images are read from your Flows Image Generator. Click any image to load its palette and start editing.</p>
      </div>
      <div className="col-span-12 lg:col-span-5 card p-4">
        <GalleryGrid onPick={pick} />
      </div>
      <div className="col-span-12 lg:col-span-7 card p-4">
        {picked ? <StudioEditor palette={palette} /> : <div className="opacity-70">Pick an image to start</div>}
      </div>
    </div>
  );
}
