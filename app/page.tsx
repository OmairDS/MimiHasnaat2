import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { currentAdmin } from '@/lib/session';
import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  if (await currentAdmin()) redirect('/dashboard');

  const families = (await sql`
    select f.id, f.name_ar, f.emoji,
           coalesce(json_agg(json_build_object('id', a.id, 'name', a.name_ar, 'role', a.role_ar, 'emoji', a.emoji)
                    order by a.id) filter (where a.id is not null), '[]') as admins
    from families f left join admins a on a.family_id = f.id
    group by f.id order by f.id`) as any[];

  return <LoginClient families={families} />;
}
