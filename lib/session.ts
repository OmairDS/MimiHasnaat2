import { cookies } from 'next/headers';
import { sql } from './db';

export type Admin = {
  id: number; name_ar: string; role_ar: string; emoji: string;
  family_id: number; family_ar: string; family_emoji: string; family_slug: string;
};

export async function currentAdmin(): Promise<Admin | null> {
  const jar = await cookies();
  const id = Number(jar.get('admin_id')?.value);
  if (!id) return null;
  const rows = await sql`
    select a.id, a.name_ar, a.role_ar, a.emoji, a.family_id,
           f.name_ar as family_ar, f.emoji as family_emoji, f.slug as family_slug
    from admins a join families f on f.id = a.family_id
    where a.id = ${id}` as any[];
  return (rows[0] as Admin) || null;
}
