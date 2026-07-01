'use client'

import { useState, type ReactNode } from 'react'
import { useToast } from './Toast'

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  theme?: { color?: string }
  handler?: (response: RazorpayResponse) => void
  modal?: { ondismiss?: () => void }
}
interface RazorpayInstance {
  open: () => void
  on: (event: string, cb: () => void) => void
}
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function UpgradeButton({
  planId,
  className = 'btn btn-primary btn-sm',
  children,
}: {
  planId: string
  className?: string
  children: ReactNode
}) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  async function checkout() {
    setLoading(true)
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not start checkout')

      // Demo mode — no live keys, so simulate a successful upgrade at no charge.
      if (data.demo) {
        toast(`${data.planName} activated — demo checkout, no charge`, 'success')
        setLoading(false)
        return
      }

      const ready = await loadRazorpay()
      if (!ready || !window.Razorpay) throw new Error('Could not load the payment window')

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Vessa',
        description: `${data.planName} plan`,
        order_id: data.orderId,
        theme: { color: '#5b6cff' },
        handler: async (response) => {
          const verify = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          const result = await verify.json()
          if (result.verified) toast(`${data.planName} plan activated. Welcome aboard!`, 'success')
          else toast('Payment could not be verified. Contact support.', 'error')
        },
        modal: { ondismiss: () => setLoading(false) },
      })
      rzp.on('payment.failed', () => toast('Payment failed. Please try again.', 'error'))
      rzp.open()
      setLoading(false)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Checkout failed', 'error')
      setLoading(false)
    }
  }

  return (
    <button className={className} onClick={checkout} disabled={loading}>
      {loading ? <><span className="spinner" /> Processing…</> : children}
    </button>
  )
}
