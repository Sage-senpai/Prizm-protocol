'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ScrollIndicator } from './scroll-indicator';
import { useWallet } from '@/context/wallet-context';

export function Hero() {
  const { setShowModal } = useWallet();

  return (
    <section id="overview" className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.28em] text-white/60">
            Prizm Protocol
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-semibold text-white">
              Human-first liquidity for real-world assets.
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
              A monochrome, trust-weighted lending layer on Polkadot. Proof of Personhood lifts borrow caps for verified humans and keeps pools resilient.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="glass-button group text-base font-semibold px-8 py-4"
            >
              Connect Wallet
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              href="/markets"
              className="button-secondary text-base font-semibold px-8 py-4"
            >
              Explore Markets
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            {[
              { label: 'Total Supplied', value: '$1.9B' },
              { label: 'Active Vaults', value: '6' },
              { label: 'Verified Humans', value: '32K+' },
            ].map((stat) => (
              <div key={stat.label} className="glass px-6 py-4">
                <div className="flex items-center justify-center gap-2 text-white/70 text-xs uppercase tracking-[0.2em]">
                  <ShieldCheck className="h-4 w-4 text-white/50" />
                  <span>{stat.label}</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  );
}
