import type { IconName } from '@/components/Icon'

export interface ToolMeta {
  id: string
  name: string
  href: string
  icon: IconName
  category: string
  tagline: string
  description: string
  features: string[]
}

export const tools: ToolMeta[] = [
  {
    id: 'contract-guard',
    name: 'ContractGuard',
    href: '/dashboard/contract-guard',
    icon: 'shield',
    category: 'Legal & Risk',
    tagline: 'Instant contract risk analysis',
    description:
      'Paste any contract and get an AI risk assessment — flagged clauses, missing protections, and a clear risk score in plain English.',
    features: [
      'Liability trap detection',
      'Missing protection alerts',
      'Risk scoring, low to critical',
      'Plain-English explanations',
    ],
  },
  {
    id: 'content-forge',
    name: 'ContentForge',
    href: '/dashboard/content-forge',
    icon: 'layers',
    category: 'Marketing',
    tagline: 'One input, every platform',
    description:
      'Turn a single piece of content into platform-ready posts for LinkedIn, X, YouTube Shorts, and email newsletters.',
    features: [
      'LinkedIn thought leadership',
      'X / Twitter threads',
      'YouTube Short scripts',
      'Email newsletters',
    ],
  },
  {
    id: 'flow-pilot',
    name: 'FlowPilot',
    href: '/dashboard/flow-pilot',
    icon: 'workflow',
    category: 'Operations',
    tagline: 'Client workflows on autopilot',
    description:
      'Generate complete client onboarding checklists, custom plans, follow-up schedules, and communication templates.',
    features: [
      'Client intake automation',
      'Custom plan generation',
      'Follow-up scheduling',
      'Client email templates',
    ],
  },
  {
    id: 'reply-forge',
    name: 'ReplyForge',
    href: '/dashboard/reply-forge',
    icon: 'mail',
    category: 'Communication',
    tagline: 'Perfect replies in seconds',
    description:
      'Paste any message and your intent — get three ready-to-send reply drafts in professional, friendly, and firm tones.',
    features: [
      'Three tone variations',
      'Subject lines included',
      'Context-aware drafting',
      'One-click copy',
    ],
  },
  {
    id: 'pitch-craft',
    name: 'PitchCraft',
    href: '/dashboard/pitch-craft',
    icon: 'penTool',
    category: 'Sales',
    tagline: 'Proposals that win deals',
    description:
      'Generate structured client proposals with objectives, scope, timeline, and investment — plus cold and follow-up emails.',
    features: [
      'Full proposal outline',
      'Scope & timeline drafting',
      'Cold outreach email',
      'Follow-up sequence',
    ],
  },
  {
    id: 'insight-lens',
    name: 'InsightLens',
    href: '/dashboard/insight-lens',
    icon: 'scan',
    category: 'Productivity',
    tagline: 'Documents into decisions',
    description:
      'Drop in meeting notes, transcripts, or long documents and get a summary, key points, action items, and sentiment.',
    features: [
      'Executive summaries',
      'Key point extraction',
      'Action items with owners',
      'Sentiment analysis',
    ],
  },
  {
    id: 'rank-forge',
    name: 'RankForge',
    href: '/dashboard/rank-forge',
    icon: 'trendingUp',
    category: 'SEO',
    tagline: 'Rank-ready content plans',
    description:
      'Enter a topic and get an on-page SEO kit — meta title and description, URL slug, target keywords, a content outline, and FAQ schema.',
    features: [
      'Optimized meta tags',
      'Primary & secondary keywords',
      'Full content outline',
      'FAQ suggestions',
    ],
  },
  {
    id: 'brand-forge',
    name: 'BrandForge',
    href: '/dashboard/brand-forge',
    icon: 'megaphone',
    category: 'Branding',
    tagline: 'A brand identity in seconds',
    description:
      'Describe your business and get name ideas with rationale, taglines, a value proposition, tone of voice, and a color story.',
    features: [
      'Brand name ideas',
      'Taglines & value prop',
      'Tone-of-voice words',
      'Color palette story',
    ],
  },
  {
    id: 'dev-lens',
    name: 'DevLens',
    href: '/dashboard/dev-lens',
    icon: 'code',
    category: 'Engineering',
    tagline: 'Senior-level code review',
    description:
      'Paste code and get a prioritized review — bugs, security risks, and maintainability issues, plus a cleaner rewritten snippet.',
    features: [
      'Bug & risk detection',
      'Security best practices',
      'Severity-ranked issues',
      'Improved code snippet',
    ],
  },
]
