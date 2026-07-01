// Prefill samples so users can try each tool in one click.

export const exampleContract = `SERVICE AGREEMENT

Section 3.1 — Payment Terms. Payment shall be rendered within 60 business days of invoice submission and acceptance by the Company.

Section 4.2 — Intellectual Property. All work product, ideas, and derivative works created during the engagement shall become the sole and exclusive property of the Company, including any pre-existing intellectual property incorporated therein.

Section 7.1 — Liability. The Contractor shall indemnify and hold harmless the Company against any and all claims, damages, losses, and expenses, without limitation.

Section 9.3 — Non-Compete. For a period of 24 months following termination, the Contractor shall not engage in any business that competes with the Company's current or anticipated future services.

Section 11 — Termination. Either party may terminate with 14 days written notice.`

export const exampleContent = `We spent six months rebuilding our onboarding flow, and the results surprised everyone. Activation jumped from 41% to 53% simply by removing three steps and adding a single progress indicator. The lesson: users don't churn because your product is complex, they churn because the first five minutes feel like work. Reduce time-to-value, show progress, and celebrate the first win. That's the whole playbook.`

export const exampleReplyMessage = `Hi, thanks for the proposal. The scope looks good but we're worried the timeline is too aggressive given the holidays. Can we revisit the delivery date and maybe trim a few of the nice-to-have features for phase one?`

export const exampleReplyIntent = `Agree the timeline is tight, propose locking scope by Friday and moving delivery to the 28th, and offer a quick call Thursday.`

export const examplePitch = {
  service: 'E-commerce storefront redesign and conversion optimization',
  prospect: 'Meridian Retail, a mid-size direct-to-consumer apparel brand',
  projectDetails:
    'Their mobile checkout has a high drop-off at the shipping step. Goal is to lift conversion 18-25% within 90 days. Budget is flexible for the right outcome. Traffic is 68% mobile.',
}

export const exampleInsight = `Team sync notes — Q3 review.
Alex: onboarding revamp shipped, 7-day activation up from 41% to 53%.
Priya: three enterprise trials are blocked by the billing sync bug, this is now our top priority.
Sam: support tickets down 18% since the in-app help center launched.
Dana: marketing wants to resume the paid campaign but we agreed to hold until the billing fix is verified in production.
Leadership approved two additional engineering hires for Q4.
Action: engineering ships the billing fix by end of week, marketing resumes campaign after verification, product documents the onboarding metrics for the board deck.`

export const exampleWorkflow = {
  businessType: 'Fitness Coach',
  clientName: 'Sarah Chen',
  clientGoals:
    'Lose 15 lbs of body fat while keeping muscle. Intermediate lifter, 4 days a week, previous lower back injury (cleared by physio).',
  budget: '$200-300/month',
}

export const exampleSeoTopic = 'AI contract review software for freelancers'

export const exampleBrand = {
  description:
    'A focused AI workspace with specialized tools for contracts, content, proposals, and client operations, aimed at solo professionals and small teams.',
  vibe: 'Modern, trustworthy, calm, and premium — confident without being flashy.',
}

export const exampleCode = `function getUserOrders(userId) {
  db.query("SELECT * FROM orders WHERE user_id = " + userId, (err, rows) => {
    try {
      return rows
    } catch (e) {}
  })
}`
