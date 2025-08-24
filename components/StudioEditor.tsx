'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

type Size = { w: number; h: number; label: string };
const PRESETS: Size[] = [
  { label: 'Instagram Post (1:1 1080)', w: 1080, h: 1080 },
  { label: 'Instagram Story (9:16 1080x1920)', w: 1080, h: 1920 },
  { label: 'Reel / TikTok (9:16 1080x1920)', w: 1080, h: 1920 },
  { label: 'LinkedIn (1200x627)', w: 1200, h: 627 },
  { label: 'Twitter/X (1600x900)', w: 1600, h: 900 },
];

export default function StudioEditor({ palette }: { palette?: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [bg, setBg] = useState<string | undefined>(palette?.[0]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, { backgroundColor: '#111', selection: true });
    setCanvas(c);
    // default text
    const text = new fabric.Textbox('Your Headline', { left: 60, top: 60, fill: '#fff', fontSize: 64, fontWeight: 'bold' });
    c.add(text);
    return () => c.dispose();
  }, []);

  useEffect(()=>{
    if (canvas && bg) {
      canvas.setBackgroundColor(bg, ()=> canvas.renderAll());
    }
  }, [bg, canvas]);

  function addText() {
    if (!canvas) return;
    const t = new fabric.Textbox('New text', { left: 80, top: 120, fill: '#fff', fontSize: 36 });
    canvas.add(t);
    canvas.setActiveObject(t);
  }

  function addShape(kind: 'rect'|'circle') {
    if (!canvas) return;
    const obj = kind === 'rect'
      ? new fabric.Rect({ left: 100, top: 200, width: 220, height: 140, rx: 24, ry: 24, fill: '#ffffff22', stroke: '#fff', strokeWidth: 2 })
      : new fabric.Circle({ left: 130, top: 260, radius: 90, fill: '#ffffff22', stroke: '#fff', strokeWidth: 2 });
    canvas.add(obj);
  }

  function importImage(url: string) {
    if (!canvas) return;
    fabric.Image.fromURL(url, (img) => {
      img.set({ left: 80, top: 300, selectable: true, clipPath: undefined });
      img.scaleToWidth(640);
      canvas.add(img);
    }, { crossOrigin: 'anonymous' });
  }

  async function exportPNG() {
    if (!canvas) return;
    const data = canvas.toDataURL({ format: 'png', quality: 1 });
    const a = document.createElement('a');
    a.href = data;
    a.download = 'post.png';
    a.click();
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3 card p-4 space-y-4">
        <div>
          <div className="font-semibold mb-2">Canvas</div>
          <select className="input w-full" onChange={(e)=>{
            const size = PRESETS.find(p=>p.label===e.target.value) || PRESETS[0];
            if (!canvas) return;
            canvas.setDimensions({ width: size.w, height: size.h });
            canvas.renderAll();
          }}>
            {PRESETS.map(p=> <option key={p.label}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <div className="font-semibold mb-2">Palette</div>
          <div className="flex gap-2 flex-wrap">
            {(palette||['#121212','#ffffff']).map(c=> (
              <button key={c} style={{ background: c }} className="w-7 h-7 rounded-full border border-white/30" onClick={()=>setBg(c)} />
            ))}
          </div>
        </div>
        <div className="space-x-2">
          <button className="btn" onClick={addText}>Add Text</button>
          <button className="btn" onClick={()=>addShape('rect')}>Rect</button>
          <button className="btn" onClick={()=>addShape('circle')}>Circle</button>
        </div>
        <div>
          <input id="imgurl" className="input w-full" placeholder="Paste image URL and click Import" />
          <button className="btn mt-2" onClick={()=>{
            const url = (document.getElementById('imgurl') as HTMLInputElement).value;
            if (url) importImage(url);
          }}>Import Image</button>
        </div>
        <div>
          <button className="btn w-full" onClick={exportPNG}>Export PNG</button>
        </div>
      </div>
      <div className="col-span-9 card p-4">
        <div className="relative w-full overflow-auto">
          <canvas ref={canvasRef} width={1080} height={1080} />
        </div>
      </div>
    </div>
  );
}
