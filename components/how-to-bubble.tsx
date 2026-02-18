'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { X, MessageCircle } from 'lucide-react';
import { useWallet } from '@/context/wallet-context';

const STORAGE_KEY = 'prizm-help-dismissed';

export function HowToBubble() {
  const { isConnected, isVerified } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY);
    setIsOpen(dismissed !== 'true');
  }, []);

  const steps = useMemo(
    () => [
      isConnected ? 'Wallet connected.' : 'Connect a wallet to unlock actions.',
      'Complete onboarding: profile + PoP verification.',
      'Visit Dashboard to track positions.',
      'Use Markets to select a vault.',
      'Supply or borrow on a vault detail page.',
    ],
    [isConnected],
  );

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[900] flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
        aria-label="Open quick guide"
      >
        <MessageCircle className="h-4 w-4" />
        Quick guide
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[900] w-80 rounded-2xl border border-white/15 bg-black/70 p-5 text-sm text-white/80 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Getting Started</p>
          <h3 className="mt-2 text-base font-semibold text-white">
            {isVerified ? 'You are verified.' : 'Welcome to Prizm.'}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(STORAGE_KEY, 'true');
            }
          }}
          className="rounded-full border border-white/10 bg-white/5 p-1 text-white/70 hover:text-white"
          aria-label="Dismiss quick guide"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="mt-4 space-y-2 text-white/70">
        {steps.map((step) => (
          <li key={step} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
            <span>{step}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-3">
        <Link
          href="/onboard"
          className="flex-1 rounded-full border border-white/15 bg-white text-center text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Start onboarding
        </Link>
        <Link
          href="/markets"
          className="flex-1 rounded-full border border-white/15 bg-white/5 text-center text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          Browse markets
        </Link>
      </div>
    </div>
  );
}
