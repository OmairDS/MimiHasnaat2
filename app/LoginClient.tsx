'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Admin = { id: number; name: string; role: string; emoji: string };
type Family = { id: number; name_ar: string; emoji: string; admins: Admin[] };

export default function LoginClient({ families }: { families: Family[] }) {
  const router = useRouter();
  const [family, setFamily] = useState<Family | null>(families.length === 1 ? families[0] : null);
  const single = families.length === 1;
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(code: string) {
    setBusy(true);
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId: admin!.id, pin: code }),
    });
    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError('الرمز غير صحيح، جرّب مرة ثانية');
      setPin('');
      setBusy(false);
    }
  }

  function tap(d: string) {
    if (busy) return;
    const next = (pin + d).slice(0, 4);
    setPin(next);
    if (next.length === 4) submit(next);
  }

  return (
    <main className="shell">
      <div className="hero">
        <span className="moon">🌙</span>
        <h1>نجوم الحسنات</h1>
        <p>
          {!family && 'اختر عائلتك'}
          {family && !admin && 'مين أنت؟'}
          {admin && 'اكتب رمزك السري'}
        </p>
      </div>

      {!family && (
        <div className="grid grid-3">
          {families.map((f) => (
            <div key={f.id} className="pick" onClick={() => setFamily(f)} role="button" tabIndex={0}
                 onKeyDown={(e) => e.key === 'Enter' && setFamily(f)}>
              <span className="big">{f.emoji}</span>
              <h3>{f.name_ar}</h3>
              <small>{f.admins.length} ولي أمر</small>
            </div>
          ))}
        </div>
      )}

      {family && !admin && (
        <>
          <div className="grid grid-3">
            {family.admins.map((a) => (
              <div key={a.id} className="pick" onClick={() => setAdmin(a)} role="button" tabIndex={0}
                   onKeyDown={(e) => e.key === 'Enter' && setAdmin(a)}>
                <span className="big">{a.emoji}</span>
                <h3>{a.name}</h3>
                <small>{a.role}</small>
              </div>
            ))}
          </div>
          <div className="tools" style={{ marginTop: 22 }}>
            {!single && <button className="btn-ghost" onClick={() => setFamily(null)}>رجوع للعائلات</button>}
          </div>
        </>
      )}

      {admin && (
        <>
          <div className="pindots">
            {[0, 1, 2, 3].map((i) => <i key={i} className={pin.length > i ? 'on' : ''} />)}
          </div>
          <div className="pinpad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button key={d} onClick={() => tap(d)}>{d}</button>
            ))}
            <button onClick={() => setPin('')}>مسح</button>
            <button onClick={() => tap('0')}>0</button>
            <button onClick={() => setPin(pin.slice(0, -1))}>⌫</button>
          </div>
          {error && <p className="err">{error}</p>}
          <div className="tools" style={{ marginTop: 20 }}>
            <button className="btn-ghost" onClick={() => { setAdmin(null); setPin(''); setError(''); }}>
              رجوع
            </button>
          </div>
        </>
      )}
    </main>
  );
}
