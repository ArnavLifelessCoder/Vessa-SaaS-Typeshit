<div align="center">

# Vessa

### The AI workspace for modern business

Nine purpose-built AI tools in one unified dashboard — contracts, content,
proposals, code review, SEO, branding and more. Runs at **zero cost** out of the box.

**[🚀 Live demo → vessa-saas.vercel.app](https://vessa-saas.vercel.app/)**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-149eca?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## What is Vessa?

Vessa bundles nine focused AI tools behind one clean dashboard. Each tool solves
a single high-value business problem and returns **structured, ready-to-use
output** — not a chat transcript.

It's designed to be **free to run**: with no API keys it works in a realistic
demo mode, and with free API keys (Google Gemini / Groq) it runs live AI. Add
both and every request runs on both models in parallel, keeping the better answer.

## The nine tools

| Tool | Category | What it does |
|------|----------|--------------|
| **ContractGuard** | Legal & Risk | Flags risky clauses, missing protections, and a risk score |
| **ContentForge** | Marketing | Repurposes one input into LinkedIn, X, YouTube & email |
| **FlowPilot** | Operations | Builds client onboarding workflows, plans & templates |
| **ReplyForge** | Communication | Drafts three tone-varied, ready-to-send email replies |
| **PitchCraft** | Sales | Generates structured proposals + cold & follow-up emails |
| **InsightLens** | Productivity | Summaries, key points, action items & sentiment from docs |
| **RankForge** | SEO | Meta tags, keywords, content outline & FAQ schema |
| **BrandForge** | Branding | Name ideas, taglines, value prop, tone & color story |
| **DevLens** | Engineering | Code review: issues, security notes & an improved snippet |

## Highlights

- **💸 Zero-cost by default** — realistic demo mode with no keys; free live AI with Gemini/Groq.
- **🏆 Best-of-two AI** — set two providers and each request runs on both; the stronger valid response wins (also more reliable).
- **⌘K command palette** — jump to any tool or action instantly.
- **🌗 Light / dark theme** — persisted, with no flash on load.
- **🧠 Persistent workspace** — run history, usage credits and preferences saved locally.
- **⚡ Per-tool power features** — one-click examples, ⌘+Enter to run, copy-all & download, toasts.
- **💳 Razorpay billing** — India-ready checkout with a demo fallback (no charge without keys).
- **📱 Responsive** — mobile drawer navigation, fully responsive layouts.
- **🔎 SEO-ready** — metadata, `robots.txt`, `sitemap.xml`, and a branded 404.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) · **React 19** · **TypeScript 5**
- Vanilla CSS design system (dark + light) — no UI library
- Hand-authored inline SVG icons — no icon dependency
- AI providers: **Google Gemini**, **Groq**, **Anthropic** (pluggable, REST)
- Payments: **Razorpay**

> No runtime dependencies beyond `next`, `react`, and `react-dom`.

## Quick start

```bash
# 1. Install
npm install

# 2. (Optional) configure keys — the app works with none
cp .env.example .env.local

# 3. Run
npm run dev
```

Open **http://localhost:3000**. With an empty `.env.local` you're in free demo
mode; add keys below to enable live AI.

## Environment variables

Nothing is required — demo mode works with an empty file. Add any of these to
`.env.local` (or your Vercel project settings) to go live:

| Variable | Effect | Get it free |
|----------|--------|-------------|
| `GEMINI_API_KEY` | Live AI (free tier) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `GROQ_API_KEY` | Live AI (free tier) | [console.groq.com/keys](https://console.groq.com/keys) |
| `ANTHROPIC_API_KEY` | Live AI (paid, optional) | [console.anthropic.com](https://console.anthropic.com) |
| `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` | Live checkout | [dashboard.razorpay.com](https://dashboard.razorpay.com/app/keys) |

- **One AI key** → live single-provider mode.
- **Two AI keys** → best-of-two (parallel, best answer wins).

`.env.local` is gitignored — only `.env.example` (placeholders) is committed.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Lint with `eslint-config-next` |

## Deploy on Vercel

1. Push to GitHub.
2. Import the repo at **[vercel.com/new](https://vercel.com/new)** — Next.js is auto-detected, no config needed.
3. *(Optional)* add environment variables in **Settings → Environment Variables**.
4. Deploy. Every push to `main` redeploys automatically.

Live example: **[vessa-saas.vercel.app](https://vessa-saas.vercel.app/)**

## Architecture

For a deep, intricate breakdown — request lifecycle, the best-of-N AI layer,
the client store, theming, billing flow, and how to add a new tool — see
**[VESSA.md](./VESSA.md)**.

## Roadmap

- Real authentication + database (auth is currently a demo stub)
- Server-side usage limits and persisted subscriptions
- Favorites / pinned tools surfaced in the UI

## License

MIT — free to use and modify.
