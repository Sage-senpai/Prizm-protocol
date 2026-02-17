'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  TrendingUp,
  Lock,
  Users,
  BarChart3,
  Cpu,
  Fingerprint,
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'PoP-Weighted Borrowing',
      description: 'Verified humans earn higher limits, while bots are capped by design.',
      color: 'from-gray-200 to-gray-500',
    },
    {
      icon: Zap,
      title: 'Instant Liquidity',
      description: 'Supply and borrow in seconds with transparent on-chain accounting.',
      color: 'from-gray-400 to-gray-600',
    },
    {
      icon: TrendingUp,
      title: 'Risk-Adjusted Yields',
      description: 'LTV and rates respond to PoP strength and vault health in real time.',
      color: 'from-gray-300 to-gray-500',
    },
    {
      icon: Lock,
      title: 'Vault-Grade Security',
      description: 'Audited contracts, risk monitors, and circuit breakers protect capital.',
      color: 'from-gray-200 to-gray-700',
    },
    {
      icon: Users,
      title: 'Human-First Access',
      description: 'One verified human, one fair share of liquidity and borrow power.',
      color: 'from-gray-300 to-gray-600',
    },
    {
      icon: BarChart3,
      title: 'Transparent Analytics',
      description: 'Live vault stats, utilization, and risk indicators you can trust.',
      color: 'from-gray-200 to-gray-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="features" className="py-20 px-4 relative overflow-hidden">
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
            Protocol <span className="gradient-text">Benefits</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            A human-first lending stack that protects capital, improves access, and scales with trust.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className="glass p-8 h-full hover:border-white/40 transition-all duration-300 cursor-pointer relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-10 blur transition-all duration-300 -z-10`} />

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>

                  {/* Accent line */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} w-0 group-hover:w-full transition-all duration-300`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Secondary Features */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: Cpu,
              title: 'On-Chain Risk Engine',
              description: 'PoP-weighted risk scoring updates collateral factors automatically.',
            },
            {
              icon: Fingerprint,
              title: 'Privacy-Preserving PoP',
              description: 'Proof of Personhood verifies uniqueness without exposing identity data.',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass p-8 flex gap-6 items-start group hover:border-white/40 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
