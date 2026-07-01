// AI wrapper — provider-flexible. Supports free tiers (Google Gemini, Groq),
// paid Anthropic Claude, and a zero-cost demo mode with no key at all.

import {
  demoContractReview,
  demoContentOutputs,
  demoWorkflowResult,
  type ContractReviewResult,
  type ContentOutput,
  type WorkflowResult,
} from './demo-data';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PLACEHOLDERS = ['', 'your_claude_api_key', 'your_gemini_api_key', 'your_groq_api_key'];
const has = (key?: string) => !!key && !PLACEHOLDERS.includes(key);

export type Provider = 'gemini' | 'groq' | 'anthropic' | 'demo';
type LiveProvider = Exclude<Provider, 'demo'>;

const LABELS: Record<LiveProvider, string> = {
  gemini: 'Gemini 2.0 Flash',
  groq: 'Llama 3.3 70B (Groq)',
  anthropic: 'Claude Sonnet 4',
};

/** Every provider that has a usable key, in preference order. */
function availableProviders(): LiveProvider[] {
  const list: LiveProvider[] = [];
  if (has(GEMINI_API_KEY)) list.push('gemini');
  if (has(GROQ_API_KEY)) list.push('groq');
  if (has(ANTHROPIC_API_KEY)) list.push('anthropic');
  return list;
}

export function activeProvider(): Provider {
  return availableProviders()[0] ?? 'demo';
}

/** Friendly label for the UI — reflects best-of mode when >1 key is set. */
export function modelLabel(): string {
  const p = availableProviders();
  if (p.length === 0) return 'Demo mode';
  if (p.length === 1) return LABELS[p[0]];
  return `${p.map((x) => LABELS[x]).join(' + ')} · best of ${p.length}`;
}

function isDemoMode(): boolean {
  return availableProviders().length === 0;
}

/** Strip markdown code fences some models wrap JSON in. */
function cleanJson(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Heuristic quality score for a parsed JSON response. Rewards completeness
 * (more populated fields/array items and richer text) so the more thorough
 * of two valid answers wins. Text length is capped so rambling isn't rewarded.
 */
function scoreJson(v: unknown): number {
  if (Array.isArray(v)) return v.reduce<number>((s, x) => s + scoreJson(x), v.length * 8);
  if (v && typeof v === 'object') {
    return Object.values(v as Record<string, unknown>).reduce<number>((s, x) => s + scoreJson(x), 0);
  }
  if (typeof v === 'string') return Math.min(v.trim().length, 500);
  if (typeof v === 'number' || typeof v === 'boolean') return 4;
  return 0;
}

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status} — ${await res.text()}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callGroq(systemPrompt: string, userMessage: string): Promise<string> {
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq API error: ${res.status} — ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

async function callAnthropic(systemPrompt: string, userMessage: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API error: ${res.status} — ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text;
}

const CALLERS: Record<LiveProvider, (s: string, u: string) => Promise<string>> = {
  gemini: callGemini,
  groq: callGroq,
  anthropic: callAnthropic,
};

/**
 * Routes to the configured provider(s). With a single key it calls that
 * provider. With two or more keys it runs them in parallel and returns the
 * best-scoring valid-JSON response ("best of N"). Returns clean JSON text.
 */
async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const providers = availableProviders();
  if (providers.length === 0) throw new Error('No AI provider configured');

  if (providers.length === 1) {
    return cleanJson(await CALLERS[providers[0]](systemPrompt, userMessage));
  }

  // Best-of-N: call every provider in parallel, keep valid JSON, pick the richest.
  const settled = await Promise.allSettled(
    providers.map((p) => CALLERS[p](systemPrompt, userMessage))
  );

  const candidates: { text: string; score: number }[] = [];
  for (const r of settled) {
    if (r.status !== 'fulfilled') continue;
    const text = cleanJson(r.value);
    try {
      candidates.push({ text, score: scoreJson(JSON.parse(text)) });
    } catch {
      // discard responses that aren't valid JSON
    }
  }

  if (candidates.length === 0) {
    const firstOk = settled.find((r) => r.status === 'fulfilled') as
      | PromiseFulfilledResult<string>
      | undefined;
    if (firstOk) return cleanJson(firstOk.value);
    throw new Error('All AI providers failed to respond');
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].text;
}

// --- Contract Review ---
export async function reviewContract(contractText: string): Promise<ContractReviewResult> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 2000)); // simulate latency
    return demoContractReview;
  }

  const systemPrompt = `You are an expert contract attorney and legal risk analyst. Analyze the provided contract text and identify liability traps, unfair terms, missing protections, and ambiguous language.

Return your analysis as valid JSON with this exact structure:
{
  "riskScore": "Low" | "Medium" | "High" | "Critical",
  "riskPercentage": number (0-100),
  "flaggedClauses": [
    {
      "severity": "low" | "medium" | "high" | "critical",
      "section": "section reference",
      "clause": "exact quoted text",
      "explanation": "why this is risky"
    }
  ],
  "missingProtections": ["description of missing protection"],
  "summary": "overall assessment"
}

Be thorough but practical. Focus on clauses that could cause real financial or legal harm.`;

  const result = await callClaude(systemPrompt, `Please review this contract:\n\n${contractText}`);
  return JSON.parse(result);
}

// --- Content Repurposing ---
export async function repurposeContent(
  sourceContent: string,
  platforms: string[]
): Promise<ContentOutput[]> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 2500));
    return demoContentOutputs.filter((o) => platforms.includes(o.platform));
  }

  const systemPrompt = `You are an expert content strategist who excels at adapting content for different platforms. Given source content, repurpose it for the requested platforms.

For each platform, adapt the tone, format, and length appropriately:
- LinkedIn Post: Professional, thought-leadership tone. 1000-1300 characters. Use line breaks and emojis strategically.
- Twitter/X Thread: Punchy, conversational. Number each tweet. 5-8 tweets of 280 chars each.
- YouTube Short Script: Hook (3s), Problem (7s), Solution (15s), Proof (15s), CTA (10s). Include [TEXT OVERLAY] suggestions.
- Email Newsletter: Conversational, personal tone. Include subject line. 400-600 words.

Return as valid JSON array:
[{ "platform": "platform name", "content": "full content" }]`;

  const result = await callClaude(
    systemPrompt,
    `Repurpose this content for these platforms: ${platforms.join(', ')}\n\nSource content:\n${sourceContent}`
  );
  return JSON.parse(result);
}

// --- Workflow Generation ---
export async function generateWorkflow(
  businessType: string,
  clientName: string,
  clientGoals: string,
  budget?: string
): Promise<WorkflowResult> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 2000));
    return demoWorkflowResult;
  }

  const systemPrompt = `You are an expert business consultant specializing in ${businessType} businesses. Generate a complete client onboarding workflow, custom plan, follow-up schedule, and client communication template.

Return as valid JSON:
{
  "onboardingSteps": ["step 1", "step 2", ...],
  "customPlan": "detailed markdown-formatted plan",
  "followUpSchedule": [{ "day": "Day 1", "action": "description" }],
  "emailTemplate": "full email with subject line"
}

Make the plan highly specific to the ${businessType} industry. Be practical and actionable.`;

  const budgetInfo = budget ? `\nBudget: ${budget}` : '';
  const result = await callClaude(
    systemPrompt,
    `Create a complete workflow for:\nBusiness Type: ${businessType}\nClient Name: ${clientName}\nClient Goals: ${clientGoals}${budgetInfo}`
  );
  return JSON.parse(result);
}

// ============================================================
// New tools: ReplyForge, PitchCraft, InsightLens
// ============================================================
import {
  demoEmailReplies,
  demoProposalResult,
  demoInsightResult,
  type EmailReply,
  type ProposalResult,
  type InsightResult,
} from './demo-data';

// --- ReplyForge: smart email replies ---
export async function draftReplies(
  originalMessage: string,
  intent: string
): Promise<EmailReply[]> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 1800));
    return demoEmailReplies;
  }

  const systemPrompt = `You are an expert business communication assistant. Given an original message and the sender's desired intent, draft three reply options in different tones: Professional, Friendly, and Firm.

Each reply must be complete, ready-to-send, and include a subject line. Keep them concise and natural.

Return valid JSON only:
[{ "tone": "Professional" | "Friendly" | "Firm", "subject": "subject line", "body": "full email body" }]`;

  const result = await callClaude(
    systemPrompt,
    `Original message:\n${originalMessage}\n\nMy intent for the reply:\n${intent}`
  );
  return JSON.parse(result);
}

// --- PitchCraft: proposals & outreach ---
export async function generateProposal(
  service: string,
  prospect: string,
  projectDetails: string
): Promise<ProposalResult> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 2200));
    return demoProposalResult;
  }

  const systemPrompt = `You are an expert business development strategist and copywriter. Generate a persuasive, professional client proposal plus outreach emails.

Return valid JSON only:
{
  "overview": "one-paragraph executive summary",
  "sections": [{ "title": "section title", "content": "section body (may use \\n line breaks)" }],
  "coldEmail": "a short, compelling cold outreach email with a subject line",
  "followUpEmail": "a polite follow-up email with a subject line"
}

Include sections for Objectives, Scope of Work, Timeline, and Investment. Be specific and confident.`;

  const result = await callClaude(
    systemPrompt,
    `Service offered: ${service}\nProspect / client: ${prospect}\nProject details: ${projectDetails}`
  );
  return JSON.parse(result);
}

// --- InsightLens: document & meeting intelligence ---
export async function extractInsights(sourceText: string): Promise<InsightResult> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 2000));
    return demoInsightResult;
  }

  const systemPrompt = `You are an expert analyst. Read the provided document, transcript, or meeting notes and extract a structured summary.

Return valid JSON only:
{
  "summary": "concise 2-4 sentence executive summary",
  "keyPoints": ["most important takeaways"],
  "actionItems": [{ "owner": "person or team", "task": "clear action" }],
  "topics": ["short topic tags"],
  "sentiment": "Positive" | "Neutral" | "Mixed" | "Negative"
}`;

  const result = await callClaude(systemPrompt, `Analyze this content:\n\n${sourceText}`);
  return JSON.parse(result);
}

// ============================================================
// New tools: RankForge (SEO), BrandForge, DevLens (code review)
// ============================================================
import {
  demoSeoResult,
  demoBrandResult,
  demoCodeReview,
  type SeoResult,
  type BrandResult,
  type CodeReviewResult,
} from './demo-data';

// --- RankForge: SEO optimizer ---
export async function optimizeSeo(topic: string, pageType: string): Promise<SeoResult> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 2000));
    return demoSeoResult;
  }

  const systemPrompt = `You are an expert SEO strategist. Given a topic and page type, produce an on-page SEO plan.

Return valid JSON only:
{
  "metaTitle": "under 60 characters, keyword-forward",
  "metaDescription": "under 155 characters, compelling",
  "slug": "kebab-case-url-slug",
  "primaryKeyword": "the main target keyword",
  "secondaryKeywords": ["supporting keywords"],
  "outline": [{ "heading": "H2 heading", "points": ["bullet points to cover"] }],
  "faqs": [{ "question": "common question", "answer": "concise answer" }]
}`;

  const result = await callClaude(
    systemPrompt,
    `Topic: ${topic}\nPage type: ${pageType}`
  );
  return JSON.parse(result);
}

// --- BrandForge: brand identity ---
export async function generateBrand(description: string, vibe: string): Promise<BrandResult> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 2000));
    return demoBrandResult;
  }

  const systemPrompt = `You are an expert brand strategist and naming consultant. Given a business description and desired vibe, generate a brand identity starter kit.

Return valid JSON only:
{
  "names": [{ "name": "brand name", "rationale": "why it works" }],
  "taglines": ["short memorable taglines"],
  "valueProposition": "one clear sentence",
  "toneWords": ["adjectives describing the voice"],
  "colorStory": "a short description of a fitting color palette and what it signals"
}

Provide at least 5 names and 4 taglines. Avoid trademarked or well-known brand names.`;

  const result = await callClaude(
    systemPrompt,
    `Business: ${description}\nDesired vibe: ${vibe}`
  );
  return JSON.parse(result);
}

// --- DevLens: code review ---
export async function reviewCode(code: string, language: string): Promise<CodeReviewResult> {
  if (isDemoMode()) {
    await new Promise((r) => setTimeout(r, 2200));
    return demoCodeReview;
  }

  const systemPrompt = `You are a senior staff engineer performing a rigorous code review. Identify bugs, security issues, and maintainability problems, then provide an improved version.

Return valid JSON only:
{
  "language": "detected or provided language",
  "summary": "2-3 sentence overview of the code quality",
  "issues": [{ "severity": "low" | "medium" | "high" | "critical", "title": "short title", "detail": "explanation and fix" }],
  "securityNotes": ["security best practices relevant to this code"],
  "improvedSnippet": "a safer, cleaner rewrite of the code"
}`;

  const languageHint = language && language !== 'Auto-detect' ? `Language: ${language}\n\n` : '';
  const result = await callClaude(systemPrompt, `${languageHint}Review this code:\n\n${code}`);
  return JSON.parse(result);
}
