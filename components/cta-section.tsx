'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/context/wallet-context';

export function CTASection() {
  const { setShowModal } = useWallet();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="relative glass p-12 md:p-16 lg:p-20 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Main heading */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6"
          >
            Ready to unlock human-first liquidity?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Supply or borrow against real-world assets with PoP-weighted limits and live risk controls built for trust.
          </motion.p>

          {/* Key benefits */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {[
              {
                icon: Shield,
                title: 'Fully Secured',
                description: 'Audited smart contracts and insurance',
              },
              {
                icon: Zap,
                title: 'Instant Liquidity',
                description: 'Withdraw anytime without lockup',
              },
              {
                icon: Users,
                title: 'Community Owned',
                description: 'DAO governance on protocol updates',
              },
            ].map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex flex-col items-center gap-4 p-6 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-white">{benefit.title}</h4>
                  <p className="text-white/60 text-sm">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
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
              className="button-secondary text-base font-semibold px-8 py-4"
            >
              Browse Markets
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-12 border-t border-white/10"
          >
            <p className="text-white/50 text-sm mb-6">Trusted by teams shipping on Polkadot</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {['OpenZeppelin', 'Certora', 'Trail of Bits', 'CertiK'].map((auditor, i) => (
                <motion.div
                  key={i}
                  className="text-white/40 font-semibold text-sm hover:text-white/70 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  {auditor}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
