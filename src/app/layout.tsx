import './globals.css'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Blockchain Generator | Create Custom Blockchains',
  description: 'Generate, mine, and publish custom blockchains with real-time progress tracking. A powerful tool for blockchain development and education.',
  keywords: ['blockchain', 'cryptocurrency', 'mining', 'generator', 'web3', 'decentralized'],
  authors: [{ name: 'Blockchain Generator Team' }],
  creator: 'Blockchain Generator',
  publisher: 'Blockchain Generator',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blockchain-generator.vercel.app',
    title: 'Blockchain Generator | Create Custom Blockchains',
    description: 'Generate, mine, and publish custom blockchains with real-time progress tracking.',
    siteName: 'Blockchain Generator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Blockchain Generator - Create Custom Blockchains',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blockchain Generator | Create Custom Blockchains',
    description: 'Generate, mine, and publish custom blockchains with real-time progress tracking.',
    images: ['/og-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#075985' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
