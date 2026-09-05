import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { currentAdmin } from '@/lib/session';
import { weekRange } from '@/lib/week';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const admin = await currentAdmin();
  if (!admin) redirect('/');

  const { start, end } = weekRange(0);

  const kids = (await sql`
    select k.id, k.name_ar as name, k.emoji, k.color, k.active,
      coalesce((select sum(p.delta) from points p where p.kid_id = k.id), 0)::int as total,
      coalesce((select sum(p.delta) from points p
                where p.kid_id = k.id and p.created_at >= ${start.toISOString()}
                  and p.created_at < ${end.toISOString()}), 0)::int as week,
      coalesce((select json_agg(r) from (
          select p.id, p.delta, p.reason, p.created_at
          from points p where p.kid_id = k.id
          order by p.created_at desc limit 3) r), '[]') as recent,
      exists(select 1 from admin_kids ak where ak.admin_id = ${admin.id} and ak.kid_id = k.id) as mine
    from kids k
    where k.family_id = ${admin.family_id} and k.active
    order by k.id`) as any[];

  return <DashboardClient admin={admin} kids={kids} />;
}
