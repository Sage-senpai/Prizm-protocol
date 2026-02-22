'use client';

import { useEffect, useState } from 'react';
import { Check, ExternalLink, Loader2, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWallet, type WalletType } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';

// ─── Wallet registry ─────────────────────────────────────────────────────────

type WalletProvider = {
  id: WalletType;
  name: string;
  description: string;
  badge: string;
  accent: string;
  installUrl: string;
  /** Key in window.injectedWeb3 for Polkadot wallets; null for EVM */
  injectedKey: string | null;
};

const WALLET_PROVIDERS: WalletProvider[] = [
  {
    id: 'metamask',
    name: 'MetaMask (EVM)',
    description: 'EVM wallet for Moonbeam Solidity contracts',
    badge: 'MM',
    accent: 'from-white to-zinc-500',
    installUrl: 'https://metamask.io/download/',
    injectedKey: null,
  },
  {
    id: 'talisman',
    name: 'Talisman',
    description: 'Polkadot-native wallet with multi-chain support',
    badge: 'TL',
    accent: 'from-white to-zinc-500',
    installUrl: 'https://talisman.xyz/download',
    injectedKey: 'talisman',
  },
  {
    id: 'polkadot-js',
    name: 'Polkadot.js Extension',
    description: 'Browser extension for Polkadot accounts',
    badge: 'PX',
    accent: 'from-white to-zinc-400',
    installUrl: 'https://polkadot.js.org/extension/',
    injectedKey: 'polkadot-js',
  },
  {
    id: 'subwallet',
    name: 'SubWallet',
    description: 'Multi-chain wallet with fast signing',
    badge: 'SW',
    accent: 'from-white to-zinc-300',
    installUrl: 'https://subwallet.app/download.html',
    injectedKey: 'subwallet-js',
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'Mobile-first wallet with secure vaults',
    badge: 'NV',
    accent: 'from-white to-zinc-600',
    installUrl: 'https://novawallet.io/',
    injectedKey: 'nova',
  },
];

// ─── Wallet detection ────────────────────────────────────────────────────────

type DetectedMap = Record<WalletType, boolean>;

function scanInstalledWallets(): DetectedMap {
  const w = window as Window & { ethereum?: unknown; injectedWeb3?: Record<string, unknown> };
  const injected = w.injectedWeb3 ?? {};
  return {
    metamask: !!w.ethereum,
    'polkadot-js': !!injected['polkadot-js'],
    talisman: !!injected.talisman,
    subwallet: !!injected['subwallet-js'],
    nova: !!injected.nova,
    demo: true, // always available
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WalletModal() {
  const { showModal, setShowModal, connectWallet } = useWallet();
  const { showToast } = useToast();
  const [connectingId, setConnectingId] = useState<WalletType | null>(null);
  const [connectStatus, setConnectStatus] = useState<string | null>(null);
  const [detected, setDetected] = useState<DetectedMap | null>(null);

  // Scan for installed wallet extensions each time the modal opens
  useEffect(() => {
    if (!showModal) {
      setDetected(null);
      return;
    }
    // Extensions inject asynchronously after page load — short delay catches them
    const timer = setTimeout(() => setDetected(scanInstalledWallets()), 350);
    return () => clearTimeout(timer);
  }, [showModal]);

  const handleClick = async (provider: WalletProvider) => {
    const isInstalled = detected?.[provider.id] ?? false;

    // Not installed → open the extension's install page
    if (!isInstalled) {
      window.open(provider.installUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Installed → connect
    setConnectingId(provider.id);
    setConnectStatus('Waiting for extension approval\u2026');

    // After ~6 s (first attempt over, retry starting) update the status
    const retryTimer = setTimeout(
      () => setConnectStatus('Waking up extension, retrying\u2026'),
      6_000,
    );
    // After ~25 s (retries ongoing) remind user to open the extension
    const hintTimer = setTimeout(
      () => setConnectStatus('Still waiting \u2014 try clicking the extension icon in your toolbar'),
      25_000,
    );

    try {
      await connectWallet(provider.id);
      showToast('Wallet connected successfully.', 'success');
      setShowModal(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet.';
      console.error('Connection failed:', error);
      showToast(message, 'error');
    } finally {
      clearTimeout(retryTimer);
      clearTimeout(hintTimer);
      setConnectingId(null);
      setConnectStatus(null);
    }
  };

  const scanning = detected === null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="glass-deep max-h-[85vh] overflow-hidden border-black/15 p-5 sm:max-w-[440px] sm:p-6 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground sm:text-2xl">Connect Wallet</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {connectStatus
              ? connectStatus
              : scanning
              ? 'Scanning for installed wallets\u2026'
              : 'Select an installed wallet to continue.'}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[52vh] space-y-2 overflow-y-auto pr-1">
          {WALLET_PROVIDERS.map((provider) => {
            const isDetected = detected?.[provider.id] ?? false;
            const isNotInstalled = !scanning && !isDetected;

            return (
              <button
                key={provider.id}
                type="button"
                onClick={() => handleClick(provider)}
                disabled={connectingId !== null || scanning}
                className={`glass flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 transition-all disabled:opacity-60 ${
                  isNotInstalled
                    ? 'border-black/5 opacity-50 dark:border-white/5'
                    : 'border-black/10 hover:border-black/30 dark:border-white/10 dark:hover:border-white/30'
                }`}
              >
                {/* Badge */}
                <div
                  className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${provider.accent} flex items-center justify-center text-sm font-bold text-black`}
                >
                  {provider.badge}
                </div>

                {/* Name + status */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{provider.name}</p>
                    {!scanning && (
                      isDetected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          <Check className="h-2.5 w-2.5" /> Detected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Not installed
                        </span>
                      )
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isNotInstalled ? 'Click to install \u2192' : provider.description}
                  </p>
                </div>

                {/* Trailing icon */}
                {scanning ? (
                  <div className="h-4 w-4 shrink-0 rounded-full bg-white/10 animate-pulse" />
                ) : connectingId === provider.id ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-foreground" />
                ) : isNotInstalled ? (
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <Wallet className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>

        {/* Demo / Guest access fallback */}
        <div className="relative my-1 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>

        <button
          type="button"
          disabled={connectingId !== null}
          onClick={async () => {
            setConnectingId('demo');
            try {
              await connectWallet('demo');
              showToast('Demo mode active — wallet actions are simulated.', 'info');
              setShowModal(false);
            } catch {
              showToast('Failed to start demo mode.', 'error');
            } finally {
              setConnectingId(null);
            }
          }}
          className="glass flex w-full items-center gap-3 rounded-xl border border-dashed border-black/15 px-3 py-2.5 transition-all hover:border-black/30 disabled:opacity-60 dark:border-white/15 dark:hover:border-white/30"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-sm font-bold text-muted-foreground dark:border-white/10 dark:bg-white/5">
            &#9654;
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-foreground">Demo / Guest Access</p>
            <p className="text-xs text-muted-foreground">Explore the UI without a real wallet</p>
          </div>
          {connectingId === 'demo' ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-foreground" />
          ) : (
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </button>

        <div className="mt-2 rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs text-muted-foreground">
            By connecting a wallet, you agree to the Terms of Service and acknowledge the current demo state.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
