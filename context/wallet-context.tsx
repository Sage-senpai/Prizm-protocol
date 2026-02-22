'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from 'react';
import { connectEvmWallet } from '@/lib/blockchain/evm';
import { getPolkadotAccounts } from '@/lib/blockchain/polkadot-wallet';

export type WalletType = 'polkadot-js' | 'talisman' | 'subwallet' | 'nova' | 'metamask';
export type WalletNamespace = 'polkadot' | 'evm';

// ─── Tier helpers ─────────────────────────────────────────────────────────────

/** Derive borrow multiplier from PoP tier (basis: 1.0×) */
function tierToMultiplier(tier: number): number {
  if (tier >= 3) return 2.0;
  if (tier === 2) return 1.5;
  if (tier === 1) return 1.0;
  return 1.0; // unverified – no borrowing, but keep at 1 for UI math
}

// ─── Context interface ────────────────────────────────────────────────────────

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
  walletNamespace: WalletNamespace | null;
  accountSource: string | null;

  /** PoP tier: 0 = unverified | 1 = DIM1 | 2 = DIM2 | 3 = Full-stack */
  popTier: number;
  /** Convenience: true when popTier >= 1 */
  isVerified: boolean;
  /** 1.0 / 1.5 / 2.0 depending on tier */
  borrowMultiplier: number;

  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  /** Called from the verify page once on-chain PoP is confirmed */
  setPopTier: (tier: number) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

// ─── Persisted state shape ────────────────────────────────────────────────────

interface PersistedState {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
  walletNamespace: WalletNamespace | null;
  accountSource: string | null;
  popTier: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WalletContext = createContext<WalletContextType | undefined>(undefined);
const STORAGE_KEY   = 'prizm-wallet-state-v2'; // bumped to avoid stale shape
const APP_NAME      = 'Prizm Protocol';
const WALLET_SOURCES: Record<WalletType, string | null> = {
  'polkadot-js': 'polkadot-js',
  talisman:      'talisman',
  subwallet:     'subwallet-js',
  nova:          'nova',
  metamask:      null,
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected]     = useState(false);
  const [address, setAddress]             = useState<string | null>(null);
  const [walletType, setWalletType]       = useState<WalletType | null>(null);
  const [walletNamespace, setWalletNamespace] = useState<WalletNamespace | null>(null);
  const [accountSource, setAccountSource] = useState<string | null>(null);
  const [popTier, setPopTierState]        = useState<number>(0);
  const [showModal, setShowModal]         = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const isVerified      = popTier >= 1;
  const borrowMultiplier = tierToMultiplier(popTier);

  // ── Pre-warm Polkadot WASM so enable() fires immediately on connect ────────
  useEffect(() => {
    import('@/lib/blockchain/polkadot-wallet')
      .then(({ preloadPolkadotCrypto }) => preloadPolkadotCrypto())
      .catch(() => {});
  }, []);

  // ── Hydrate from localStorage ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PersistedState;
      setIsConnected(parsed.isConnected ?? false);
      setAddress(parsed.address ?? null);
      setWalletType(parsed.walletType ?? null);
      setWalletNamespace(parsed.walletNamespace ?? null);
      setAccountSource(parsed.accountSource ?? null);
      setPopTierState(parsed.popTier ?? 0);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ── Persist to localStorage ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload: PersistedState = {
      isConnected,
      address,
      walletType,
      walletNamespace,
      accountSource,
      popTier,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [isConnected, address, walletType, walletNamespace, accountSource, popTier]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const connectWallet = useCallback(async (selectedWallet: WalletType) => {
    // 55-second outer timeout:
    //   40 s  first enable() attempt (user approves extension popup)
    // + 10 s  crypto WASM init
    // +  5 s  overhead
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('Wallet connection timed out. Check that your extension is unlocked and try again.')),
        55_000,
      ),
    );

    try {
      await Promise.race([
        (async () => {
          if (selectedWallet === 'metamask') {
            const { address: evmAddress } = await connectEvmWallet();
            setAddress(evmAddress);
            setWalletNamespace('evm');
            setAccountSource(null);
          } else {
            const preferredSource = WALLET_SOURCES[selectedWallet] ?? undefined;
            const accounts = await getPolkadotAccounts(APP_NAME, preferredSource);
            if (!accounts.length) {
              throw new Error('No Polkadot accounts found. Open your wallet and grant access.');
            }
            setAddress(accounts[0].address);
            setWalletNamespace('polkadot');
            setAccountSource(accounts[0].source ?? null);
          }
          setWalletType(selectedWallet);
          setIsConnected(true);
          setShowModal(false);
        })(),
        timeout,
      ]);
    } catch (error) {
      console.error('[WalletProvider] connectWallet failed:', error);
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setWalletType(null);
    setWalletNamespace(null);
    setAccountSource(null);
    setPopTierState(0);
  }, []);

  /** Called by the verify page once the on-chain credential is confirmed */
  const setPopTier = useCallback((tier: number) => {
    setPopTierState(Math.max(0, Math.min(3, tier)));
  }, []);

  // ── Context value ──────────────────────────────────────────────────────────
  const value = useMemo<WalletContextType>(
    () => ({
      isConnected,
      address,
      walletType,
      walletNamespace,
      accountSource,
      popTier,
      isVerified,
      borrowMultiplier,
      connectWallet,
      disconnectWallet,
      setPopTier,
      showModal,
      setShowModal,
    }),
    [
      isConnected, address, walletType, walletNamespace, accountSource,
      popTier, isVerified, borrowMultiplier,
      connectWallet, disconnectWallet, setPopTier, showModal,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
