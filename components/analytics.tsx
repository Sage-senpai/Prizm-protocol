'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Download, Info, BarChart3, LineChart } from 'lucide-react';

export function Analytics() {
  const timeRanges = ['24h', '7d', '30d', '90d', '1y'];
  const selectedRange = '30d';

  const earningsData = [
    { label: 'Week 1', earned: 245, pending: 120 },
    { label: 'Week 2', earned: 380, pending: 95 },
    { label: 'Week 3', earned: 420, pending: 110 },
    { label: 'Week 4', earned: 510, pending: 85 },
    { label: 'Week 5', earned: 635, pending: 120 },
  ];

  const maxEarnings = Math.max(...earningsData.map(d => d.earned + d.pending));

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
    <section id="analytics" className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Performance <span className="gradient-text">Analytics</span>
            </h2>
            <p className="text-white/60 text-lg">
              Track your earnings and portfolio performance in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="glass px-4 py-2 text-white text-sm hover:border-white/40 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { label: 'Total Earned', value: '$2,190', change: '+12.5%', tone: 'text-white/80' },
            { label: 'This Month', value: '$1,240', change: '+8.2%', tone: 'text-white/80' },
            { label: 'Average APR', value: '9.85%', change: '+0.3%', tone: 'text-white/70' },
            { label: 'Portfolio Value', value: '$65,420', change: '+5.1%', tone: 'text-white/80' },
          ].map((metric, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="glass p-6 group"
            >
              <p className="text-white/60 text-sm font-medium mb-3">{metric.label}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-white mb-2">{metric.value}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 border border-white/10 ${metric.tone}`}>
                    {metric.change}
                  </span>
                </div>
                <TrendingUp className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Earnings Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="glass p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">Earnings Overview</h3>
                  <p className="text-white/60 text-sm mt-1">Last 30 days performance</p>
                </div>
                <div className="flex gap-2">
                  {timeRanges.map((range) => (
                    <button
                      key={range}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        range === selectedRange
                          ? 'bg-white/15 text-white border border-white/20'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-72 flex items-end justify-between gap-4 mb-6">
                {earningsData.map((data, i) => {
                  const total = data.earned + data.pending;
                  const heightPercent = (total / maxEarnings) * 100;

                  return (
                    <motion.div
                      key={i}
                      className="flex-1 flex flex-col gap-2 items-center group cursor-pointer"
                      initial={{ height: 0 }}
                      whileInView={{ height: 'auto' }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                    >
                      <div className="w-full flex items-end gap-1 h-64">
                        <motion.div
                          className="flex-1 rounded-t-lg bg-gradient-to-t from-white/35 to-white/15 group-hover:from-white/50 group-hover:to-white/25 transition-all"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${(data.earned / maxEarnings) * 100}%` }}
                          transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                        />
                        <motion.div
                          className="flex-1 rounded-t-lg bg-gradient-to-t from-white/18 to-white/8 group-hover:from-white/30 group-hover:to-white/15 transition-all"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${(data.pending / maxEarnings) * 100}%` }}
                          transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                        />
                      </div>
                      <p className="text-white/60 text-xs font-medium">{data.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/50" />
                  <span className="text-white/70 text-sm">Earned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="text-white/70 text-sm">Pending</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Distribution Pie */}
          <motion.div variants={itemVariants}>
            <div className="glass p-8 h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Asset Distribution</h3>
              <p className="text-white/60 text-sm mb-8">Portfolio allocation</p>

              <div className="flex-1 flex items-center justify-center mb-6">
                <motion.div className="relative w-40 h-40">
                  {/* Pie segments - simplified visualization */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="8"
                      strokeDasharray="75.4 251.2"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 1 }}
                      className="svg-origin-center"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient2)"
                      strokeWidth="8"
                      strokeDasharray="62.8 251.2"
                      strokeDashoffset="-75.4"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 1 }}
                      className="svg-origin-center"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient3)"
                      strokeWidth="8"
                      strokeDasharray="113 251.2"
                      strokeDashoffset="-138.2"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 1 }}
                      className="svg-origin-center"
                    />
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#cfcfcf" />
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#b8b8b8" />
                        <stop offset="100%" stopColor="#8a8a8a" />
                      </linearGradient>
                      <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6f6f6f" />
                        <stop offset="100%" stopColor="#4b4b4b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Portfolio</p>
                      <p className="text-lg font-bold text-white">$65K</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Real Estate', value: '45%', color: 'bg-white/60' },
                  { name: 'Trade Finance', value: '30%', color: 'bg-white/30' },
                  { name: 'Other Assets', value: '25%', color: 'bg-white/20' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-white/70 text-sm">{item.name}</span>
                    </div>
                    <span className="text-white font-semibold text-sm">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mt-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              title: 'Risk Assessment',
              description: 'Your portfolio risk profile',
              metrics: ['Volatility: Low', 'Correlation: Optimized', 'Stress Test: Passed'],
              icon: BarChart3,
            },
            {
              title: 'Projected Returns',
              description: 'Annual yield estimation',
              metrics: ['Conservative: 8.2%', 'Expected: 10.5%', 'Optimistic: 13.1%'],
              icon: LineChart,
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={i} variants={itemVariants} className="glass p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{card.title}</h4>
                    <p className="text-white/60 text-sm">{card.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {card.metrics.map((metric, j) => (
                    <div key={j} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70 text-sm">{metric.split(':')[0]}</span>
                      <span className="text-white font-semibold">{metric.split(':')[1]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
