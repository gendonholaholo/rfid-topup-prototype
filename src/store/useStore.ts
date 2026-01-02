import { create } from 'zustand';
import {
  Customer,
  WebreportSubmission,
  BankStatement,
  MatchingResult,
  Transaction,
  DashboardStats,
} from '@/types';
import { mockCustomer, mockCustomers } from '@/data/mock-data';

// ===========================================
// STORE INTERFACE
// ===========================================

interface AutomationEngineState {
  // Data
  customer: Customer;
  customers: Customer[];
  webreportSubmissions: WebreportSubmission[];
  bankStatements: BankStatement[];
  matchingResults: MatchingResult[];
  transactions: Transaction[];

  // Webreport Actions
  addWebreportSubmission: (submission: Omit<WebreportSubmission, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => WebreportSubmission;
  updateWebreportStatus: (id: string, status: WebreportSubmission['status'], matchedId?: string) => void;

  // Bank Statement Actions
  addBankStatement: (statement: Omit<BankStatement, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => BankStatement;
  addBankStatements: (statements: Omit<BankStatement, 'id' | 'createdAt' | 'updatedAt' | 'status'>[]) => BankStatement[];
  updateBankStatementStatus: (id: string, status: BankStatement['status'], matchedId?: string) => void;

  // Matching Actions
  addMatchingResult: (result: Omit<MatchingResult, 'id' | 'createdAt' | 'updatedAt'>) => MatchingResult;
  updateMatchingStatus: (id: string, status: MatchingResult['status'], verifiedBy?: string, notes?: string) => void;

  // Transaction Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Transaction;
  updateCustomerBalance: (customerId: string, amount: number) => void;

  // Getters
  getPendingWebreports: () => WebreportSubmission[];
  getPendingBankStatements: () => BankStatement[];
  getPendingMatches: () => MatchingResult[];
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

export const useStore = create<AutomationEngineState>((set, get) => ({
  // Initial Data
  customer: { ...mockCustomer },
  customers: [...mockCustomers],
  webreportSubmissions: [],
  bankStatements: [],
  matchingResults: [],
  transactions: [],

  // Webreport Actions
  addWebreportSubmission: (submission) => {
    const now = new Date().toISOString();
    const newSubmission: WebreportSubmission = {
      ...submission,
      id: generateId('WR'),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      webreportSubmissions: [newSubmission, ...state.webreportSubmissions],
    }));
    return newSubmission;
  },

  updateWebreportStatus: (id, status, matchedId) => {
    set((state) => ({
      webreportSubmissions: state.webreportSubmissions.map((s) =>
        s.id === id
          ? {
              ...s,
              status,
              matchedWithBankStatementId: matchedId || s.matchedWithBankStatementId,
              updatedAt: new Date().toISOString(),
            }
          : s
      ),
    }));
  },

  // Bank Statement Actions
  addBankStatement: (statement) => {
    const now = new Date().toISOString();
    const newStatement: BankStatement = {
      ...statement,
      id: generateId('BS'),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      bankStatements: [newStatement, ...state.bankStatements],
    }));
    return newStatement;
  },

  addBankStatements: (statements) => {
    const now = new Date().toISOString();
    const newStatements: BankStatement[] = statements.map((s) => ({
      ...s,
      id: generateId('BS'),
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    }));
    set((state) => ({
      bankStatements: [...newStatements, ...state.bankStatements],
    }));
    return newStatements;
  },

  updateBankStatementStatus: (id, status, matchedId) => {
    set((state) => ({
      bankStatements: state.bankStatements.map((s) =>
        s.id === id
          ? {
              ...s,
              status,
              matchedWithWebreportId: matchedId || s.matchedWithWebreportId,
              updatedAt: new Date().toISOString(),
            }
          : s
      ),
    }));
  },

  // Matching Actions
  addMatchingResult: (result) => {
    const now = new Date().toISOString();
    const newResult: MatchingResult = {
      ...result,
      id: generateId('MR'),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      matchingResults: [newResult, ...state.matchingResults],
    }));
    return newResult;
  },

  updateMatchingStatus: (id, status, verifiedBy, notes) => {
    const now = new Date().toISOString();
    set((state) => ({
      matchingResults: state.matchingResults.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              verifiedBy: verifiedBy || m.verifiedBy,
              verifiedAt: status === 'verified' || status === 'rejected' ? now : m.verifiedAt,
              notes: notes || m.notes,
              updatedAt: now,
            }
          : m
      ),
    }));
  },

  // Transaction Actions
  addTransaction: (transaction) => {
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId('TRX'),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
    return newTransaction;
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
  getPendingWebreports: () => {
    return get().webreportSubmissions.filter((s) => s.status === 'pending');
  },

  getPendingBankStatements: () => {
    return get().bankStatements.filter((s) => s.status === 'pending');
  },

  getPendingMatches: () => {
    return get().matchingResults.filter(
      (m) => m.status === 'auto_matched' || m.status === 'manual_review'
    );
  },

  getDashboardStats: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];

    return {
      pendingWebreports: state.webreportSubmissions.filter((s) => s.status === 'pending').length,
      pendingBankStatements: state.bankStatements.filter((s) => s.status === 'pending').length,
      pendingMatches: state.matchingResults.filter(
        (m) => m.status === 'auto_matched' || m.status === 'manual_review'
      ).length,
      autoMatchedToday: state.matchingResults.filter(
        (m) => m.status === 'auto_matched' && m.createdAt.startsWith(today)
      ).length,
      manualReviewNeeded: state.matchingResults.filter((m) => m.status === 'manual_review').length,
      verifiedToday: state.matchingResults.filter(
        (m) => m.status === 'verified' && m.verifiedAt?.startsWith(today)
      ).length,
      totalAmountToday: state.transactions
        .filter((t) => t.status === 'success' && t.createdAt.startsWith(today))
        .reduce((sum, t) => sum + t.amount, 0),
    };
  },
}));
