'use client';

import { motion } from 'framer-motion';
import { ChevronRight, BarChart3, Activity, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function LendingMarket() {
  const [selectedPool, setSelectedPool] = useState(0);

  const lendingPools = [
    {
      id: 1,
      name: 'Premium Real Estate',
      symbol: 'PREM',
      totalValue: '$850M',
      utilizationRate: 68,
      borrowRate: '8.2%',
      supplyRate: '6.5%',
      borrowers: 342,
      collateralRatio: 2.5,
      health: 'Excellent',
      healthColor: 'text-green-400',
      icon: '🏰',
      description: 'Investment-grade commercial real estate across major metro areas.',
    },
    {
      id: 2,
      name: 'Trade Finance Pool',
      symbol: 'TRADE',
      totalValue: '$620M',
      utilizationRate: 75,
      borrowRate: '11.5%',
      supplyRate: '9.2%',
      borrowers: 287,
      collateralRatio: 2.0,
      health: 'Strong',
      healthColor: 'text-blue-400',
      icon: '📊',
      description: 'Short-term financing for verified cross-border trade transactions.',
    },
    {
      id: 3,
      name: 'Supply Chain Assets',
      symbol: 'SUPPLY',
      totalValue: '$480M',
      utilizationRate: 62,
      borrowRate: '9.8%',
      supplyRate: '7.5%',
      borrowers: 198,
      collateralRatio: 2.2,
      health: 'Strong',
      healthColor: 'text-blue-400',
      icon: '⛓️',
      description: 'Inventory and receivables financing backed by supply chain data.',
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

  const selectedPool_ = lendingPools[selectedPool];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
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
            Lending <span className="gradient-text">Markets</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Access diverse lending opportunities with institutional-grade transparency and risk management.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pool Selection */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {lendingPools.map((pool, index) => (
              <motion.button
                key={pool.id}
                variants={itemVariants}
                onClick={() => setSelectedPool(index)}
                className={`w-full text-left transition-all duration-300 glass p-5 group ${
                  selectedPool === index ? 'border-purple-400/50 bg-purple-500/10' : 'hover:border-white/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{pool.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                      {pool.name}
                    </h4>
                    <p className="text-white/50 text-sm">{pool.symbol}</p>
                    <p className="text-white/60 text-xs mt-2">{pool.totalValue}</p>
                  </div>
                  {selectedPool === index && (
                    <div className="flex-shrink-0">
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Pool Details */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <motion.div
              key={selectedPool_.id}
              className="glass p-8 md:p-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-5xl mb-4">{selectedPool_.icon}</div>
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedPool_.name}</h3>
                  <p className="text-white/70">{selectedPool_.description}</p>
                </div>
                <div className={`text-right ${selectedPool_.healthColor}`}>
                  <p className="text-xs font-semibold opacity-75 mb-1">HEALTH</p>
                  <p className="text-lg font-bold">{selectedPool_.health}</p>
                </div>
              </div>

              {/* Total Value */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 mb-8">
                <p className="text-white/60 text-sm font-medium mb-2">Total Value Locked</p>
                <p className="text-4xl font-bold text-white">{selectedPool_.totalValue}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    label: 'Utilization Rate',
                    value: `${selectedPool_.utilizationRate}%`,
                    icon: BarChart3,
                  },
                  {
                    label: 'Borrow Rate',
                    value: selectedPool_.borrowRate,
                    icon: Activity,
                  },
                  {
                    label: 'Supply Rate',
                    value: selectedPool_.supplyRate,
                    icon: BarChart3,
                  },
                  {
                    label: 'Active Borrowers',
                    value: selectedPool_.borrowers,
                    icon: Activity,
                  },
                  {
                    label: 'Collateral Ratio',
                    value: `${selectedPool_.collateralRatio}x`,
                    icon: AlertCircle,
                  },
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={i}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-4 h-4 text-purple-400" />
                        <p className="text-white/60 text-xs font-medium">{metric.label}</p>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-white">{metric.value}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Utilization Gauge */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/70 font-medium">Pool Utilization</p>
                  <span className="text-purple-300 font-semibold">{selectedPool_.utilizationRate}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedPool_.utilizationRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="glass-button">Supply Capital</button>
                <button className="glass px-6 py-3 rounded-full text-white font-semibold hover:bg-white/20 transition-all">
                  Borrow Assets
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          className="glass p-8 md:p-12 mt-12 grid md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { label: 'Total Lending Markets', value: '3' },
            { label: 'Combined TVL', value: '$1.95B' },
            { label: 'Active Borrowers', value: '827' },
            { label: 'Avg Collateral Ratio', value: '2.23x' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-white/50 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
