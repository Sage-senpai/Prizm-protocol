'use client';

import { motion } from 'framer-motion';
import { Send, Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function WalletSection() {
  const walletData = {
    balance: '$45,230.50',
    earned: '$12,450.00',
    assets: [
      { name: 'USDC', amount: '25,000', value: '$25,000' },
      { name: 'USDT', amount: '15,000', value: '$15,000' },
      { name: 'ETH', amount: '5.23', value: '$18,050' },
    ],
  };

  const transactions = [
    { type: 'deposit', asset: 'USDC', amount: '+$5,000', time: '2 hours ago', icon: ArrowDownLeft },
    { type: 'withdraw', asset: 'USDT', amount: '-$2,500', time: '1 day ago', icon: ArrowUpRight },
    { type: 'deposit', asset: 'ETH', amount: '+1.5 ETH', time: '3 days ago', icon: ArrowDownLeft },
    { type: 'earn', asset: 'Interest', amount: '+$125.30', time: '5 days ago', icon: TrendingUp },
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
    <section id="wallet" className="py-20 px-4 relative overflow-hidden">
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
            Your <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Monitor your assets and earnings with real-time analytics and historical tracking.
          </p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Main Balance Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="glass p-8 md:p-12 group">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <p className="text-white/60 text-lg font-medium mb-2">Total Balance</p>
                  <h3 className="text-5xl md:text-6xl font-bold text-white">{walletData.balance}</h3>
                </div>
                <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Earnings Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Total Earned</p>
                    <p className="text-3xl md:text-4xl font-bold text-white mt-2">{walletData.earned}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-4 py-2 bg-white/10 text-white/80 rounded-lg text-sm font-semibold border border-white/10">
                      +7.24% this month
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="glass-button">Deposit</button>
                <button className="glass px-6 py-3 rounded-full text-white font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Withdraw
                </button>
              </div>
            </div>
          </motion.div>

          {/* Assets List */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="glass p-8 h-full">
              <h4 className="text-xl font-bold text-white mb-6">Your Assets</h4>
              <div className="space-y-4">
                {walletData.assets.map((asset, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{asset.name[0]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm">{asset.name}</p>
                        <p className="text-white/50 text-xs">{asset.amount}</p>
                      </div>
                    </div>
                    <p className="text-white font-semibold text-right flex-shrink-0">{asset.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          variants={itemVariants}
          className="glass p-8 md:p-12 mt-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="text-2xl font-bold text-white mb-8">Recent Activity</h4>
          <div className="space-y-4">
            {transactions.map((tx, i) => {
              const Icon = tx.icon;
              return (
                <motion.div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === 'deposit'
                        ? 'bg-white/15 text-white'
                        : tx.type === 'withdraw'
                          ? 'bg-white/10 text-white/80'
                          : 'bg-white/10 text-white/70'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{tx.asset}</p>
                      <p className="text-white/50 text-sm">{tx.time}</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg text-white/90">
                    {tx.amount}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
