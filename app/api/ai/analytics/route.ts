import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const { metrics, business } = await req.json();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Given these recent social metrics (JSON): ${JSON.stringify(metrics).slice(0, 8000)}
Provide:
- Key insights (what's working / not)
- Hypotheses
- Next 7-day action plan
- 3 content ideas per platform
- Simple forecast for reach & CTR with upper/lower bounds
Business context: ${business || 'SMB / creator brand'}`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: 'You are a pragmatic growth analyst.' }, { role: 'user', content: prompt }]
  });

  return NextResponse.json({ insights: resp.choices[0]?.message?.content || '' });
}
