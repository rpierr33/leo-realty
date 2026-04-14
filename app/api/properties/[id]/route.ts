import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { properties } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/utils/auth-guard';

type Params = { params: Promise<{ id: string }> };

const PATCH_ALLOWED = [
  'title', 'description', 'status', 'propertyType', 'price', 'bedrooms',
  'bathrooms', 'sqft', 'address', 'city', 'state', 'zip', 'images',
  'features', 'agentId', 'isFeatured', 'isPublished', 'yearBuilt', 'parking',
] as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const [row] = await db.select().from(properties).where(eq(properties.id, parseInt(id))).limit(1);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error('GET /api/properties/[id]:', err);
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
    const [row] = await db.update(properties).set({ ...updateData, updatedAt: new Date() }).where(eq(properties.id, parseInt(id))).returning();
    return NextResponse.json(row);
  } catch (err) {
    console.error('PATCH /api/properties/[id]:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  const { id } = await params;
  try {
    await db.delete(properties).where(eq(properties.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/properties/[id]:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
