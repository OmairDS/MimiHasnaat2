import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { currentAdmin } from '@/lib/session';

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const { kidIds } = await req.json();
  const ids = (Array.isArray(kidIds) ? kidIds : []).map(Number).filter(Boolean);

  await sql`delete from admin_kids where admin_id = ${admin.id}`;
  for (const kid of ids) {
    await sql`
      insert into admin_kids (admin_id, kid_id)
      select ${admin.id}, id from kids where id = ${kid} and family_id = ${admin.family_id}
      on conflict do nothing`;
  }
  return NextResponse.json({ ok: true });
}
