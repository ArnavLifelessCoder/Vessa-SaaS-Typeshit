'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { exampleBrand } from '@/lib/examples'
import type { BrandResult } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

function brandText(r: BrandResult): string {
  return [
    'BRAND IDENTITY KIT',
    '',
    'Value proposition:',
    r.valueProposition,
    '',
    'Name ideas:',
    ...r.names.map((n) => `- ${n.name}: ${n.rationale}`),
    '',
    'Taglines:',
    ...r.taglines.map((t) => `- ${t}`),
    '',
    `Tone of voice: ${r.toneWords.join(', ')}`,
    '',
    'Color story:',
    r.colorStory,
  ].join('\n')
}

export default function BrandForgePage() {
  const toast = useToast()
  const [description, setDescription] = useState('')
  const [vibe, setVibe] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BrandResult | null>(null)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!description.trim()) {
      setError('Please describe your business.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ai/brand-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, vibe }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      toast('Brand kit generated', 'success')
      recordRun({
        toolId: 'brand-forge',
        toolName: 'BrandForge',
        icon: 'megaphone',
        href: '/dashboard/brand-forge',
        summary: `${data.names.length} name ideas, ${data.taglines.length} taglines`,
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

  function fillExample() {
    setDescription(exampleBrand.description)
    setVibe(exampleBrand.vibe)
    setError('')
  }

  return (
    <div className={styles.toolPage}>
      <div className={styles.toolHeader}>
        <span className={styles.toolHeaderIcon}><Icon name="megaphone" size={22} /></span>
        <div>
          <h2>BrandForge</h2>
          <p>Describe your business and get names, taglines, a value proposition, tone, and a color story.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="megaphone" size={16} /> Business details</span>
            <button className="example-btn" onClick={fillExample}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label" htmlFor="bf-desc">What does your business do?</label>
            <textarea
              id="bf-desc"
              className="form-textarea"
              rows={6}
              placeholder="Describe your product, who it's for, and what makes it different…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '150px' }}
            />
            <span className="char-count">{description.length.toLocaleString()} characters</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bf-vibe">Desired vibe (optional)</label>
            <input id="bf-vibe" type="text" className="form-input" placeholder="e.g., Modern, trustworthy, premium" value={vibe} onChange={(e) => setVibe(e.target.value)} />
          </div>

          {error && <div className={styles.inlineError}>{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Generating…</> : <><Icon name="sparkle" size={17} /> Generate brand kit</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="sparkle" size={16} /> Brand kit</span>
            {result && <ResultActions text={brandText(result)} filename="brand-kit.txt" />}
          </div>

          {!result && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="megaphone" size={30} /></span>
              <p>Describe your business to get names, taglines, tone of voice, and a color story.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is shaping your brand…</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <div className={styles.proposalOverview}>{result.valueProposition}</div>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="sparkle" size={16} /> Name ideas
              </h4>
              {result.names.map((n, i) => (
                <div key={i} className={styles.proposalSection}>
                  <h5>{n.name}</h5>
                  <div className={styles.proposalBody}>{n.rationale}</div>
                </div>
              ))}

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="megaphone" size={16} /> Taglines
              </h4>
              <ul className={styles.missingList}>
                {result.taglines.map((t, i) => (
                  <li key={i} className={styles.keyPointItem}>
                    <Icon name="check" size={15} className={styles.checkIconOutput} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="target" size={16} /> Tone of voice
              </h4>
              <div className={styles.topicTags}>
                {result.toneWords.map((w) => (
                  <span key={w} className="badge badge-accent">{w}</span>
                ))}
              </div>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="sparkle" size={16} /> Color story
              </h4>
              <div className={styles.insightSummary}>
                <p style={{ margin: 0 }}>{result.colorStory}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
