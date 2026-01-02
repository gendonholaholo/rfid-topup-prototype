import {
  WebreportSubmission,
  BankStatement,
  MatchingResult,
  MatchStatus,
} from '@/types';

// ===========================================
// MATCHING CONFIGURATION
// ===========================================

export interface MatchingConfig {
  // Toleransi waktu dalam jam antara transfer dan upload
  dateToleranceHours: number;
  // Threshold score untuk auto-match (0-100)
  autoMatchThreshold: number;
  // Threshold score untuk manual review (0-100)
  manualReviewThreshold: number;
}

export const DEFAULT_MATCHING_CONFIG: MatchingConfig = {
  dateToleranceHours: 24,
  autoMatchThreshold: 90,
  manualReviewThreshold: 50,
};

// ===========================================
// MATCHING RESULT BUILDER
// ===========================================

interface MatchDetails {
  vaMatch: boolean;
  amountMatch: boolean;
  dateProximity: number;
}

function calculateMatchScore(details: MatchDetails, config: MatchingConfig): number {
  let score = 0;

  // VA Match: 50 points
  if (details.vaMatch) {
    score += 50;
  }

  // Amount Match: 40 points
  if (details.amountMatch) {
    score += 40;
  }

  // Date Proximity: up to 10 points
  // Semakin dekat waktunya, semakin tinggi skornya
  if (details.dateProximity <= config.dateToleranceHours) {
    const dateScore = 10 * (1 - details.dateProximity / config.dateToleranceHours);
    score += Math.max(0, dateScore);
  }

  return Math.round(score);
}

function determineMatchStatus(score: number, config: MatchingConfig): MatchStatus {
  if (score >= config.autoMatchThreshold) {
    return 'auto_matched';
  } else if (score >= config.manualReviewThreshold) {
    return 'manual_review';
  }
  return 'manual_review';
}

// ===========================================
// MATCHING ENGINE
// ===========================================

export interface MatchingEngineResult {
  matched: MatchingResult[];
  unmatchedWebreports: WebreportSubmission[];
  unmatchedBankStatements: BankStatement[];
}

export function runMatchingEngine(
  webreports: WebreportSubmission[],
  bankStatements: BankStatement[],
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG
): MatchingEngineResult {
  const matched: MatchingResult[] = [];
  const usedWebreportIds = new Set<string>();
  const usedBankStatementIds = new Set<string>();

  // Filter hanya yang pending
  const pendingWebreports = webreports.filter((w) => w.status === 'pending');
  const pendingBankStatements = bankStatements.filter((b) => b.status === 'pending');

  // Untuk setiap webreport, cari bank statement yang cocok
  for (const webreport of pendingWebreports) {
    let bestMatch: {
      bankStatement: BankStatement;
      score: number;
      details: MatchDetails;
    } | null = null;

    for (const bankStatement of pendingBankStatements) {
      // Skip jika sudah digunakan
      if (usedBankStatementIds.has(bankStatement.id)) continue;

      // Hitung match details
      const details = calculateMatchDetails(webreport, bankStatement);
      const score = calculateMatchScore(details, config);

      // Update best match jika score lebih tinggi
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { bankStatement, score, details };
      }
    }

    // Jika ada match dengan score cukup tinggi
    if (bestMatch && bestMatch.score >= config.manualReviewThreshold) {
      const status = determineMatchStatus(bestMatch.score, config);
      const now = new Date().toISOString();

      const matchResult: MatchingResult = {
        id: '', // Will be set by store
        webreportId: webreport.id,
        bankStatementId: bestMatch.bankStatement.id,
        webreport: webreport,
        bankStatement: bestMatch.bankStatement,
        matchScore: bestMatch.score,
        matchDetails: bestMatch.details,
        status,
        createdAt: now,
        updatedAt: now,
      };

      matched.push(matchResult);
      usedWebreportIds.add(webreport.id);
      usedBankStatementIds.add(bestMatch.bankStatement.id);
    }
  }

  // Collect unmatched items
  const unmatchedWebreports = pendingWebreports.filter(
    (w) => !usedWebreportIds.has(w.id)
  );
  const unmatchedBankStatements = pendingBankStatements.filter(
    (b) => !usedBankStatementIds.has(b.id)
  );

  return {
    matched,
    unmatchedWebreports,
    unmatchedBankStatements,
  };
}

// ===========================================
// SINGLE MATCH FUNCTION
// ===========================================

export function matchSingle(
  webreport: WebreportSubmission,
  bankStatement: BankStatement,
  config: MatchingConfig = DEFAULT_MATCHING_CONFIG
): MatchingResult {
  const details = calculateMatchDetails(webreport, bankStatement);
  const score = calculateMatchScore(details, config);
  const status = determineMatchStatus(score, config);
  const now = new Date().toISOString();

  return {
    id: '',
    webreportId: webreport.id,
    bankStatementId: bankStatement.id,
    webreport,
    bankStatement,
    matchScore: score,
    matchDetails: details,
    status,
    createdAt: now,
    updatedAt: now,
  };
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function calculateMatchDetails(
  webreport: WebreportSubmission,
  bankStatement: BankStatement
): MatchDetails {
  // VA Match - normalize dan compare
  const vaMatch = normalizeVA(webreport.virtualAccountNumber) === 
                  normalizeVA(bankStatement.virtualAccountNumber);

  // Amount Match - exact match
  const amountMatch = webreport.amount === bankStatement.amount;

  // Date Proximity - dalam jam
  const webreportDate = new Date(webreport.transferDate);
  const bankStatementDate = new Date(bankStatement.transactionDate);
  const diffMs = Math.abs(webreportDate.getTime() - bankStatementDate.getTime());
  const dateProximity = diffMs / (1000 * 60 * 60); // Convert to hours

  return {
    vaMatch,
    amountMatch,
    dateProximity,
  };
}

function normalizeVA(va: string): string {
  // Remove non-numeric characters and trim
  return va.replace(/\D/g, '').trim();
}

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

export function validateWebreportData(data: Partial<WebreportSubmission>): string[] {
  const errors: string[] = [];

  if (!data.virtualAccountNumber) {
    errors.push('Virtual Account Number is required');
  }

  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!data.transferDate) {
    errors.push('Transfer date is required');
  }

  if (!data.bankSender) {
    errors.push('Bank sender is required');
  }

  return errors;
}

export function validateBankStatementData(data: Partial<BankStatement>): string[] {
  const errors: string[] = [];

  if (!data.virtualAccountNumber) {
    errors.push('Virtual Account Number is required');
  }

  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!data.transactionDate) {
    errors.push('Transaction date is required');
  }

  if (!data.bankCode) {
    errors.push('Bank code is required');
  }

  return errors;
}
