import { Customer, RFIDCard, Transaction } from '@/types';

// ===========================================
// CONSTANTS
// ===========================================

export const PENDING_EXPIRY_MINUTES = 30;

// ===========================================
// MOCK CUSTOMERS
// ===========================================

export const mockCustomer: Customer = {
  id: 'CUST-001',
  companyName: 'PT Logistik Nusantara',
  email: 'admin@logistiknusantara.co.id',
  phone: '021-5551234',
  virtualAccountNumber: '8810012345678901',
  balance: 22500000,
  rfidCards: ['RFID-001', 'RFID-002', 'RFID-003'],
  createdAt: '2024-01-15T08:00:00.000Z',
  updatedAt: '2024-12-01T10:30:00.000Z',
};

export const mockCustomers: Customer[] = [
  mockCustomer,
  {
    id: 'CUST-002',
    companyName: 'PT Transportasi Mandiri',
    email: 'finance@transmandiri.com',
    phone: '021-5559876',
    virtualAccountNumber: '8810012345678902',
    balance: 25000000,
    rfidCards: ['RFID-004', 'RFID-005'],
    createdAt: '2024-02-20T09:00:00.000Z',
    updatedAt: '2024-11-28T14:15:00.000Z',
  },
  {
    id: 'CUST-003',
    companyName: 'CV Mitra Ekspedisi',
    email: 'keuangan@mitraekspedisi.id',
    phone: '021-5554321',
    virtualAccountNumber: '8810012345678903',
    balance: 8500000,
    rfidCards: ['RFID-006'],
    createdAt: '2024-03-10T10:00:00.000Z',
    updatedAt: '2024-12-02T08:45:00.000Z',
  },
  {
    id: 'CUST-004',
    companyName: 'PT Armada Sejahtera',
    email: 'admin@armadasejahtera.co.id',
    phone: '021-5558765',
    virtualAccountNumber: '8810012345678904',
    balance: 42000000,
    rfidCards: ['RFID-007', 'RFID-008', 'RFID-009', 'RFID-010'],
    createdAt: '2024-01-05T07:30:00.000Z',
    updatedAt: '2024-12-03T11:20:00.000Z',
  },
];

// ===========================================
// MOCK RFID CARDS
// ===========================================

export const mockRFIDCards: RFIDCard[] = [
  {
    id: 'RFID-001',
    cardNumber: 'RFID-2024-001-A',
    customerId: 'CUST-001',
    vehiclePlate: 'B 1234 ABC',
    vehicleType: 'Truk Box',
    status: 'active',
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'RFID-002',
    cardNumber: 'RFID-2024-002-A',
    customerId: 'CUST-001',
    vehiclePlate: 'B 5678 DEF',
    vehicleType: 'Pickup',
    status: 'active',
    createdAt: '2024-02-20T09:00:00.000Z',
  },
  {
    id: 'RFID-003',
    cardNumber: 'RFID-2024-003-A',
    customerId: 'CUST-001',
    vehiclePlate: 'B 9012 GHI',
    vehicleType: 'Truk Trailer',
    status: 'inactive',
    createdAt: '2024-03-15T10:00:00.000Z',
  },
  {
    id: 'RFID-004',
    cardNumber: 'RFID-2024-004-A',
    customerId: 'CUST-002',
    vehiclePlate: 'B 3456 JKL',
    vehicleType: 'Truk Box',
    status: 'active',
    createdAt: '2024-02-20T09:00:00.000Z',
  },
  {
    id: 'RFID-005',
    cardNumber: 'RFID-2024-005-A',
    customerId: 'CUST-002',
    vehiclePlate: 'B 7890 MNO',
    vehicleType: 'Pickup',
    status: 'active',
    createdAt: '2024-03-01T10:00:00.000Z',
  },
  {
    id: 'RFID-006',
    cardNumber: 'RFID-2024-006-A',
    customerId: 'CUST-003',
    vehiclePlate: 'D 1122 PQR',
    vehicleType: 'Truk Box',
    status: 'active',
    createdAt: '2024-03-10T10:00:00.000Z',
  },
  {
    id: 'RFID-007',
    cardNumber: 'RFID-2024-007-A',
    customerId: 'CUST-004',
    vehiclePlate: 'L 3344 STU',
    vehicleType: 'Truk Trailer',
    status: 'active',
    createdAt: '2024-01-05T07:30:00.000Z',
  },
  {
    id: 'RFID-008',
    cardNumber: 'RFID-2024-008-A',
    customerId: 'CUST-004',
    vehiclePlate: 'L 5566 VWX',
    vehicleType: 'Truk Box',
    status: 'active',
    createdAt: '2024-01-10T08:00:00.000Z',
  },
  {
    id: 'RFID-009',
    cardNumber: 'RFID-2024-009-A',
    customerId: 'CUST-004',
    vehiclePlate: 'L 7788 YZA',
    vehicleType: 'Pickup',
    status: 'active',
    createdAt: '2024-02-01T09:00:00.000Z',
  },
  {
    id: 'RFID-010',
    cardNumber: 'RFID-2024-010-A',
    customerId: 'CUST-004',
    vehiclePlate: 'L 9900 BCD',
    vehicleType: 'Truk Box',
    status: 'inactive',
    createdAt: '2024-02-15T10:00:00.000Z',
  },
];

// ===========================================
// BANK CODES
// ===========================================

export const bankCodes = [
  { code: 'BCA', name: 'Bank Central Asia' },
  { code: 'MANDIRI', name: 'Bank Mandiri' },
  { code: 'BNI', name: 'Bank Negara Indonesia' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia' },
  { code: 'BSI', name: 'Bank Syariah Indonesia' },
  { code: 'BTN', name: 'Bank Tabungan Negara' },
  { code: 'BANKDKI', name: 'Bank DKI' },
];

// ===========================================
// MOCK RFID CARD BALANCES
// ===========================================

export const mockRFIDCardBalances: Record<string, number> = {
  'RFID-001': 5000000,
  'RFID-002': 3500000,
  'RFID-003': 0,
  'RFID-004': 8000000,
  'RFID-005': 4200000,
  'RFID-006': 2800000,
  'RFID-007': 12000000,
  'RFID-008': 9500000,
  'RFID-009': 6300000,
  'RFID-010': 0,
};

// ===========================================
// INITIAL DUMMY TRANSACTIONS
// ===========================================

export const initialTransactions: Transaction[] = [
  {
    id: 'TRX-001',
    customerId: 'CUST-001',
    customerName: 'PT Logistik Nusantara',
    virtualAccountNumber: '8810012345678901',
    amount: 10000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BCA',
    createdAt: '2026-01-05T09:15:00.000Z',
    updatedAt: '2026-01-05T09:15:00.000Z',
  },
  {
    id: 'TRX-002',
    customerId: 'CUST-002',
    customerName: 'PT Transportasi Mandiri',
    virtualAccountNumber: '8810012345678902',
    amount: 25000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'MANDIRI',
    createdAt: '2026-01-08T14:30:00.000Z',
    updatedAt: '2026-01-08T14:30:00.000Z',
  },
  {
    id: 'TRX-003',
    customerId: 'CUST-003',
    customerName: 'CV Mitra Ekspedisi',
    virtualAccountNumber: '8810012345678903',
    amount: 5000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BNI',
    createdAt: '2026-01-12T10:00:00.000Z',
    updatedAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 'TRX-004',
    customerId: 'CUST-004',
    customerName: 'PT Armada Sejahtera',
    virtualAccountNumber: '8810012345678904',
    amount: 50000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BRI',
    createdAt: '2026-01-15T08:45:00.000Z',
    updatedAt: '2026-01-15T08:45:00.000Z',
  },
  {
    id: 'TRX-005',
    customerId: 'CUST-001',
    customerName: 'PT Logistik Nusantara',
    virtualAccountNumber: '8810012345678901',
    amount: 15000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BSI',
    createdAt: '2026-01-20T11:20:00.000Z',
    updatedAt: '2026-01-20T11:20:00.000Z',
  },
  {
    id: 'TRX-006',
    customerId: 'CUST-002',
    customerName: 'PT Transportasi Mandiri',
    virtualAccountNumber: '8810012345678902',
    amount: 20000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BTN',
    createdAt: '2026-01-25T13:00:00.000Z',
    updatedAt: '2026-01-25T13:00:00.000Z',
  },
  {
    id: 'TRX-007',
    customerId: 'CUST-004',
    customerName: 'PT Armada Sejahtera',
    virtualAccountNumber: '8810012345678904',
    amount: 30000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BANKDKI',
    createdAt: '2026-01-28T16:30:00.000Z',
    updatedAt: '2026-01-28T16:30:00.000Z',
  },
  {
    id: 'TRX-008',
    customerId: 'CUST-003',
    customerName: 'CV Mitra Ekspedisi',
    virtualAccountNumber: '8810012345678903',
    amount: 8000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BCA',
    createdAt: '2026-02-02T09:00:00.000Z',
    updatedAt: '2026-02-02T09:00:00.000Z',
  },
  {
    id: 'TRX-009',
    customerId: 'CUST-001',
    customerName: 'PT Logistik Nusantara',
    virtualAccountNumber: '8810012345678901',
    amount: 12000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'MANDIRI',
    createdAt: '2026-02-05T10:45:00.000Z',
    updatedAt: '2026-02-05T10:45:00.000Z',
  },
  {
    id: 'TRX-010',
    customerId: 'CUST-004',
    customerName: 'PT Armada Sejahtera',
    virtualAccountNumber: '8810012345678904',
    amount: 40000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BRI',
    createdAt: '2026-02-10T14:15:00.000Z',
    updatedAt: '2026-02-10T14:15:00.000Z',
  },
  {
    id: 'TRX-011',
    customerId: 'CUST-001',
    customerName: 'PT Logistik Nusantara',
    virtualAccountNumber: '8810012345678901',
    amount: 7500000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BCA',
    createdAt: '2026-02-12T09:15:00.000Z',
    updatedAt: '2026-02-12T09:15:00.000Z',
  },
  {
    id: 'TRX-012',
    customerId: 'CUST-002',
    customerName: 'PT Transportasi Mandiri',
    virtualAccountNumber: '8810012345678902',
    amount: 18000000,
    status: 'failed',
    paymentMethod: 'Virtual Account',
    bankCode: 'MANDIRI',
    createdAt: '2026-02-12T14:30:00.000Z',
    updatedAt: '2026-02-12T15:00:00.000Z',
  },
  {
    id: 'TRX-013',
    customerId: 'CUST-003',
    customerName: 'CV Mitra Ekspedisi',
    virtualAccountNumber: '8810012345678903',
    amount: 3000000,
    status: 'failed',
    paymentMethod: 'Virtual Account',
    bankCode: 'BNI',
    createdAt: '2026-02-11T08:00:00.000Z',
    updatedAt: '2026-02-11T08:30:00.000Z',
  },
];

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
