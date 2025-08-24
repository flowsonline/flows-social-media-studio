import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { brand, industry, goal, audience, tone } = body;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are an AI ad strategist. Create a concise plan:
1) Market trend scan for ${industry}
2) Audience segments for ${audience}
3) Platform-by-platform recommendations (IG, FB, LinkedIn, X, TikTok)
4) 3 ad copy variations per platform in tone: ${tone || 'confident, modern'}
5) Visual concepts (describe) + prompts for image generator
6) KPI targets & quick A/B test plan
Goal: ${goal}. Brand: ${brand}.`;

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: 'Be concrete and actionable.' }, { role: 'user', content: prompt }]
  });

  return NextResponse.json({ plan: resp.choices[0]?.message?.content || '' });
}
