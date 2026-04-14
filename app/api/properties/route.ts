import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { properties } from '@/lib/db/schema';
import { requireAuth } from '@/lib/utils/auth-guard';
import type { InferInsertModel } from 'drizzle-orm';

type PropertyInsert = InferInsertModel<typeof properties>;

export async function GET() {
  try {
    const rows = await db.select().from(properties).orderBy(properties.createdAt);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/properties:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json();
    const ALLOWED: (keyof PropertyInsert)[] = [
      'slug', 'title', 'description', 'status', 'propertyType', 'price',
      'bedrooms', 'bathrooms', 'sqft', 'address', 'city', 'state', 'zip',
      'images', 'features', 'agentId', 'isFeatured', 'isPublished',
      'yearBuilt', 'parking', 'lotSize', 'mlsId',
    ];
    const data: Partial<PropertyInsert> = {};
    for (const key of ALLOWED) {
      if (key in body) (data as Record<string, unknown>)[key] = body[key];
    }
    const [row] = await db.insert(properties).values(data as PropertyInsert).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('POST /api/properties:', err);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
