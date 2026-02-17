'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ArrowLeft, TrendingUp, BarChart3, PieChart, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';
import { vaults } from '@/lib/vaults';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';

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

const amountSchema = z.object({
  amount: z
    .string()
    .min(1, 'Enter an amount')
    .refine((value) => Number(value) > 0, { message: 'Amount must be greater than 0' }),
});

export default function VaultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vaultId = typeof params.id === 'string' ? params.id : params.id?.[0] || '';
  const vault = useMemo(() => vaults.find((item) => item.id === vaultId), [vaultId]);
  const { isConnected, isVerified, setShowModal } = useWallet();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [simulatedLtv, setSimulatedLtv] = useState(45);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const supplyForm = useForm<z.infer<typeof amountSchema>>({
    resolver: zodResolver(amountSchema),
    defaultValues: { amount: '' },
  });

  const borrowForm = useForm<z.infer<typeof amountSchema>>({
    resolver: zodResolver(amountSchema),
    defaultValues: { amount: '' },
  });

  const handleProtectedAction = (action: 'Supply' | 'Borrow', amount: string) => {
    if (!isConnected) {
      showToast('Please connect wallet first.', 'warning');
      setShowModal(true);
      router.push('/');
      return;
    }
    if (!isVerified) {
      showToast('Verify your humanity to unlock full borrow limits.', 'info');
      router.push('/verify');
      return;
    }
    showToast(`${action} request for ${amount} submitted.`, 'success');
  };

  if (!vault) {
    return (
      <main className="relative min-h-screen">
        <Navigation />
        <section className="pt-32 pb-20 px-4 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Vault not found</h1>
          <p className="text-white/60 mb-8">The vault you are looking for does not exist.</p>
          <Link href="/markets" className="glass-button px-6 py-3 inline-flex items-center justify-center">
            Back to Markets
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const healthFactor = Number(((vault.maxLtv / Math.max(simulatedLtv, 1)) * 2.4).toFixed(2));
  const healthColor =
    healthFactor >= 2.5 ? 'text-green-300' : healthFactor >= 1.8 ? 'text-yellow-300' : 'text-red-300';

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <Link href="/markets" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Markets
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{vault.name}</h1>
                <p className="text-white/60">{vault.description}</p>
              </div>
            </div>
            <div className="glass px-6 py-4 rounded-2xl">
              <p className="text-white/60 text-sm">Total Supplied</p>
              <p className="text-2xl font-bold text-white">${(vault.totalSupplied / 1_000_000).toFixed(0)}M</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-72 w-full bg-white/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { label: 'Supply APY', value: `${vault.supplyApy.toFixed(1)}%`, tone: 'text-green-300' },
                { label: 'Borrow APY', value: `${vault.borrowApy.toFixed(1)}%`, tone: 'text-orange-300' },
                { label: 'Utilization', value: `${vault.utilization}%`, tone: 'text-blue-300' },
              ].map((metric) => (
                <div key={metric.label} className="glass p-6 rounded-2xl">
                  <p className="text-white/60 text-sm">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.tone}`}>{metric.value}</p>
                </div>
              ))}
            </div>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="glass p-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="docs">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Collateral Details</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="glass-dark p-4 rounded-xl">
                        <p className="text-white/60 text-sm">Collateral Type</p>
                        <p className="text-white font-semibold">{vault.collateralType}</p>
                      </div>
                      <div className="glass-dark p-4 rounded-xl">
                        <p className="text-white/60 text-sm">Max LTV</p>
                        <p className="text-white font-semibold">{vault.maxLtv}%</p>
                      </div>
                      <div className="glass-dark p-4 rounded-xl">
                        <p className="text-white/60 text-sm">Liquidation Threshold</p>
                        <p className="text-white font-semibold">{vault.liquidationThreshold}%</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-3 text-white/70">
                      <ShieldCheck className="w-5 h-5 text-white/60" />
                      <span>PoP verification improves your borrow cap and reduces protocol risk.</span>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Health Factor Simulator</h2>
                    <p className="text-white/60 mb-6">
                      Simulate your borrowing LTV to estimate health factor and liquidation risk.
                    </p>
                    <div className="glass-dark p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Simulated LTV</span>
                        <span className="text-white font-semibold">{simulatedLtv}%</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={80}
                        step={5}
                        value={simulatedLtv}
                        onChange={(event) => setSimulatedLtv(Number(event.target.value))}
                        aria-label="Simulated loan-to-value slider"
                        className="w-full"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Health Factor</span>
                        <span className={`text-lg font-bold ${healthColor}`}>{healthFactor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="glass p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-4">Supply Assets</h3>
                    <Form {...supplyForm}>
                      <form
                        onSubmit={supplyForm.handleSubmit((values) => handleProtectedAction('Supply', values.amount))}
                        className="space-y-4"
                      >
                        <FormField
                          control={supplyForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Enter amount"
                                  className="glass-input w-full px-4 py-3 text-white placeholder-white/50"
                                />
                              </FormControl>
                              <FormMessage className="text-sm text-red-300" />
                            </FormItem>
                          )}
                        />
                        <button type="submit" className="glass-button w-full">
                          Supply {vault.symbol}
                        </button>
                        <p className="text-white/60 text-xs">Earn {vault.supplyApy.toFixed(1)}% APY</p>
                      </form>
                    </Form>
                  </div>

                  <div className="glass p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-4">Borrow Assets</h3>
                    <Form {...borrowForm}>
                      <form
                        onSubmit={borrowForm.handleSubmit((values) => handleProtectedAction('Borrow', values.amount))}
                        className="space-y-4"
                      >
                        <FormField
                          control={borrowForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Enter amount"
                                  className="glass-input w-full px-4 py-3 text-white placeholder-white/50"
                                />
                              </FormControl>
                              <FormMessage className="text-sm text-red-300" />
                            </FormItem>
                          )}
                        />
                        <button type="submit" className="glass-button w-full">
                          Borrow USDC
                        </button>
                        <p className="text-white/60 text-xs">Pay {vault.borrowApy.toFixed(1)}% APY</p>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass p-6 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Supply and Borrow Rates
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={vault.history}>
                        <defs>
                          <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="borrowGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="supplyApy" stroke="#a855f7" fill="url(#supplyGradient)" />
                        <Area type="monotone" dataKey="borrowApy" stroke="#38bdf8" fill="url(#borrowGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-6 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Collateral Mix
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={vault.composition} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                          {vault.composition.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {vault.composition.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between text-sm text-white/70">
                        <span>{entry.name}</span>
                        <span>{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-6">Utilization Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={vault.history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip content={<ChartTooltip />} />
                      <Line type="monotone" dataKey="utilization" stroke="#ec4899" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="docs" className="space-y-6">
              <div className="glass p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-4">Vault Documents</h3>
                <p className="text-white/60 mb-6">
                  Placeholder documents for collateral audits, custody agreements, and risk disclosures.
                </p>
                <div className="space-y-3">
                  {['Collateral Audit Report', 'Custody Agreement', 'Risk Parameters'].map((doc) => (
                    <div key={doc} className="glass-dark p-4 rounded-xl flex items-center justify-between">
                      <span className="text-white">{doc}</span>
                      <span className="text-white/50 text-sm">PDF</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </main>
  );
}
