'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useWallet } from '@/context/wallet-context';
import { useToast } from '@/context/toast-context';

export function useProtectedRoute(options?: { requireVerified?: boolean }) {
  const { requireVerified = true } = options || {};
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected, isVerified } = useWallet();
  const { showToast } = useToast();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (didRedirect.current) return;
    if (!isConnected) {
      showToast('Please connect wallet first.', 'warning');
      router.push('/');
      didRedirect.current = true;
      return;
    }
    if (requireVerified && !isVerified && pathname !== '/verify') {
      showToast('Verify your humanity to unlock full borrow limits.', 'info');
      router.push('/verify');
      didRedirect.current = true;
    }
  }, [isConnected, isVerified, pathname, requireVerified, router, showToast]);

  return { isConnected, isVerified };
}
