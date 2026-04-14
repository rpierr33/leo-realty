import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { properties } from '@/lib/db/schema';
import { requireAuth } from '@/lib/utils/auth-guard';
import { and, eq, gte, lte, ilike, or, SQL } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';

type PropertyInsert = InferInsertModel<typeof properties>;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type');          // residential, condo, etc.
    const status = searchParams.get('status');        // for_sale, for_rent, etc.
    const priceMin = searchParams.get('price_min');  // numeric string
    const priceMax = searchParams.get('price_max');  // numeric string
    const beds = searchParams.get('beds');            // min bedrooms
    const baths = searchParams.get('baths');          // min bathrooms
    const q = searchParams.get('q');                  // text search (title + city + address)

    const filters: SQL[] = [];

    // Only published by default unless admin is requesting all
    const includeUnpublished = searchParams.get('all') === '1';
    if (!includeUnpublished) {
      filters.push(eq(properties.isPublished, true));
    }

    if (type) {
      filters.push(eq(properties.propertyType, type as PropertyInsert['propertyType']));
    }
    if (status) {
      filters.push(eq(properties.status, status as PropertyInsert['status']));
    }
    if (priceMin) {
      filters.push(gte(properties.price, priceMin));
    }
    if (priceMax) {
      filters.push(lte(properties.price, priceMax));
    }
    if (beds) {
      filters.push(gte(properties.bedrooms, parseInt(beds)));
    }
    if (baths) {
      filters.push(gte(properties.bathrooms, parseInt(baths)));
    }
    if (q) {
      const pattern = `%${q}%`;
      filters.push(
        or(
          ilike(properties.title, pattern),
          ilike(properties.city, pattern),
          ilike(properties.address, pattern),
          ilike(properties.state, pattern)
        )!
      );
    }

    const rows = await db
      .select()
      .from(properties)
      .where(filters.length > 0 ? and(...filters) : undefined)
      .orderBy(properties.createdAt);

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
