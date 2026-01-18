import { NextRequest, NextResponse } from 'next/server';
import { MatchingResult, VerifyMatchRequest } from '@/types';

// ===========================================
// IN-MEMORY STORE (Simulating Database)
// ===========================================

let matchingResults: MatchingResult[] = [];

function generateId(): string {
  return `MR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

// ===========================================
// GET /api/matching - List all matching results
// ===========================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let filtered = [...matchingResults];

  if (status) {
    const statuses = status.split(',');
    filtered = filtered.filter((m) => statuses.includes(m.status));
  }

  // Sort by createdAt descending
  filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({
    success: true,
    data: filtered,
    total: filtered.length,
    pending: filtered.filter((m) => 
      m.status === 'auto_matched' || m.status === 'manual_review'
    ).length,
  });
}

// ===========================================
// POST /api/matching - Create new matching result
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const now = new Date().toISOString();
    const newResult: MatchingResult = {
      ...body,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    matchingResults.unshift(newResult);

    return NextResponse.json({
      success: true,
      data: newResult,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// ===========================================
// PATCH /api/matching - Verify/Reject a match
// ===========================================

export async function PATCH(request: NextRequest) {
  try {
    const body: VerifyMatchRequest = await request.json();
    const { matchingResultId, action, notes, verifiedBy } = body;

    if (!matchingResultId) {
      return NextResponse.json(
        { success: false, error: 'matchingResultId is required' },
        { status: 400 }
      );
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'action must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    const index = matchingResults.findIndex((m) => m.id === matchingResultId);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Matching result not found' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const updatedResult: MatchingResult = {
      ...matchingResults[index],
      status: action === 'approve' ? 'verified' : 'rejected',
      verifiedBy,
      verifiedAt: now,
      notes,
      updatedAt: now,
    };

    matchingResults[index] = updatedResult;

    return NextResponse.json({
      success: true,
      data: updatedResult,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// ===========================================
// DELETE /api/matching - Clear all (for testing)
// ===========================================

export async function DELETE() {
  matchingResults = [];
  return NextResponse.json({ success: true, message: 'All matching results cleared' });
}
