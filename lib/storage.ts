type Asset = { id: string; url: string; tags: string[]; createdAt: number; title?: string; palette?: string[] };

const db: Record<string, Asset> = {};

function id() { return Math.random().toString(36).slice(2); }

export const Storage = {
  async listAssets(q?: string) {
    const arr = Object.values(db).sort((a,b)=>b.createdAt-a.createdAt);
    if (!q) return arr;
    const s = q.toLowerCase();
    return arr.filter(a => (a.title||'').toLowerCase().includes(s) || a.tags.join(' ').toLowerCase().includes(s));
  },
  async addAsset(url: string, meta?: Partial<Asset>) {
    const _id = id();
    db[_id] = { id: _id, url, tags: [], createdAt: Date.now(), ...meta };
    return db[_id];
  },
  async tagAsset(id: string, tags: string[]) {
    if (db[id]) db[id].tags = tags;
    return db[id];
  },
  async get(id: string) { return db[id]; }
};
