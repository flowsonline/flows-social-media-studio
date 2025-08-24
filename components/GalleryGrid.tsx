'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Item = { id?: string; url: string; palette?: string[] };

export default function GalleryGrid({ onPick }:{ onPick?: (url: string)=>void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState('');

  useEffect(()=>{
    fetch('/api/flows/gallery').then(r=>r.json()).then(data=>{
      const arr: Item[] = data.images?.map((x:any)=> ({ id: x.id||x._id, url: x.url||x.imageUrl })) || [];
      setItems(arr);
    }).catch(()=>{});
  },[]);

  const filtered = items.filter(i => i.url.includes(q));

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <input className="input flex-1" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filtered.map((it, idx)=>(
          <button key={idx} className="relative aspect-square overflow-hidden rounded-xl group border border-white/10" onClick={()=>onPick?.(it.url)}>
            <Image src={it.url} alt="" fill className="object-cover group-hover:scale-105 transition-transform"/>
          </button>
        ))}
      </div>
    </div>
  );
}
