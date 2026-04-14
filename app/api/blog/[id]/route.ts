import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/utils/auth-guard';

type Params = { params: Promise<{ id: string }> };

const PATCH_ALLOWED = ['title', 'excerpt', 'content', 'coverImageUrl', 'authorId', 'category', 'tags', 'isPublished', 'readTimeMinutes', 'slug'] as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, parseInt(id))).limit(1);
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    console.error('GET /api/blog/[id]:', err);
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
    if (updateData.isPublished === true && body.publishedAt === undefined) {
      updateData.publishedAt = new Date();
    }
    const [row] = await db.update(blogPosts).set({ ...updateData, updatedAt: new Date() }).where(eq(blogPosts.id, parseInt(id))).returning();
    return NextResponse.json(row);
  } catch (err) {
    console.error('PATCH /api/blog/[id]:', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const authError = await requireAuth();
  if (authError) return authError;
  const { id } = await params;
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/blog/[id]:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
