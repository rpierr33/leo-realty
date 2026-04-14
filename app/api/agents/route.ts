import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agents } from '@/lib/db/schema';
import { requireAuth } from '@/lib/utils/auth-guard';
import { eq } from 'drizzle-orm';
import type { InferInsertModel } from 'drizzle-orm';

type AgentInsert = InferInsertModel<typeof agents>;

export async function GET() {
  try {
    const rows = await db.select().from(agents).where(eq(agents.isActive, true)).orderBy(agents.displayOrder);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/agents:', err);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json();
    const ALLOWED: (keyof AgentInsert)[] = ['slug', 'name', 'title', 'role', 'phone', 'email', 'bio', 'avatarUrl', 'specialties', 'yearsExperience', 'licenseNumber', 'displayOrder'];
    const data: Partial<AgentInsert> = {};
    for (const key of ALLOWED) {
      if (key in body) (data as Record<string, unknown>)[key] = body[key];
    }
    const [row] = await db.insert(agents).values(data as AgentInsert).returning();
    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error('POST /api/agents:', err);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
