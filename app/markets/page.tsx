'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { Search, ArrowRight, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { vaults } from '@/lib/vaults';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('tvl');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredVaults = useMemo(() => {
    return vaults.filter(
      (vault) =>
        vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vault.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vault.collateralType.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const sortedVaults = useMemo(() => {
    return [...filteredVaults].sort((a, b) => {
      if (sortBy === 'tvl') return b.tvl - a.tvl;
      if (sortBy === 'supply') return b.supplyApy - a.supplyApy;
      if (sortBy === 'utilization') return b.utilization - a.utilization;
      return 0;
    });
  }, [filteredVaults, sortBy]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Very Low':
        return 'text-white/80 bg-white/10';
      case 'Low':
        return 'text-white/80 bg-white/10';
      case 'Medium':
        return 'text-white/70 bg-white/10';
      case 'High':
        return 'text-white/60 bg-white/10';
      default:
        return 'text-white/70 bg-white/10';
    }
  };

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
            <h1 className="text-4xl font-bold text-white mb-2">Markets</h1>
            <p className="text-white/60">
              Browse verified RWA vaults and compare supply and borrow rates in real time.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by vault, symbol, or collateral type"
                className="glass-input w-full pl-12 pr-4 py-3 text-white placeholder-white/50"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">Sort by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="glass px-4 py-2 text-white w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tvl">Total Supplied</SelectItem>
                  <SelectItem value="supply">Supply APY</SelectItem>
                  <SelectItem value="utilization">Utilization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-4">RWA Vault Overview</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full bg-white/10" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/60">Vault</TableHead>
                    <TableHead className="text-white/60">Collateral</TableHead>
                    <TableHead className="text-white/60">Supply APY</TableHead>
                    <TableHead className="text-white/60">Borrow APY</TableHead>
                    <TableHead className="text-white/60">Utilization</TableHead>
                    <TableHead className="text-right text-white/60">Total Supplied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedVaults.map((vault) => (
                    <TableRow key={vault.id} className="border-white/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{vault.name}</p>
                            <p className="text-white/50 text-sm">{vault.symbol}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/70">{vault.collateralType}</TableCell>
                      <TableCell className="text-white font-semibold">{vault.supplyApy.toFixed(1)}%</TableCell>
                      <TableCell className="text-white font-semibold">{vault.borrowApy.toFixed(1)}%</TableCell>
                      <TableCell className="text-white/70">{vault.utilization}%</TableCell>
                      <TableCell className="text-right text-white/80">
                        ${(vault.totalSupplied / 1_000_000).toFixed(0)}M
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="h-64 w-full bg-white/10" />
                ))
              : sortedVaults.map((vault) => (
                  <motion.div
                    key={vault.id}
                    whileHover={{ y: -6 }}
                    className="glass p-6 rounded-2xl flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">{vault.name}</h3>
                        <p className="text-white/50 text-sm">{vault.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(vault.risk)}`}>
                        {vault.risk}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Supply APY</span>
                        <span className="text-white font-semibold">{vault.supplyApy.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Borrow APY</span>
                        <span className="text-white font-semibold">{vault.borrowApy.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Utilization</span>
                        <span className="text-white/80">{vault.utilization}%</span>
                      </div>
                    </div>
                    <Link
                      href={`/vaults/${vault.id}`}
                      className="glass px-4 py-2 rounded-lg text-white/80 hover:text-white transition-colors border border-white/10 hover:border-white/30 flex items-center justify-center gap-2"
                    >
                      View Vault
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
          </div>
          {!loading && sortedVaults.length === 0 && (
            <div className="glass p-10 rounded-3xl text-center text-white/70">
              No vaults match your search criteria.
            </div>
          )}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
