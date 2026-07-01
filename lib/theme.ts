'use client'

import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'
const KEY = 'vessa:theme'
const EVENT = 'vessa:theme-change'

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return (document.documentElement.dataset.theme as Theme) || 'dark'
}

export function setTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT))
}

export function toggleTheme(): void {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

export function useTheme(): Theme {
  const [theme, setThemeState] = useState<Theme>('dark')
  useEffect(() => {
    const sync = () => setThemeState(getTheme())
    sync()
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])
  return theme
}
