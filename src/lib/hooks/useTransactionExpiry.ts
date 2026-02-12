'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function useTransactionExpiry() {
  const expireTransactions = useStore((s) => s.expireTransactions);

  useEffect(() => {
    // Check immediately on mount
    expireTransactions();

    // Then check every 30 seconds
    const interval = setInterval(expireTransactions, 30_000);
    return () => clearInterval(interval);
  }, [expireTransactions]);
}
