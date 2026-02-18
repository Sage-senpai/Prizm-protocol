'use client';

import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight } from 'lucide-react';
import { appConfig } from '@/lib/config';
import { fetchChainInfo, fetchEvmChainData, fetchPolkadotLatestBlock, submitPolkadotTransfer, subscribePolkadotFinalizedBlocks } from '@/lib/blockchain/examples';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';

type ChainInfo = {
  chain: string;
  nodeName: string;
  nodeVersion: string;
  genesisHash: string;
};

type EvmInfo = {
  chainId: number;
  name: string;
  blockNumber: number;
};

export function PolkadotStatus() {
  const { address, walletNamespace, accountSource } = useWallet();
  const { showToast } = useToast();
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  const [finalizedBlock, setFinalizedBlock] = useState<number | null>(null);
  const [evmInfo, setEvmInfo] = useState<EvmInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let active = true;

    const load = async () => {
      try {
        const [info, latest, evm] = await Promise.all([
          fetchChainInfo(),
          fetchPolkadotLatestBlock(),
          fetchEvmChainData(),
        ]);

        if (!active) return;
        setChainInfo(info);
        setLatestBlock(latest.number);
        setEvmInfo(evm);

        unsubscribe = await subscribePolkadotFinalizedBlocks((block) => {
          setFinalizedBlock(block);
        });
      } catch (error) {
        console.error('Chain status error', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSampleTransfer = async () => {
    if (walletNamespace !== 'polkadot' || !address || !accountSource) {
      showToast('Connect a Polkadot wallet to run the sample transfer.', 'warning');
      return;
    }

    if (!appConfig.polkadot.transferTo) {
      showToast('Set NEXT_PUBLIC_POLKADOT_TRANSFER_TO to enable sample transfers.', 'info');
      return;
    }

    try {
      const hash = await submitPolkadotTransfer({
        from: address,
        to: appConfig.polkadot.transferTo,
        amountPlanck: '1000000000',
        source: accountSource,
      });
      showToast(`Transfer submitted: ${hash.slice(0, 10)}...`, 'success');
    } catch (error) {
      console.error('Transfer error', error);
      showToast('Sample transfer failed. Check wallet permissions.', 'error');
    }
  };

  return (
    <div className="glass p-6 rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-white/70">
          <Activity className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.24em]">Chain Status</span>
        </div>
        <span className="text-xs text-white/50">Env: {appConfig.env}</span>
      </div>

      {loading ? (
        <p className="text-white/50 text-sm">Syncing chain data...</p>
      ) : (
        <div className="space-y-4 text-sm text-white/70">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass-dark p-4 rounded-2xl">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">Polkadot</p>
              <p className="text-white font-semibold">{chainInfo?.chain ?? 'Unknown'}</p>
              <p className="text-white/50">{chainInfo?.nodeName} {chainInfo?.nodeVersion}</p>
              <p className="text-white/50">Genesis: {chainInfo?.genesisHash.slice(0, 10)}...</p>
            </div>
            <div className="glass-dark p-4 rounded-2xl">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">Moonbeam EVM</p>
              <p className="text-white font-semibold">{evmInfo?.name ?? 'Unknown'}</p>
              <p className="text-white/50">Chain ID: {evmInfo?.chainId ?? '--'}</p>
              <p className="text-white/50">Block: {evmInfo?.blockNumber ?? '--'}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass-dark p-4 rounded-2xl">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">Latest Block</p>
              <p className="text-white font-semibold">{latestBlock ?? '--'}</p>
            </div>
            <div className="glass-dark p-4 rounded-2xl">
              <p className="text-white/50 text-xs uppercase tracking-[0.2em]">Finalized Block</p>
              <p className="text-white font-semibold">{finalizedBlock ?? '--'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleSampleTransfer}
              className="button-secondary inline-flex items-center justify-center gap-2"
            >
              Run sample transfer
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <span className="text-xs text-white/50">
              Uses Polkadot.js signer when a Polkadot wallet is connected.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
