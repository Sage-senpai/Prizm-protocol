'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ShieldCheck, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">About Prizm</h1>
          <p className="text-white/60 text-lg">
            Prizm is a sybil-resistant RWA collateralized lending protocol built on Polkadot/Moonbeam. We believe fair access
            to liquidity starts with verified human participation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'PoP-Weighted Lending',
              description: 'Borrow limits are dynamically weighted by Proof of Personhood to deter bots and multi-account exploits.',
            },
            {
              icon: Globe,
              title: 'Real-World Collateral',
              description: 'Tokenized real estate, invoices, and commodities power transparent on-chain lending markets.',
            },
            {
              icon: Users,
              title: 'Human-First Access',
              description: 'One verified human equals one fair share of liquidity, improving inclusion and stability.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass p-6 rounded-3xl">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Team</h2>
          <p className="text-white/60 mb-6">
            Our team blends DeFi, RWA, and identity experts focused on building a safer lending stack for verified humans.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Protocol Lead', 'Risk Engineer', 'Product Designer'].map((role) => (
              <div key={role} className="glass-dark p-4 rounded-xl">
                <p className="text-white font-semibold">{role}</p>
                <p className="text-white/50 text-sm">Team member placeholder</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
