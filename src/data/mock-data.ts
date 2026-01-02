import { Customer, RFIDCard } from '@/types';

// ===========================================
// MOCK CUSTOMERS
// ===========================================

export const mockCustomer: Customer = {
  id: 'CUST-001',
  companyName: 'PT Logistik Nusantara',
  email: 'admin@logistiknusantara.co.id',
  phone: '021-5551234',
  virtualAccountNumber: '8810012345678901',
  balance: 15000000,
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
];

// ===========================================
// BANK CODES
// ===========================================

export const bankCodes = [
  { code: 'BCA', name: 'Bank Central Asia' },
  { code: 'MANDIRI', name: 'Bank Mandiri' },
  { code: 'BNI', name: 'Bank Negara Indonesia' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia' },
  { code: 'CIMB', name: 'CIMB Niaga' },
  { code: 'PERMATA', name: 'Bank Permata' },
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
