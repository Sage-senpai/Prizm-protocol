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
      <DialogContent className="glass-deep max-h-[85vh] overflow-hidden border-black/15 p-5 sm:max-w-[440px] sm:p-6 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground sm:text-2xl">Connect Wallet</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a Polkadot or EVM wallet. Approve the connection in your extension.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[52vh] space-y-2 overflow-y-auto pr-1">
          {WALLET_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => handleConnect(provider.id)}
              disabled={connectingId !== null}
              className="glass w-full rounded-xl border border-black/10 px-3 py-2.5 transition-all hover:border-black/30 disabled:opacity-60 dark:border-white/10 dark:hover:border-white/30"
            >
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${provider.accent} flex items-center justify-center text-sm font-bold text-black`}>
                {provider.badge}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{provider.name}</p>
                <p className="text-xs text-muted-foreground">{provider.description}</p>
              </div>
              {connectingId === provider.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-foreground" />
              ) : (
                <Wallet className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs text-muted-foreground">
            By connecting a wallet, you agree to the Terms of Service and acknowledge the current demo state.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
