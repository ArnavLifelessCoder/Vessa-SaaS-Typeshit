import { NextRequest } from 'next/server'
import { getPlan, CURRENCY } from '@/lib/plans'

const KEY_ID = process.env.RAZORPAY_KEY_ID
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

const PLACEHOLDERS = ['', 'your_razorpay_key_id', 'your_razorpay_key_secret']
const has = (v?: string) => !!v && !PLACEHOLDERS.includes(v)

function isDemo(): boolean {
  return !has(KEY_ID) || !has(KEY_SECRET)
}

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json()
    const plan = getPlan(planId)

    if (!plan) {
      return Response.json({ error: 'Unknown plan' }, { status: 400 })
    }
    if (plan.amount <= 0) {
      return Response.json({ error: 'This plan is free — no payment required' }, { status: 400 })
    }

    // Demo mode: no live keys, so simulate an order (no charge).
    if (isDemo()) {
      return Response.json({
        demo: true,
        amount: plan.amount,
        currency: CURRENCY,
        planName: plan.name,
      })
    }

    // Live: create a real Razorpay order.
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64')
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        amount: plan.amount,
        currency: CURRENCY,
        receipt: `rcpt_${plan.id}_${Date.now()}`,
        notes: { planId: plan.id, planName: plan.name },
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('Razorpay order error:', detail)
      return Response.json({ error: 'Failed to create payment order' }, { status: 502 })
    }

    const order = await res.json()
    return Response.json({
      demo: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: KEY_ID,
      planName: plan.name,
    })
  } catch (error) {
    console.error('create-order error:', error)
    return Response.json({ error: 'Failed to start checkout. Please try again.' }, { status: 500 })
  }
}
