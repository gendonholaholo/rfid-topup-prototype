import { create } from 'zustand';
import { Transaction, Customer } from '@/types';
import { mockTransactions, mockCustomer } from '@/data/mock-data';

interface AppState {
  // Customer state
  customer: Customer;
  
  // Transactions state
  transactions: Transaction[];
  
  // Actions
  addTransaction: (transaction: Transaction) => void;
  updateCustomerBalance: (amount: number) => void;
  
  // Computed - get transactions count by status
  getTransactionsByStatus: (status: string) => Transaction[];
  getTotalByStatus: (status: string) => number;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state from mock data
  customer: { ...mockCustomer },
  transactions: [...mockTransactions],

  // Add new transaction (called when payment simulation succeeds)
  addTransaction: (transaction: Transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    }));
  },

  // Update customer balance (called when payment succeeds)
  updateCustomerBalance: (amount: number) => {
    set((state) => ({
      customer: {
        ...state.customer,
        balance: state.customer.balance + amount,
      },
    }));
  },

  // Get transactions filtered by status
  getTransactionsByStatus: (status: string) => {
    return get().transactions.filter((t) => t.status === status);
  },

  // Get total amount by status
  getTotalByStatus: (status: string) => {
    return get()
      .transactions.filter((t) => t.status === status)
      .reduce((sum, t) => sum + t.amount, 0);
  },
}));

// Helper to generate transaction ID
export function generateTransactionId(): string {
  return `TRX-${Date.now().toString(36).toUpperCase()}`;
}

// Helper to generate Xendit payment ID
export function generateXenditId(): string {
  return `xendit_va_${Date.now()}`;
}
