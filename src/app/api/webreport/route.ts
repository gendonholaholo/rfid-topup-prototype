import { NextRequest, NextResponse } from 'next/server';
import { CreateWebreportRequest, WebreportResponse } from '@/types';

// ===========================================
// IN-MEMORY STORE (Simulating Database)
// Note: In production, use actual database
// ===========================================

// This will be synced with client-side Zustand store via API calls
let webreportSubmissions: Array<{
  id: string;
  customerId: string;
  customerName: string;
  virtualAccountNumber: string;
  amount: number;
  transferDate: string;
  bankSender: string;
  notes?: string;
  status: 'pending' | 'matched' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}> = [];

function generateId(): string {
  return `WR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// ===========================================
// GET /api/webreport - List all submissions
// ===========================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const customerId = searchParams.get('customerId');

  let filtered = [...webreportSubmissions];

  if (status) {
    filtered = filtered.filter((s) => s.status === status);
  }

  if (customerId) {
    filtered = filtered.filter((s) => s.customerId === customerId);
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
  });
}

// ===========================================
// POST /api/webreport - Create new submission
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const body: CreateWebreportRequest = await request.json();

    // Validation
    const errors: string[] = [];
    if (!body.virtualAccountNumber) errors.push('Virtual Account Number is required');
    if (!body.amount || body.amount <= 0) errors.push('Amount must be greater than 0');
    if (!body.transferDate) errors.push('Transfer date is required');
    if (!body.bankSender) errors.push('Bank sender is required');

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newSubmission = {
      id: generateId(),
      customerId: body.customerId,
      customerName: '', // Would be fetched from customer DB in production
      virtualAccountNumber: body.virtualAccountNumber,
      amount: body.amount,
      transferDate: body.transferDate,
      bankSender: body.bankSender,
      notes: body.notes,
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    };

    webreportSubmissions.unshift(newSubmission);

    const response: WebreportResponse = {
      success: true,
      data: newSubmission,
    };

    return NextResponse.json(response, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// ===========================================
// DELETE /api/webreport - Clear all (for testing)
// ===========================================

export async function DELETE() {
  webreportSubmissions = [];
  return NextResponse.json({ success: true, message: 'All submissions cleared' });
}
