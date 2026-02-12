// Re-export analytics types
export * from './analytics';

// ===========================================
// CORE ENTITIES
// ===========================================

export interface Customer {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  virtualAccountNumber: string;
  balance: number;
  rfidCards: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RFIDCard {
  id: string;
  cardNumber: string;
  customerId: string;
  vehiclePlate: string;
  vehicleType: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
}

// ===========================================
// TRANSACTION (After Verification)
// ===========================================

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  virtualAccountNumber: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: string;
  bankCode: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string; // ISO string, only for 'pending' transactions
}

// ===========================================
// DASHBOARD STATS
// ===========================================

export interface DashboardStats {
  totalTransactionsToday: number;
  totalAmountToday: number;
  transactionsThisMonth: number;
  activeCustomers: number;
}

// ===========================================
// UTILITY TYPES
// ===========================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
