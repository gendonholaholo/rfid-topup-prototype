import { Customer, RFIDCard, Transaction, BankOption } from '@/types';

// Mock Customer Data
export const mockCustomer: Customer = {
  id: 'CUST-001',
  companyName: 'PT Maju Jaya Transportasi',
  email: 'finance@majujaya.co.id',
  phone: '021-5551234',
  virtualAccountNumber: '8888081200011111',
  balance: 15750000,
  totalCards: 12,
  createdAt: '2024-01-15T08:00:00Z',
};

// Mock RFID Cards
export const mockRFIDCards: RFIDCard[] = [
  {
    id: 'RFID-001',
    cardNumber: '0012 3456 7890 1234',
    vehiclePlate: 'B 1234 ABC',
    vehicleType: 'Truck',
    customerId: 'CUST-001',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'RFID-002',
    cardNumber: '0012 3456 7890 1235',
    vehiclePlate: 'B 5678 DEF',
    vehicleType: 'Pickup',
    customerId: 'CUST-001',
    isActive: true,
    createdAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'RFID-003',
    cardNumber: '0012 3456 7890 1236',
    vehiclePlate: 'B 9012 GHI',
    vehicleType: 'Truck',
    customerId: 'CUST-001',
    isActive: false,
    createdAt: '2024-02-15T08:00:00Z',
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'TRX-001',
    customerId: 'CUST-001',
    customerName: 'PT Maju Jaya Transportasi',
    virtualAccountNumber: '8888081200011111',
    amount: 5000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BCA',
    xenditPaymentId: 'xendit_va_123456',
    paidAt: '2025-01-02T10:30:00Z',
    createdAt: '2025-01-02T10:25:00Z',
    updatedAt: '2025-01-02T10:30:00Z',
  },
  {
    id: 'TRX-002',
    customerId: 'CUST-001',
    customerName: 'PT Maju Jaya Transportasi',
    virtualAccountNumber: '8888081200011111',
    amount: 10000000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'MANDIRI',
    xenditPaymentId: 'xendit_va_123457',
    paidAt: '2024-12-28T14:20:00Z',
    createdAt: '2024-12-28T14:15:00Z',
    updatedAt: '2024-12-28T14:20:00Z',
  },
  {
    id: 'TRX-003',
    customerId: 'CUST-001',
    customerName: 'PT Maju Jaya Transportasi',
    virtualAccountNumber: '8888081200011111',
    amount: 2500000,
    status: 'pending',
    paymentMethod: 'Virtual Account',
    bankCode: 'BCA',
    createdAt: '2025-01-02T11:00:00Z',
    updatedAt: '2025-01-02T11:00:00Z',
  },
  {
    id: 'TRX-004',
    customerId: 'CUST-002',
    customerName: 'CV Sentosa Abadi',
    virtualAccountNumber: '8888081200022222',
    amount: 7500000,
    status: 'success',
    paymentMethod: 'Virtual Account',
    bankCode: 'BRI',
    xenditPaymentId: 'xendit_va_123458',
    paidAt: '2025-01-01T09:00:00Z',
    createdAt: '2025-01-01T08:55:00Z',
    updatedAt: '2025-01-01T09:00:00Z',
  },
];

// Bank Options for VA
export const bankOptions: BankOption[] = [
  { code: 'BCA', name: 'Bank Central Asia', logo: '/banks/bca.png' },
  { code: 'MANDIRI', name: 'Bank Mandiri', logo: '/banks/mandiri.png' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia', logo: '/banks/bri.png' },
  { code: 'BNI', name: 'Bank Negara Indonesia', logo: '/banks/bni.png' },
  { code: 'PERMATA', name: 'Bank Permata', logo: '/banks/permata.png' },
];

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}


// Mock All Customers (for admin)
export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    companyName: 'PT Maju Jaya Transportasi',
    email: 'finance@majujaya.co.id',
    phone: '021-5551234',
    virtualAccountNumber: '8888081200011111',
    balance: 15750000,
    totalCards: 12,
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'CUST-002',
    companyName: 'CV Sentosa Abadi',
    email: 'admin@sentosaabadi.com',
    phone: '021-5559876',
    virtualAccountNumber: '8888081200022222',
    balance: 8500000,
    totalCards: 5,
    createdAt: '2024-02-20T08:00:00Z',
  },
  {
    id: 'CUST-003',
    companyName: 'PT Logistik Nusantara',
    email: 'finance@lognus.co.id',
    phone: '021-5554567',
    virtualAccountNumber: '8888081200033333',
    balance: 25000000,
    totalCards: 25,
    createdAt: '2024-03-10T08:00:00Z',
  },
];
