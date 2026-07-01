'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { ResultActions } from '@/components/ResultActions'
import { useToast } from '@/components/Toast'
import { recordRun } from '@/lib/store'
import { useSubmitShortcut } from '@/lib/useSubmitShortcut'
import { exampleContent } from '@/lib/examples'
import type { ContentOutput } from '@/lib/demo-data'
import styles from '../dashboard.module.css'

const PLATFORMS = [
  { id: 'LinkedIn Post', label: 'LinkedIn Post' },
  { id: 'Twitter/X Thread', label: 'X / Twitter Thread' },
  { id: 'YouTube Short Script', label: 'YouTube Short' },
  { id: 'Email Newsletter', label: 'Email Newsletter' },
]

export default function ContentForgePage() {
  const toast = useToast()
  const [sourceContent, setSourceContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LinkedIn Post', 'Twitter/X Thread'])
  const [loading, setLoading] = useState(false)
  const [outputs, setOutputs] = useState<ContentOutput[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const [error, setError] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  async function handleGenerate() {
    if (!sourceContent.trim()) {
      setError('Please enter some source content.')
      return
    }
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform.')
      return
    }
    setLoading(true)
    setError('')
    setOutputs([])
    try {
      const res = await fetch('/api/ai/content-repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceContent, platforms: selectedPlatforms }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOutputs(data)
      setActiveTab(0)
      toast(`Generated ${data.length} versions`, 'success')
      recordRun({
        toolId: 'content-forge',
        toolName: 'ContentForge',
        icon: 'layers',
        href: '/dashboard/content-forge',
        summary: `Repurposed into ${data.length} platform${data.length === 1 ? '' : 's'}`,
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

  function handleCopy(idx: number) {
    navigator.clipboard.writeText(outputs[idx].content)
    setCopiedIdx(idx)
    toast('Copied to clipboard')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className={styles.toolPage}>
      <div className={styles.toolHeader}>
        <span className={styles.toolHeaderIcon}><Icon name="layers" size={22} /></span>
        <div>
          <h2>ContentForge</h2>
          <p>Paste one piece of content, pick your platforms, and get optimized versions for each.</p>
        </div>
      </div>

      <div className={styles.toolGrid}>
        <div className={styles.toolInputPanel}>
          <div className="field-header">
            <span className="panelTitle-inline"><Icon name="fileText" size={16} /> Source content</span>
            <button className="example-btn" onClick={() => { setSourceContent(exampleContent); setError('') }}>
              <Icon name="sparkle" size={13} /> Try example
            </button>
          </div>
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <textarea
              className="form-textarea"
              rows={9}
              placeholder="Paste a blog post, podcast transcript, article, or any source content here…"
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              style={{ minHeight: '190px' }}
            />
            <span className="char-count">{sourceContent.length.toLocaleString()} characters</span>
          </div>

          <h4 className={styles.panelTitle}><Icon name="target" size={16} /> Output platforms</h4>
          <div className="checkbox-group" style={{ marginBottom: '1.5rem' }}>
            {PLATFORMS.map((p) => {
              const checked = selectedPlatforms.includes(p.id)
              return (
                <label key={p.id} className={`checkbox-label ${checked ? 'checked' : ''}`} onClick={() => togglePlatform(p.id)}>
                  <span className="checkbox-indicator">{checked && <Icon name="check" size={12} />}</span>
                  {p.label}
                </label>
              )
            })}
          </div>

          {error && <div className={styles.inlineError}>{error}</div>}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Generating…</> : <><Icon name="sparkle" size={17} /> Generate content</>}
          </button>
          <p className={styles.shortcutHint}>Tip: press <kbd className="kbd">⌘</kbd> <kbd className="kbd">Enter</kbd> to run</p>
        </div>

        <div className={styles.toolOutputPanel}>
          <div className="output-header-row">
            <span className="panelTitle-inline"><Icon name="sparkle" size={16} /> Generated content</span>
            {outputs.length > 0 && (
              <ResultActions
                text={outputs.map((o) => `## ${o.platform}\n\n${o.content}`).join('\n\n---\n\n')}
                filename="repurposed-content.txt"
              />
            )}
          </div>

          {outputs.length === 0 && !loading && (
            <div className={styles.resultsEmpty}>
              <span className={styles.emptyIcon}><Icon name="layers" size={30} /></span>
              <p>Select platforms, paste content, and generate to create platform-optimized versions.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p>AI is crafting your content…</p>
            </div>
          )}

          {outputs.length > 0 && (
            <div className="animate-fade-in">
              <div className="tabs">
                {outputs.map((output, i) => (
                  <button key={i} className={`tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
                    {output.platform}
                  </button>
                ))}
              </div>

              <div className={styles.contentOutput}>
                <div className={styles.contentOutputHeader}>
                  <h4>{outputs[activeTab].platform}</h4>
                  <button className={`copy-btn ${copiedIdx === activeTab ? 'copied' : ''}`} onClick={() => handleCopy(activeTab)}>
                    {copiedIdx === activeTab ? <><Icon name="check" size={14} /> Copied</> : <><Icon name="copy" size={14} /> Copy</>}
                  </button>
                </div>
                <div className={styles.contentOutputBody}>{outputs[activeTab].content}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
