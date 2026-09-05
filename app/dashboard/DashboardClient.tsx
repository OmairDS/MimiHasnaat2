'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AVATARS } from '@/lib/avatars';

type Kid = {
  id: number; name: string; emoji: string; color: string;
  total: number; week: number; mine: boolean;
  recent: { id: number; delta: number; reason: string; created_at: string }[];
};

const GOOD = [
  'صلّى في وقتها', 'حفظ آية جديدة', 'قرأ ورده من القرآن', 'أذكار الصباح والمساء',
  'ساعد أمه في البيت', 'رتّب غرفته', 'صدق في كلامه', 'أحسن إلى إخوانه',
  'أنهى واجباته', 'تصدّق على محتاج', 'ابتسم وسلّم', 'صام يومًا',
];
const BAD = [
  'تأخر عن الصلاة', 'قال كلامًا غير صحيح', 'تشاجر مع إخوانه', 'رفع صوته على والديه',
  'لم يرتب غرفته', 'أهمل واجباته', 'وقت زائد على الجوال', 'لم يستأذن',
];


export default function DashboardClient({ admin, kids }: { admin: any; kids: Kid[] }) {
  const router = useRouter();
  const [sheet, setSheet] = useState<null | 'point' | 'add' | 'pick' | 'rename'>(null);
  const [target, setTarget] = useState<Kid | null>(null);
  const [sign, setSign] = useState(1);
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('boy1');
  const [picked, setPicked] = useState<number[]>(kids.filter(k => k.mine).map(k => k.id));
  const [showAll, setShowAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const visible = showAll ? kids : kids.filter(k => k.mine);
  const close = () => { setSheet(null); setTarget(null); setReason(''); setAmount(1); setMsg(''); };

  async function send(url: string, body: any, method = 'POST') {
    setBusy(true);
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(data.error || 'ما ضبطت، جرّب مرة ثانية'); return false; }
    close();
    router.refresh();
    return true;
  }

  function openPoint(kid: Kid, s: number) {
    setTarget(kid); setSign(s); setAmount(1); setReason(''); setMsg(''); setSheet('point');
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="mark">🌙</span>
          <div>
            نجوم الحسنات
            <div className="who">{admin.family_emoji} {admin.family_ar} — {admin.name_ar}</div>
          </div>
        </div>
        <button className="btn-ghost btn-sm" onClick={async () => {
          await fetch('/api/logout', { method: 'POST' });
          router.push('/'); router.refresh();
        }}>خروج</button>
      </header>

      <div className="tools">
        <a className="btn" href="/report">📜 تقرير الجمعة</a>
        <button className="btn-ghost btn-sm" onClick={() => { setPicked(kids.filter(k => k.mine).map(k => k.id)); setSheet('pick'); }}>
          👨‍👩‍👦 اختيار أطفالي
        </button>
        <button className="btn-ghost btn-sm" onClick={() => { setNewName(''); setNewEmoji('boy1'); setSheet('add'); }}>
          ➕ إضافة طفل
        </button>
        <button className="btn-ghost btn-sm" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'عرض أطفالي فقط' : 'عرض كل أطفال العائلة'}
        </button>
      </div>

      {visible.length === 0 && (
        <div className="pick" style={{ cursor: 'default' }}>
          <span className="big">🧸</span>
          <h3>ما اخترت أطفالك بعد</h3>
          <small>اضغط «اختيار أطفالي» وحدد من تتابعه، أو أضف طفلًا جديدًا.</small>
        </div>
      )}

      <div className="grid grid-3">
        {visible.map((kid) => {
          const cap = 50;
          const pct = Math.max(0, Math.min(100, (kid.week / cap) * 100));
          return (
            <article className="kid" key={kid.id} style={{ ['--glow' as any]: kid.color + '55' }}>
              <div className="kid-top">
                <div className="avatar" style={{ borderColor: kid.color }}><Avatar id={kid.emoji} size={52} /></div>
                <div style={{ flex: 1 }}>
                  <h3>{kid.name}</h3>
                  <div className="sub">هذا الأسبوع {kid.week >= 0 ? '+' : ''}{kid.week} نجمة</div>
                </div>
                <button className="btn-ghost btn-sm" title="تعديل الاسم"
                  onClick={() => { setTarget(kid); setNewName(kid.name); setNewEmoji(kid.emoji); setSheet('rename'); }}>
                  ✏️
                </button>
              </div>

              <div className="jar">
                <div className="jar-track">
                  <div className="jar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="score">
                <b>{kid.total} ⭐</b>
                <span>مجموع النجوم من البداية</span>
              </div>

              <div className="kid-actions">
                <button className="btn-plus" onClick={() => openPoint(kid, 1)}>+ حسنة</button>
                <button className="btn-minus" onClick={() => openPoint(kid, -1)}>− مخالفة</button>
              </div>

              {kid.recent?.length > 0 && (
                <div className="log">
                  {kid.recent.map((r) => (
                    <div key={r.id}>
                      <b>{r.delta > 0 ? '＋' : '－'}{Math.abs(r.delta)} {r.reason}</b>
                      <span onClick={() => send('/api/points', { id: r.id }, 'DELETE')}
                            style={{ cursor: 'pointer' }} title="تراجع">↩︎</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {sheet && (
        <div className="veil" onClick={close}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>

            {sheet === 'point' && target && (
              <>
                <h2>{sign > 0 ? '⭐ حسنة لـ' : '☁️ مخالفة لـ'} {target.name}</h2>
                <p className="hint">{sign > 0 ? 'كم نجمة يستحق؟ وليش؟' : 'كم نجمة تُخصم؟ وليش؟'}</p>

                <span className="label">عدد النجوم</span>
                <div className="chips">
                  {[1, 2, 3, 5, 10].map((n) => (
                    <button key={n} className={`chip ${amount === n ? (sign > 0 ? 'on' : 'on-minus') : ''}`}
                            onClick={() => setAmount(n)}>{n}</button>
                  ))}
                </div>

                <span className="label">السبب</span>
                <div className="chips">
                  {(sign > 0 ? GOOD : BAD).map((r) => (
                    <button key={r} className={`chip ${reason === r ? (sign > 0 ? 'on' : 'on-minus') : ''}`}
                            onClick={() => setReason(r)}>{r}</button>
                  ))}
                </div>

                <span className="label">أو اكتب السبب بنفسك</span>
                <input type="text" value={reason} placeholder="مثال: ساعد جدته في الحديقة"
                       onChange={(e) => setReason(e.target.value)} />

                {msg && <p className="err">{msg}</p>}
                <div className="row">
                  <button className="btn-ghost" onClick={close}>إلغاء</button>
                  <button className={sign > 0 ? 'btn-plus' : 'btn-minus'} disabled={busy}
                          onClick={() => send('/api/points', { kidId: target.id, delta: sign * amount, reason })}>
                    {sign > 0 ? `أضف ${amount} نجمة` : `اخصم ${amount} نجمة`}
                  </button>
                </div>
              </>
            )}

            {sheet === 'add' && (
              <>
                <h2>➕ طفل جديد في {admin.family_ar}</h2>
                <p className="hint">اكتب الاسم واختر رمزه المفضل.</p>
                <input type="text" value={newName} placeholder="اسم الطفل"
                       onChange={(e) => setNewName(e.target.value)} />
                <span className="label">الرمز</span>
                <div className="chips avatar-picker">
                  {AVATARS.map((a) => (
                    <button key={a.key} className={`chip pick-av ${newEmoji === a.key ? 'on' : ''}`}
                            title={a.label} onClick={() => setNewEmoji(a.key)}>
                      <Avatar id={a.key} size={42} />
                    </button>
                  ))}
                </div>
                {msg && <p className="err">{msg}</p>}
                <div className="row">
                  <button className="btn-ghost" onClick={close}>إلغاء</button>
                  <button disabled={busy} onClick={() => send('/api/kids', { name: newName, emoji: newEmoji })}>
                    أضف الطفل
                  </button>
                </div>
              </>
            )}

            {sheet === 'rename' && target && (
              <>
                <h2>✏️ تعديل بيانات {target.name}</h2>
                <p className="hint">غيّر الاسم أو الرمز.</p>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <span className="label">الرمز</span>
                <div className="chips avatar-picker">
                  {AVATARS.map((a) => (
                    <button key={a.key} className={`chip pick-av ${newEmoji === a.key ? 'on' : ''}`}
                            title={a.label} onClick={() => setNewEmoji(a.key)}>
                      <Avatar id={a.key} size={42} />
                    </button>
                  ))}
                </div>
                <div className="row">
                  <button className="btn-ghost" onClick={close}>إلغاء</button>
                  <button disabled={busy}
                          onClick={() => send('/api/kids', { id: target.id, name: newName, emoji: newEmoji }, 'PATCH')}>
                    احفظ
                  </button>
                </div>
              </>
            )}

            {sheet === 'pick' && (
              <>
                <h2>👨‍👩‍👦 اختر أطفالك</h2>
                <p className="hint">اللي تختارهم يظهرون في لوحتك.</p>
                <div className="chips">
                  {kids.map((k) => (
                    <button key={k.id}
                      className={`chip ${picked.includes(k.id) ? 'on' : ''}`}
                      onClick={() => setPicked(picked.includes(k.id) ? picked.filter(i => i !== k.id) : [...picked, k.id])}>
                      <Avatar id={k.emoji} size={24} /> {k.name}
                    </button>
                  ))}
                </div>
                <div className="row">
                  <button className="btn-ghost" onClick={close}>إلغاء</button>
                  <button disabled={busy} onClick={() => send('/api/select', { kidIds: picked })}>احفظ الاختيار</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
