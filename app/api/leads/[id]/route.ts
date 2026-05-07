import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/utils/auth-guard';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  try {
    const [row] = await db.select().from(leads).where(eq(leads.id, parseInt(id))).limit(1);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error('GET /api/leads/[id]:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  try {
    const body = await req.json();
    const ALLOWED = ['status', 'notes', 'assignedAgentId'] as const;
    const updateData: Record<string, unknown> = {};
    for (const key of ALLOWED) {
      if (key in body) updateData[key] = body[key];
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    const [row] = await db.update(leads).set({ ...updateData, updatedAt: new Date() }).where(eq(leads.id, parseInt(id))).returning();
    return NextResponse.json(row);
  } catch (err) {
    console.error('PATCH /api/leads/[id]:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  try {
    await db.delete(leads).where(eq(leads.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/leads/[id]:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
