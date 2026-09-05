import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { currentAdmin } from '@/lib/session';

export async function POST(req: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const { name, emoji, color } = await req.json();
  const clean = String(name || '').trim();
  if (!clean) return NextResponse.json({ ok: false, error: 'اكتب اسم الطفل' }, { status: 400 });

  const rows = (await sql`
    insert into kids (family_id, name_ar, emoji, color)
    values (${admin.family_id}, ${clean}, ${emoji || '🌟'}, ${color || '#F5B92E'})
    returning id`) as any[];
  await sql`insert into admin_kids (admin_id, kid_id) values (${admin.id}, ${rows[0].id}) on conflict do nothing`;
  return NextResponse.json({ ok: true, id: rows[0].id });
}

export async function PATCH(req: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  const { id, name, emoji, active } = await req.json();
  await sql`
    update kids set
      name_ar = coalesce(${name ?? null}, name_ar),
      emoji   = coalesce(${emoji ?? null}, emoji),
      active  = coalesce(${active ?? null}, active)
    where id = ${Number(id)} and family_id = ${admin.family_id}`;
  return NextResponse.json({ ok: true });
}
