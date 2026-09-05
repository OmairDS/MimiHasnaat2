import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { currentAdmin } from '@/lib/session';
import { weekRange, arabicDate, hijri } from '@/lib/week';
import ReportTools from './ReportTools';
import { Avatar } from '@/lib/avatars';

export const dynamic = 'force-dynamic';

const MEDALS = ['🥇', '🥈', '🥉'];

export default async function Report({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const admin = await currentAdmin();
  if (!admin) redirect('/');

  const params = await searchParams;
  const offset = Number(params?.w || 0);
  const { start, end } = weekRange(offset);
  const prev = weekRange(offset - 1);

  const rows = (await sql`
    select k.id, k.name_ar as name, k.emoji, k.color,
      coalesce((select sum(p.delta) from points p where p.kid_id = k.id
        and p.created_at >= ${start.toISOString()} and p.created_at < ${end.toISOString()}), 0)::int as week,
      coalesce((select sum(p.delta) from points p where p.kid_id = k.id and p.delta > 0
        and p.created_at >= ${start.toISOString()} and p.created_at < ${end.toISOString()}), 0)::int as good,
      coalesce((select -sum(p.delta) from points p where p.kid_id = k.id and p.delta < 0
        and p.created_at >= ${start.toISOString()} and p.created_at < ${end.toISOString()}), 0)::int as bad,
      coalesce((select sum(p.delta) from points p where p.kid_id = k.id
        and p.created_at >= ${prev.start.toISOString()} and p.created_at < ${prev.end.toISOString()}), 0)::int as last_week,
      coalesce((select sum(p.delta) from points p where p.kid_id = k.id), 0)::int as total,
      coalesce((select json_agg(d) from (
        select p.delta, p.reason, p.created_at from points p
        where p.kid_id = k.id and p.created_at >= ${start.toISOString()} and p.created_at < ${end.toISOString()}
        order by p.created_at) d), '[]') as deeds
    from kids k
    where k.family_id = ${admin.family_id} and k.active
    order by k.id`) as any[];

  const ranked = [...rows].sort((a, b) => b.week - a.week);
  const best = ranked[0]?.week ?? 0;
  const improve = [...rows].sort((a, b) => (b.week - b.last_week) - (a.week - a.last_week))[0];
  const lastDay = new Date(end.getTime() - 1);

  return (
    <main className="shell">
      <ReportTools offset={offset} />

      <section className="report">
        <div style={{ textAlign: 'center', fontSize: '2rem' }}>🕌 ✨ 🌙</div>
        <h1>تقرير الجمعة — {admin.family_ar}</h1>
        <p className="when">
          من {arabicDate(start)} إلى {arabicDate(lastDay)} · {hijri(lastDay)}
        </p>

        <div className="podium">
          {ranked.map((k, i) => {
            const badges: { text: string; warn?: boolean }[] = [];
            if (i === 0 && k.week > 0) badges.push({ text: '🏆 نجم الأسبوع' });
            if (k.bad === 0 && k.good > 0) badges.push({ text: '🕊️ أسبوع بلا مخالفات' });
            if (k.good >= 20) badges.push({ text: '⭐ مجتهد' });
            if (improve && improve.id === k.id && k.week > k.last_week) badges.push({ text: '📈 الأكثر تطورًا' });
            if (k.week < 0) badges.push({ text: '💛 الأسبوع الجاي أحسن', warn: true });

            return (
              <div className={`rank ${i === 0 && k.week > 0 ? 'first' : ''}`} key={k.id}>
                <div className="medal">{MEDALS[i] || <Avatar id={k.emoji} size={36} />}</div>
                <div className="who2">
                  <b><span className="inline-av"><Avatar id={k.emoji} size={26} /></span>{k.name}</b>
                  <small>+{k.good} حسنة · −{k.bad} مخالفة · الرصيد الكلي {k.total} ⭐</small>
                  {badges.length > 0 && (
                    <div className="badges">
                      {badges.map((b) => <span key={b.text} className={`badge ${b.warn ? 'warn' : ''}`}>{b.text}</span>)}
                    </div>
                  )}
                </div>
                <div className={`tot ${k.week < 0 ? 'neg' : ''}`}>{k.week}</div>
              </div>
            );
          })}
        </div>

        {rows.map((k) => (
          k.deeds.length > 0 && (
            <div className="detail" key={k.id}>
              <h3><span className="inline-av"><Avatar id={k.emoji} size={26} /></span>ماذا فعل {k.name} هذا الأسبوع؟</h3>
              {k.deeds.map((d: any, i: number) => (
                <div className="deed" key={i}>
                  <span>{d.reason}</span>
                  <span className={d.delta > 0 ? 'p' : 'm'}>{d.delta > 0 ? `+${d.delta} ⭐` : `${d.delta} ☁️`}</span>
                </div>
              ))}
            </div>
          )
        ))}

        {best === 0 && ranked.every((k) => k.week === 0) && (
          <p style={{ textAlign: 'center', marginTop: 24, color: '#7A8798' }}>
            ما تسجّلت أي نقاط في هذا الأسبوع بعد.
          </p>
        )}

        <div className="ayah">
          ﴿ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ ﴾
          <div style={{ fontSize: '.8rem', marginTop: 6, color: '#7A8798' }}>سورة الزلزلة</div>
        </div>
      </section>
    </main>
  );
}
