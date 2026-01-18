import { create } from 'zustand';
import {
  PlanType,
  PaymentGatewayVendor,
  BankPartner,
  PlanATransaction,
  WebhookEvent,
  ImportSession,
} from '@/types/integrations';
import {
  paymentGatewayVendors,
  bankPartners,
  mockPlanATransactions,
  mockWebhookEvents,
  mockImportSessions,
} from '@/data/mock-integrations';

// ===========================================
// INTEGRATION STORE INTERFACE
// ===========================================

interface IntegrationState {
  // Active Plans
  activePlans: PlanType[];

  // Plan A State
  planAVendors: PaymentGatewayVendor[];
  selectedVendor: PaymentGatewayVendor | null;
  planATransactions: PlanATransaction[];

  // Plan B State
  bankPartners: BankPartner[];
  connectedBanks: string[];
  webhookEvents: WebhookEvent[];

  // Plan C State
  importSessions: ImportSession[];

  // Plan A Actions
  selectVendor: (vendor: PaymentGatewayVendor) => void;
  addPlanATransaction: (transaction: PlanATransaction) => void;
  updatePlanATransactionStatus: (id: string, status: PlanATransaction['status']) => void;

  // Plan B Actions
  connectBank: (bankCode: string) => void;
  disconnectBank: (bankCode: string) => void;
  addWebhookEvent: (event: WebhookEvent) => void;
  processWebhookEvent: (id: string) => void;

  // Plan C Actions
  addImportSession: (session: ImportSession) => void;
  updateImportSession: (id: string, updates: Partial<ImportSession>) => void;

  // General Actions
  togglePlan: (plan: PlanType) => void;
  isPlanActive: (plan: PlanType) => boolean;
}

// ===========================================
// INTEGRATION STORE IMPLEMENTATION
// ===========================================

export const useIntegrationStore = create<IntegrationState>((set, get) => ({
  // Initial State
  activePlans: ['B', 'C'], // Default: Plan B and C active

  // Plan A
  planAVendors: paymentGatewayVendors,
  selectedVendor: null,
  planATransactions: mockPlanATransactions,

  // Plan B
  bankPartners: bankPartners,
  connectedBanks: ['bca', 'mandiri'],
  webhookEvents: mockWebhookEvents,

  // Plan C
  importSessions: mockImportSessions,

  // Plan A Actions
  selectVendor: (vendor) => {
    set({ selectedVendor: vendor });
  },

  addPlanATransaction: (transaction) => {
    set((state) => ({
      planATransactions: [transaction, ...state.planATransactions],
    }));
  },

  updatePlanATransactionStatus: (id, status) => {
    set((state) => ({
      planATransactions: state.planATransactions.map((t) =>
        t.id === id
          ? { ...t, status, paidAt: status === 'paid' ? new Date().toISOString() : t.paidAt }
          : t
      ),
    }));
  },

  // Plan B Actions
  connectBank: (bankCode) => {
    set((state) => ({
      connectedBanks: state.connectedBanks.includes(bankCode)
        ? state.connectedBanks
        : [...state.connectedBanks, bankCode],
    }));
  },

  disconnectBank: (bankCode) => {
    set((state) => ({
      connectedBanks: state.connectedBanks.filter((b) => b !== bankCode),
    }));
  },

  addWebhookEvent: (event) => {
    set((state) => ({
      webhookEvents: [event, ...state.webhookEvents],
    }));
  },

  processWebhookEvent: (id) => {
    set((state) => ({
      webhookEvents: state.webhookEvents.map((e) =>
        e.id === id
          ? { ...e, status: 'processed' as const, processedAt: new Date().toISOString() }
          : e
      ),
    }));
  },

  // Plan C Actions
  addImportSession: (session) => {
    set((state) => ({
      importSessions: [session, ...state.importSessions],
    }));
  },

  updateImportSession: (id, updates) => {
    set((state) => ({
      importSessions: state.importSessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  },

  // General Actions
  togglePlan: (plan) => {
    set((state) => ({
      activePlans: state.activePlans.includes(plan)
        ? state.activePlans.filter((p) => p !== plan)
        : [...state.activePlans, plan],
    }));
  },

  isPlanActive: (plan) => {
    return get().activePlans.includes(plan);
  },
}));
