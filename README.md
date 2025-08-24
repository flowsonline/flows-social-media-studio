# FLOWS Social Media Studio (Next.js + Wix Headless)

A drop-in, Vercel-deployable app that:

- Authenticates **Wix members** via **Wix Headless (OAuth + PKCE)** and **gates features by plan** (Free / Creator / Business Pro).
- Integrates with your **Flows Image Generator** at `https://flows-image-generator.vercel.app/` to **pull generated images & color palettes**.
- Includes a **visual post editor** (Fabric.js) with text/shapes/stickers, IG/FB/TikTok/LinkedIn/X presets, palette-aware color picker.
- Lets members **organize, tag, and search** their assets & upload images.
- Provides an **AI Ad Strategy** tool & **AI Analytics Insights** using your `OPENAI_API_KEY`.
- Ships with **publish & schedule stubs** for all major social APIs and a **Vercel cron worker** (`/api/cron/publish`) for queued posts.

> QUICK DEPLOY (Vercel): set env vars from `.env.example`, then `npm i && npm run build && npm start` (or deploy via Vercel UI).


## 1) Wix Headless Setup (Members + Plans)

1. In your Wix **Headless Settings**, create an **OAuth app for Visitors & Members** and copy the **Client ID**.  
2. Add an **Allowed Redirect URI**:  
   - `http://localhost:3000/auth/callback` (dev)  
   - `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback` (prod)
3. Set env vars:
   - `NEXT_PUBLIC_WIX_CLIENT_ID`
   - `NEXT_PUBLIC_WIX_REDIRECT_URI` (must exactly match a redirect)
   - (Optional) `NEXT_PUBLIC_WIX_PLAN_ID_CREATOR`, `NEXT_PUBLIC_WIX_PLAN_ID_BUSINESS_PRO` (from Pricing Plans).
4. Publish your Wix site once so the **Wix-managed login page** works.

The login flow is handled with the **Wix JS SDK** and PKCE as shown in Wix docs. See _Handle Members with Wix‑Managed Login (JS SDK)_ and _Create a Client with OAuth_.

## 2) Flows Image Generator Integration

By default, the Studio calls your generator for **gallery** and **palette** endpoints via `/api/flows/*`.  
If the generator doesn’t expose palettes, the Studio falls back to **server-side palette extraction** (Vibrant).

Configure:
- `NEXT_PUBLIC_FLOWS_BASE_URL=https://flows-image-generator.vercel.app`

## 3) Storage

The app ships with an in-memory store (dev only). For production, set one of:
- **Vercel Blob** → `BLOB_READ_WRITE_TOKEN`
- **Supabase** → `SUPABASE_URL`, `SUPABASE_ANON_KEY`

## 4) Social Publishing

Each provider has a connector in `lib/social/*`. Add your tokens and flip the `ENABLED` flags inside those files.

- **Facebook / Instagram**: Meta Graph API (image publishing & scheduling).  
- **LinkedIn**: Shares API.  
- **X (Twitter)**: v2 API with `oauth 2.0` app token.  
- **TikTok**: Business Content Posting API.

Use the Studio’s **Schedule** tab to queue posts. A Vercel cron calls `/api/cron/publish` every 15 minutes.

## 5) AI Features

- **Ad Strategy** → `/ads` uses OpenAI (`OPENAI_API_KEY`) to generate market analysis, audience targeting, ad copy, and creative prompts.  
- **Analytics Insights** → `/analytics` accepts CSV/JSON with metrics (reach, impressions, clicks, CTR, ER%, conversions) and produces tailored guidance & simple forecasting.

## 6) Zero‑Code Deploy on Vercel

1. Create a Vercel account (Google login is fine).
2. Click **New Project → Import → Upload** and drop this folder (zip is OK).
3. No env vars needed for testing: the app **auto‑runs in BYPASS** if it doesn’t see a Wix Client ID.
4. Deploy → open the URL.

> Optional: set `OPENAI_API_KEY` later to enable AI pages (`/ads`, `/analytics`).

---

## 7) Local Dev

```bash
npm i
cp .env.example .env
# Fill OPENAI_API_KEY + NEXT_PUBLIC_WIX_* vars
npm run dev
```

## 7) Notes

- This template favors **client-side Wix gating** (fast & simple). For stricter gating, forward member tokens to your API routes and verify server-side against **Pricing Plans Orders**.
- The code uses evergreen Next.js 14 App Router, Tailwind, and **Fabric.js** in a client component for the canvas editor.
- All risky secrets stay **server-side**. Never expose your Wix Client Secret—this project uses the **Wix JS SDK OAuth (PKCE)** path that **does not** require a client secret in the browser.

## References

- Wix Headless — Create Client with OAuth (JS SDK)  
- Wix Headless — About Authentication, Visitor/Member OAuth  
- Wix — Pricing Plans / Orders APIs  
- Wix Headless — Wix-managed Login (JS SDK, PKCE)

