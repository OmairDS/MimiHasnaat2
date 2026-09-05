import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { currentAdmin } from '@/lib/session';

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const { kidId, delta, reason } = await req.json();
  const amount = Math.trunc(Number(delta));
  const why = String(reason || '').trim();

  if (!amount || Math.abs(amount) > 50) {
    return NextResponse.json({ ok: false, error: 'عدد النقاط غير صحيح' }, { status: 400 });
  }
  if (!why) return NextResponse.json({ ok: false, error: 'اكتب السبب' }, { status: 400 });

  const owned = (await sql`
    select id from kids where id = ${Number(kidId)} and family_id = ${admin.family_id}`) as any[];
  if (!owned[0]) return NextResponse.json({ ok: false }, { status: 403 });

  await sql`
    insert into points (kid_id, admin_id, delta, reason)
    values (${Number(kidId)}, ${admin.id}, ${amount}, ${why})`;
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const { id } = await req.json();
  await sql`
    delete from points p using kids k
    where p.id = ${Number(id)} and p.kid_id = k.id and k.family_id = ${admin.family_id}`;
  return NextResponse.json({ ok: true });
}
