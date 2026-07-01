// Single source of truth for pricing. Amounts are in paise (INR),
// since Razorpay (India) settles in INR. Change values here only.

export const CURRENCY = 'INR'

export interface Plan {
  id: 'starter' | 'pro' | 'business'
  name: string
  amount: number // in paise; 0 = free
  priceLabel: string
  period: string
  description: string
  features: string[]
  cta: string
  variant: 'outline' | 'primary'
  popular: boolean
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    amount: 0,
    priceLabel: '₹0',
    period: '/month',
    description: 'For individuals trying things out.',
    features: [
      '5 contract reviews / month',
      '10 content repurposes / month',
      '3 workflow generations / month',
      'Access to all nine tools',
      'Community support',
    ],
    cta: 'Get started free',
    variant: 'outline',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    amount: 79900, // ₹799
    priceLabel: '₹799',
    period: '/month',
    description: 'For professionals shipping every day.',
    features: [
      '100 runs / month per tool',
      'Priority AI processing',
      'Export & download results',
      'Advanced risk scoring',
      'Email support',
    ],
    cta: 'Upgrade to Pro',
    variant: 'primary',
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    amount: 159900, // ₹1,599
    priceLabel: '₹1,599',
    period: '/month',
    description: 'For teams that run on AI.',
    features: [
      'Unlimited runs across all tools',
      'Team collaboration, 5 seats',
      'Custom AI prompt library',
      'API access',
      'SSO, audit logs & priority support',
    ],
    cta: 'Go Business',
    variant: 'outline',
    popular: false,
  },
]

export function getPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id)
}
