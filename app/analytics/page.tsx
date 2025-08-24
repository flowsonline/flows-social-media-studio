'use client';

import { useState } from 'react';
import PlanGate from '@/components/PlanGate';

export default function AnalyticsPage() {
  const [text, setText] = useState('');
  const [insights, setInsights] = useState('');

  async function analyze() {
    let metrics;
    try {
      metrics = JSON.parse(text);
    } catch {
      alert('Paste JSON metrics.');
      return;
    }
    const res = await fetch('/api/ai/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ metrics }) });
    const data = await res.json();
    setInsights(data.insights || 'Error');
  }

  return (
    <PlanGate need="business">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold">Analytics Insights</h1>
        <p className="opacity-80">Paste JSON metrics (or wire provider tokens in <code>lib/social/*</code> and extend to fetch automatically).</p>
        <textarea className="input w-full h-48 mt-4 font-mono text-xs" placeholder='[{"platform":"instagram","reach":12000,"impressions":18000,"clicks":350,"ctr":1.9,"engagementRate":3.1,"conversions":12}]' value={text} onChange={e=>setText(e.target.value)} />
        <button className="btn mt-4" onClick={analyze}>Analyze</button>
        {insights && <pre className="card p-4 mt-6 whitespace-pre-wrap text-sm">{insights}</pre>}
      </div>
    </PlanGate>
  );
}
