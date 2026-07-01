// Demo AI responses — used when no API key is configured
// These simulate realistic AI outputs for each tool

export interface ContractClause {
  severity: 'low' | 'medium' | 'high' | 'critical';
  clause: string;
  explanation: string;
  section: string;
}

export interface ContractReviewResult {
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  riskPercentage: number;
  flaggedClauses: ContractClause[];
  missingProtections: string[];
  summary: string;
}

export interface ContentOutput {
  platform: string;
  content: string;
}

export interface WorkflowResult {
  onboardingSteps: string[];
  customPlan: string;
  followUpSchedule: { day: string; action: string }[];
  emailTemplate: string;
}

export const demoContractReview: ContractReviewResult = {
  riskScore: 'High',
  riskPercentage: 72,
  flaggedClauses: [
    {
      severity: 'critical',
      section: 'Section 4.2 — Intellectual Property',
      clause: '"All work product, ideas, and derivative works created during the engagement shall become the sole and exclusive property of the Company, including any pre-existing intellectual property incorporated therein."',
      explanation: 'This clause claims ownership of your PRE-EXISTING IP — not just what you create for them. This means any tools, libraries, or frameworks you built before this contract could be claimed by the client. This is a major red flag.'
    },
    {
      severity: 'high',
      section: 'Section 7.1 — Liability',
      clause: '"The Contractor shall indemnify and hold harmless the Company against any and all claims, damages, losses, and expenses, without limitation."',
      explanation: 'The phrase "without limitation" exposes you to unlimited financial liability. Industry standard contracts cap liability at the total amount paid under the contract. This clause means a small mistake could lead to a lawsuit exceeding your entire contract value.'
    },
    {
      severity: 'high',
      section: 'Section 9.3 — Non-Compete',
      clause: '"For a period of 24 months following termination, the Contractor shall not engage in any business that competes with the Company\'s current or anticipated future services."',
      explanation: '24 months is excessively long — typical non-competes are 6-12 months. The phrase "anticipated future services" is dangerously vague and could prevent you from working in your entire field.'
    },
    {
      severity: 'medium',
      section: 'Section 3.1 — Payment Terms',
      clause: '"Payment shall be rendered within 60 business days of invoice submission and acceptance."',
      explanation: '60 business days (~3 calendar months) is far beyond industry standard. Net-30 is typical for freelance work. This creates significant cash flow risk for the contractor.'
    },
    {
      severity: 'low',
      section: 'Section 11 — Termination',
      clause: '"Either party may terminate with 14 days written notice."',
      explanation: 'While mutual termination rights are fair, 14 days may not be enough notice for complex projects. Consider negotiating for 30 days to allow for proper handoff.'
    }
  ],
  missingProtections: [
    'No limitation of liability cap — you need a clause limiting your total liability to the amount paid under the contract.',
    'No kill fee / cancellation fee — if the client terminates mid-project, you have no guaranteed payment for work already completed.',
    'No late payment penalty — there is no incentive for the client to pay on time.',
    'No scope change process — no mechanism to handle additional work requests or scope creep, which could lead to unpaid extra work.',
    'No dispute resolution clause — no specified method (mediation, arbitration) for resolving disagreements before litigation.'
  ],
  summary: 'This contract contains several high-risk clauses that disproportionately favor the hiring company. The IP clause is particularly dangerous as it could claim ownership of your pre-existing work. We strongly recommend negotiating sections 4.2, 7.1, and 9.3 before signing.'
};

export const demoContentOutputs: ContentOutput[] = [
  {
    platform: 'LinkedIn Post',
    content: `I've been building SaaS products for 5 years, and here's the #1 mistake I see founders make:

They build for "everyone."

Here's the truth: The riches are in the niches.

Last month, I watched a solo developer hit $12K MRR with a tool that does ONE thing — scan freelance contracts for liability traps.

Not a general AI assistant.
Not a ChatGPT wrapper.
A scalpel, not a Swiss Army knife.

Here's the framework I use to find profitable SaaS niches:

1️⃣ Find a specific job title in a specific industry
2️⃣ Ask them what they hate doing every week
3️⃣ Build the tool that eliminates that pain
4️⃣ Price it at 10% of the value you create

The best part? You don't need to build your own AI model.

You're an orchestrator — connecting powerful APIs (Claude, GPT) to a clean interface that solves a real problem.

Your total starting cost? Under $50/month.

Stop building for everyone. Start building for someone.

What niche are you exploring? Drop it in the comments 👇

#SaaS #AI #Entrepreneurship #StartupAdvice`
  },
  {
    platform: 'Twitter/X Thread',
    content: `🧵 The 2026 playbook for building an AI SaaS that actually makes money:

(Most founders are getting this completely wrong)

1/ The era of making easy money with ChatGPT wrappers is OVER.

To get people to pull out their credit cards in 2026, you need a Micro SaaS — a highly specific tool that solves a painful B2B problem.

2/ Three archetypes printing money right now:

📋 AI Contract Reviewers → Scan docs for legal traps
⚙️ Vertical Workflow Automators → End-to-end tools for specific roles
🎙️ Content Repurposing Engines → One input → 5 platform outputs

3/ The lean stack:

• Next.js on Vercel (free tier)
• Supabase (auth + DB)
• Claude API (AI brain)
• Stripe (payments)

Total monthly cost to start: <$50

4/ The math that matters:

SaaS = Monthly Recurring Revenue

At $49/mo with 10 new customers/month and 5% churn:
→ Month 12 MRR: $4,800
→ Month 24 MRR: $8,200

But bump churn to 10%? You hit a CEILING at $4,900. Forever.

5/ The #1 rule: VALIDATE BEFORE YOU BUILD.

Talk to 5 people. Build a landing page. Get 20 email signups.

If you can't get 20 emails, you won't get credit cards.

No demand? Pivot fast.

6/ The biggest mistake I see: spending 3 months coding in a basement and launching to crickets.

Build the audience before the product.

Drop your niche idea below — I'll tell you if it has legs 🦵`
  },
  {
    platform: 'YouTube Short Script',
    content: `[HOOK — 0:00-0:03]
"Building an AI SaaS in 2026? Stop. Don't make this mistake."

[PROBLEM — 0:03-0:10]
"Everyone's building generic ChatGPT wrappers. That market is dead. Over. Finished."

[SOLUTION — 0:10-0:25]
"The money is in Micro SaaS. Pick ONE painful problem for ONE specific type of person.

Like scanning freelance contracts for liability traps. Or turning one podcast into five pieces of content.

You don't need to build AI. You just connect APIs to a beautiful interface."

[PROOF — 0:25-0:40]
"The math? At $49 a month with 10 new customers and low churn? You're at $8,000 MRR in two years. Your total starting cost? Under fifty bucks a month."

[CTA — 0:40-0:50]
"But here's the secret — validate before you build. Talk to 5 real people. If you can't get 20 email signups, pivot. Follow for the full breakdown."

[TEXT OVERLAY IDEAS]
- "The $50/mo AI SaaS Stack"
- "Micro SaaS > Generic AI"
- "Validate Before You Build"`
  },
  {
    platform: 'Email Newsletter',
    content: `Subject: The AI SaaS playbook nobody's talking about (2026 edition)

Hey there,

I need to be blunt with you about something:

If you're planning to build "another AI chatbot" or a generic AI assistant this year, you're going to struggle.

The window for easy-money ChatGPT wrappers closed sometime in mid-2024. I watched it happen in real-time.

But here's what IS working — and working extremely well:

**Micro SaaS.**

Tiny, hyper-specific tools that solve ONE painful problem for ONE type of business.

I've been tracking three archetypes that are absolutely printing money right now:

**1. AI Contract Reviewers** — A solo dev I know built a tool that scans freelance contracts for liability traps. She charges $79/month. She has 180 customers. That's $14,220/month. From a SINGLE feature.

**2. Content Repurposing Engines** — Upload one podcast episode, get a LinkedIn post, Twitter thread, YouTube short script, and email newsletter. Marketing agencies are paying $99/month for this without blinking.

**3. Vertical Workflow Automators** — Think Calendly meets AI, but specifically for fitness coaches. Or real estate agents. Or tutors. End-to-end workflows for a single profession.

The tech stack? Dead simple:
- Next.js (free hosting on Vercel)
- Supabase (auth + database)
- Claude or GPT API (the AI brain)
- Stripe (payments)

**Total monthly cost: under $50.**

But here's what separates winners from everyone else: they VALIDATE before they build.

Talk to 5 people. Build a landing page. Get 20 email signups.

Can't get 20 emails? That's not a failure — that's a $10,000 lesson learned in 2 weeks instead of 3 months.

I'll be breaking down the exact step-by-step in my next few emails.

Until then — start talking to real people in real industries about real problems.

Talk soon,
[Your name]

P.S. Hit reply and tell me what niche you're exploring. I read every response.`
  }
];

export const demoWorkflowResult: WorkflowResult = {
  onboardingSteps: [
    'Send welcome email with intake questionnaire link (automated)',
    'Schedule 30-minute discovery call via Calendly integration',
    'Collect health history form and liability waiver (digital signature)',
    'Complete body composition assessment and movement screening',
    'Review dietary habits questionnaire and current supplement stack',
    'Set up client in your training app with login credentials',
    'Create shared Google Drive folder for progress photos and documents',
    'Schedule first training session and add to shared calendar'
  ],
  customPlan: `# 12-Week Transformation Program for Sarah Chen

## Client Profile
- **Goal:** Lose 15 lbs of body fat while maintaining muscle mass
- **Experience:** Intermediate (2 years of inconsistent gym training)
- **Availability:** 4 days/week, 60 minutes per session
- **Constraints:** Previous lower back injury (L4-L5 disc bulge, cleared by physio)
- **Budget:** Mid-range ($200-300/month for coaching)

---

## Phase 1: Foundation (Weeks 1-4)
**Focus:** Movement quality, habit building, metabolic baseline

### Training Split:
- **Day 1 (Mon):** Upper Body Push + Core Stability
- **Day 2 (Wed):** Lower Body — Squat Pattern + Hip Hinge (light loads)
- **Day 3 (Fri):** Upper Body Pull + Shoulder Health
- **Day 4 (Sat):** Lower Body — Single Leg + Carries + Conditioning

### Nutrition:
- Calories: 1,750 kcal/day (moderate deficit)
- Protein: 140g | Carbs: 165g | Fat: 58g
- Priority: Hit protein target daily, track intake 5 of 7 days minimum
- Hydration: 2.5L water daily

### Weekly Cardio: 2x 30min low-intensity walks + 1x 20min incline treadmill

---

## Phase 2: Progressive Overload (Weeks 5-8)
**Focus:** Strength progression, increasing training volume

- Increase working sets by 1-2 per muscle group
- Introduce progressive overload tracking (weight/reps logged per session)
- Adjust calories to 1,650 kcal/day if weight loss stalls
- Add 1 HIIT session (12 min) on a non-training day

---

## Phase 3: Peak & Transition (Weeks 9-12)
**Focus:** Intensity techniques, assessment, planning Phase 2

- Introduce supersets and drop sets for increased metabolic demand
- Final body composition assessment in Week 11
- Week 12: Deload week + program review + Phase 2 program design
- Transition to maintenance calories for 2 weeks before next cut cycle

---

## Key Performance Indicators:
- ✅ Body weight: Target 15 lb reduction
- ✅ Waist measurement: Target 2-3 inch reduction
- ✅ Squat: Target 1x bodyweight for 5 reps
- ✅ Consistency: 85%+ session attendance
- ✅ Habit: 5/7 days nutrition tracking compliance`,
  followUpSchedule: [
    { day: 'Day 1', action: 'Send welcome email + intake questionnaire' },
    { day: 'Day 3', action: 'Follow up if questionnaire not completed' },
    { day: 'Day 5', action: 'Discovery call — review goals, set expectations' },
    { day: 'Day 7', action: 'Deliver custom program + nutrition plan' },
    { day: 'Week 1 End', action: 'Check-in message: "How was your first week?"' },
    { day: 'Week 2', action: 'Review training logs + form check videos' },
    { day: 'Week 4', action: 'Progress photos + measurements + program adjustment' },
    { day: 'Week 6', action: 'Mid-program check-in call (15 min)' },
    { day: 'Week 8', action: 'Nutrition review + calorie adjustment if needed' },
    { day: 'Week 10', action: 'Pre-assessment reminder + motivation message' },
    { day: 'Week 12', action: 'Final assessment + results review + renewal discussion' }
  ],
  emailTemplate: `Subject: Welcome to your transformation journey, Sarah! 🎉

Hi Sarah,

I'm thrilled to officially welcome you to [Your Coaching Brand]!

I've reviewed everything from our discovery call and I'm excited about your goals. Losing 15 lbs while keeping your strength is absolutely achievable in 12 weeks — and I'll be with you every step of the way.

**Here's what happens next:**

1. **Complete your intake forms** — I've sent you two quick questionnaires (health history + nutrition habits). These help me build your custom program. Please complete them within the next 48 hours.

2. **Schedule your first session** — Use this link to book your kickoff training session: [Calendly Link]

3. **Download the training app** — I'll be programming all your workouts here. Your login credentials are:
   - App: [App Name]
   - Email: sarah.chen@email.com
   - Temporary Password: [Generated]

4. **Join our client community** — [Optional: Link to private Facebook/Discord group]

**Your custom 12-week program** will be delivered within 24 hours of completing your intake forms. It's tailored specifically to your goals, experience level, and schedule.

A few ground rules for our partnership:
- ✅ I respond to messages within 12 hours (Mon-Fri)
- ✅ Weekly check-ins are every Sunday evening
- ✅ Progress photos every 4 weeks (they tell the real story!)
- ✅ No question is too small — if you're unsure, ask

I believe in you, Sarah. Let's make these 12 weeks count.

To your strongest self,
[Your Name]
[Your Coaching Brand]

P.S. Pro tip: Take your "Day 1" progress photos before your first session. Future you will thank present you. 📸`
};

// ============================================================
// New tools: ReplyForge, PitchCraft, InsightLens
// ============================================================

// --- ReplyForge: smart email replies ---
export interface EmailReply {
  tone: string
  subject: string
  body: string
}

export const demoEmailReplies: EmailReply[] = [
  {
    tone: 'Professional',
    subject: 'Re: Project timeline and next steps',
    body: `Hi Jordan,

Thank you for the detailed update. I appreciate you flagging the timeline concern early.

To keep us on track, I'd suggest we lock the revised scope by Friday and push the delivery date to the 28th. That gives the team the buffer they need without compromising quality.

I've blocked 30 minutes on Thursday to walk through the open items together. Feel free to send over any questions beforehand.

Best regards,
[Your name]`,
  },
  {
    tone: 'Friendly',
    subject: 'Re: Project timeline and next steps',
    body: `Hey Jordan,

Really glad you raised this now rather than later. Totally makes sense.

How about we finalize the new scope by Friday and aim for the 28th? That should give everyone breathing room. I'll hop on a quick call Thursday so we can sort the last few details.

Talk soon,
[Your name]`,
  },
  {
    tone: 'Firm',
    subject: 'Re: Project timeline and next steps',
    body: `Hi Jordan,

Thanks for the update. To be clear, the revised scope needs to be confirmed by Friday so the team can commit to the 28th with confidence.

Any changes after that point will need to go through the change-request process we agreed on. I've set aside time Thursday to align on the remaining items.

Regards,
[Your name]`,
  },
]

// --- PitchCraft: proposals & outreach ---
export interface ProposalSection {
  title: string
  content: string
}

export interface ProposalResult {
  overview: string
  sections: ProposalSection[]
  coldEmail: string
  followUpEmail: string
}

export const demoProposalResult: ProposalResult = {
  overview:
    'A results-focused engagement to rebuild Meridian Retail\'s e-commerce storefront, targeting a measurable lift in conversion rate and average order value within 90 days.',
  sections: [
    {
      title: 'Objectives',
      content:
        'Increase checkout conversion by 18-25%, reduce cart abandonment, and modernize the storefront for mobile-first shoppers who now represent 68% of traffic.',
    },
    {
      title: 'Scope of Work',
      content:
        '1. UX audit and analytics review\n2. Redesign of product and checkout flows\n3. Performance optimization (target LCP < 2.0s)\n4. A/B test framework setup\n5. Two rounds of iteration based on live data',
    },
    {
      title: 'Timeline',
      content:
        'Weeks 1-2: Discovery and audit\nWeeks 3-6: Design and build\nWeeks 7-8: QA and launch\nWeeks 9-12: Optimization and reporting',
    },
    {
      title: 'Investment',
      content:
        'Fixed project fee of $18,500, billed 40% upfront and 60% on launch. Optional ongoing optimization retainer at $2,400/month.',
    },
  ],
  coldEmail: `Subject: A quick idea to lift Meridian's checkout conversion

Hi Priya,

I was looking at Meridian Retail's storefront and noticed the mobile checkout drops customers at the shipping step — a pattern I've helped three DTC brands fix, with an average 21% conversion lift.

I put together a short outline of what a 90-day engagement could look like. Would you be open to a 15-minute call next week to see if it's a fit?

Either way, happy to share the audit notes — no strings attached.

Best,
[Your name]`,
  followUpEmail: `Subject: Following up — Meridian checkout notes

Hi Priya,

Circling back on my note from last week. I know launch season is busy, so no pressure at all.

I still have the audit notes ready whenever you'd like them. If a quick call is easier, here's my calendar: [link].

Thanks,
[Your name]`,
}

// --- InsightLens: document & meeting intelligence ---
export interface InsightResult {
  summary: string
  keyPoints: string[]
  actionItems: { owner: string; task: string }[]
  topics: string[]
  sentiment: 'Positive' | 'Neutral' | 'Mixed' | 'Negative'
}

export const demoInsightResult: InsightResult = {
  summary:
    'The team reviewed Q3 performance, agreed the new onboarding flow improved activation by 12%, and prioritized fixing the billing sync bug before the enterprise launch. Marketing will hold the paid campaign until the fix ships.',
  keyPoints: [
    'New onboarding flow lifted 7-day activation from 41% to 53%.',
    'A billing sync bug is blocking three enterprise trials and is now the top priority.',
    'The paid acquisition campaign is paused until the billing fix is verified in production.',
    'Support ticket volume dropped 18% after the in-app help center launch.',
    'Leadership approved two additional engineering hires for Q4.',
  ],
  actionItems: [
    { owner: 'Engineering', task: 'Ship and verify the billing sync fix by end of week.' },
    { owner: 'Marketing', task: 'Resume paid campaign once billing fix is confirmed in prod.' },
    { owner: 'Product', task: 'Document the new onboarding flow metrics for the board deck.' },
    { owner: 'People Ops', task: 'Open two senior engineering roles for Q4.' },
  ],
  topics: ['Q3 Review', 'Onboarding', 'Billing Bug', 'Enterprise Launch', 'Hiring'],
  sentiment: 'Positive',
}

// ============================================================
// New tools: RankForge (SEO), BrandForge, DevLens (code review)
// ============================================================

// --- RankForge: SEO optimizer ---
export interface SeoOutlineSection {
  heading: string
  points: string[]
}
export interface SeoFaq {
  question: string
  answer: string
}
export interface SeoResult {
  metaTitle: string
  metaDescription: string
  slug: string
  primaryKeyword: string
  secondaryKeywords: string[]
  outline: SeoOutlineSection[]
  faqs: SeoFaq[]
}

export const demoSeoResult: SeoResult = {
  metaTitle: 'AI Contract Review Software: Catch Risky Clauses in Seconds',
  metaDescription:
    'Scan any contract for liability traps, unfair terms, and missing protections with AI. Get a clear risk score and plain-English fixes in under a minute.',
  slug: 'ai-contract-review-software',
  primaryKeyword: 'ai contract review software',
  secondaryKeywords: [
    'contract risk analysis',
    'review contracts with ai',
    'find risky clauses',
    'freelance contract checker',
    'legal document ai tool',
  ],
  outline: [
    {
      heading: 'What is AI contract review?',
      points: [
        'Define the category and who it serves',
        'Contrast with manual attorney review on speed and cost',
        'Set expectations: assistive, not a replacement for legal advice',
      ],
    },
    {
      heading: 'How AI spots risky clauses',
      points: [
        'Liability caps and unlimited indemnification',
        'IP ownership overreach',
        'Payment terms and non-compete red flags',
      ],
    },
    {
      heading: 'Choosing the right tool',
      points: ['Accuracy and explainability', 'Data privacy and retention', 'Pricing and export options'],
    },
  ],
  faqs: [
    {
      question: 'Is AI contract review a substitute for a lawyer?',
      answer:
        'No. It surfaces risks fast and explains them in plain English, but a qualified attorney should review high-stakes agreements before signing.',
    },
    {
      question: 'How accurate is AI clause detection?',
      answer:
        'Modern models reliably flag common risk patterns like uncapped liability and IP overreach. Always verify flagged items against the full contract context.',
    },
  ],
}

// --- BrandForge: brand identity generator ---
export interface BrandName {
  name: string
  rationale: string
}
export interface BrandResult {
  names: BrandName[]
  taglines: string[]
  valueProposition: string
  toneWords: string[]
  colorStory: string
}

export const demoBrandResult: BrandResult = {
  names: [
    { name: 'Lumenly', rationale: 'Evokes light and clarity — a tool that makes complex work simple.' },
    { name: 'Northpeak', rationale: 'Suggests direction and reaching a summit; confident and aspirational.' },
    { name: 'Cadence', rationale: 'Implies smooth, reliable rhythm — a product teams can build a routine around.' },
    { name: 'Brightframe', rationale: 'Combines optimism with structure; approachable yet professional.' },
    { name: 'Everlane Labs', rationale: 'Timeless and trustworthy, with a modern, experimental edge.' },
  ],
  taglines: [
    'Clarity, on demand.',
    'Do your best work, faster.',
    'The calm way to get more done.',
    'Less busywork. More momentum.',
  ],
  valueProposition:
    'A focused workspace that turns hours of manual busywork into minutes, so professionals can spend their time on the decisions that actually move the needle.',
  toneWords: ['Confident', 'Calm', 'Precise', 'Warm', 'Modern'],
  colorStory:
    'A deep indigo base signals trust and focus, paired with a bright signal-blue accent for energy and forward motion. Neutral slate grays keep the system clean and premium.',
}

// --- DevLens: code review ---
export interface CodeIssue {
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  detail: string
}
export interface CodeReviewResult {
  language: string
  summary: string
  issues: CodeIssue[]
  securityNotes: string[]
  improvedSnippet: string
}

export const demoCodeReview: CodeReviewResult = {
  language: 'JavaScript',
  summary:
    'The function works for the happy path but has a SQL injection risk, no input validation, and swallows errors silently. Below are prioritized fixes and a safer rewrite.',
  issues: [
    {
      severity: 'critical',
      title: 'SQL injection via string interpolation',
      detail:
        'User input is concatenated directly into the query string. Use parameterized queries or a prepared statement so input is never treated as SQL.',
    },
    {
      severity: 'high',
      title: 'Missing input validation',
      detail:
        'The userId is used without checking type or presence. Validate and coerce inputs before the query to avoid runtime errors and abuse.',
    },
    {
      severity: 'medium',
      title: 'Errors are swallowed',
      detail:
        'The empty catch block hides failures. Log the error with context and rethrow or return a typed error so callers can react.',
    },
    {
      severity: 'low',
      title: 'Inconsistent async handling',
      detail: 'Mixing callbacks and promises makes control flow hard to follow. Standardize on async/await.',
    },
  ],
  securityNotes: [
    'Never build SQL by concatenating user input — use parameter binding.',
    'Apply least-privilege database credentials for the app runtime.',
    'Return generic error messages to clients; keep stack traces server-side.',
  ],
  improvedSnippet: `async function getUserOrders(db, userId) {
  if (!Number.isInteger(userId)) {
    throw new TypeError('userId must be an integer')
  }

  try {
    // Parameterized query — input is bound, never interpolated
    const rows = await db.query(
      'SELECT id, total, created_at FROM orders WHERE user_id = $1',
      [userId]
    )
    return rows
  } catch (err) {
    console.error('getUserOrders failed', { userId, err })
    throw err
  }
}`,
}
