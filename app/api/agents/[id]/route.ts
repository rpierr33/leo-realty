import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/utils/auth-guard';

type Params = { params: Promise<{ id: string }> };

const PATCH_ALLOWED = ['name', 'title', 'role', 'phone', 'email', 'bio', 'avatarUrl', 'specialties', 'yearsExperience', 'licenseNumber', 'isActive', 'displayOrder', 'instagramUrl', 'linkedinUrl', 'facebookUrl'] as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const [row] = await db.select().from(agents).where(eq(agents.id, parseInt(id))).limit(1);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error('GET /api/agents/[id]:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  const { id } = await params;
  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = {};
    for (const key of PATCH_ALLOWED) {
      if (key in body) updateData[key] = body[key];
    }
    const [row] = await db.update(agents).set({ ...updateData, updatedAt: new Date() }).where(eq(agents.id, parseInt(id))).returning();
    return NextResponse.json(row);
  } catch (err) {
    console.error('PATCH /api/agents/[id]:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  const { id } = await params;
  try {
    // Soft delete
    await db.update(agents).set({ isActive: false, updatedAt: new Date() }).where(eq(agents.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/agents/[id]:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
