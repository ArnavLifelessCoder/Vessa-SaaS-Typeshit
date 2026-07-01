import { NextRequest } from 'next/server'
import crypto from 'crypto'

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET
const PLACEHOLDERS = ['', 'your_razorpay_key_secret']
const has = (v?: string) => !!v && !PLACEHOLDERS.includes(v)

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    // Demo mode: nothing to verify against, accept it.
    if (!has(KEY_SECRET)) {
      return Response.json({ verified: true, demo: true })
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ verified: false, error: 'Missing payment fields' }, { status: 400 })
    }

    const expected = crypto
      .createHmac('sha256', KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const verified = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))

    return Response.json({ verified }, { status: verified ? 200 : 400 })
  } catch (error) {
    console.error('verify error:', error)
    return Response.json({ verified: false, error: 'Verification failed' }, { status: 500 })
  }
}
