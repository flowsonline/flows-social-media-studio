'use client';

import { useState } from 'react';
import PlanGate from '@/components/PlanGate';

export default function AdsPage() {
  const [form, setForm] = useState({ brand: '', industry: '', goal: 'Sales', audience: 'US SMBs', tone: 'confident, modern' });
  const [plan, setPlan] = useState<string>('');

  async function generate() {
    setPlan('');
    const res = await fetch('/api/ai/ad-strategy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    setPlan(data.plan || 'Error');
  }

  return (
    <PlanGate need="creator">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">AI Ad Strategy</h1>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {Object.entries(form).map(([k,v])=> (
            <input key={k} className="input" placeholder={k} value={v as string} onChange={e=>setForm({ ...form, [k]: e.target.value })} />
          ))}
        </div>
        <button className="btn mt-4" onClick={generate}>Generate Plan</button>
        {plan && <pre className="card p-4 mt-6 whitespace-pre-wrap text-sm">{plan}</pre>}
      </div>
    </PlanGate>
  );
}
