import Vibrant from 'node-vibrant';
import { CONFIG } from './config';

export async function fetchGallery(page = 1) {
  // Try a best-guess gallery endpoint; otherwise, fall back to a simple list wrapper.
  const url = `${CONFIG.FLOWS_BASE_URL}/api/gallery?page=${page}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch {}
  // Fallback: assume generator exposes a simple JSON at /api/history or /api/images
  for (const path of ['/api/history', '/api/images']) {
    try {
      const r = await fetch(`${CONFIG.FLOWS_BASE_URL}${path}`, { next: { revalidate: 60 } });
      if (r.ok) return r.json();
    } catch {}
  }
  return { images: [] };
}

export async function fetchPaletteForImage(imageUrl: string) {
  // First attempt: ask generator for palette directly
  try {
    const res = await fetch(`${CONFIG.FLOWS_BASE_URL}/api/palette?imageUrl=${encodeURIComponent(imageUrl)}`);
    if (res.ok) return res.json();
  } catch {}

  // Fallback: extract palette server-side
  const buffer = await fetch(imageUrl).then(r => r.arrayBuffer());
  const palette = await Vibrant.from(Buffer.from(buffer)).getPalette();
  const colors = Object.values(palette)
    .filter(Boolean)
    .map((swatch: any) => swatch.getHex());
  return { colors };
}
