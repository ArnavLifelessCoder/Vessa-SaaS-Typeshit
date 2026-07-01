'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon, type IconName } from './Icon'
import { tools } from '@/lib/tools'
import { toggleTheme } from '@/lib/theme'

interface Command {
  id: string
  label: string
  hint: string
  icon: IconName
  keywords: string
  run: () => void
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      { id: 'home', label: 'Go to Overview', hint: 'Dashboard', icon: 'grid', keywords: 'home overview dashboard', run: () => router.push('/dashboard') },
      { id: 'settings', label: 'Open Settings', hint: 'Account', icon: 'settings', keywords: 'settings account billing plan', run: () => router.push('/dashboard/settings') },
      { id: 'landing', label: 'View landing page', hint: 'Marketing', icon: 'arrowRight', keywords: 'landing home marketing site', run: () => router.push('/') },
      { id: 'theme', label: 'Toggle light / dark theme', hint: 'Appearance', icon: 'sparkle', keywords: 'theme dark light appearance mode', run: () => toggleTheme() },
    ]
    const toolCmds: Command[] = tools.map((t) => ({
      id: t.id,
      label: `Open ${t.name}`,
      hint: t.category,
      icon: t.icon,
      keywords: `${t.name} ${t.category} ${t.tagline}`.toLowerCase(),
      run: () => router.push(t.href),
    }))
    return [...toolCmds, ...nav]
  }, [router])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords.includes(q)
    )
  }, [query, commands])

  // Global shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpenEvent = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('vessa:open-palette', onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('vessa:open-palette', onOpenEvent)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  if (!open) return null

  const choose = (cmd: Command) => {
    cmd.run()
    setOpen(false)
  }

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command menu">
        <div className="cmdk-input-row">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Search tools and actions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
              if (e.key === 'Enter' && filtered[active]) { e.preventDefault(); choose(filtered[active]) }
            }}
          />
          <kbd className="cmdk-esc">ESC</kbd>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && <div className="cmdk-empty">No results for “{query}”</div>}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`cmdk-item ${i === active ? 'active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(cmd)}
            >
              <span className="cmdk-item-icon"><Icon name={cmd.icon} size={17} /></span>
              <span className="cmdk-item-label">{cmd.label}</span>
              <span className="cmdk-item-hint">{cmd.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
