import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from 'next/font/google'
import { AnimatedBackground } from '@/components/animated-background'
import { ThemeProvider } from '@/components/theme-provider'
import { WalletProvider } from '@/context/wallet-context'
import { WalletModal } from '@/components/wallet-modal'
import { ToastProvider } from '@/context/toast-context'
import { HowToBubble } from '@/components/how-to-bubble'

import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Prizm - Next-Gen DeFi RWA Lending',
  description: 'Borrow against real-world assets with sybil-resistant Proof of Personhood. Prizm delivers transparent, secure RWA lending on Polkadot/Moonbeam.',
  keywords: ['DeFi', 'RWA', 'Lending', 'Real-world assets', 'Cryptocurrency'],
  authors: [{ name: 'Prizm Protocol' }],
  openGraph: {
    title: 'Prizm - DeFi Lending Revolution',
    description: 'Sybil-resistant RWA lending with Proof of Personhood-weighted borrowing power.',
    type: 'website',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <WalletProvider>
              <AnimatedBackground />
              <WalletModal />
              <HowToBubble />
              {children}
            </WalletProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
