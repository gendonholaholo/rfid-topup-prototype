// Customer/Company types
export interface Customer {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  virtualAccountNumber: string;
  balance: number;
  totalCards: number;
  createdAt: string;
}

// RFID Card types
export interface RFIDCard {
  id: string;
  cardNumber: string;
  vehiclePlate: string;
  vehicleType: string;
  customerId: string;
  isActive: boolean;
  createdAt: string;
}

// Transaction types
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'expired';

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  virtualAccountNumber: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  bankCode: string;
  xenditPaymentId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Virtual Account types
export interface VirtualAccount {
  id: string;
  customerId: string;
  bankCode: string;
  accountNumber: string;
  name: string;
  isActive: boolean;
  expirationDate?: string;
}

// Bank options
export interface BankOption {
  code: string;
  name: string;
  logo: string;
}
