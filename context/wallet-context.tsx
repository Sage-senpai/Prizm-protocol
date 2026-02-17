'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type WalletType = 'metamask' | 'talisman' | 'subwallet' | 'nova';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
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

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
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
        isVerified: boolean;
        borrowMultiplier: number;
      };
      setIsConnected(parsed.isConnected);
      setAddress(parsed.address);
      setWalletType(parsed.walletType);
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
      isVerified,
      borrowMultiplier,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [isConnected, address, walletType, isVerified, borrowMultiplier]);

  const connectWallet = async (selectedWallet: WalletType) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockAddresses: Record<WalletType, string> = {
        metamask: '0x742d35Cc6634C0532925a3b844Bc9e7595f7eaB',
        talisman: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
        subwallet: '0x1234567890abcdef1234567890abcdef12345678',
        nova: '0x91b4a89d9b4b9f7eaB5A1d0c3A31b0f1dE9B20a2',
      };

      setAddress(mockAddresses[selectedWallet]);
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
      isVerified,
      borrowMultiplier,
      connectWallet,
      disconnectWallet,
      verifyPop,
      showModal,
      setShowModal,
    }),
    [isConnected, address, walletType, isVerified, borrowMultiplier, showModal],
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
