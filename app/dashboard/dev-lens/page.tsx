'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { exampleCode } from '@/lib/examples'
import type { CodeReviewResult } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

const LANGUAGES = ['Auto-detect', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Java', 'C#', 'Ruby', 'PHP', 'Rust', 'SQL']

function reviewText(r: CodeReviewResult): string {
  return [
    `CODE REVIEW (${r.language})`,
    '',
    r.summary,
    '',
    'Issues:',
    ...r.issues.map((i) => `[${i.severity.toUpperCase()}] ${i.title}\n${i.detail}`),
    '',
    'Security notes:',
    ...r.securityNotes.map((s) => `- ${s}`),
    '',
    'Improved snippet:',
    r.improvedSnippet,
  ].join('\n')
}

export default function DevLensPage() {
  const toast = useToast()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('Auto-detect')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CodeReviewResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleReview() {
    if (!code.trim() || code.length < 20) {
      setError('Please paste a bit more code to review.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      toast('Review complete', 'success')
      recordRun({
        toolId: 'dev-lens',
        toolName: 'DevLens',
        icon: 'code',
        href: '/dashboard/dev-lens',
        summary: `${data.issues.length} issues found (${data.language})`,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  useSubmitShortcut(handleReview, !loading)

  function copySnippet() {
    if (result?.improvedSnippet) {
      navigator.clipboard.writeText(result.improvedSnippet)
      setCopied(true)
      toast('Snippet copied')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const severityBadge = (severity: string) => {
    const map: Record<string, string> = {
      low: 'badge badge-success',
      medium: 'badge badge-warning',
      high: 'badge badge-danger',
      critical: 'badge badge-danger',
    }
    return map[severity] || 'badge badge-info'
  }

  return (
    <div className={styles.toolPage}>
      <div className={styles.toolHeader}>
        <span className={styles.toolHeaderIcon}><Icon name="code" size={22} /></span>
        <div>
          <h2>DevLens</h2>
          <p>Paste code and get a senior-level review: bugs, security risks, and a cleaner rewrite.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="code" size={16} /> Code</span>
            <button className="example-btn" onClick={() => { setCode(exampleCode); setError('') }}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dl-lang">Language</label>
            <select id="dl-lang" className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <textarea
              className={`form-textarea ${styles.codeInput}`}
              rows={12}
              placeholder="Paste your function, module, or snippet here…"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              style={{ minHeight: '260px' }}
            />
            <span className="char-count">{code.length.toLocaleString()} characters</span>
          </div>

          {error && <div className={styles.inlineError}>{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleReview} disabled={loading}>
            {loading ? <><span className="spinner" /> Reviewing…</> : <><Icon name="scan" size={17} /> Review code</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="barChart" size={16} /> Review</span>
            {result && <ResultActions text={reviewText(result)} filename="code-review.txt" />}
          </div>

          {!result && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="code" size={30} /></span>
              <p>Paste code and run the review to get prioritized issues and a safer rewrite.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is reviewing your code…</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <div className={styles.insightSummary}>
                <div className={styles.insightSummaryHead}>
                  <h4>Summary</h4>
                  <span className="badge badge-neutral">{result.language}</span>
                </div>
                <p style={{ margin: 0 }}>{result.summary}</p>
              </div>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="alert" size={16} /> Issues ({result.issues.length})
              </h4>
              {result.issues.map((issue, i) => (
                <div key={i} className={styles.clauseCard}>
                  <div className={styles.clauseHeader}>
                    <span className={styles.clauseSection}>{issue.title}</span>
                    <span className={severityBadge(issue.severity)}>{issue.severity.toUpperCase()}</span>
                  </div>
                  <div className={styles.clauseExplanation}>{issue.detail}</div>
                </div>
              ))}

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="lock" size={16} /> Security notes
              </h4>
              <ul className={styles.missingList}>
                {result.securityNotes.map((s, i) => (
                  <li key={i} className={styles.keyPointItem}>
                    <Icon name="shield" size={15} className={styles.checkIconOutput} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.workflowSectionHead} style={{ marginTop: '1.5rem' }}>
                <h4 className={styles.panelTitle} style={{ margin: 0 }}><Icon name="code" size={16} /> Improved snippet</h4>
                <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copySnippet}>
                  {copied ? <><Icon name="check" size={14} /> Copied</> : <><Icon name="copy" size={14} /> Copy</>}
                </button>
              </div>
              <pre className={styles.codeBlock}>{result.improvedSnippet}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
