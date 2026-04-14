import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { requireAuth } from '@/lib/utils/auth-guard';
import { eq } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';

type BlogInsert = InferInsertModel<typeof blogPosts>;

export async function GET() {
  try {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(blogPosts.publishedAt);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/blog:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json();
    const ALLOWED: (keyof BlogInsert)[] = ['slug', 'title', 'excerpt', 'content', 'coverImageUrl', 'authorId', 'category', 'tags', 'isPublished', 'readTimeMinutes'];
    const data: Partial<BlogInsert> = {};
    for (const key of ALLOWED) {
      if (key in body) (data as Record<string, unknown>)[key] = body[key];
    }
    if (data.isPublished) data.publishedAt = new Date();
    const [row] = await db.insert(blogPosts).values(data as BlogInsert).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('POST /api/blog:', err);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
