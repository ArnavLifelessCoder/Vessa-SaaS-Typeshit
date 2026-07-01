# Vessa — Architecture & Engineering Reference

> The AI workspace for modern business. Nine purpose-built AI tools in one
> unified dashboard, built on Next.js 16 (App Router) with a provider-flexible
> AI layer that runs at **zero cost** by default.

This document is the deep technical reference for the codebase: how it is
structured, how requests flow, how each subsystem works, and how to extend it.

---

## 1. Product summary

Vessa bundles nine focused AI tools behind one dashboard. Each tool solves a
single high-value business problem and returns **structured JSON**, not a chat
transcript. The nine tools:

| Tool | Route | Category | What it does |
|------|-------|----------|--------------|
| ContractGuard | `/dashboard/contract-guard` | Legal & Risk | Contract risk analysis: flagged clauses, missing protections, risk score |
| ContentForge | `/dashboard/content-forge` | Marketing | Repurpose one input into LinkedIn / X / YouTube / email |
| FlowPilot | `/dashboard/flow-pilot` | Operations | Client onboarding workflow, plan, follow-up schedule, email |
| ReplyForge | `/dashboard/reply-forge` | Communication | Three tone-varied ready-to-send email replies |
| PitchCraft | `/dashboard/pitch-craft` | Sales | Structured proposal + cold & follow-up emails |
| InsightLens | `/dashboard/insight-lens` | Productivity | Summary, key points, action items, sentiment from documents |
| RankForge | `/dashboard/rank-forge` | SEO | Meta tags, keywords, content outline, FAQ schema |
| BrandForge | `/dashboard/brand-forge` | Branding | Name ideas, taglines, value prop, tone, color story |
| DevLens | `/dashboard/dev-lens` | Engineering | Code review: issues, security notes, improved snippet |

**Key architectural properties**

- **Zero-cost by default** — with no API keys the app runs in *demo mode* with
  realistic simulated output. With free keys (Gemini / Groq) it runs live AI.
- **Best-of-N** — with two or more keys, every request runs on all providers in
  parallel and the strongest valid response is returned.
- **No database** — all user-facing state (history, credits, theme, pins) is
  persisted client-side in `localStorage`. Auth is currently a demo stub.
- **Single source of truth registries** — `lib/tools.ts` and `lib/plans.ts`
  drive the entire UI (landing, dashboard, palette, footer, pricing, billing).

---

## 2. Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 16.2.9** (App Router, Turbopack) | Route Handlers for the API |
| UI runtime | **React 19.2.4** | Server + Client Components |
| Language | **TypeScript 5** (`strict`) | `moduleResolution: bundler`, path alias `@/*` → repo root |
| Styling | **Vanilla CSS** | Global design system + CSS Modules per surface |
| Fonts | Google Fonts via CSS `@import` | `Sora` (headings), `Inter` (body) |
| AI providers | Gemini, Groq, Anthropic (pluggable) | REST calls, no SDKs |
| Payments | **Razorpay** (India) | Orders API + HMAC verification |
| Persistence | Browser `localStorage` | No server DB |
| Icons | Hand-authored inline SVG (`components/Icon.tsx`) | No icon dependency |

There are **no runtime dependencies beyond `next`, `react`, `react-dom`** — the
entire product surface is built from first principles.

---

## 3. High-level architecture

```
                          ┌───────────────────────────────────────────┐
                          │                 Browser                    │
                          │                                             │
  ┌────────────┐          │  ┌───────────────┐   ┌──────────────────┐  │
  │  Landing   │  (SSG)   │  │ Client Tools  │   │ Client subsystems │  │
  │  page.tsx  │◄─────────┼──┤ (9 tool pages)│   │ store / theme /   │  │
  └────────────┘          │  └───────┬───────┘   │ toast / palette   │  │
  ┌────────────┐          │          │ fetch     └──────────────────┘  │
  │ Auth pages │          │          ▼               ▲  localStorage    │
  └────────────┘          │   /api/ai/* JSON         │  (vessa:*)       │
                          └──────────┼───────────────┼──────────────────┘
                                     │ (server)      │
             ┌───────────────────────▼───────────────┴───────────────┐
             │                Next.js Route Handlers                  │
             │   /api/ai/<tool>   /api/payment/create-order|verify    │
             └───────────┬───────────────────────────┬───────────────┘
                         │                            │
                 ┌───────▼────────┐          ┌────────▼─────────┐
                 │   lib/ai.ts    │          │   Razorpay API   │
                 │  best-of-N     │          │  (orders + HMAC) │
                 └───┬───────┬────┘          └──────────────────┘
                     │       │ (no key → demo-data.ts)
          ┌──────────▼─┐  ┌──▼─────────┐  ┌────────────┐
          │  Gemini    │  │   Groq     │  │ Anthropic  │
          │ 2.0 Flash  │  │ Llama 3.3  │  │  Sonnet 4  │
          └────────────┘  └────────────┘  └────────────┘
```

Rendering split:
- **Static / server-rendered:** landing (`app/page.tsx`), auth pages, settings,
  `not-found`, `robots.txt`, `sitemap.xml`, root layout metadata.
- **Client components:** every tool page, dashboard shell, and all interactive
  subsystems (store, theme, toast, palette, reveal, scroll progress, upgrade).
- **Server-only:** Route Handlers and `lib/ai.ts` (reads `process.env`, holds
  provider keys — never bundled to the client).

---

## 4. Directory structure

```
app/
├── layout.tsx                 # Root layout: metadata, no-flash theme script, <html>/<body>
├── globals.css                # Design tokens (dark + light), primitives, QoL component CSS
├── page.tsx                   # Marketing landing (server component)
├── page.module.css            # Landing styles (ambient bg, sections, metrics, pricing)
├── not-found.tsx              # Branded 404
├── robots.ts                  # SEO robots.txt (MetadataRoute.Robots)
├── sitemap.ts                 # SEO sitemap.xml (MetadataRoute.Sitemap)
│
├── (auth)/                    # Route group (no URL segment)
│   ├── auth.module.css
│   ├── login/page.tsx         # Login + Google button (demo)
│   └── signup/page.tsx        # Signup + Google button (demo)
│
├── dashboard/
│   ├── layout.tsx             # Client shell: sidebar, topbar, drawer, providers
│   ├── dashboard.module.css   # All dashboard + tool styles
│   ├── page.tsx               # Overview: recent activity, live stats, tool grid
│   ├── settings/page.tsx      # Account, plan (Razorpay), provider/model, danger zone
│   ├── contract-guard/page.tsx
│   ├── content-forge/page.tsx
│   ├── flow-pilot/page.tsx
│   ├── reply-forge/page.tsx
│   ├── pitch-craft/page.tsx
│   ├── insight-lens/page.tsx
│   ├── rank-forge/page.tsx
│   ├── brand-forge/page.tsx
│   └── dev-lens/page.tsx
│
└── api/
    ├── ai/
    │   ├── contract-review/route.ts
    │   ├── content-repurpose/route.ts
    │   ├── workflow-generate/route.ts
    │   ├── reply-draft/route.ts
    │   ├── proposal-generate/route.ts
    │   ├── insights-extract/route.ts
    │   ├── seo-optimize/route.ts
    │   ├── brand-generate/route.ts
    │   └── code-review/route.ts
    └── payment/
        ├── create-order/route.ts
        └── verify/route.ts

components/
├── Icon.tsx                   # Icon set + LogoMark (V mark) + GoogleIcon
├── Reveal.tsx                 # IntersectionObserver scroll-reveal wrapper
├── ScrollProgress.tsx         # Top gradient scroll-depth bar
├── Toast.tsx                  # ToastProvider + useToast() context
├── CommandPalette.tsx         # ⌘K palette (nav + actions)
├── ThemeToggle.tsx            # Sun/moon theme switch
├── ResultActions.tsx          # Copy-all + Download toolbar for tool output
└── UpgradeButton.tsx          # Razorpay checkout trigger (+ demo fallback)

lib/
├── ai.ts                      # Provider-flexible AI layer + best-of-N + demo routing
├── demo-data.ts               # Types + realistic simulated responses for every tool
├── examples.ts                # "Try example" prefill inputs
├── tools.ts                   # Tool registry (drives all navigation surfaces)
├── plans.ts                   # Pricing registry (INR, paise) — drives pricing + billing
├── store.ts                   # Client store: history + credits + pins (localStorage)
├── storage.ts                 # SSR-safe JSON get/set, downloadText, timeAgo
├── theme.ts                   # Theme get/set/toggle + useTheme hook
└── useSubmitShortcut.ts       # ⌘/Ctrl+Enter to run a tool
```

---

## 5. The AI layer (`lib/ai.ts`) — in depth

This is the heart of the backend. It is **server-only** (imported exclusively by
Route Handlers and the server-rendered settings page).

### 5.1 Provider detection

```
GEMINI_API_KEY  ─┐
GROQ_API_KEY    ─┼─►  has(key)  ─►  availableProviders(): LiveProvider[]
ANTHROPIC_API_KEY┘                  (order: gemini, groq, anthropic)
```

- `has(key)` rejects empty strings and known placeholder values
  (`your_gemini_api_key`, etc.), so a template `.env` never enables live mode.
- `availableProviders()` returns every provider with a usable key, in preference
  order.
- `activeProvider()` = first available, or `'demo'` if none.
- `isDemoMode()` = `availableProviders().length === 0`.
- `modelLabel()` produces the UI string:
  - 0 keys → `"Demo mode"`
  - 1 key → e.g. `"Gemini 2.0 Flash"`
  - ≥2 keys → e.g. `"Gemini 2.0 Flash + Llama 3.3 70B (Groq) · best of 2"`

### 5.2 Provider callers

Three async functions issue raw REST calls and return the model's text:

- `callGemini` → `generativelanguage.googleapis.com/.../{model}:generateContent`
  with `generationConfig.responseMimeType = "application/json"` (forces JSON).
- `callGroq` → `api.groq.com/openai/v1/chat/completions` (OpenAI-compatible),
  `response_format: { type: "json_object" }`, Bearer auth.
- `callAnthropic` → `api.anthropic.com/v1/messages`, `x-api-key` + version header.

Model IDs are overridable via `GEMINI_MODEL`, `GROQ_MODEL`, `ANTHROPIC_MODEL`.

### 5.3 `callClaude()` — the router + best-of-N

> Named `callClaude` for historical reasons; it is provider-agnostic.

```
callClaude(system, user):
  providers = availableProviders()
  if providers.length === 0 → throw
  if providers.length === 1 → return cleanJson(await CALLERS[p](system,user))

  # Best-of-N
  settled = await Promise.allSettled(providers.map(call))
  candidates = []
  for each fulfilled result:
      text = cleanJson(result)
      try { candidates.push({ text, score: scoreJson(JSON.parse(text)) }) }
      catch { skip invalid JSON }
  if candidates empty → return first fulfilled raw (or throw if all rejected)
  return highest-scoring candidate.text
```

- **`cleanJson()`** strips markdown code fences (```` ```json ````) some models
  emit, so downstream `JSON.parse` is reliable.
- **`scoreJson(value)`** is a recursive completeness heuristic:
  - arrays: `length * 8 + Σ score(items)` (rewards more items)
  - objects: `Σ score(values)` (rewards more populated fields)
  - strings: `min(trimmedLength, 500)` (rewards detail, capped to avoid rewarding rambling)
  - numbers/booleans: `4`
  The richer, more complete valid response wins. Best-of-N also improves
  **reliability**: if one provider errors or times out, the other still answers.

### 5.4 Tool functions

Each tool exports one async function (e.g. `reviewContract`, `repurposeContent`,
`generateWorkflow`, `draftReplies`, `generateProposal`, `extractInsights`,
`optimizeSeo`, `generateBrand`, `reviewCode`). Every one follows the same shape:

```
export async function <tool>(...args): Promise<TypedResult> {
  if (isDemoMode()) {
    await sleep(~2s)              // simulate latency for realistic UX
    return demo<Result>          // from lib/demo-data.ts
  }
  const systemPrompt = `...strict JSON schema instructions...`
  const raw = await callClaude(systemPrompt, buildUserMessage(...args))
  return JSON.parse(raw)         // typed to the tool's Result interface
}
```

The **system prompt for every tool specifies the exact JSON structure** to
return, which is why `responseMimeType`/`response_format` JSON modes matter.

---

## 6. Request lifecycle — one tool run (sequence)

Using ContractGuard as the example; all nine tools are structurally identical.

```
User (client)                Tool page              Route Handler           lib/ai.ts            Provider(s)
─────────────                ─────────              ─────────────           ─────────            ───────────
click "Analyze"  ──────────► handleAnalyze()
                             validate input (≥50 chars)
                             setLoading(true)
                             fetch POST /api/ai/contract-review ─────────►  parse body
                                                                            validate contractText
                                                                            reviewContract(text) ─►  isDemoMode?
                                                                                                     ├ yes → sleep+demoData
                                                                                                     └ no  → callClaude ─► [best-of-N]
                                                                                                                          Gemini ║ Groq
                                                                            ◄── typed JSON ──────────  pick best
                             ◄──────── 200 JSON ─────────────────────────  Response.json(result)
                             setResult(data)
                             toast("Contract analyzed", success)
                             recordRun({...})  ──► localStorage (history + credit)
                             render risk card, clauses, missing protections
```

Client-side after success:
1. `useToast()` shows a success toast.
2. `recordRun()` (from `lib/store.ts`) prepends a `RunEntry` to history and
   consumes one credit; both persist to `localStorage` and emit a
   `vessa:store-change` event so the sidebar meter and dashboard update live.
3. `ResultActions` exposes **Copy all** and **Download** of a formatted report.

Error path: any thrown error → `res.ok` false → the page shows an inline error
and an error toast; nothing is recorded.

---

## 7. Demo mode

Demo mode is what makes the app **$0 and instantly usable**:

- Triggered whenever no live provider key is set.
- Each tool function returns a hand-authored, realistic result from
  `lib/demo-data.ts`, after a ~2s artificial delay so the loading UX is real.
- The **API contract is identical** in demo and live mode — the client cannot
  tell the difference, so nothing changes when you add a key.
- Razorpay has an equivalent demo fallback (see §10).

---

## 8. Client state store (`lib/store.ts`)

There is no server database. Durable user state lives in `localStorage` behind a
tiny pub/sub so multiple components stay in sync without a global state library.

### 8.1 Keys and constants

| Key | Purpose |
|-----|---------|
| `vessa:history` | Array of `RunEntry` (most recent first, capped at 60) |
| `vessa:creditsUsed` | Number of credits consumed (of 20) |
| `vessa:pinnedTools` | Array of pinned tool ids (reserved for favorites) |

`CREDITS_TOTAL = 20`, `HISTORY_CAP = 60`, sync event = `vessa:store-change`.

### 8.2 Data model

```ts
interface RunEntry {
  id: string          // crypto.randomUUID()
  toolId: string      // e.g. "contract-guard"
  toolName: string    // "ContractGuard"
  icon: IconName      // sidebar/activity icon
  href: string        // deep link back to the tool
  summary: string     // e.g. "Risk High (72%), 5 clauses flagged"
  ts: number          // Date.now()
}
```

### 8.3 Mutations & reactivity

- `recordRun(entry)` — prepend to history (slice to cap), increment credits
  (clamped to total), then `emit()` a `vessa:store-change` event.
- `clearHistory()`, `togglePin(id)` — same emit pattern.
- `useHistory()`, `useCredits()`, `usePins()` — hooks built on `useStoreValue`,
  which subscribes to both the custom `vessa:store-change` event **and** the
  native `storage` event (so changes propagate across browser tabs).

`useCredits()` returns `{ used, total, remaining, percent }` — the sidebar usage
bar and dashboard stat cards read from it and update instantly after each run.

> **SSR safety:** all reads go through `readJSON`/`writeJSON` in `lib/storage.ts`,
> which guard `typeof window === 'undefined'` and wrap everything in try/catch so
> private-mode or quota errors never crash a render.

---

## 9. Theming (`lib/theme.ts` + root layout)

Dark and light themes are driven by a `data-theme` attribute on `<html>`.

### 9.1 No-flash strategy

The root layout injects a tiny **blocking inline script** in `<head>` before any
paint:

```js
(function(){ try { var t = localStorage.getItem('vessa:theme') || 'dark';
  document.documentElement.dataset.theme = t; } catch(e){ ... 'dark' } })();
```

Because it runs synchronously before hydration, the correct theme is applied on
the very first frame — no flash of the wrong theme. `<html>` and `<body>` carry
`suppressHydrationWarning` (the attribute is set outside React, and browser
extensions like Grammarly also mutate `<body>`).

### 9.2 Runtime toggling

- `getTheme()` reads the current `data-theme`.
- `setTheme(t)` sets the attribute, persists to `localStorage`, dispatches
  `vessa:theme-change`.
- `toggleTheme()` flips dark/light.
- `useTheme()` subscribes to `vessa:theme-change` for reactive components
  (e.g. `ThemeToggle` swaps the sun/moon icon).

### 9.3 Tokens

`globals.css` defines the palette as CSS custom properties under `:root`
(dark) with a full override block under `:root[data-theme='light']`. Hardcoded
surfaces were tokenized (`--nav-bg`, `--overlay-track`, `--quote-bg`,
`--footer-fade`, `--scrim`) so light mode renders correctly everywhere.

---

## 10. Billing — Razorpay (`lib/plans.ts` + payment routes + `UpgradeButton`)

Stripe does not operate in India, so billing uses **Razorpay** (INR).

### 10.1 Pricing registry (`lib/plans.ts`)

Single source of truth. Amounts are in **paise** (₹1 = 100 paise), currency INR.

| id | Name | `amount` (paise) | Label | Popular |
|----|------|------------------|-------|---------|
| starter | Starter | 0 | ₹0 | — |
| pro | Pro | 79900 | ₹799 | ✓ |
| business | Business | 159900 | ₹1,599 | — |

Both the landing pricing cards and the settings upgrade buttons read from this
array, so prices change in one place.

### 10.2 Checkout flow

```
UpgradeButton (client)         /api/payment/create-order        Razorpay
──────────────────────         ──────────────────────────        ────────
click "Upgrade" ─────────────► POST { planId }
                               getPlan(planId); reject if free
                               isDemo?  (no RAZORPAY keys)
                                 ├ yes → { demo:true, amount, planName }
                                 └ no  → POST /v1/orders (Basic auth) ─► order
                               ◄── { orderId, amount, keyId, ... }
   demo? → toast "activated (no charge)"  ── done
   live? → load checkout.js
           new Razorpay(options).open()
                 └ user pays ─► handler(response)
                                POST /api/payment/verify ─────────► (HMAC check)
                                verify: HMAC_SHA256(order|payment, secret)
                                        timingSafeEqual vs signature
                                ◄── { verified: true|false }
                                toast success / failure
```

### 10.3 Security details

- `create-order` uses HTTP Basic auth with `RAZORPAY_KEY_ID:RAZORPAY_KEY_SECRET`
  base64-encoded — the **secret never reaches the client**; only `keyId`
  (publishable) is returned.
- `verify` recomputes `HMAC-SHA256(`order_id|payment_id`, key_secret)` and
  compares with `crypto.timingSafeEqual` (constant-time, prevents timing
  attacks). This is Razorpay's prescribed verification.
- **Demo fallback:** with no keys, `create-order` returns `{ demo: true }` and
  `verify` returns `{ verified: true }`, so the whole flow works at $0 with no
  real charge.

---

## 11. UI subsystems

### 11.1 Dashboard shell (`app/dashboard/layout.tsx`)
Client component that wraps all dashboard pages. Provides:
- **Sidebar** — logo, ⌘K search trigger, three nav sections (Menu / AI Tools /
  Account) generated from `lib/tools.ts`, and a live usage meter from `useCredits`.
- **Topbar** — page title (derived from pathname), quick-search pill, theme
  toggle, an "AI online" status badge, avatar.
- **Mobile drawer** — below 768px the sidebar becomes a slide-in drawer with a
  scrim; a hamburger opens it and it auto-closes on route change.
- Mounts `<ToastProvider>` (so every tool can `useToast()`) and `<CommandPalette>`.

### 11.2 Command palette (`components/CommandPalette.tsx`)
- Opens on **⌘K / Ctrl+K** (global keydown) or a `vessa:open-palette` event
  dispatched by the sidebar/topbar buttons.
- Lists all tools (from the registry) plus actions: go to Overview, open
  Settings, view landing, toggle theme.
- Full keyboard nav (Arrow keys + Enter), substring filtering, Escape to close.

### 11.3 Toasts (`components/Toast.tsx`)
React context (`useToast()`) exposing `toast(message, type)` where type is
`success | error | info`. Auto-dismiss after ~3.6s, click to dismiss, animated in.

### 11.4 Scroll motion (landing)
- `Reveal` — wraps content, uses an `IntersectionObserver` to add a `.revealed`
  class once on entry (fade + slide-up); supports a `delay` for stagger.
- `ScrollProgress` — a fixed top gradient bar scaled by scroll depth, updated via
  `requestAnimationFrame` on a passive scroll listener.
- Both respect `prefers-reduced-motion` (motion is neutralized in CSS).

### 11.5 Per-tool power features
Every tool page includes:
- **Try example** — one-click prefill from `lib/examples.ts`.
- **⌘/Ctrl+Enter to run** — via `useSubmitShortcut(handler, !loading)`.
- **Live character counter** on primary inputs.
- **Copy all + Download** of the result (`ResultActions` → `downloadText`).
- **Toast + history + credit** on success.

### 11.6 Icons (`components/Icon.tsx`)
- `Icon` — a single component rendering named stroke SVGs (`currentColor`, so
  CSS controls color). One place to add new glyphs (`IconName` union + `paths`).
- `LogoMark` — the Vessa "V": a gradient rounded tile with a two-tone folded V.
- `GoogleIcon` — the multicolor Google "G" for the auth buttons.

---

## 12. Registries drive everything

Two arrays define the product surface; edit them and the UI follows.

- **`lib/tools.ts` → `tools: ToolMeta[]`** feeds: landing toolkit grid, landing
  footer, dashboard sidebar nav, dashboard overview grid, and the command
  palette. `ToolMeta` = `{ id, name, href, icon, category, tagline, description,
  features[] }`.
- **`lib/plans.ts` → `plans: Plan[]`** feeds: landing pricing cards and the
  settings billing buttons.

The landing page also derives its counts dynamically (`tools.length`) so the
"nine tools" copy never drifts when tools are added or removed.

---

## 13. Routing map (30 routes)

```
Static (prerendered):
  /                         landing
  /login  /signup           auth
  /dashboard                overview
  /dashboard/<9 tools>       tool pages
  /dashboard/settings        account + billing
  /_not-found                404
  /robots.txt  /sitemap.xml  SEO

Dynamic (server-rendered on demand):
  /api/ai/contract-review    /api/ai/content-repurpose   /api/ai/workflow-generate
  /api/ai/reply-draft        /api/ai/proposal-generate   /api/ai/insights-extract
  /api/ai/seo-optimize       /api/ai/brand-generate      /api/ai/code-review
  /api/payment/create-order  /api/payment/verify
```

Each `/api/ai/<tool>` route: parses the JSON body, validates required fields
(returning `400` on bad input), calls the matching `lib/ai.ts` function, and
returns `Response.json(result)` — with `500` on unexpected failure.

---

## 14. Environment variables

Copy `.env.example` → `.env.local`. **Nothing is required** (demo mode works
with an empty file). Set any of the following to enable live behavior:

| Variable | Effect |
|----------|--------|
| `GEMINI_API_KEY` (+ `GEMINI_MODEL`) | Enable Google Gemini (free tier) |
| `GROQ_API_KEY` (+ `GROQ_MODEL`) | Enable Groq / Llama (free tier) |
| `ANTHROPIC_API_KEY` (+ `ANTHROPIC_MODEL`) | Enable Claude (paid) |
| `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` | Enable live checkout |
| `NEXT_PUBLIC_SUPABASE_URL` / `..._ANON_KEY` | Reserved (auth/db not yet wired) |

- **One AI key** → live single-provider mode.
- **Two+ AI keys** → best-of-N (parallel, best answer wins).
- `.env.local` is gitignored; only `.env.example` (placeholders) is committed.

---

## 15. Security notes

- **Secrets stay server-side.** `lib/ai.ts` and the payment routes read
  `process.env` and are only imported by server code; provider secrets and the
  Razorpay secret are never sent to the browser.
- **Payment verification** uses constant-time HMAC comparison.
- **Untrusted input** is treated as data: AI responses are parsed as JSON and
  typed; invalid JSON is discarded (best-of-N) or surfaces as a handled error.
- **Auth is a demo stub** — login/signup currently redirect to the dashboard
  without real authentication. Before production, wire real auth (e.g. Supabase)
  and protect `/dashboard/*` and the API routes.
- The landing metrics (250K+, 18K+, 4.9/5) are illustrative placeholders.

---

## 16. Extending: add a new AI tool (checklist)

1. **Types + demo data** — add a `Result` interface and a `demo<Result>` constant
   in `lib/demo-data.ts`.
2. **AI function** — add `export async function <tool>(...)` in `lib/ai.ts`
   following the demo/live pattern with a strict-JSON system prompt.
3. **API route** — create `app/api/ai/<tool>/route.ts` that validates input and
   calls the function.
4. **Example input** — add a sample to `lib/examples.ts`.
5. **Tool page** — create `app/dashboard/<tool>/page.tsx` reusing the two-panel
   layout, `useToast`, `recordRun`, `useSubmitShortcut`, and `ResultActions`.
6. **Register** — add a `ToolMeta` entry to `lib/tools.ts` (and an icon to
   `components/Icon.tsx` if needed). It now appears in the sidebar, overview,
   command palette, landing grid, and footer automatically.

---

## 17. Build, run, deploy

```bash
npm install        # install next / react / react-dom
npm run dev        # dev server (Turbopack) at http://localhost:3000
npm run build      # production build (type-check + prerender)
npm start          # serve the production build
npm run lint       # eslint (eslint-config-next)
```

- **Deploy target:** any Node host or Vercel. Set env vars in the host's
  dashboard (never commit `.env.local`).
- **Long-running commands** (`dev`, `start`) should be run in a terminal, not as
  one-off scripts.

---

## 18. Known limitations / roadmap

- No real authentication or database yet (demo stubs; state is per-browser).
- Usage credits are illustrative and client-side; not enforced server-side.
- Razorpay success is not yet persisted to a user record (no backend to store it).
- Favorites (`pinnedTools`) are stored but not yet surfaced in the UI.
- Replace placeholder domain `vessa.app` in `layout.tsx`, `robots.ts`,
  `sitemap.ts` with the real domain before launch.

---

_Last updated for the nine-tool, best-of-N, Razorpay build._
