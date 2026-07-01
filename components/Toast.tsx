'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type ToastType = 'success' | 'error' | 'info'
interface Toast {
  id: string
  message: string
  type: ToastType
}

const iconFor: Record<ToastType, IconName> = {
  success: 'check',
  error: 'alert',
  info: 'sparkle',
}

const ToastContext = createContext<(message: string, type?: ToastType) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3600)
  }, [])

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-viewport" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`toast toast-${t.type}`}
            onClick={() => dismiss(t.id)}
          >
            <span className="toast-icon"><Icon name={iconFor[t.type]} size={16} /></span>
            <span className="toast-message">{t.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
