'use client';

import { useEffect, useState } from 'react';
import { getWixClient } from '@/lib/wixClient';

type Gate = 'free' | 'creator' | 'business';

function levelFromEnv(): Gate {
  const raw = (process.env.NEXT_PUBLIC_BYPASS_GATE_LEVEL || 'business').toLowerCase();
  if (raw === 'creator') return 'creator';
  if (raw === 'free') return 'free';
  return 'business';
}

export function usePlanGate(): { ready: boolean; gate: Gate; member?: any } {
  const [ready, setReady] = useState(false);
  const [gate, setGate] = useState<Gate>('free');
  const [member, setMember] = useState<any>();

  useEffect(() => {
    const mode = process.env.NEXT_PUBLIC_AUTH_MODE || 'wix';
    if (mode === 'bypass') {
      setGate(levelFromEnv());
      setReady(true);
      return;
    }

    const run = async () => {
      try {
        const wix = getWixClient();
        const who = await wix.members.getCurrentMember();
        setMember(who.member);
        const orders = await wix.plans.orders.queryOrders().find();
        const active = orders.items?.filter((o:any)=>o.status==='ACTIVE') || [];
        const planIds = active.map((o:any)=>o.planId);
        const CREATOR = process.env.NEXT_PUBLIC_WIX_PLAN_ID_CREATOR || '';
        const BUSINESS = process.env.NEXT_PUBLIC_WIX_PLAN_ID_BUSINESS_PRO || '';
        if (BUSINESS && planIds.includes(BUSINESS)) setGate('business');
        else if (CREATOR && planIds.includes(CREATOR)) setGate('creator');
        else setGate('free');
      } catch (e) {
        setGate('free');
      } finally {
        setReady(true);
      }
    };
    run();
  }, []);

  return { ready, gate, member };
}

export default function PlanGate({ need, children }: { need: Gate; children: any }) {
  const { ready, gate } = usePlanGate();

  if (!ready) return <div className="max-w-3xl mx-auto mt-24 p-8 card">Checking access…</div>;
  const score = (g: Gate) => g==='business'?2 : g==='creator'?1 : 0;
  if (score(gate) < score(need)) {
    return <div className="max-w-3xl mx-auto mt-24 p-8 card">
      <h2 className="text-2xl font-semibold mb-2">This area is locked</h2>
      <p className="opacity-80">You don’t currently have access to this feature.</p>
      <p className="opacity-60 mt-2 text-sm">If you’re in test mode, set <code>NEXT_PUBLIC_AUTH_MODE=bypass</code> and <code>NEXT_PUBLIC_BYPASS_GATE_LEVEL</code> to <code>{need}</code> in your env.</p>
    </div>;
  }
  return children;
}
