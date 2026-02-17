'use client';

import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollIndicator } from './scroll-indicator';
import Link from 'next/link';
import { useWallet } from '@/context/wallet-context';

export function Hero() {
  const { setShowModal } = useWallet();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden particle-bg">
      <div className="absolute inset-0 bg-black/40" />

      {/* Animated background blobs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-40 -right-40 w-80 h-80 bg-white/5 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-gray-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="glass px-6 py-3 inline-flex items-center gap-2">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white/80">Launching Prizm Protocol 2026</span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Borrow Against Real Assets{' '}
              <span className="gradient-text">- Secured by Real Humans</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
              PoP-weighted RWA lending on Polkadot/Moonbeam. Verified humans unlock higher, safer borrow power while bots are capped.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="glass-button group inline-flex items-center justify-center text-base font-bold px-8 py-4"
            >
              Connect Wallet
              <ArrowRight className="inline-block ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/markets"
              className="glass px-8 py-4 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center text-base"
            >
              Explore Markets
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto"
          >
            {[
              { label: 'Total Supplied', value: '$1.9B' },
              { label: 'Active Vaults', value: '6' },
              { label: 'Verified Humans', value: '32K+' },
            ].map((stat) => (
              <div key={stat.label} className="glass px-6 py-4">
                <div className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4 text-white/60" />
                  <span>{stat.label}</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <ScrollIndicator />
        </motion.div>
      </div>
    </div>
  );
}
