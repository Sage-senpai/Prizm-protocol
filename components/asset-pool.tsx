'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Lock, Shield } from 'lucide-react';

export function AssetPool() {
  const assets = [
    {
      name: 'Real Estate Bonds',
      symbol: 'REB',
      apr: '8.5%',
      tvl: '$450M',
      users: '2.3K',
      risk: 'Low',
      color: 'from-blue-400 to-cyan-400',
      image: '🏢',
    },
    {
      name: 'Trade Finance',
      symbol: 'TRF',
      apr: '12.2%',
      tvl: '$680M',
      users: '1.8K',
      risk: 'Medium',
      color: 'from-purple-400 to-pink-400',
      image: '📦',
    },
    {
      name: 'Supply Chain Assets',
      symbol: 'SCA',
      apr: '10.8%',
      tvl: '$520M',
      users: '2.1K',
      risk: 'Low-Medium',
      color: 'from-green-400 to-emerald-400',
      image: '⛓️',
    },
    {
      name: 'Renewable Energy',
      symbol: 'REN',
      apr: '9.5%',
      tvl: '$340M',
      users: '1.5K',
      risk: 'Low',
      color: 'from-yellow-400 to-orange-400',
      image: '⚡',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section id="markets" className="py-20 px-4 relative overflow-hidden">
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
            Available <span className="gradient-text">Asset Pools</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Diversified real-world assets backed by institutional-grade collateral.
          </p>
        </motion.div>

        {/* Assets Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {assets.map((asset, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="glass p-8 h-full hover:border-white/40 transition-all duration-300 cursor-pointer overflow-hidden relative">
                {/* Background gradient on hover */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${asset.color} rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-300 -z-10`} />

                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-4xl mb-3">{asset.image}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{asset.name}</h3>
                      <p className="text-purple-300 text-sm">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-br ${asset.color} text-white px-4 py-2 rounded-lg text-sm font-bold`}>
                    {asset.apr} APR
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10">
                  <div>
                    <p className="text-white/50 text-xs font-medium mb-2">TVL</p>
                    <p className="text-lg font-bold text-white">{asset.tvl}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-medium mb-2">Users</p>
                    <p className="text-lg font-bold text-white">{asset.users}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-medium mb-2">Risk</p>
                    <p className={`text-lg font-bold ${
                      asset.risk === 'Low' ? 'text-green-400' : asset.risk === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
                    }`}>
                      {asset.risk}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">Stable yield generation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">Collateral locked & audited</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-white/70 text-sm">Insurance protection</span>
                  </div>
                </div>

                {/* Deposit Button */}
                <button className="w-full mt-6 glass-button">
                  Supply Assets
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Total Stats */}
        <motion.div
          className="glass p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Total TVL', value: '$1.99B' },
              { label: 'Total Users', value: '7.7K' },
              { label: 'Avg APR', value: '10.25%' },
              { label: 'Assets Listed', value: '4' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-white/50 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
