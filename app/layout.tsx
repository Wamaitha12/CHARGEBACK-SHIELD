import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chargeback Shield — Protect Your Business Revenue',
  description:
    'Track disputes, organize evidence, and improve your chargeback win rate. Built for Shopify stores, SaaS, and e-commerce businesses.',
  keywords: 'chargeback management, dispute tracking, revenue protection, chargeback win rate',
  openGraph: {
    title: 'Chargeback Shield',
    description: 'Protect your business from chargeback losses',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Anti-FOUC: apply saved theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
