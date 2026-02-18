'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { connectEvmWallet } from '@/lib/blockchain/evm';
import { getPolkadotAccounts } from '@/lib/blockchain/polkadot-wallet';

export type WalletType = 'polkadot-js' | 'talisman' | 'subwallet' | 'nova' | 'metamask';
export type WalletNamespace = 'polkadot' | 'evm';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
  walletNamespace: WalletNamespace | null;
  accountSource: string | null;
  isVerified: boolean;
  borrowMultiplier: number;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  verifyPop: () => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);
const STORAGE_KEY = 'prizm-wallet-state';
const WALLET_APP_NAME = 'Prizm Protocol';
const WALLET_SOURCES: Record<WalletType, string | null> = {
  'polkadot-js': 'polkadot-js',
  talisman: 'talisman',
  subwallet: 'subwallet-js',
  nova: 'nova',
  metamask: null,
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [walletNamespace, setWalletNamespace] = useState<WalletNamespace | null>(null);
  const [accountSource, setAccountSource] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [borrowMultiplier, setBorrowMultiplier] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        isConnected: boolean;
        address: string | null;
        walletType: WalletType | null;
        walletNamespace: WalletNamespace | null;
        accountSource: string | null;
        isVerified: boolean;
        borrowMultiplier: number;
      };
      setIsConnected(parsed.isConnected);
      setAddress(parsed.address);
      setWalletType(parsed.walletType);
      setWalletNamespace(parsed.walletNamespace ?? null);
      setAccountSource(parsed.accountSource ?? null);
      setIsVerified(parsed.isVerified);
      setBorrowMultiplier(parsed.borrowMultiplier || 1);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      isConnected,
      address,
      walletType,
      walletNamespace,
      accountSource,
      isVerified,
      borrowMultiplier,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [isConnected, address, walletType, walletNamespace, accountSource, isVerified, borrowMultiplier]);

  const connectWallet = async (selectedWallet: WalletType) => {
    try {
      if (selectedWallet === 'metamask') {
        const { address: evmAddress } = await connectEvmWallet();
        setAddress(evmAddress);
        setWalletNamespace('evm');
        setAccountSource(null);
      } else {
        const preferredSource = WALLET_SOURCES[selectedWallet] ?? undefined;
        const accounts = await getPolkadotAccounts(WALLET_APP_NAME, preferredSource);
        if (!accounts.length) {
          throw new Error('No Polkadot accounts found. Open your wallet and authorize access.');
        }
        setAddress(accounts[0].address);
        setWalletNamespace('polkadot');
        setAccountSource(accounts[0].source ?? null);
      }

      setWalletType(selectedWallet);
      setIsConnected(true);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setWalletType(null);
    setWalletNamespace(null);
    setAccountSource(null);
    setIsVerified(false);
    setBorrowMultiplier(1);
  };

  const verifyPop = () => {
    setIsVerified(true);
    setBorrowMultiplier(1.5);
  };

  const value = useMemo(
    () => ({
      isConnected,
      address,
      walletType,
      walletNamespace,
      accountSource,
      isVerified,
      borrowMultiplier,
      connectWallet,
      disconnectWallet,
      verifyPop,
      showModal,
      setShowModal,
    }),
    [isConnected, address, walletType, walletNamespace, accountSource, isVerified, borrowMultiplier, showModal],
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
