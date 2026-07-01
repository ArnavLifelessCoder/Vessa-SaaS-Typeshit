import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://vessa.app'),
  title: {
    default: 'Vessa — The AI Workspace for Modern Business',
    template: '%s · Vessa',
  },
  description:
    'Nine purpose-built AI tools in one workspace: contract review, content repurposing, workflow automation, smart replies, proposal generation, document intelligence, SEO planning, brand identity, and code review.',
  keywords: [
    'AI SaaS',
    'contract review',
    'content repurposing',
    'workflow automation',
    'AI email',
    'proposal generator',
    'document intelligence',
  ],
  authors: [{ name: 'Vessa' }],
  openGraph: {
    title: 'Vessa — The AI Workspace for Modern Business',
    description: 'Nine purpose-built AI tools in one unified workspace.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const themeScript = `(function(){try{var t=localStorage.getItem('vessa:theme')||'dark';document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
