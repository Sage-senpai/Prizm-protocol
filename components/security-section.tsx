'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Activity, Radar } from 'lucide-react';

export function SecuritySection() {
  const points = [
    {
      icon: ShieldCheck,
      title: 'PoP Risk Engine',
      description: 'Borrow limits scale with verified humanity, keeping pools resilient.',
    },
    {
      icon: Lock,
      title: 'Vault Isolation',
      description: 'Each RWA vault has its own parameters, caps, and liquidation buffers.',
    },
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description: 'Health factors, utilization, and liquidation thresholds update live.',
    },
    {
      icon: Radar,
      title: 'Circuit Breakers',
      description: 'Automated safeguards protect liquidity during volatility spikes.',
    },
  ];

  return (
    <section id="security" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 text-sm text-white/80">
            <span className="w-2 h-2 rounded-full bg-white/70" />
            Security first, always
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Security Built For <span className="gradient-text">RWA Lending</span>
          </h2>
          <p className="text-white/70 text-lg">
            Prizm blends on-chain transparency with institution-grade safeguards to keep collateral safe, liquidations fair, and borrowers protected.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                className="glass p-6 hover:border-white/40 transition-all"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{point.title}</h3>
                <p className="text-white/70 text-sm">{point.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
