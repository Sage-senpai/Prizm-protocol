'use client';

import { useState } from 'react';
import { Loader2, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWallet, type WalletType } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';

const WALLET_PROVIDERS: Array<{
  id: WalletType;
  name: string;
  description: string;
  badge: string;
  accent: string;
}> = [
  {
    id: 'polkadot-js',
    name: 'Polkadot.js Extension',
    description: 'Browser extension for Polkadot accounts',
    badge: 'PX',
    accent: 'from-white to-zinc-400',
  },
  {
    id: 'talisman',
    name: 'Talisman',
    description: 'Polkadot-native wallet with multi-chain support',
    badge: 'TL',
    accent: 'from-white to-zinc-500',
  },
  {
    id: 'subwallet',
    name: 'SubWallet',
    description: 'Multi-chain wallet with fast signing',
    badge: 'SW',
    accent: 'from-white to-zinc-300',
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'Mobile-first wallet with secure vaults',
    badge: 'NV',
    accent: 'from-white to-zinc-600',
  },
  {
    id: 'metamask',
    name: 'MetaMask (EVM)',
    description: 'EVM wallet for Moonbeam Solidity contracts',
    badge: 'MM',
    accent: 'from-white to-zinc-500',
  },
];

export function WalletModal() {
  const { showModal, setShowModal, connectWallet } = useWallet();
  const { showToast } = useToast();
  const [connectingId, setConnectingId] = useState<WalletType | null>(null);

  const handleConnect = async (walletId: WalletType) => {
    setConnectingId(walletId);
    try {
      await connectWallet(walletId);
      showToast('Wallet connected successfully.', 'success');
      setShowModal(false);
    } catch (error) {
      console.error('Connection failed:', error);
      showToast('Failed to connect wallet. Please try again.', 'error');
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="glass-deep border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Connect Wallet</DialogTitle>
          <DialogDescription className="text-white/60">
            Select a Polkadot or EVM wallet. Approve the connection in your extension.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {WALLET_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleConnect(provider.id)}
              disabled={connectingId !== null}
              className="w-full flex items-center gap-4 glass px-4 py-3 rounded-2xl border border-white/10 hover:border-white/30 transition-all disabled:opacity-60"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.accent} text-black flex items-center justify-center font-bold`}>
                {provider.badge}
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold">{provider.name}</p>
                <p className="text-white/60 text-sm">{provider.description}</p>
              </div>
              {connectingId === provider.id ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Wallet className="w-5 h-5 text-white/60" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-white/60 text-sm">
            By connecting a wallet, you agree to the Terms of Service and acknowledge the current demo state.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
