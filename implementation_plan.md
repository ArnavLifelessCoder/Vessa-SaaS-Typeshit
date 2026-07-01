# Vessa — Full-Stack AI SaaS Platform

A production-grade AI SaaS platform with three monetizable AI tools under one unified dashboard, built on Next.js + Supabase + Claude API + Stripe.

## Platform Overview

**NexusAI** is a multi-tool AI SaaS that bundles three high-value B2B tools:

| Tool | What It Does | Target Users |
|------|-------------|--------------|
| **🔍 ContractGuard** | Upload contracts/docs, AI scans for liability traps, risky clauses, missing protections, compliance gaps | Freelancers, small law firms, healthcare admins |
| **🔄 ContentForge** | Paste/upload content, AI repurposes it into LinkedIn posts, Twitter threads, YouTube short scripts, email newsletters | Content creators, marketing agencies |
| **⚙️ FlowPilot** | AI-powered client intake forms, custom plan generation, and workflow automation for vertical businesses | Coaches, real estate agents, local services |

---

## Architecture

```
┌──────────────────────────────────────────┐
│            Next.js App Router            │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ │
│  │ Landing  │ │  Auth    │ │ Dashboard │ │
│  │  Page    │ │  Pages   │ │  + Tools  │ │
│  └─────────┘ └──────────┘ └───────────┘ │
│           │          │            │       │
│           ▼          ▼            ▼       │
│      API Routes (Route Handlers)         │
│  ┌──────────┐ ┌──────┐ ┌─────────────┐  │
│  │ /api/ai  │ │/api/ │ │ /api/stripe │  │
│  │ tools    │ │auth  │ │  webhooks   │  │
│  └────┬─────┘ └──┬───┘ └──────┬──────┘  │
└───────┼──────────┼─────────────┼─────────┘
        │          │             │
   ┌────▼───┐ ┌───▼────┐  ┌────▼───┐
   │ Claude │ │Supabase│  │ Stripe │
   │  API   │ │Auth+DB │  │  API   │
   └────────┘ └────────┘  └────────┘
```

---

## Proposed Changes

### Phase 1: Project Scaffold & Design System

#### [NEW] Next.js project initialization

- Initialize with `npx -y create-next-app@latest ./` using App Router, TypeScript, and vanilla CSS
- Project structure:

```
AI SaaS/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata
│   ├── page.tsx                # Marketing landing page
│   ├── globals.css             # Design system tokens + global styles
│   ├── (auth)/
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Signup page
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard shell (sidebar + topbar)
│   │   ├── page.tsx            # Dashboard home (overview cards)
│   │   ├── contract-guard/
│   │   │   └── page.tsx        # ContractGuard tool
│   │   ├── content-forge/
│   │   │   └── page.tsx        # ContentForge tool
│   │   ├── flow-pilot/
│   │   │   └── page.tsx        # FlowPilot tool
│   │   └── settings/
│   │       └── page.tsx        # Account + billing settings
│   └── api/
│       ├── ai/
│       │   ├── contract-review/route.ts
│       │   ├── content-repurpose/route.ts
│       │   └── workflow-generate/route.ts
│       └── stripe/
│           └── webhook/route.ts
├── components/
│   ├── landing/                # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx
│   │   └── Footer.tsx
│   ├── dashboard/              # Dashboard components
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── UsageCard.tsx
│   ├── tools/                  # AI tool components
│   │   ├── ContractUploader.tsx
│   │   ├── ContractResults.tsx
│   │   ├── ContentInput.tsx
│   │   ├── ContentOutputs.tsx
│   │   ├── WorkflowForm.tsx
│   │   └── WorkflowPlan.tsx
│   └── ui/                     # Shared UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase.ts             # Supabase client setup
│   ├── ai.ts                   # Claude API wrapper
│   └── stripe.ts               # Stripe client setup
├── .env.local                  # API keys (template)
└── package.json
```

---

### Phase 2: Landing Page (Marketing)

#### [NEW] `app/page.tsx` — Marketing landing page

Premium dark-mode landing page with:
- **Hero**: Animated gradient headline, tagline, CTA buttons ("Start Free Trial" / "See Pricing")
- **Features**: 3-column showcase of ContractGuard, ContentForge, FlowPilot with icons and descriptions
- **How It Works**: 3-step visual (Sign Up → Pick a Tool → Get AI Results)
- **Pricing**: 3-tier pricing cards (Free / Pro $29/mo / Business $79/mo)
- **Footer**: Links, social, legal

---

### Phase 3: Authentication

#### [NEW] `app/(auth)/login/page.tsx` and `signup/page.tsx`

- Supabase Auth integration with email/password
- Beautiful glass-card auth forms with gradient accents
- Redirect to `/dashboard` on success
- Protected route middleware for `/dashboard/*`

---

### Phase 4: Dashboard Shell

#### [NEW] `app/dashboard/layout.tsx`

- **Sidebar**: Logo, navigation links to each tool, settings, logout
- **Topbar**: User greeting, usage counter, upgrade CTA
- **Main content area**: Renders child pages

#### [NEW] `app/dashboard/page.tsx` — Overview

- Welcome card with user name
- 3 tool cards (ContractGuard, ContentForge, FlowPilot) with "Launch" buttons
- Usage stats (documents reviewed, content generated, workflows created)
- Quick-start tips

---

### Phase 5: The Three AI Tools

#### Tool 1: 🔍 ContractGuard (`app/dashboard/contract-guard/page.tsx`)

**UI:**
- Text area to paste contract text OR file upload zone (`.txt`, `.pdf` — parsed client-side)
- "Analyze Contract" button
- Results panel with:
  - Risk score badge (Low / Medium / High / Critical)
  - List of flagged clauses with severity, quote, and AI explanation
  - "What's Missing" section for protections not found
  - Downloadable summary

**API Route:** `app/api/ai/contract-review/route.ts`
- Sends contract text to Claude API with a specialized system prompt:
  - Role: expert contract attorney
  - Task: identify liability traps, unfair terms, missing protections, ambiguous language
  - Output: structured JSON with risk_score, flagged_clauses[], missing_protections[]

#### Tool 2: 🔄 ContentForge (`app/dashboard/content-forge/page.tsx`)

**UI:**
- Text area for source content (blog post, podcast transcript, article)
- Checkboxes to select output formats: LinkedIn Post, Twitter Thread, YouTube Short Script, Email Newsletter
- "Generate Content" button
- Tabbed output panel — one tab per selected format
- Copy-to-clipboard button on each output

**API Route:** `app/api/ai/content-repurpose/route.ts`
- Sends source content + selected formats to Claude API
- System prompt: expert content strategist who adapts tone and format per platform
- Output: structured JSON with platform-specific content pieces

#### Tool 3: ⚙️ FlowPilot (`app/dashboard/flow-pilot/page.tsx`)

**UI:**
- Form fields:
  - Business type (dropdown: Fitness Coach, Real Estate Agent, Tutor, Consultant, Other)
  - Client name
  - Client goals / requirements (textarea)
  - Budget range (optional)
- "Generate Workflow" button
- Results panel with:
  - AI-generated onboarding checklist
  - Custom plan/program for the client
  - Suggested next steps and follow-up schedule
  - Email template for client communication

**API Route:** `app/api/ai/workflow-generate/route.ts`
- Sends business type + client info to Claude API
- System prompt: expert business consultant for that specific vertical
- Output: structured JSON with onboarding_steps[], custom_plan, follow_up_schedule, email_template

---

### Phase 6: Settings & Billing

#### [NEW] `app/dashboard/settings/page.tsx`

- Account info (email, password change)
- Current plan display
- Usage statistics
- Stripe Customer Portal link for billing management

---

## Environment Variables Needed

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_claude_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

> [!IMPORTANT]
> The app will work in **demo mode** without API keys — AI responses will be simulated with realistic placeholder data so you can see the full experience. Add real keys to `.env.local` to enable live AI processing.

## User Review Required

> [!IMPORTANT]
> **Demo Mode vs Real API Keys**: I will build the platform to work beautifully in demo mode first (with simulated AI responses). This lets you see and test everything immediately. You can plug in your Supabase, Claude, and Stripe API keys later to go live. Sound good?

## Verification Plan

### Automated Tests
- `npm run build` — Verify the entire app compiles without errors
- `npm run dev` — Launch dev server and test all routes

### Manual Verification
- Navigate landing page, test all sections and CTA links
- Sign up / Login flow (demo mode without Supabase)
- Dashboard overview renders correctly
- Each AI tool: submit input → see AI results
- Settings page displays correctly
- Mobile responsive on all pages
