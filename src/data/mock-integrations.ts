import {
  PaymentGatewayVendor,
  BankPartner,
  FileImportTemplate,
  PlanATransaction,
  WebhookEvent,
  ImportSession,
} from '@/types/integrations';

// ===========================================
// PLAN A - PAYMENT GATEWAY VENDORS
// ===========================================

export const paymentGatewayVendors: PaymentGatewayVendor[] = [
  {
    id: 'vendor-xendit',
    name: 'Xendit',
    code: 'xendit',
    description: 'Payment gateway terkemuka di Indonesia dengan API modern dan dokumentasi lengkap.',
    features: {
      setupFee: 'Gratis',
      vaFee: 'Rp 4.000/trx',
      settlementTime: 'T+1 (Next Business Day)',
      bankSupport: 10,
      apiQuality: 5,
      dashboardQuality: 5,
      supportHours: '24/7',
      hasCallback: true,
      hasRefund: true,
    },
    pros: [
      'API dokumentasi sangat lengkap',
      'Dashboard real-time yang intuitif',
      'Support 10+ bank untuk VA',
      'Webhook callback reliable',
      'Technical support responsive',
    ],
    cons: [
      'Fee per transaksi relatif standar',
      'Minimum top-up saldo merchant',
    ],
    isRecommended: true,
  },
  {
    id: 'vendor-midtrans',
    name: 'Midtrans',
    code: 'midtrans',
    description: 'Payment gateway milik Gojek/GoTo dengan integrasi ekosistem yang luas.',
    features: {
      setupFee: 'Gratis',
      vaFee: 'Rp 4.000/trx',
      settlementTime: 'T+1 (Next Business Day)',
      bankSupport: 8,
      apiQuality: 4,
      dashboardQuality: 4,
      supportHours: 'Jam Kerja (09:00-18:00)',
      hasCallback: true,
      hasRefund: true,
    },
    pros: [
      'Bagian dari ekosistem GoTo',
      'Integrasi dengan GoPay',
      'Sandbox testing environment',
      'Multi-currency support',
    ],
    cons: [
      'Support hanya jam kerja',
      'Dashboard kurang real-time',
      'Dokumentasi kadang outdated',
    ],
    isRecommended: false,
  },
  {
    id: 'vendor-doku',
    name: 'DOKU',
    code: 'doku',
    description: 'Payment gateway lokal dengan pengalaman panjang di Indonesia.',
    features: {
      setupFee: 'Negotiable',
      vaFee: 'Rp 3.500/trx',
      settlementTime: 'T+2 (2 Business Days)',
      bankSupport: 6,
      apiQuality: 3,
      dashboardQuality: 3,
      supportHours: 'Jam Kerja (09:00-17:00)',
      hasCallback: true,
      hasRefund: false,
    },
    pros: [
      'Fee per transaksi lebih murah',
      'Pengalaman lama di Indonesia',
      'Relationship manager dedicated',
    ],
    cons: [
      'Settlement lebih lama (T+2)',
      'API agak legacy',
      'Dashboard kurang modern',
      'Tidak ada fitur refund otomatis',
    ],
    isRecommended: false,
  },
  {
    id: 'vendor-ipaymu',
    name: 'iPaymu',
    code: 'ipaymu',
    description: 'Payment gateway dengan fokus pada UMKM dan startup.',
    features: {
      setupFee: 'Gratis',
      vaFee: 'Rp 3.000/trx',
      settlementTime: 'T+1 (Next Business Day)',
      bankSupport: 5,
      apiQuality: 3,
      dashboardQuality: 3,
      supportHours: 'Jam Kerja (09:00-17:00)',
      hasCallback: true,
      hasRefund: false,
    },
    pros: [
      'Fee paling murah',
      'Cocok untuk volume kecil',
      'Setup cepat',
    ],
    cons: [
      'Bank support terbatas',
      'Dokumentasi kurang lengkap',
      'Tidak cocok untuk enterprise',
    ],
    isRecommended: false,
  },
];

// ===========================================
// PLAN B - BANK PARTNERS
// ===========================================

export const bankPartners: BankPartner[] = [
  {
    id: 'bank-bca',
    name: 'Bank Central Asia',
    code: 'bca',
    hasWebhookAPI: true,
    webhookFeatures: {
      realtime: true,
      batchSupport: true,
      retryMechanism: true,
    },
    integrationDifficulty: 'medium',
    documentationUrl: 'https://developer.bca.co.id',
  },
  {
    id: 'bank-mandiri',
    name: 'Bank Mandiri',
    code: 'mandiri',
    hasWebhookAPI: true,
    webhookFeatures: {
      realtime: true,
      batchSupport: false,
      retryMechanism: true,
    },
    integrationDifficulty: 'hard',
    documentationUrl: 'https://developer.bankmandiri.co.id',
  },
  {
    id: 'bank-bni',
    name: 'Bank Negara Indonesia',
    code: 'bni',
    hasWebhookAPI: true,
    webhookFeatures: {
      realtime: false,
      batchSupport: true,
      retryMechanism: false,
    },
    integrationDifficulty: 'medium',
    documentationUrl: 'https://apiportal.bni.co.id',
  },
  {
    id: 'bank-bri',
    name: 'Bank Rakyat Indonesia',
    code: 'bri',
    hasWebhookAPI: true,
    webhookFeatures: {
      realtime: true,
      batchSupport: true,
      retryMechanism: true,
    },
    integrationDifficulty: 'easy',
    documentationUrl: 'https://developers.bri.co.id',
  },
  {
    id: 'bank-cimb',
    name: 'CIMB Niaga',
    code: 'cimb',
    hasWebhookAPI: false,
    webhookFeatures: {
      realtime: false,
      batchSupport: false,
      retryMechanism: false,
    },
    integrationDifficulty: 'hard',
  },
  {
    id: 'bank-permata',
    name: 'Bank Permata',
    code: 'permata',
    hasWebhookAPI: true,
    webhookFeatures: {
      realtime: true,
      batchSupport: false,
      retryMechanism: true,
    },
    integrationDifficulty: 'medium',
  },
];

// ===========================================
// PLAN C - FILE IMPORT TEMPLATES
// ===========================================

export const fileImportTemplates: FileImportTemplate[] = [
  {
    id: 'template-bca',
    bankCode: 'BCA',
    bankName: 'Bank Central Asia',
    format: 'csv',
    columns: {
      virtualAccount: 'Nomor VA',
      amount: 'Nominal',
      date: 'Tanggal',
      senderName: 'Nama Pengirim',
      reference: 'Referensi',
    },
    dateFormat: 'DD/MM/YYYY',
    delimiter: ',',
    hasHeader: true,
    sampleData: `Nomor VA,Nominal,Tanggal,Nama Pengirim,Referensi
8810012345678901,10000000,02/01/2026,PT ABC Indonesia,TRF-001
8810012345678902,5000000,02/01/2026,PT XYZ Corp,TRF-002`,
  },
  {
    id: 'template-mandiri',
    bankCode: 'MANDIRI',
    bankName: 'Bank Mandiri',
    format: 'csv',
    columns: {
      virtualAccount: 'VA_NUMBER',
      amount: 'AMOUNT',
      date: 'TRX_DATE',
      senderName: 'SENDER_NAME',
      reference: 'REF_NO',
    },
    dateFormat: 'YYYY-MM-DD',
    delimiter: ';',
    hasHeader: true,
    sampleData: `VA_NUMBER;AMOUNT;TRX_DATE;SENDER_NAME;REF_NO
8810012345678901;10000000;2026-01-02;PT ABC Indonesia;TRF-001
8810012345678902;5000000;2026-01-02;PT XYZ Corp;TRF-002`,
  },
  {
    id: 'template-bri',
    bankCode: 'BRI',
    bankName: 'Bank Rakyat Indonesia',
    format: 'xlsx',
    columns: {
      virtualAccount: 'No Virtual Account',
      amount: 'Jumlah',
      date: 'Tanggal Transaksi',
      senderName: 'Pengirim',
      reference: 'No Ref',
    },
    dateFormat: 'DD-MMM-YYYY',
    hasHeader: true,
    sampleData: `No Virtual Account | Jumlah | Tanggal Transaksi | Pengirim | No Ref
8810012345678901 | 10.000.000 | 02-Jan-2026 | PT ABC Indonesia | TRF-001`,
  },
];

// ===========================================
// MOCK TRANSACTIONS FOR DEMO
// ===========================================

export const mockPlanATransactions: PlanATransaction[] = [
  {
    id: 'PA-001',
    vendorCode: 'xendit',
    externalId: 'XND-VA-001',
    virtualAccountNumber: '8810012345678901',
    customerId: 'CUST-001',
    customerName: 'PT Logistik Nusantara',
    amount: 10000000,
    status: 'paid',
    paidAt: '2026-01-02T09:15:00.000Z',
    expiredAt: '2026-01-03T09:00:00.000Z',
    createdAt: '2026-01-02T09:00:00.000Z',
  },
  {
    id: 'PA-002',
    vendorCode: 'xendit',
    externalId: 'XND-VA-002',
    virtualAccountNumber: '8810012345678902',
    customerId: 'CUST-002',
    customerName: 'PT Transportasi Mandiri',
    amount: 25000000,
    status: 'pending',
    expiredAt: '2026-01-03T10:00:00.000Z',
    createdAt: '2026-01-02T10:00:00.000Z',
  },
];

export const mockWebhookEvents: WebhookEvent[] = [
  {
    id: 'WH-001',
    bankCode: 'BCA',
    eventType: 'credit',
    virtualAccountNumber: '8810012345678901',
    amount: 10000000,
    senderName: 'PT ABC INDONESIA',
    senderAccount: '1234567890',
    reference: 'TRF-BCA-001',
    timestamp: '2026-01-02T09:15:00.000Z',
    rawPayload: {
      transaction_id: 'BCA-TRX-001',
      virtual_account: '8810012345678901',
      amount: 10000000,
    },
    processedAt: '2026-01-02T09:15:05.000Z',
    status: 'processed',
  },
  {
    id: 'WH-002',
    bankCode: 'MANDIRI',
    eventType: 'credit',
    virtualAccountNumber: '8810012345678903',
    amount: 8500000,
    senderName: 'CV MITRA EKSPEDISI',
    reference: 'TRF-MDR-001',
    timestamp: '2026-01-02T10:30:00.000Z',
    rawPayload: {
      trx_id: 'MDR-001',
      va_number: '8810012345678903',
      credit_amount: 8500000,
    },
    status: 'received',
  },
];

export const mockImportSessions: ImportSession[] = [
  {
    id: 'IMP-001',
    fileName: 'rekening_koran_bca_jan2026.csv',
    fileSize: 15360,
    bankCode: 'BCA',
    totalRows: 25,
    successRows: 23,
    failedRows: 2,
    status: 'completed',
    errors: [
      { row: 12, message: 'Invalid VA format' },
      { row: 18, message: 'Amount is negative' },
    ],
    importedAt: '2026-01-02T08:00:00.000Z',
    importedBy: 'Admin',
  },
  {
    id: 'IMP-002',
    fileName: 'mutasi_mandiri_jan2026.csv',
    fileSize: 8192,
    bankCode: 'MANDIRI',
    totalRows: 15,
    successRows: 15,
    failedRows: 0,
    status: 'completed',
    errors: [],
    importedAt: '2026-01-02T09:30:00.000Z',
    importedBy: 'Admin',
  },
];

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

export function getVendorById(id: string): PaymentGatewayVendor | undefined {
  return paymentGatewayVendors.find((v) => v.id === id);
}

export function getBankPartnerByCode(code: string): BankPartner | undefined {
  return bankPartners.find((b) => b.code === code);
}

export function getTemplateByBankCode(bankCode: string): FileImportTemplate | undefined {
  return fileImportTemplates.find((t) => t.bankCode === bankCode);
}

export function generateWebhookEvent(
  bankCode: string,
  virtualAccountNumber: string,
  amount: number,
  senderName?: string
): WebhookEvent {
  const now = new Date().toISOString();
  return {
    id: `WH-${Date.now()}`,
    bankCode,
    eventType: 'credit',
    virtualAccountNumber,
    amount,
    senderName,
    timestamp: now,
    rawPayload: {
      bank: bankCode,
      va: virtualAccountNumber,
      amount,
      sender: senderName,
    },
    status: 'received',
  };
}
