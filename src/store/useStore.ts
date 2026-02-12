import { create } from 'zustand';
import { Customer, Transaction, DashboardStats } from '@/types';
import { mockCustomer, mockCustomers, initialTransactions, PENDING_EXPIRY_MINUTES } from '@/data/mock-data';

// ===========================================
// STORE INTERFACE
// ===========================================

interface AppState {
  // Data
  customer: Customer;
  customers: Customer[];
  transactions: Transaction[];

  // Actions
  submitTopup: (amount: number, bankCode: string, notes?: string) => Transaction;
  updateCustomerBalance: (customerId: string, amount: number) => void;
  confirmTransaction: (txId: string) => void;
  expireTransactions: () => void;

  // Getters
  getDashboardStats: () => DashboardStats;
}

// ===========================================
// ID GENERATORS
// ===========================================

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// ===========================================
// STORE IMPLEMENTATION
// ===========================================

export const useStore = create<AppState>((set, get) => ({
  // Initial Data
  customer: { ...mockCustomer },
  customers: [...mockCustomers],
  transactions: [...initialTransactions],

  // Submit Top-Up: creates a PENDING transaction (balance not updated yet)
  submitTopup: (amount, bankCode, notes) => {
    const state = get();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + PENDING_EXPIRY_MINUTES * 60000).toISOString();
    const newTransaction: Transaction = {
      id: generateId('TRX'),
      customerId: state.customer.id,
      customerName: state.customer.companyName,
      virtualAccountNumber: state.customer.virtualAccountNumber,
      amount,
      status: 'pending',
      paymentMethod: 'Virtual Account',
      bankCode,
      createdAt: now,
      updatedAt: now,
      expiresAt,
    };

    set((s) => ({
      transactions: [newTransaction, ...s.transactions],
    }));

    // Suppress unused variable warning - notes is accepted but not stored in prototype
    void notes;

    return newTransaction;
  },

  // Confirm a pending transaction → success + update balance
  confirmTransaction: (txId) => {
    const state = get();
    const tx = state.transactions.find((t) => t.id === txId);
    if (!tx || tx.status !== 'pending') return;

    const now = new Date().toISOString();
    set((s) => ({
      transactions: s.transactions.map((t) =>
        t.id === txId ? { ...t, status: 'success' as const, updatedAt: now } : t
      ),
      customer:
        s.customer.id === tx.customerId
          ? { ...s.customer, balance: s.customer.balance + tx.amount }
          : s.customer,
      customers: s.customers.map((c) =>
        c.id === tx.customerId ? { ...c, balance: c.balance + tx.amount } : c
      ),
    }));
  },

  // Auto-expire pending transactions past their deadline
  expireTransactions: () => {
    const now = new Date().toISOString();
    set((s) => {
      const hasExpired = s.transactions.some(
        (t) => t.status === 'pending' && t.expiresAt && t.expiresAt < now
      );
      if (!hasExpired) return s;

      return {
        transactions: s.transactions.map((t) =>
          t.status === 'pending' && t.expiresAt && t.expiresAt < now
            ? { ...t, status: 'failed' as const, updatedAt: now }
            : t
        ),
      };
    });
  },

  updateCustomerBalance: (customerId, amount) => {
    set((state) => ({
      customer:
        state.customer.id === customerId
          ? { ...state.customer, balance: state.customer.balance + amount }
          : state.customer,
      customers: state.customers.map((c) =>
        c.id === customerId ? { ...c, balance: c.balance + amount } : c
      ),
    }));
  },

  // Getters
  getDashboardStats: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const todayTransactions = state.transactions.filter(
      (t) => t.status === 'success' && t.createdAt.startsWith(today)
    );

    const thisMonthTransactions = state.transactions.filter((t) => {
      if (t.status !== 'success') return false;
      const d = new Date(t.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    const uniqueCustomers = new Set(
      state.transactions
        .filter((t) => t.status === 'success')
        .map((t) => t.customerId)
    );

    return {
      totalTransactionsToday: todayTransactions.length,
      totalAmountToday: todayTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactionsThisMonth: thisMonthTransactions.length,
      activeCustomers: uniqueCustomers.size,
    };
  },
}));
