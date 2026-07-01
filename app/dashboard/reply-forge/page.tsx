'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { exampleReplyMessage, exampleReplyIntent } from '@/lib/examples'
import type { EmailReply } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

export default function ReplyForgePage() {
  const toast = useToast()
  const [originalMessage, setOriginalMessage] = useState('')
  const [intent, setIntent] = useState('')
  const [loading, setLoading] = useState(false)
  const [replies, setReplies] = useState<EmailReply[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!originalMessage.trim() || !intent.trim()) {
      setError('Please paste the message and describe how you want to reply.')
      return
    }
    setLoading(true)
    setError('')
    setReplies([])
    try {
      const res = await fetch('/api/ai/reply-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalMessage, intent }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReplies(data)
      setActiveTab(0)
      toast(`Drafted ${data.length} replies`, 'success')
      recordRun({
        toolId: 'reply-forge',
        toolName: 'ReplyForge',
        icon: 'mail',
        href: '/dashboard/reply-forge',
        summary: `${data.length} reply drafts generated`,
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
    setOriginalMessage(exampleReplyMessage)
    setIntent(exampleReplyIntent)
    setError('')
  }

  function handleCopy() {
    const r = replies[activeTab]
    if (r) {
      navigator.clipboard.writeText(`Subject: ${r.subject}\n\n${r.body}`)
      setCopied(true)
      toast('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={styles.toolPage}>
      <div className={styles.toolHeader}>
        <span className={styles.toolHeaderIcon}><Icon name="mail" size={22} /></span>
        <div>
          <h2>ReplyForge</h2>
          <p>Paste any message and your intent — get three ready-to-send replies in different tones.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="mail" size={16} /> Message to reply to</span>
            <button className="example-btn" onClick={fillExample}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <textarea
              className="form-textarea"
              rows={7}
              placeholder="Paste the email or message you received here…"
              value={originalMessage}
              onChange={(e) => setOriginalMessage(e.target.value)}
              style={{ minHeight: '160px' }}
            />
            <span className="char-count">{originalMessage.length.toLocaleString()} characters</span>
          </div>

          <h4 className={styles.panelTitle}><Icon name="target" size={16} /> Your intent</h4>
          <div className="form-group">
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="What do you want to say? e.g., Agree to the timeline but push delivery to the 28th."
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
            />
          </div>

          {error && <div className={styles.inlineError}>{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Drafting replies…</> : <><Icon name="sparkle" size={17} /> Draft replies</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="sparkle" size={16} /> Reply drafts</span>
            {replies.length > 0 && (
              <ResultActions
                text={replies.map((r) => `[${r.tone}]\nSubject: ${r.subject}\n\n${r.body}`).join('\n\n---\n\n')}
                filename="reply-drafts.txt"
              />
            )}
          </div>

          {replies.length === 0 && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="mail" size={30} /></span>
              <p>Paste a message and your intent to get three tone variations you can send.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is drafting your replies…</p>
            </div>
          )}

          {replies.length > 0 && (
            <div className="animate-fade-in">
              <div className="tabs">
                {replies.map((r, i) => (
                  <button key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
                    {r.tone}
                  </button>
                ))}
              </div>

              <div className={styles.contentOutput}>
                <div className={styles.contentOutputHeader}>
                  <div className={styles.replySubject}>
                    <span className={styles.replySubjectLabel}>Subject</span>
                    {replies[activeTab].subject}
                  </div>
                  <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
                    {copied ? <><Icon name="check" size={14} /> Copied</> : <><Icon name="copy" size={14} /> Copy</>}
                  </button>
                </div>
                <div className={styles.contentOutputBody}>{replies[activeTab].body}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
