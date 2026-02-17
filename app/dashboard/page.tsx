'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ArrowDownRight, ArrowUpRight, TrendingUp, ShieldCheck, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { vaults } from '@/lib/vaults';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

type TooltipItem = {
  name?: string;
  value?: number;
};

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipItem[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass p-3 rounded-lg text-xs text-white/80">
      <p className="text-white font-semibold mb-1">{label}</p>
      {payload.map((item) => (
        <div key={item.name || 'value'} className="flex items-center justify-between gap-4">
          <span className="text-white/60">{item.name}</span>
          <span className="text-white">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  useProtectedRoute();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const portfolio = {
    totalSupplied: 87_500,
    totalBorrowed: 32_200,
    netApy: 6.8,
    healthFactor: 2.7,
    borrowPowerUsed: 42,
  };

  const growthData = [
    { month: 'Jan', value: 42 },
    { month: 'Feb', value: 48 },
    { month: 'Mar', value: 52 },
    { month: 'Apr', value: 58 },
    { month: 'May', value: 66 },
    { month: 'Jun', value: 72 },
  ];

  const positions = useMemo(
    () =>
      vaults.slice(0, 3).map((vault, index) => ({
        ...vault,
        supplied: 18_000 + index * 9_000,
        borrowed: 6_000 + index * 2_500,
      })),
    [],
  );

  const borrowRingData = [
    { name: 'Used', value: portfolio.borrowPowerUsed, fill: '#a855f7' },
    { name: 'Available', value: 100 - portfolio.borrowPowerUsed, fill: 'rgba(255,255,255,0.1)' },
  ];

  const healthTone =
    portfolio.healthFactor >= 2.5
      ? 'text-green-300'
      : portfolio.healthFactor >= 1.8
        ? 'text-yellow-300'
        : 'text-red-300';

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/60">
              Track your positions, borrow power, and health factor in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? [...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-28 w-full bg-white/10" />
                ))
              : [
                  { label: 'Total Supplied', value: `$${portfolio.totalSupplied.toLocaleString()}`, icon: ArrowUpRight, tone: 'text-green-300' },
                  { label: 'Total Borrowed', value: `$${portfolio.totalBorrowed.toLocaleString()}`, icon: ArrowDownRight, tone: 'text-orange-300' },
                  { label: 'Net APY', value: `${portfolio.netApy}%`, icon: TrendingUp, tone: 'text-blue-300' },
                  { label: 'Health Factor', value: portfolio.healthFactor.toFixed(2), icon: ShieldCheck, tone: healthTone },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="glass p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-white/60 text-sm">{metric.label}</p>
                        <Icon className={`w-5 h-5 ${metric.tone}`} />
                      </div>
                      <p className={`text-2xl font-bold ${metric.tone}`}>{metric.value}</p>
                    </div>
                  );
                })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass p-6 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-4">Portfolio Growth</h2>
              <div className="h-72">
                {loading ? (
                  <Skeleton className="h-full w-full bg-white/10" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="value" stroke="#a855f7" fill="url(#growthGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="glass p-6 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-4">Borrow Power</h2>
              <div className="h-52">
                {loading ? (
                  <Skeleton className="h-full w-full bg-white/10" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={borrowRingData} dataKey="value" innerRadius={55} outerRadius={80} startAngle={90} endAngle={-270}>
                        {borrowRingData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="text-center mt-4">
                <p className="text-white/60 text-sm">Used</p>
                <p className="text-2xl font-bold text-white">{portfolio.borrowPowerUsed}%</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Positions</h2>
              <Link href="/markets" className="text-white/60 hover:text-white transition-colors text-sm">
                View all markets
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full bg-white/10" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/60">Vault</TableHead>
                    <TableHead className="text-white/60">Supplied</TableHead>
                    <TableHead className="text-white/60">Borrowed</TableHead>
                    <TableHead className="text-white/60">APY</TableHead>
                    <TableHead className="text-right text-white/60">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position) => (
                    <TableRow key={position.id} className="border-white/10">
                      <TableCell className="text-white font-semibold">{position.name}</TableCell>
                      <TableCell className="text-white/80">${position.supplied.toLocaleString()}</TableCell>
                      <TableCell className="text-white/80">${position.borrowed.toLocaleString()}</TableCell>
                      <TableCell className="text-green-300">{position.supplyApy.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/vaults/${position.id}`} className="text-white/60 hover:text-white transition-colors">
                          Manage
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                {[
                  { label: 'Supplied PRE', value: '$12,000', time: '2 hours ago' },
                  { label: 'Borrowed USDC', value: '$4,500', time: '1 day ago' },
                  { label: 'Repaid USDC', value: '$2,000', time: '3 days ago' },
                ].map((tx) => (
                  <div key={tx.label} className="glass-dark p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{tx.label}</p>
                      <p className="text-white/50 text-sm">{tx.time}</p>
                    </div>
                    <p className="text-white font-semibold">{tx.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-4">Borrowing Status</h2>
              <div className="space-y-4">
                <div className="glass-dark p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/60">
                    <Wallet className="w-4 h-4" />
                    Borrow Limit
                  </div>
                  <span className="text-white font-semibold">$125,000</span>
                </div>
                <div className="glass-dark p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/60">
                    <ShieldCheck className="w-4 h-4" />
                    PoP Status
                  </div>
                  <span className="text-green-300 font-semibold">Verified</span>
                </div>
                <div className="glass-dark p-4 rounded-xl">
                  <p className="text-white/60 text-sm mb-2">Risk Guidance</p>
                  <p className="text-white/80 text-sm">
                    Maintain a health factor above 1.8 to avoid liquidation risk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
