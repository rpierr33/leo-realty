import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';

const schema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(10),
  interest: z.enum(['buying', 'selling', 'renting', 'mortgage', 'other']).default('other'),
  message: z.string().optional(),
  source: z.string().optional(),
  propertyId: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Handle both name formats
    let firstName = data.firstName || '';
    let lastName = data.lastName || '';
    if (!firstName && data.name) {
      const parts = data.name.split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    await db.insert(leads).values({
      firstName: firstName || 'Unknown',
      lastName: lastName || '',
      email: data.email,
      phone: data.phone,
      interest: data.interest,
      message: data.message ?? '',
      source: data.source ?? 'contact_form',
      status: 'new',
      ...(data.propertyId ? { propertyId: data.propertyId } : {}),
    });

    return NextResponse.json({ success: true, message: 'Lead created' }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: err.issues }, { status: 422 });
    }
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
