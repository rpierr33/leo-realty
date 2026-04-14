import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { requireAuth } from '@/lib/utils/auth-guard';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const rows = await db.select().from(leads).orderBy(leads.createdAt);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/leads:', err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, interest, message, source, status } = body;
    const [row] = await db.insert(leads).values({
      firstName: firstName || 'Unknown',
      lastName: lastName || '',
      email,
      phone,
      interest: interest || 'other',
      message,
      source,
      status: status || 'new',
    }).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('POST /api/leads:', err);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
