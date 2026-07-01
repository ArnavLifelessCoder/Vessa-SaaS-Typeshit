'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { exampleWorkflow } from '@/lib/examples'
import type { WorkflowResult } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

const BUSINESS_TYPES = [
  'Fitness Coach',
  'Real Estate Agent',
  'Online Tutor',
  'Business Consultant',
  'Life Coach',
  'Pet Groomer',
  'Photographer',
  'Nutritionist',
  'Other',
]

type Section = 'onboarding' | 'plan' | 'schedule' | 'email'

function workflowText(r: WorkflowResult): string {
  return [
    'CLIENT WORKFLOW',
    '',
    'Onboarding checklist:',
    ...r.onboardingSteps.map((s, i) => `${i + 1}. ${s}`),
    '',
    'Custom plan:',
    r.customPlan,
    '',
    'Follow-up schedule:',
    ...r.followUpSchedule.map((f) => `${f.day} — ${f.action}`),
    '',
    'Email template:',
    r.emailTemplate,
  ].join('\n')
}

export default function FlowPilotPage() {
  const toast = useToast()
  const [businessType, setBusinessType] = useState('Fitness Coach')
  const [clientName, setClientName] = useState('')
  const [clientGoals, setClientGoals] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WorkflowResult | null>(null)
  const [activeSection, setActiveSection] = useState<Section>('onboarding')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!clientName.trim() || !clientGoals.trim()) {
      setError('Please fill in client name and goals.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/ai/workflow-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, clientName, clientGoals, budget }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setActiveSection('onboarding')
      toast('Workflow generated', 'success')
      recordRun({
        toolId: 'flow-pilot',
        toolName: 'FlowPilot',
        icon: 'workflow',
        href: '/dashboard/flow-pilot',
        summary: `${businessType} workflow for ${clientName}`,
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
    setBusinessType(exampleWorkflow.businessType)
    setClientName(exampleWorkflow.clientName)
    setClientGoals(exampleWorkflow.clientGoals)
    setBudget(exampleWorkflow.budget)
    setError('')
  }

  function handleCopyEmail() {
    if (result?.emailTemplate) {
      navigator.clipboard.writeText(result.emailTemplate)
      setCopied(true)
      toast('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={styles.toolPage}>
      <div className={styles.toolHeader}>
        <span className={styles.toolHeaderIcon}><Icon name="workflow" size={22} /></span>
        <div>
          <h2>FlowPilot</h2>
          <p>Enter client details and generate a complete onboarding workflow, plan, and templates.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="users" size={16} /> Client details</span>
            <button className="example-btn" onClick={fillExample}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fp-business">Business type</label>
            <select id="fp-business" className="form-select" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
              {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fp-name">Client name</label>
            <input id="fp-name" type="text" className="form-input" placeholder="e.g., Sarah Chen" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fp-goals">Client goals / requirements</label>
            <textarea id="fp-goals" className="form-textarea" rows={5} placeholder="Describe what the client wants to achieve, experience level, constraints, etc." value={clientGoals} onChange={(e) => setClientGoals(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fp-budget">Budget range (optional)</label>
            <input id="fp-budget" type="text" className="form-input" placeholder="e.g., $200-300/month" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>

          {error && <div className={styles.inlineError}>{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Generating workflow…</> : <><Icon name="workflow" size={17} /> Generate workflow</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="target" size={16} /> Generated workflow</span>
            {result && <ResultActions text={workflowText(result)} filename="client-workflow.txt" />}
          </div>

          {!result && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="workflow" size={30} /></span>
              <p>Fill in client details and generate to create a complete, ready-to-use workflow.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is building your workflow…</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <div className="tabs">
                <button className={`tab ${activeSection === 'onboarding' ? 'active' : ''}`} onClick={() => setActiveSection('onboarding')}><Icon name="check" size={14} /> Onboarding</button>
                <button className={`tab ${activeSection === 'plan' ? 'active' : ''}`} onClick={() => setActiveSection('plan')}><Icon name="target" size={14} /> Plan</button>
                <button className={`tab ${activeSection === 'schedule' ? 'active' : ''}`} onClick={() => setActiveSection('schedule')}><Icon name="calendar" size={14} /> Follow-up</button>
                <button className={`tab ${activeSection === 'email' ? 'active' : ''}`} onClick={() => setActiveSection('email')}><Icon name="mail" size={14} /> Email</button>
              </div>

              {activeSection === 'onboarding' && (
                <div className={styles.workflowSection}>
                  <ul className={styles.onboardingSteps}>
                    {result.onboardingSteps.map((step, i) => (
                      <li key={i} className={styles.onboardingStep}>
                        <span className={styles.stepNum}>{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSection === 'plan' && (
                <div className={styles.workflowSection}>
                  <div className={styles.planContent}>{result.customPlan}</div>
                </div>
              )}

              {activeSection === 'schedule' && (
                <div className={styles.workflowSection}>
                  <table className={styles.scheduleTable}>
                    <thead>
                      <tr><th>When</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {result.followUpSchedule.map((item, i) => (
                        <tr key={i}><td>{item.day}</td><td>{item.action}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeSection === 'email' && (
                <div className={styles.workflowSection}>
                  <div className={styles.workflowSectionHead}>
                    <h4>Client email template</h4>
                    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyEmail}>
                      {copied ? <><Icon name="check" size={14} /> Copied</> : <><Icon name="copy" size={14} /> Copy</>}
                    </button>
                  </div>
                  <div className={styles.planContent}>{result.emailTemplate}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
