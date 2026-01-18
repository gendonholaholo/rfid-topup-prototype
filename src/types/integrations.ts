// ===========================================
// INTEGRATION TYPES - PLAN A, B, C
// ===========================================

// Base integration types
export type PlanType = 'A' | 'B' | 'C';
export type IntegrationStatus = 'active' | 'inactive' | 'testing' | 'error';

// ===========================================
// PLAN A - PAYMENT GATEWAY
// ===========================================

export interface PaymentGatewayVendor {
  id: string;
  name: string;
  code: 'xendit' | 'midtrans' | 'doku' | 'ipaymu' | 'finpay';
  logo?: string;
  description: string;
  features: {
    setupFee: string;
    vaFee: string;
    settlementTime: string;
    bankSupport: number;
    apiQuality: 1 | 2 | 3 | 4 | 5;
    dashboardQuality: 1 | 2 | 3 | 4 | 5;
    supportHours: string;
    hasCallback: boolean;
    hasRefund: boolean;
  };
  pros: string[];
  cons: string[];
  isRecommended?: boolean;
}

export interface PlanAConfig {
  selectedVendor: PaymentGatewayVendor | null;
  apiKey?: string;
  callbackUrl?: string;
  isLive: boolean;
  status: IntegrationStatus;
}

export interface PlanATransaction {
  id: string;
  vendorCode: string;
  externalId: string;
  virtualAccountNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  paidAt?: string;
  expiredAt: string;
  createdAt: string;
}

// ===========================================
// PLAN B - BANK API WEBHOOK
// ===========================================

export interface BankPartner {
  id: string;
  name: string;
  code: 'bca' | 'mandiri' | 'bni' | 'bri' | 'cimb' | 'permata';
  logo?: string;
  hasWebhookAPI: boolean;
  webhookFeatures: {
    realtime: boolean;
    batchSupport: boolean;
    retryMechanism: boolean;
  };
  integrationDifficulty: 'easy' | 'medium' | 'hard';
  documentationUrl?: string;
}

export interface PlanBConfig {
  connectedBanks: BankPartner[];
  webhookEndpoint: string;
  webhookSecret?: string;
  status: IntegrationStatus;
  lastWebhookReceived?: string;
}

export interface WebhookEvent {
  id: string;
  bankCode: string;
  eventType: 'credit' | 'debit';
  virtualAccountNumber: string;
  amount: number;
  senderName?: string;
  senderAccount?: string;
  reference?: string;
  timestamp: string;
  rawPayload: Record<string, unknown>;
  processedAt?: string;
  status: 'received' | 'processed' | 'failed';
}

// ===========================================
// PLAN C - FILE IMPORT
// ===========================================

export interface FileImportTemplate {
  id: string;
  bankCode: string;
  bankName: string;
  format: 'csv' | 'xlsx' | 'xls';
  columns: {
    virtualAccount: string;
    amount: string;
    date: string;
    senderName?: string;
    reference?: string;
  };
  dateFormat: string;
  delimiter?: string;
  hasHeader: boolean;
  sampleData: string;
}

export interface PlanCConfig {
  templates: FileImportTemplate[];
  defaultTemplate?: string;
  autoMatchAfterImport: boolean;
  status: IntegrationStatus;
}

export interface ImportSession {
  id: string;
  fileName: string;
  fileSize: number;
  bankCode: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  status: 'uploading' | 'parsing' | 'validating' | 'importing' | 'completed' | 'failed';
  errors: { row: number; message: string }[];
  importedAt: string;
  importedBy: string;
}

// ===========================================
// UNIFIED TRANSACTION (untuk tracking source)
// ===========================================

export interface UnifiedTransaction {
  id: string;
  source: PlanType;
  sourceTransactionId: string;
  customerId: string;
  customerName: string;
  virtualAccountNumber: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  metadata: {
    planA?: { vendorCode: string; externalId: string };
    planB?: { bankCode: string; webhookEventId: string };
    planC?: { importSessionId: string; rowNumber: number };
  };
  createdAt: string;
  processedAt?: string;
}
