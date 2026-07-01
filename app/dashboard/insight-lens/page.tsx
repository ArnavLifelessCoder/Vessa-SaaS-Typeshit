'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { exampleInsight } from '@/lib/examples'
import type { InsightResult } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

function insightText(r: InsightResult): string {
  return [
    'INSIGHTS',
    `Sentiment: ${r.sentiment}`,
    `Topics: ${r.topics.join(', ')}`,
    '',
    'Summary:',
    r.summary,
    '',
    'Key points:',
    ...r.keyPoints.map((p) => `- ${p}`),
    '',
    'Action items:',
    ...r.actionItems.map((a) => `- [${a.owner}] ${a.task}`),
  ].join('\n')
}

export default function InsightLensPage() {
  const toast = useToast()
  const [sourceText, setSourceText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InsightResult | null>(null)
  const [error, setError] = useState('')

  async function handleAnalyze() {
    if (!sourceText.trim() || sourceText.length < 50) {
      setError('Please paste at least 50 characters to analyze.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ai/insights-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      toast('Insights extracted', 'success')
      recordRun({
        toolId: 'insight-lens',
        toolName: 'InsightLens',
        icon: 'scan',
        href: '/dashboard/insight-lens',
        summary: `${data.keyPoints.length} key points, ${data.actionItems.length} actions`,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  useSubmitShortcut(handleAnalyze, !loading)

  const sentimentBadge = (s: string) => {
    const map: Record<string, string> = {
      Positive: 'badge badge-success',
      Neutral: 'badge badge-neutral',
      Mixed: 'badge badge-warning',
      Negative: 'badge badge-danger',
    }
    return map[s] || 'badge badge-neutral'
  }

  return (
    <div className={styles.toolPage}>
      <div className={styles.toolHeader}>
        <span className={styles.toolHeaderIcon}><Icon name="scan" size={22} /></span>
        <div>
          <h2>InsightLens</h2>
          <p>Drop in notes, transcripts, or long documents and get a summary, key points, and action items.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="fileText" size={16} /> Source text</span>
            <button className="example-btn" onClick={() => { setSourceText(exampleInsight); setError('') }}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <textarea
              className="form-textarea"
              rows={14}
              placeholder="Paste meeting notes, a call transcript, or any long document here…"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              style={{ minHeight: '320px' }}
            />
            <span className="char-count">{sourceText.length.toLocaleString()} characters</span>
          </div>
          {error && <div className={styles.inlineError}>{error}</div>}
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAnalyze} disabled={loading}>
            {loading ? <><span className="spinner" /> Analyzing…</> : <><Icon name="scan" size={17} /> Extract insights</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="barChart" size={16} /> Insights</span>
            {result && <ResultActions text={insightText(result)} filename="insights.txt" />}
          </div>

          {!result && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="scan" size={30} /></span>
              <p>Paste content and run the analysis to get a structured, decision-ready breakdown.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is reading your document…</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <div className={styles.insightSummary}>
                <div className={styles.insightSummaryHead}>
                  <h4>Summary</h4>
                  <span className={sentimentBadge(result.sentiment)}>{result.sentiment}</span>
                </div>
                <p>{result.summary}</p>
                <div className={styles.topicTags}>
                  {result.topics.map((t) => (
                    <span key={t} className="badge badge-accent">{t}</span>
                  ))}
                </div>
              </div>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="check" size={16} /> Key points ({result.keyPoints.length})
              </h4>
              <ul className={styles.missingList}>
                {result.keyPoints.map((p, i) => (
                  <li key={i} className={styles.keyPointItem}>
                    <Icon name="check" size={15} className={styles.checkIconOutput} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="target" size={16} /> Action items ({result.actionItems.length})
              </h4>
              <ul className={styles.actionList}>
                {result.actionItems.map((a, i) => (
                  <li key={i} className={styles.actionItem}>
                    <span className={styles.actionOwner}>{a.owner}</span>
                    <span>{a.task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
