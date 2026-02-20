'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ArrowLeft, TrendingUp, BarChart3, PieChart, ShieldCheck, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';
import { vaults } from '@/lib/vaults';
import { appConfig } from '@/lib/config';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TxModal, useTxSteps } from '@/components/tx-modal';
import {
  supplyCollateral,
  borrowUsdc,
  repayUsdc,
  withdrawCollateral,
  getUserPosition,
  switchToMoonbase,
  type UserPosition,
} from '@/lib/blockchain/contracts';
import {
  Area, AreaChart, CartesianGrid, Line, LineChart,
  Pie, PieChart as RechartsPieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from 'recharts';

// ─── Chart tooltip ──────────────────────────────────────────────────────────

type TooltipItem = { name?: string; value?: number };
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 rounded-lg text-xs text-white/80">
      <p className="text-white font-semibold mb-1">{label}</p>
      {payload.map((item) => (
        <div key={item.name ?? 'v'} className="flex items-center justify-between gap-4">
          <span className="text-white/60">{item.name}</span>
          <span className="text-white">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Form schema ─────────────────────────────────────────────────────────────

const amountSchema = z.object({
  amount: z.string().min(1, 'Enter an amount').refine((v) => Number(v) > 0, { message: 'Must be > 0' }),
});
type AmountForm = z.infer<typeof amountSchema>;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VaultDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const vaultId = typeof params.id === 'string' ? params.id : params.id?.[0] ?? '';
  const vault   = useMemo(() => vaults.find((v) => v.id === vaultId), [vaultId]);

  const { isConnected, isVerified, popTier, setShowModal } = useWallet();
  const { showToast } = useToast();

  const [loading, setLoading]           = useState(true);
  const [simulatedLtv, setSimulatedLtv] = useState(45);
  const [position, setPosition]         = useState<UserPosition | null>(null);
  const [positionLoading, setPosLoading] = useState(false);

  // Transaction modal state
  const [txModalOpen, setTxModalOpen]   = useState(false);
  const [txModalTitle, setTxModalTitle] = useState('');
  const supplySteps  = useTxSteps([
    { id: 'approve', label: 'Approve RWA Token' },
    { id: 'supply',  label: 'Supply to Vault'  },
  ]);
  const borrowSteps  = useTxSteps([{ id: 'borrow', label: 'Borrow USDC' }]);
  const repaySteps   = useTxSteps([
    { id: 'approve', label: 'Approve USDC' },
    { id: 'repay',   label: 'Repay Debt'   },
  ]);
  const withdrawSteps = useTxSteps([{ id: 'withdraw', label: 'Withdraw Collateral' }]);
  const [activeSteps, setActiveSteps] = useState(supplySteps);

  const supplyForm   = useForm<AmountForm>({ resolver: zodResolver(amountSchema), defaultValues: { amount: '' } });
  const borrowForm   = useForm<AmountForm>({ resolver: zodResolver(amountSchema), defaultValues: { amount: '' } });
  const repayForm    = useForm<AmountForm>({ resolver: zodResolver(amountSchema), defaultValues: { amount: '' } });
  const withdrawForm = useForm<AmountForm>({ resolver: zodResolver(amountSchema), defaultValues: { amount: '' } });

  // Initial UI loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Fetch on-chain position
  const fetchPosition = useCallback(async () => {
    if (!isConnected || !appConfig.contractsDeployed) return;
    const { ethereum } = window as Window & { ethereum?: unknown };
    if (!ethereum) return;
    try {
      setPosLoading(true);
      const { BrowserProvider } = await import('ethers');
      const provider = new BrowserProvider(ethereum as import('ethers').Eip1193Provider);
      const signer   = await provider.getSigner();
      const addr     = await signer.getAddress();
      const pos      = await getUserPosition(addr);
      setPosition(pos);
    } catch (err) {
      console.warn('[VaultPage] fetchPosition:', err);
    } finally {
      setPosLoading(false);
    }
  }, [isConnected]);

  useEffect(() => { fetchPosition(); }, [fetchPosition]);

  if (!vault) {
    return (
      <main className="relative min-h-screen">
        <Navigation />
        <section className="pt-32 pb-20 px-4 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Vault not found</h1>
          <Link href="/markets" className="glass-button px-6 py-3 inline-flex items-center justify-center">
            Back to Markets
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  // ── Guard helpers ────────────────────────────────────────────────────────────

  const guardAction = (): boolean => {
    if (!isConnected) { showToast('Connect wallet first.', 'warning'); setShowModal(true); return false; }
    return true;
  };
  const guardBorrow = (): boolean => {
    if (!guardAction()) return false;
    if (!isVerified) { showToast('PoP verification required to borrow.', 'info'); router.push('/verify'); return false; }
    return true;
  };

  // ── Transaction handlers ─────────────────────────────────────────────────────

  const handleSupply = async ({ amount }: AmountForm) => {
    if (!guardAction()) return;
    setTxModalTitle('Supply Collateral');
    setActiveSteps(supplySteps);
    supplySteps.resetSteps();
    setTxModalOpen(true);
    try {
      await switchToMoonbase();
      supplySteps.setStepStatus('approve', 'loading');
      const result = await supplyCollateral(
        amount,
        (hash) => supplySteps.setStepStatus('approve', 'success', { txHash: hash }),
      );
      supplySteps.setStepStatus('approve', 'success');
      supplySteps.setStepStatus('supply', 'loading');
      supplySteps.setStepStatus('supply', 'success', { txHash: result });
      showToast('Supply successful!', 'success');
      supplyForm.reset();
      fetchPosition();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      supplySteps.setStepStatus('supply', 'error', { errorMsg: msg });
      showToast(msg.length > 60 ? msg.slice(0, 57) + '…' : msg, 'error');
    }
  };

  const handleBorrow = async ({ amount }: AmountForm) => {
    if (!guardBorrow()) return;
    setTxModalTitle('Borrow USDC');
    setActiveSteps(borrowSteps);
    borrowSteps.resetSteps();
    setTxModalOpen(true);
    try {
      await switchToMoonbase();
      borrowSteps.setStepStatus('borrow', 'loading');
      const hash = await borrowUsdc(amount);
      borrowSteps.setStepStatus('borrow', 'success', { txHash: hash });
      showToast('Borrow successful!', 'success');
      borrowForm.reset();
      fetchPosition();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      borrowSteps.setStepStatus('borrow', 'error', { errorMsg: msg });
      showToast(msg.length > 60 ? msg.slice(0, 57) + '…' : msg, 'error');
    }
  };

  const handleRepay = async ({ amount }: AmountForm) => {
    if (!guardAction()) return;
    setTxModalTitle('Repay Debt');
    setActiveSteps(repaySteps);
    repaySteps.resetSteps();
    setTxModalOpen(true);
    try {
      await switchToMoonbase();
      repaySteps.setStepStatus('approve', 'loading');
      await repayUsdc(
        amount,
        (hash) => repaySteps.setStepStatus('approve', 'success', { txHash: hash }),
      );
      repaySteps.setStepStatus('approve', 'success');
      repaySteps.setStepStatus('repay', 'loading');
      repaySteps.setStepStatus('repay', 'success');
      showToast('Repay successful!', 'success');
      repayForm.reset();
      fetchPosition();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      repaySteps.setStepStatus('repay', 'error', { errorMsg: msg });
      showToast(msg.length > 60 ? msg.slice(0, 57) + '…' : msg, 'error');
    }
  };

  const handleWithdraw = async ({ amount }: AmountForm) => {
    if (!guardAction()) return;
    setTxModalTitle('Withdraw Collateral');
    setActiveSteps(withdrawSteps);
    withdrawSteps.resetSteps();
    setTxModalOpen(true);
    try {
      await switchToMoonbase();
      withdrawSteps.setStepStatus('withdraw', 'loading');
      const hash = await withdrawCollateral(amount);
      withdrawSteps.setStepStatus('withdraw', 'success', { txHash: hash });
      showToast('Withdrawal successful!', 'success');
      withdrawForm.reset();
      fetchPosition();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transaction failed';
      withdrawSteps.setStepStatus('withdraw', 'error', { errorMsg: msg });
      showToast(msg.length > 60 ? msg.slice(0, 57) + '…' : msg, 'error');
    }
  };

  // ── Display values ───────────────────────────────────────────────────────────

  const healthFactor = position
    ? position.healthFactor === Infinity ? '∞' : position.healthFactor.toFixed(2)
    : Number(((vault.maxLtv / Math.max(simulatedLtv, 1)) * 2.4).toFixed(2)).toString();

  const healthColor =
    position?.healthFactor === Infinity || Number(healthFactor) >= 2.5 ? 'text-white' :
    Number(healthFactor) >= 1.8 ? 'text-white/70' : 'text-white/50';

  const supplyApy = vault.supplyApy.toFixed(1);
  const borrowApy = vault.borrowApy.toFixed(1);

  return (
    <main className="relative min-h-screen">
      <Navigation />

      <TxModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        title={txModalTitle}
        steps={activeSteps.steps}
        onComplete={fetchPosition}
        completionMessage="Transaction confirmed on Moonbase Alpha."
      />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-8">

          <Link href="/markets" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />Back to Markets
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

          {/* Metric cards */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full bg-white/10" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { label: 'Supply APY',  value: `${supplyApy}%` },
                { label: 'Borrow APY',  value: `${borrowApy}%` },
                { label: 'Utilization', value: `${vault.utilization}%` },
              ].map((m) => (
                <div key={m.label} className="glass p-6 rounded-2xl">
                  <p className="text-white/60 text-sm">{m.label}</p>
                  <p className="text-2xl font-bold text-white">{m.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* On-chain position (when contracts deployed + connected) */}
          {isConnected && appConfig.contractsDeployed && (
            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Your On-Chain Position</h3>
                <button
                  type="button"
                  onClick={fetchPosition}
                  className="text-white/40 hover:text-white transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${positionLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {position ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="glass-dark p-3 rounded-xl">
                    <p className="text-white/50">Supplied</p>
                    <p className="text-white font-semibold">{Number(position.supplied).toFixed(2)} PRE</p>
                    <p className="text-white/40 text-xs">${position.collateralValueUsd}</p>
                  </div>
                  <div className="glass-dark p-3 rounded-xl">
                    <p className="text-white/50">Borrowed</p>
                    <p className="text-white font-semibold">${position.borrowed}</p>
                  </div>
                  <div className="glass-dark p-3 rounded-xl">
                    <p className="text-white/50">Max Borrow</p>
                    <p className="text-white font-semibold">${position.maxBorrow}</p>
                  </div>
                  <div className="glass-dark p-3 rounded-xl">
                    <p className="text-white/50">Health Factor</p>
                    <p className={`font-bold ${healthColor}`}>
                      {position.healthFactor === Infinity ? '∞' : position.healthFactor.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-white/40 text-sm">
                  {positionLoading ? 'Loading position…' : 'No position yet. Supply collateral to start.'}
                </p>
              )}
              {/* PoP tier badge */}
              <div className="mt-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white/50" />
                <span className="text-white/50 text-xs">
                  {isVerified
                    ? `PoP Tier ${popTier} active — ${popTier === 1 ? '1.0×' : popTier === 2 ? '1.5×' : '2.0×'} borrow multiplier`
                    : 'PoP not verified — borrowing locked'}
                </span>
              </div>
            </div>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="glass p-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="docs">Documents</TabsTrigger>
            </TabsList>

            {/* ── Overview ── */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">

                  {/* Collateral details */}
                  <div className="glass p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Collateral Details</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Collateral Type',       value: vault.collateralType },
                        { label: 'Max LTV',               value: `${vault.maxLtv}%` },
                        { label: 'Liquidation Threshold', value: `${vault.liquidationThreshold}%` },
                      ].map((d) => (
                        <div key={d.label} className="glass-dark p-4 rounded-xl">
                          <p className="text-white/60 text-sm">{d.label}</p>
                          <p className="text-white font-semibold">{d.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center gap-3 text-white/70">
                      <ShieldCheck className="w-5 h-5 text-white/60" />
                      <span className="text-sm">
                        PoP verification required to borrow. Higher tiers unlock larger limits.
                      </span>
                    </div>
                  </div>

                  {/* Health factor simulator */}
                  <div className="glass p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Health Factor Simulator</h2>
                    <div className="glass-dark p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Simulated LTV</span>
                        <span className="text-white font-semibold">{simulatedLtv}%</span>
                      </div>
                      <input
                        type="range" min={20} max={80} step={5}
                        value={simulatedLtv}
                        onChange={(e) => setSimulatedLtv(Number(e.target.value))}
                        aria-label="Simulated LTV slider"
                        className="w-full"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Simulated Health Factor</span>
                        <span className={`text-lg font-bold ${healthColor}`}>{healthFactor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Supply + Borrow + Repay + Withdraw forms */}
                <div className="space-y-4">

                  {/* Supply */}
                  <div className="glass p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-4">Supply Collateral</h3>
                    <Form {...supplyForm}>
                      <form onSubmit={supplyForm.handleSubmit(handleSupply)} className="space-y-3">
                        <FormField control={supplyForm.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Amount (PRE)"
                                className="glass-input w-full text-white placeholder-white/50" />
                            </FormControl>
                            <FormMessage className="text-xs text-white/60" />
                          </FormItem>
                        )} />
                        <button type="submit" className="glass-button w-full">Supply {vault.symbol}</button>
                        <p className="text-white/50 text-xs">Earn {supplyApy}% APY</p>
                      </form>
                    </Form>
                  </div>

                  {/* Borrow */}
                  <div className="glass p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-4">Borrow USDC</h3>
                    {!isVerified && (
                      <div className="glass-dark p-3 rounded-xl mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-white/40" />
                        <Link href="/verify" className="text-xs text-white/50 hover:text-white transition-colors">
                          Verify PoP to unlock borrowing →
                        </Link>
                      </div>
                    )}
                    <Form {...borrowForm}>
                      <form onSubmit={borrowForm.handleSubmit(handleBorrow)} className="space-y-3">
                        <FormField control={borrowForm.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Amount (USDC)"
                                className="glass-input w-full text-white placeholder-white/50"
                                disabled={!isVerified} />
                            </FormControl>
                            <FormMessage className="text-xs text-white/60" />
                          </FormItem>
                        )} />
                        <button type="submit" disabled={!isVerified}
                          className="glass-button w-full disabled:opacity-40 disabled:cursor-not-allowed">
                          Borrow USDC
                        </button>
                        <p className="text-white/50 text-xs">Pay {borrowApy}% APY</p>
                      </form>
                    </Form>
                  </div>

                  {/* Repay */}
                  <div className="glass p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-4">Repay Debt</h3>
                    <Form {...repayForm}>
                      <form onSubmit={repayForm.handleSubmit(handleRepay)} className="space-y-3">
                        <FormField control={repayForm.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="USDC to repay"
                                className="glass-input w-full text-white placeholder-white/50" />
                            </FormControl>
                            <FormMessage className="text-xs text-white/60" />
                          </FormItem>
                        )} />
                        <button type="submit" className="button-secondary w-full">Repay USDC</button>
                      </form>
                    </Form>
                  </div>

                  {/* Withdraw */}
                  <div className="glass p-6 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-4">Withdraw Collateral</h3>
                    <Form {...withdrawForm}>
                      <form onSubmit={withdrawForm.handleSubmit(handleWithdraw)} className="space-y-3">
                        <FormField control={withdrawForm.control} name="amount" render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="number" placeholder="Amount (PRE)"
                                className="glass-input w-full text-white placeholder-white/50" />
                            </FormControl>
                            <FormMessage className="text-xs text-white/60" />
                          </FormItem>
                        )} />
                        <button type="submit" className="button-secondary w-full">Withdraw</button>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Analytics ── */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass p-6 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" /> Supply &amp; Borrow Rates
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={vault.history}>
                        <defs>
                          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#fff" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#fff" stopOpacity={0.08} />
                          </linearGradient>
                          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#fff" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#fff" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="supplyApy" stroke="#fff" fill="url(#sg)" />
                        <Area type="monotone" dataKey="borrowApy" stroke="#d4d4d4" fill="url(#bg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="glass p-6 rounded-3xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5" /> Collateral Mix
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie data={vault.composition} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                          {vault.composition.map((e) => <Cell key={e.name} fill={e.color} />)}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {vault.composition.map((e) => (
                      <div key={e.name} className="flex items-center justify-between text-sm text-white/70">
                        <span>{e.name}</span><span>{e.value}%</span>
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
                      <Line type="monotone" dataKey="utilization" stroke="#fff" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            {/* ── Docs ── */}
            <TabsContent value="docs" className="space-y-6">
              <div className="glass p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-white mb-4">Vault Documents</h3>
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
