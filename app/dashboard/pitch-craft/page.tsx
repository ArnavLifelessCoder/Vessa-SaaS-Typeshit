'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { examplePitch } from '@/lib/examples'
import type { ProposalResult } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

type View = 'proposal' | 'cold' | 'followup'

function proposalText(r: ProposalResult): string {
  return [
    'PROPOSAL',
    '',
    r.overview,
    '',
    ...r.sections.map((s) => `${s.title.toUpperCase()}\n${s.content}`),
    '',
    'COLD EMAIL',
    r.coldEmail,
    '',
    'FOLLOW-UP EMAIL',
    r.followUpEmail,
  ].join('\n\n')
}

export default function PitchCraftPage() {
  const toast = useToast()
  const [service, setService] = useState('')
  const [prospect, setProspect] = useState('')
  const [projectDetails, setProjectDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ProposalResult | null>(null)
  const [view, setView] = useState<View>('proposal')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  async function handleGenerate() {
    if (!service.trim() || !prospect.trim() || !projectDetails.trim()) {
      setError('Please fill in the service, prospect, and project details.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ai/proposal-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, prospect, projectDetails }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setView('proposal')
      toast('Pitch generated', 'success')
      recordRun({
        toolId: 'pitch-craft',
        toolName: 'PitchCraft',
        icon: 'penTool',
        href: '/dashboard/pitch-craft',
        summary: `Proposal for ${prospect}`,
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
    setService(examplePitch.service)
    setProspect(examplePitch.prospect)
    setProjectDetails(examplePitch.projectDetails)
    setError('')
  }

  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    toast('Copied to clipboard')
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className={styles.toolPage}>
      <div className={styles.toolHeader}>
        <span className={styles.toolHeaderIcon}><Icon name="penTool" size={22} /></span>
        <div>
          <h2>PitchCraft</h2>
          <p>Turn a few details into a structured proposal plus cold and follow-up outreach emails.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="penTool" size={16} /> Pitch details</span>
            <button className="example-btn" onClick={fillExample}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pc-service">Service you offer</label>
            <input id="pc-service" type="text" className="form-input" placeholder="e.g., E-commerce storefront redesign" value={service} onChange={(e) => setService(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pc-prospect">Prospect / client</label>
            <input id="pc-prospect" type="text" className="form-input" placeholder="e.g., Meridian Retail (DTC brand)" value={prospect} onChange={(e) => setProspect(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pc-details">Project details</label>
            <textarea id="pc-details" className="form-textarea" rows={6} placeholder="Describe the goals, scope, budget range, and any context that matters…" value={projectDetails} onChange={(e) => setProjectDetails(e.target.value)} />
          </div>

          {error && <div className={styles.inlineError}>{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Building pitch…</> : <><Icon name="sparkle" size={17} /> Generate pitch</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="fileText" size={16} /> Generated pitch</span>
            {result && <ResultActions text={proposalText(result)} filename="proposal.txt" />}
          </div>

          {!result && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="penTool" size={30} /></span>
              <p>Fill in the details and generate a full proposal with ready-to-send outreach emails.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is crafting your pitch…</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <div className="tabs">
                <button className={`tab ${view === 'proposal' ? 'active' : ''}`} onClick={() => setView('proposal')}><Icon name="fileText" size={14} /> Proposal</button>
                <button className={`tab ${view === 'cold' ? 'active' : ''}`} onClick={() => setView('cold')}><Icon name="mail" size={14} /> Cold email</button>
                <button className={`tab ${view === 'followup' ? 'active' : ''}`} onClick={() => setView('followup')}><Icon name="clock" size={14} /> Follow-up</button>
              </div>

              {view === 'proposal' && (
                <div className={styles.workflowSection}>
                  <p className={styles.proposalOverview}>{result.overview}</p>
                  {result.sections.map((s, i) => (
                    <div key={i} className={styles.proposalSection}>
                      <h5>{s.title}</h5>
                      <div className={styles.proposalBody}>{s.content}</div>
                    </div>
                  ))}
                </div>
              )}

              {view === 'cold' && (
                <div className={styles.contentOutput}>
                  <div className={styles.contentOutputHeader}>
                    <h4>Cold outreach</h4>
                    <button className={`copy-btn ${copied === 'cold' ? 'copied' : ''}`} onClick={() => copy('cold', result.coldEmail)}>
                      {copied === 'cold' ? <><Icon name="check" size={14} /> Copied</> : <><Icon name="copy" size={14} /> Copy</>}
                    </button>
                  </div>
                  <div className={styles.contentOutputBody}>{result.coldEmail}</div>
                </div>
              )}

              {view === 'followup' && (
                <div className={styles.contentOutput}>
                  <div className={styles.contentOutputHeader}>
                    <h4>Follow-up email</h4>
                    <button className={`copy-btn ${copied === 'followup' ? 'copied' : ''}`} onClick={() => copy('followup', result.followUpEmail)}>
                      {copied === 'followup' ? <><Icon name="check" size={14} /> Copied</> : <><Icon name="copy" size={14} /> Copy</>}
                    </button>
                  </div>
                  <div className={styles.contentOutputBody}>{result.followUpEmail}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
