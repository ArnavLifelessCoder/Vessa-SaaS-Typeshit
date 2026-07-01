import Link from 'next/link'
import { LogoMark, Icon } from '@/components/Icon'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.25rem',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1.2rem',
          color: 'var(--text-primary)',
        }}
      >
        <LogoMark size={30} /> Vessa
      </Link>
      <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }} className="text-gradient">404</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '32ch' }}>
        This page drifted off into the void. Let&apos;s get you back to the workspace.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-secondary">Back home</Link>
        <Link href="/dashboard" className="btn btn-primary">
          Go to dashboard <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </div>
  )
}
