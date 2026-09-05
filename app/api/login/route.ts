import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  const { adminId, pin } = await req.json();
  const rows = (await sql`select id, pin from admins where id = ${Number(adminId)}`) as any[];
  if (!rows[0] || rows[0].pin !== String(pin)) {
    return NextResponse.json({ ok: false, error: 'الرمز غير صحيح' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_id', String(rows[0].id), {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 120,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
