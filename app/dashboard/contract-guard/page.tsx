'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { exampleContract } from '@/lib/examples'
import type { ContractReviewResult } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

function reportText(r: ContractReviewResult): string {
  return [
    'CONTRACT RISK REPORT',
    `Risk level: ${r.riskScore} (${r.riskPercentage}%)`,
    '',
    'Summary:',
    r.summary,
    '',
    'Flagged clauses:',
    ...r.flaggedClauses.map((c, i) => `${i + 1}. [${c.severity.toUpperCase()}] ${c.section}\n"${c.clause}"\n${c.explanation}`),
    '',
    'Missing protections:',
    ...r.missingProtections.map((m) => `- ${m}`),
  ].join('\n')
}

export default function ContractGuardPage() {
  const toast = useToast()
  const [contractText, setContractText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ContractReviewResult | null>(null)
  const [error, setError] = useState('')

  async function handleAnalyze() {
    if (!contractText.trim() || contractText.length < 50) {
      setError('Please enter at least 50 characters of contract text.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ai/contract-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      toast('Contract analyzed', 'success')
      recordRun({
        toolId: 'contract-guard',
        toolName: 'ContractGuard',
        icon: 'shield',
        href: '/dashboard/contract-guard',
        summary: `Risk ${data.riskScore} (${data.riskPercentage}%), ${data.flaggedClauses.length} clauses flagged`,
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
        <span className={styles.toolHeaderIcon}><Icon name="shield" size={22} /></span>
        <div>
          <h2>ContractGuard</h2>
          <p>Paste your contract and let AI surface liability traps, risky clauses, and missing protections.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="fileText" size={16} /> Contract text</span>
            <button className="example-btn" onClick={() => { setContractText(exampleContract); setError('') }}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <textarea
              className="form-textarea"
              rows={14}
              placeholder="Paste your contract, agreement, or legal document text here…"
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              style={{ minHeight: '320px' }}
            />
            <span className="char-count">{contractText.length.toLocaleString()} characters</span>
          </div>
          {error && <div className={styles.inlineError}>{error}</div>}
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAnalyze} disabled={loading}>
            {loading ? <><span className="spinner" /> Analyzing contract…</> : <><Icon name="scan" size={17} /> Analyze contract</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="barChart" size={16} /> Analysis results</span>
            {result && <ResultActions text={reportText(result)} filename="contract-risk-report.txt" />}
          </div>

          {!result && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="shield" size={30} /></span>
              <p>Paste a contract and run the analysis to see an AI-powered risk breakdown.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is reviewing your contract…</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <div className={styles.riskScoreCard}>
                <div className={`${styles.riskCircle} risk-${result.riskScore.toLowerCase()}`}>
                  {result.riskPercentage}%
                </div>
                <div className={styles.riskInfo}>
                  <h4>Risk level: {result.riskScore}</h4>
                  <p>{result.summary}</p>
                </div>
              </div>

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="alert" size={16} /> Flagged clauses ({result.flaggedClauses.length})
              </h4>
              {result.flaggedClauses.map((clause, i) => (
                <div key={i} className={styles.clauseCard}>
                  <div className={styles.clauseHeader}>
                    <span className={styles.clauseSection}>{clause.section}</span>
                    <span className={severityBadge(clause.severity)}>{clause.severity.toUpperCase()}</span>
                  </div>
                  <div className={styles.clauseQuote}>{clause.clause}</div>
                  <div className={styles.clauseExplanation}>{clause.explanation}</div>
                </div>
              ))}

              <h4 className={styles.panelTitle} style={{ marginTop: '1.5rem' }}>
                <Icon name="lock" size={16} /> Missing protections ({result.missingProtections.length})
              </h4>
              <ul className={styles.missingList}>
                {result.missingProtections.map((item, i) => (
                  <li key={i} className={styles.missingItem}>
                    <Icon name="x" size={15} className={styles.missingIcon} />
                    <span>{item}</span>
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
