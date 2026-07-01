'use client'

import { useState } from 'react'
import { Icon } from './Icon'
import { useToast } from './Toast'
import { downloadText } from '@/lib/storage'

/** Copy-all + download toolbar for tool output. */
export function ResultActions({ text, filename }: { text: string; filename: string }) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  function copyAll() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  function download() {
    downloadText(filename, text)
    toast(`Downloaded ${filename}`)
  }

  return (
    <div className="result-actions">
      <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copyAll}>
        {copied ? <><Icon name="check" size={14} /> Copied</> : <><Icon name="copy" size={14} /> Copy all</>}
      </button>
      <button className="copy-btn" onClick={download}>
        <Icon name="fileText" size={14} /> Download
      </button>
    </div>
  )
}
