import type { Metadata } from 'next'
import { AnimatedBackground } from '@/components/animated-background'
import { ThemeProvider } from '@/components/theme-provider'
import { WalletProvider } from '@/context/wallet-context'
import { WalletModal } from '@/components/wallet-modal'
import { ToastProvider } from '@/context/toast-context'
import { HowToBubble } from '@/components/how-to-bubble'

import './globals.css'

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
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
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
