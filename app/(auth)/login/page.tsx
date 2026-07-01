'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogoMark, GoogleIcon } from '@/components/Icon'
import styles from '../auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Demo mode: accept any credentials
    setTimeout(() => router.push('/dashboard'), 700)
  }

  function handleGoogle() {
    setGoogleLoading(true)
    // Demo mode: simulate Google OAuth redirect
    setTimeout(() => router.push('/dashboard'), 900)
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authBg} aria-hidden="true">
        <div className={styles.authOrb1} />
        <div className={styles.authOrb2} />
      </div>

      <div className={styles.authCard}>
        <Link href="/" className={styles.authLogo}>
          <LogoMark size={30} /> <span>Vessa</span>
        </Link>

        <h2>Welcome back</h2>
        <p className={styles.authSubtitle}>Sign in to your workspace to continue</p>

        <button
          type="button"
          className="btn btn-google"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <><span className="spinner" /> Connecting…</>
          ) : (
            <><GoogleIcon size={18} /> Continue with Google</>
          )}
        </button>

        <div className={styles.divider}><span>or continue with email</span></div>

        {error && <div className={styles.authError}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : 'Sign in'}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Don&apos;t have an account? <Link href="/signup">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
