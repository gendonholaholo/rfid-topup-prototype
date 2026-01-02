import { BankStatement, BankStatementSource } from '@/types';

// ===========================================
// FILE PARSER TYPES
// ===========================================

export interface ParsedRow {
  virtualAccountNumber: string;
  amount: number;
  transactionDate: string;
  senderName?: string;
  reference?: string;
}

export interface ParseResult {
  success: boolean;
  data: ParsedRow[];
  errors: string[];
  warnings: string[];
}

// ===========================================
// CSV PARSER
// ===========================================

export function parseCSV(csvContent: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data: ParsedRow[] = [];

  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    return {
      success: false,
      data: [],
      errors: ['File harus memiliki header dan minimal 1 baris data'],
      warnings: [],
    };
  }

  // Parse header
  const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  
  // Find column indexes
  const vaIndex = findColumnIndex(header, ['virtual_account', 'va', 'va_number', 'account_number']);
  const amountIndex = findColumnIndex(header, ['amount', 'nominal', 'jumlah', 'nilai']);
  const dateIndex = findColumnIndex(header, ['date', 'transaction_date', 'tanggal', 'tgl']);
  const senderIndex = findColumnIndex(header, ['sender', 'sender_name', 'nama_pengirim', 'from']);
  const refIndex = findColumnIndex(header, ['reference', 'ref', 'referensi', 'keterangan']);

  if (vaIndex === -1) {
    errors.push('Kolom Virtual Account tidak ditemukan. Gunakan header: virtual_account, va, va_number, atau account_number');
  }
  if (amountIndex === -1) {
    errors.push('Kolom Amount tidak ditemukan. Gunakan header: amount, nominal, jumlah, atau nilai');
  }
  if (dateIndex === -1) {
    errors.push('Kolom Date tidak ditemukan. Gunakan header: date, transaction_date, tanggal, atau tgl');
  }

  if (errors.length > 0) {
    return { success: false, data: [], errors, warnings };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      const cols = parseCSVLine(line);
      
      const va = cols[vaIndex]?.trim();
      const amountStr = cols[amountIndex]?.trim();
      const dateStr = cols[dateIndex]?.trim();

      if (!va || !amountStr || !dateStr) {
        warnings.push(`Baris ${i + 1}: Data tidak lengkap, dilewati`);
        continue;
      }

      const amount = parseAmount(amountStr);
      if (isNaN(amount) || amount <= 0) {
        warnings.push(`Baris ${i + 1}: Amount tidak valid "${amountStr}", dilewati`);
        continue;
      }

      const transactionDate = parseDate(dateStr);
      if (!transactionDate) {
        warnings.push(`Baris ${i + 1}: Format tanggal tidak valid "${dateStr}", dilewati`);
        continue;
      }

      data.push({
        virtualAccountNumber: va,
        amount,
        transactionDate,
        senderName: senderIndex !== -1 ? cols[senderIndex]?.trim() : undefined,
        reference: refIndex !== -1 ? cols[refIndex]?.trim() : undefined,
      });
    } catch (e) {
      warnings.push(`Baris ${i + 1}: Error parsing - ${e}`);
    }
  }

  return {
    success: data.length > 0,
    data,
    errors,
    warnings,
  };
}

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result.map((s) => s.replace(/^"|"$/g, ''));
}

function findColumnIndex(header: string[], possibleNames: string[]): number {
  for (const name of possibleNames) {
    const index = header.indexOf(name);
    if (index !== -1) return index;
  }
  return -1;
}

function parseAmount(amountStr: string): number {
  // Remove currency symbols, spaces, and thousand separators
  const cleaned = amountStr
    .replace(/[Rp\s.]/gi, '')
    .replace(/,/g, '.');
  return parseFloat(cleaned);
}

function parseDate(dateStr: string): string | null {
  // Try various date formats
  const formats = [
    // ISO format
    /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/,
    // DD/MM/YYYY or DD-MM-YYYY
    /^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/,
    // YYYY/MM/DD
    /^(\d{4})[\/](\d{2})[\/](\d{2})$/,
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      let year, month, day;
      
      if (format === formats[0] || format === formats[2]) {
        // YYYY-MM-DD or YYYY/MM/DD
        [, year, month, day] = match;
      } else {
        // DD/MM/YYYY
        [, day, month, year] = match;
      }
      
      const date = new Date(`${year}-${month}-${day}T12:00:00.000Z`);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
  }

  // Try native parsing as fallback
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }

  return null;
}

// ===========================================
// CONVERT TO BANK STATEMENTS
// ===========================================

export function convertToBankStatements(
  parsed: ParsedRow[],
  bankCode: string,
  accountNumber: string,
  source: BankStatementSource = 'file_import'
): Omit<BankStatement, 'id' | 'createdAt' | 'updatedAt' | 'status'>[] {
  return parsed.map((row) => ({
    source,
    bankCode,
    accountNumber,
    virtualAccountNumber: row.virtualAccountNumber,
    amount: row.amount,
    transactionDate: row.transactionDate,
    senderName: row.senderName,
    reference: row.reference,
  }));
}

// ===========================================
// SAMPLE CSV TEMPLATE
// ===========================================

export const CSV_TEMPLATE = `virtual_account,amount,date,sender_name,reference
8810012345678901,10000000,2026-01-02,PT ABC Indonesia,TRF-001
8810012345678902,5000000,2026-01-02,CV Mitra Jaya,TRF-002
8810012345678903,15000000,2026-01-02,PT XYZ Logistics,TRF-003`;

export const CSV_TEMPLATE_HEADERS = [
  'virtual_account - Nomor Virtual Account (wajib)',
  'amount - Nominal transfer (wajib)',
  'date - Tanggal transaksi format YYYY-MM-DD (wajib)',
  'sender_name - Nama pengirim (opsional)',
  'reference - Nomor referensi (opsional)',
];
