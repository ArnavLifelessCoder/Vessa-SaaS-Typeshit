'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { exampleSeoTopic } from '@/lib/examples'
import type { SeoResult } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

const PAGE_TYPES = ['Blog post', 'Landing page', 'Product page', 'Comparison / listicle', 'Guide / tutorial']

function seoText(r: SeoResult): string {
  return [
    'SEO PLAN',
    `Meta title: ${r.metaTitle}`,
    `Meta description: ${r.metaDescription}`,
    `Slug: /${r.slug}`,
    `Primary keyword: ${r.primaryKeyword}`,
    `Secondary keywords: ${r.secondaryKeywords.join(', ')}`,
    '',
    'Content outline:',
    ...r.outline.map((s) => `## ${s.heading}\n${s.points.map((p) => `- ${p}`).join('\n')}`),
    '',
    'FAQs:',
    ...r.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
  ].join('\n')
}

export default function RankForgePage() {
  const toast = useToast()
  const [topic, setTopic] = useState('')
  const [pageType, setPageType] = useState('Blog post')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SeoResult | null>(null)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!topic.trim()) {
      setError('Please enter a topic or target keyword.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ai/seo-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, pageType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      toast('SEO plan ready', 'success')
      recordRun({
        toolId: 'rank-forge',
        toolName: 'RankForge',
        icon: 'trendingUp',
        href: '/dashboard/rank-forge',
        summary: `SEO plan for “${topic}”`,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  useSubmitShortcut(handleGenerate, !loading)

  return (
    <div className={styles.toolPage}>
      <div className={styles.toolHeader}>
        <span className={styles.toolHeaderIcon}><Icon name="trendingUp" size={22} /></span>
        <div>
          <h2>RankForge</h2>
          <p>Enter a topic and get a complete on-page SEO plan — meta tags, keywords, outline, and FAQs.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="search" size={16} /> Target topic</span>
            <button className="example-btn" onClick={() => { setTopic(exampleSeoTopic); setError('') }}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rf-topic">Topic or target keyword</label>
            <input id="rf-topic" type="text" className="form-input" placeholder="e.g., ai contract review software" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rf-type">Page type</label>
            <select id="rf-type" className="form-select" value={pageType} onChange={(e) => setPageType(e.target.value)}>
              {PAGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {error && <div className={styles.inlineError}>{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Building plan…</> : <><Icon name="trendingUp" size={17} /> Build SEO plan</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="fileText" size={16} /> SEO plan</span>
            {result && <ResultActions text={seoText(result)} filename="seo-plan.txt" />}
          </div>

          {!result && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="trendingUp" size={30} /></span>
              <p>Enter a topic to generate meta tags, keywords, a content outline, and FAQs.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is building your SEO plan…</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <div className={styles.serpPreview}>
                <span className={styles.serpUrl}>vessa.app › {result.slug}</span>
                <span className={styles.serpTitle}>{result.metaTitle}</span>
                <span className={styles.serpDesc}>{result.metaDescription}</span>
              </div>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="target" size={16} /> Keywords
              </h4>
              <div className={styles.topicTags}>
                <span className="badge badge-accent">{result.primaryKeyword}</span>
                {result.secondaryKeywords.map((k) => (
                  <span key={k} className="badge badge-neutral">{k}</span>
                ))}
              </div>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="fileText" size={16} /> Content outline
              </h4>
              {result.outline.map((section, i) => (
                <div key={i} className={styles.proposalSection}>
                  <h5>{section.heading}</h5>
                  <ul className={styles.outlinePoints}>
                    {section.points.map((p, j) => (
                      <li key={j}><Icon name="check" size={14} className={styles.checkIconOutput} /> {p}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="sparkle" size={16} /> FAQ suggestions
              </h4>
              {result.faqs.map((f, i) => (
                <div key={i} className={styles.proposalSection}>
                  <h5>{f.question}</h5>
                  <div className={styles.proposalBody}>{f.answer}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
