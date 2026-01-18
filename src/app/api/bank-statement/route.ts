import { NextRequest, NextResponse } from 'next/server';
import { 
  BankStatement, 
  BankStatementAPIPayload, 
  BankStatementFileImport,
  BankStatementResponse 
} from '@/types';

// ===========================================
// IN-MEMORY STORE (Simulating Database)
// ===========================================

let bankStatements: BankStatement[] = [];

function generateId(): string {
  return `BS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// ===========================================
// GET /api/bank-statement - List all statements
// ===========================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const source = searchParams.get('source');
  const bankCode = searchParams.get('bankCode');

  let filtered = [...bankStatements];

  if (status) {
    filtered = filtered.filter((s) => s.status === status);
  }

  if (source) {
    filtered = filtered.filter((s) => s.source === source);
  }

  if (bankCode) {
    filtered = filtered.filter((s) => s.bankCode === bankCode);
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

// ===========================================
// POST /api/bank-statement - Create from API or File Import
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'api'; // 'api' or 'file_import'

    if (mode === 'file_import') {
      return handleFileImport(body as BankStatementFileImport);
    } else {
      return handleAPIPayload(body as BankStatementAPIPayload);
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// ===========================================
// Handle Single API Payload (Bank API Integration)
// ===========================================

async function handleAPIPayload(payload: BankStatementAPIPayload) {
  // Validation
  const errors: string[] = [];
  if (!payload.virtualAccountNumber) errors.push('Virtual Account Number is required');
  if (!payload.amount || payload.amount <= 0) errors.push('Amount must be greater than 0');
  if (!payload.transactionDate) errors.push('Transaction date is required');
  if (!payload.bankCode) errors.push('Bank code is required');

  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, error: errors.join(', ') },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const newStatement: BankStatement = {
    id: generateId(),
    source: 'api',
    bankCode: payload.bankCode,
    accountNumber: payload.accountNumber,
    virtualAccountNumber: payload.virtualAccountNumber,
    amount: payload.amount,
    transactionDate: payload.transactionDate,
    senderName: payload.senderName,
    senderAccountNumber: payload.senderAccountNumber,
    reference: payload.reference,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  bankStatements.unshift(newStatement);

  const response: BankStatementResponse = {
    success: true,
    data: newStatement,
  };

  return NextResponse.json(response, { status: 201 });
}

// ===========================================
// Handle File Import (Batch)
// ===========================================

async function handleFileImport(payload: BankStatementFileImport) {
  if (!payload.statements || !Array.isArray(payload.statements)) {
    return NextResponse.json(
      { success: false, error: 'Statements array is required' },
      { status: 400 }
    );
  }

  if (!payload.bankCode) {
    return NextResponse.json(
      { success: false, error: 'Bank code is required' },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const newStatements: BankStatement[] = [];

  for (const stmt of payload.statements) {
    if (!stmt.virtualAccountNumber || !stmt.amount || !stmt.transactionDate) {
      continue; // Skip invalid rows
    }

    const newStatement: BankStatement = {
      id: generateId(),
      source: 'file_import',
      bankCode: payload.bankCode,
      accountNumber: payload.accountNumber,
      virtualAccountNumber: stmt.virtualAccountNumber,
      amount: stmt.amount,
      transactionDate: stmt.transactionDate,
      senderName: stmt.senderName,
      reference: stmt.reference,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    newStatements.push(newStatement);
  }

  bankStatements = [...newStatements, ...bankStatements];

  const response: BankStatementResponse = {
    success: true,
    data: newStatements,
    imported: newStatements.length,
  };

  return NextResponse.json(response, { status: 201 });
}

// ===========================================
// DELETE /api/bank-statement - Clear all (for testing)
// ===========================================

export async function DELETE() {
  bankStatements = [];
  return NextResponse.json({ success: true, message: 'All statements cleared' });
}
