'use client'

import { useEffect, useState } from 'react'
import type { IconName } from '@/components/Icon'
import { readJSON, writeJSON } from './storage'

export interface RunEntry {
  id: string
  toolId: string
  toolName: string
  icon: IconName
  href: string
  summary: string
  ts: number
}

const HISTORY_KEY = 'vessa:history'
const CREDITS_KEY = 'vessa:creditsUsed'
const PINS_KEY = 'vessa:pinnedTools'
const CREDITS_TOTAL = 20
const HISTORY_CAP = 60
const EVENT = 'vessa:store-change'

function emit() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT))
}

/** Record a successful tool run: saves to history and consumes one credit. */
export function recordRun(entry: Omit<RunEntry, 'id' | 'ts'>): void {
  const list = readJSON<RunEntry[]>(HISTORY_KEY, [])
  const next: RunEntry = { ...entry, id: crypto.randomUUID(), ts: Date.now() }
  writeJSON(HISTORY_KEY, [next, ...list].slice(0, HISTORY_CAP))

  const used = readJSON<number>(CREDITS_KEY, 0)
  writeJSON(CREDITS_KEY, Math.min(CREDITS_TOTAL, used + 1))
  emit()
}

export function clearHistory(): void {
  writeJSON(HISTORY_KEY, [])
  emit()
}

export function togglePin(toolId: string): void {
  const pins = readJSON<string[]>(PINS_KEY, [])
  const next = pins.includes(toolId) ? pins.filter((p) => p !== toolId) : [...pins, toolId]
  writeJSON(PINS_KEY, next)
  emit()
}

function useStoreValue<T>(getter: () => T): T {
  const [value, setValue] = useState<T>(getter)
  useEffect(() => {
    const sync = () => setValue(getter())
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return value
}

export function useHistory(): RunEntry[] {
  return useStoreValue(() => readJSON<RunEntry[]>(HISTORY_KEY, []))
}

export function usePins(): string[] {
  return useStoreValue(() => readJSON<string[]>(PINS_KEY, []))
}

export function useCredits() {
  const used = useStoreValue(() => readJSON<number>(CREDITS_KEY, 0))
  return {
    used,
    total: CREDITS_TOTAL,
    remaining: Math.max(0, CREDITS_TOTAL - used),
    percent: Math.min(100, Math.round((used / CREDITS_TOTAL) * 100)),
  }
}
