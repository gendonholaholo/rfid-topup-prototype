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
// WEBREPORT SUBMISSION (Customer Upload)
// ===========================================

export interface WebreportSubmission {
  id: string;
  customerId: string;
  customerName: string;
  virtualAccountNumber: string;
  amount: number;
  transferDate: string;
  bankSender: string;
  proofImageUrl?: string;
  notes?: string;
  status: 'pending' | 'matched' | 'verified' | 'rejected';
  matchedWithBankStatementId?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// BANK STATEMENT (From Bank API or File Import)
// ===========================================

export type BankStatementSource = 'api' | 'file_import';

export interface BankStatement {
  id: string;
  source: BankStatementSource;
  bankCode: string;
  accountNumber: string;
  virtualAccountNumber: string;
  amount: number;
  transactionDate: string;
  senderName?: string;
  senderAccountNumber?: string;
  reference?: string;
  rawData?: Record<string, unknown>;
  status: 'pending' | 'matched' | 'processed';
  matchedWithWebreportId?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// MATCHING RESULT
// ===========================================

export type MatchStatus = 
  | 'auto_matched'      // VA dan nominal cocok
  | 'partial_match'     // Salah satu cocok
  | 'manual_review'     // Perlu review manual
  | 'verified'          // Sudah diverifikasi
  | 'rejected';         // Ditolak

export interface MatchingResult {
  id: string;
  webreportId: string;
  bankStatementId: string;
  webreport: WebreportSubmission;
  bankStatement: BankStatement;
  matchScore: number;           // 0-100
  matchDetails: {
    vaMatch: boolean;
    amountMatch: boolean;
    dateProximity: number;      // dalam jam
  };
  status: MatchStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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
  status: 'pending' | 'success' | 'failed' | 'rejected';
  paymentMethod: string;
  bankCode: string;
  matchingResultId?: string;
  webreportId?: string;
  bankStatementId?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// API REQUEST/RESPONSE TYPES
// ===========================================

// Webreport API
export interface CreateWebreportRequest {
  customerId: string;
  virtualAccountNumber: string;
  amount: number;
  transferDate: string;
  bankSender: string;
  notes?: string;
}

export interface WebreportResponse {
  success: boolean;
  data?: WebreportSubmission;
  error?: string;
}

// Bank Statement API
export interface BankStatementAPIPayload {
  bankCode: string;
  accountNumber: string;
  virtualAccountNumber: string;
  amount: number;
  transactionDate: string;
  senderName?: string;
  senderAccountNumber?: string;
  reference?: string;
}

export interface BankStatementFileImport {
  bankCode: string;
  accountNumber: string;
  statements: Array<{
    virtualAccountNumber: string;
    amount: number;
    transactionDate: string;
    senderName?: string;
    reference?: string;
  }>;
}

export interface BankStatementResponse {
  success: boolean;
  data?: BankStatement | BankStatement[];
  imported?: number;
  error?: string;
}

// Matching API
export interface MatchingRequest {
  webreportId?: string;
  bankStatementId?: string;
  runFullMatch?: boolean;
}

export interface MatchingResponse {
  success: boolean;
  data?: MatchingResult | MatchingResult[];
  matched?: number;
  pending?: number;
  error?: string;
}

export interface VerifyMatchRequest {
  matchingResultId: string;
  action: 'approve' | 'reject';
  notes?: string;
  verifiedBy: string;
}

// ===========================================
// DASHBOARD STATS
// ===========================================

export interface DashboardStats {
  pendingWebreports: number;
  pendingBankStatements: number;
  pendingMatches: number;
  autoMatchedToday: number;
  manualReviewNeeded: number;
  verifiedToday: number;
  totalAmountToday: number;
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
