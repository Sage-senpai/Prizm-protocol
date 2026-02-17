'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Rocket, ShieldCheck } from 'lucide-react';

export function Phases() {
  const phases = [
    {
      number: '1',
      title: 'Supply Real Assets',
      status: 'completed',
      date: 'Step 1',
      description: 'Deposit verified RWA collateral into vaults with transparent terms.',
      milestones: [
        'Tokenized real estate, invoices, and commodities',
        'On-chain collateral tracking',
        'Institutional custody partners',
      ],
      icon: CheckCircle2,
    },
    {
      number: '2',
      title: 'Verify Personhood',
      status: 'active',
      date: 'Step 2',
      description: 'PoP verification weights your borrow limits and protects the protocol.',
      milestones: [
        'Unique human verification',
        'Borrow limit multiplier',
        'Sybil resistance guaranteed',
      ],
      icon: ShieldCheck,
    },
    {
      number: '3',
      title: 'Borrow With Confidence',
      status: 'upcoming',
      date: 'Step 3',
      description: 'Access liquidity with real-time health factors and risk alerts.',
      milestones: [
        'Dynamic LTV and liquidation buffers',
        'Real-time risk dashboards',
        'Cross-chain collateral readiness',
      ],
      icon: Rocket,
    },
  ];

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
    <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            A three-step flow that keeps capital secure and borrowing fair for verified humans.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`glass p-8 relative group ${
                  phase.status === 'completed' ? 'border-purple-400/50' : ''
                }`}
              >
                {/* Connection line */}
                {index < phases.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 w-6 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400" />
                )}

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{phase.number}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      phase.status === 'completed'
                        ? 'bg-green-500/20 text-green-300'
                        : phase.status === 'active'
                          ? 'bg-purple-500/20 text-purple-300 animate-pulse'
                          : 'bg-gray-500/20 text-gray-300'
                    }`}
                  >
                    {phase.status === 'completed'
                      ? 'Complete'
                      : phase.status === 'active'
                        ? 'Active'
                        : 'Coming'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{phase.title}</h3>
                <p className="text-purple-300 text-sm font-medium mb-4">{phase.date}</p>
                <p className="text-white/70 mb-6">{phase.description}</p>

                {/* Milestones */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  {phase.milestones.map((milestone, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                      <span className="text-white/70 text-sm">{milestone}</span>
                    </div>
                  ))}
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom text */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-white/50 text-sm">
            PoP verification provides the unique-human guarantee that powers safer borrow limits.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
