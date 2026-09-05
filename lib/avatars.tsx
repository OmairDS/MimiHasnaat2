import React from 'react';

// Each avatar is a self-contained SVG on a 100x100 grid.
// The key is stored in the kids.emoji column, so no schema change is needed.
// Old emoji values still render — see the fallback at the bottom of <Avatar/>.

const face = (cx = 50, eyeY = 47, mouthY = 55) => (
  <>
    <circle cx={cx - 8} cy={eyeY} r="2.6" fill="#3A2A1E" />
    <circle cx={cx + 8} cy={eyeY} r="2.6" fill="#3A2A1E" />
    <path d={`M${cx - 6} ${mouthY} q6 5 12 0`} stroke="#3A2A1E" strokeWidth="2.2"
          fill="none" strokeLinecap="round" />
  </>
);

const SKIN = '#F3C9A2';

function Boy({ cap, robe, bg }: { cap: string; robe: string; bg: string }) {
  return (
    <>
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path d="M26 100 q0-28 24-28 t24 28z" fill={robe} />
      <path d="M50 72 v28" stroke="rgba(0,0,0,.12)" strokeWidth="2" />
      <circle cx="50" cy="48" r="20" fill={SKIN} />
      <path d="M30 40 q20-14 40 0 q-3-8-20-8 t-20 8z" fill={cap} />
      <ellipse cx="50" cy="39" rx="21" ry="6" fill={cap} />
      {face()}
    </>
  );
}

function Girl({ scarf, robe, bg }: { scarf: string; robe: string; bg: string }) {
  return (
    <>
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path d="M24 100 q0-26 26-26 t26 26z" fill={robe} />
      <path d="M50 26 q24 0 24 26 q0 16-8 24 h-32 q-8-8-8-24 q0-26 24-26z" fill={scarf} />
      <circle cx="50" cy="50" r="15" fill={SKIN} />
      <path d="M35 50 q0-16 15-16 t15 16 q-4-9-15-9 t-15 9z" fill={scarf} />
      {face(50, 49, 57)}
    </>
  );
}

const AVATAR_ART: Record<string, React.ReactNode> = {
  boy1: <Boy cap="#1FBE8D" robe="#FDF6E3" bg="#123A5E" />,
  boy2: <Boy cap="#F5B92E" robe="#E8F1F7" bg="#1B4A3C" />,
  boy3: <Boy cap="#5B8DEF" robe="#FDF6E3" bg="#3A2C5E" />,
  boy4: <Boy cap="#E8654F" robe="#F4EEE0" bg="#134B57" />,

  girl1: <Girl scarf="#F58BA8" robe="#FDF6E3" bg="#2E1F4A" />,
  girl2: <Girl scarf="#1FBE8D" robe="#F4EEE0" bg="#123A5E" />,
  girl3: <Girl scarf="#7EC8F5" robe="#FDF6E3" bg="#1B3B5E" />,
  girl4: <Girl scarf="#C8A2E8" robe="#F4EEE0" bg="#2A3F6B" />,

  lantern: (
    <>
      <circle cx="50" cy="50" r="50" fill="#1B2E52" />
      <path d="M50 14 v8" stroke="#F5B92E" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 30 h24 l-4 8 h-16z" fill="#F5B92E" />
      <path d="M34 38 h32 l-4 34 h-24z" fill="#FFD978" />
      <path d="M42 46 h16 v20 h-16z" fill="#F5B92E" opacity=".55" />
      <path d="M32 72 h36 l-3 8 h-30z" fill="#F5B92E" />
      <circle cx="50" cy="56" r="7" fill="#FFF3C4" opacity=".9" />
    </>
  ),

  mosque: (
    <>
      <circle cx="50" cy="50" r="50" fill="#12503F" />
      <path d="M50 22 q16 10 16 26 h-32 q0-16 16-26z" fill="#FDF6E3" />
      <path d="M50 16 v7" stroke="#F5B92E" strokeWidth="3" strokeLinecap="round" />
      <rect x="26" y="48" width="48" height="30" rx="3" fill="#FDF6E3" />
      <path d="M44 78 v-14 q6-8 12 0 v14z" fill="#12503F" />
      <rect x="20" y="34" width="7" height="44" rx="3" fill="#FDF6E3" />
      <rect x="73" y="34" width="7" height="44" rx="3" fill="#FDF6E3" />
      <circle cx="23.5" cy="31" r="3" fill="#F5B92E" />
      <circle cx="76.5" cy="31" r="3" fill="#F5B92E" />
    </>
  ),

  crescent: (
    <>
      <circle cx="50" cy="50" r="50" fill="#1B2E52" />
      <path d="M62 22 a30 30 0 1 0 0 56 a24 24 0 1 1 0-56z" fill="#FFD978" />
      <circle cx="47" cy="44" r="2.4" fill="#8A6A1E" />
      <circle cx="38" cy="44" r="2.4" fill="#8A6A1E" />
      <path d="M38 54 q5 5 10 0" stroke="#8A6A1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="74" cy="30" r="3" fill="#F5B92E" />
    </>
  ),

  star: (
    <>
      <circle cx="50" cy="50" r="50" fill="#2A2050" />
      <path d="M50 18 l9 20 22 3 -16 15 4 22 -19-11 -19 11 4-22 -16-15 22-3z" fill="#FFD978" />
      <circle cx="44" cy="47" r="2.4" fill="#8A6A1E" />
      <circle cx="56" cy="47" r="2.4" fill="#8A6A1E" />
      <path d="M45 55 q5 5 10 0" stroke="#8A6A1E" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),

  quran: (
    <>
      <circle cx="50" cy="50" r="50" fill="#134B57" />
      <rect x="24" y="30" width="52" height="40" rx="5" fill="#12503F" />
      <rect x="28" y="34" width="44" height="32" rx="3" fill="#FDF6E3" />
      <path d="M50 34 v32" stroke="#D9CDAE" strokeWidth="2" />
      <path d="M34 44 h12 M34 52 h12 M54 44 h12 M54 52 h12" stroke="#B9A87F"
            strokeWidth="2" strokeLinecap="round" />
      <path d="M50 24 l3 6 6 1 -4.5 4 1 6 -5.5-3 -5.5 3 1-6 -4.5-4 6-1z" fill="#F5B92E" />
    </>
  ),

  dates: (
    <>
      <circle cx="50" cy="50" r="50" fill="#1B4A3C" />
      <path d="M50 44 v34" stroke="#8B5E34" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 44 q-22-12-30 2 q18 2 30 6z" fill="#1FBE8D" />
      <path d="M50 44 q22-12 30 2 q-18 2-30 6z" fill="#1FBE8D" />
      <path d="M50 42 q-12-20-2-28 q10 10 2 28z" fill="#25D89E" />
      <ellipse cx="42" cy="56" rx="5" ry="7" fill="#B36A2E" />
      <ellipse cx="58" cy="58" rx="5" ry="7" fill="#8B4A22" />
      <ellipse cx="50" cy="64" rx="5" ry="7" fill="#B36A2E" />
    </>
  ),

  rug: (
    <>
      <circle cx="50" cy="50" r="50" fill="#3A2C5E" />
      <path d="M30 78 v-34 q20-18 40 0 v34z" fill="#B23A48" />
      <path d="M36 74 v-28 q14-13 28 0 v28z" fill="#FDF6E3" />
      <path d="M50 38 q9 8 9 16 h-18 q0-8 9-16z" fill="#B23A48" />
      <path d="M42 66 h16" stroke="#B23A48" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 78 h44" stroke="#F5B92E" strokeWidth="4" strokeLinecap="round" />
    </>
  ),

  camel: (
    <>
      <circle cx="50" cy="50" r="50" fill="#8A6A3E" />
      <path d="M28 74 v-14 q0-10 12-10 h14 q10 0 10 10 v14" fill="#E8C48A" />
      <path d="M40 52 q6-10 12 0z" fill="#D9AE6F" />
      <path d="M64 50 q6-16 12-4 q4 4 0 10 l-4 18" fill="#E8C48A" />
      <circle cx="74" cy="46" r="8" fill="#E8C48A" />
      <circle cx="77" cy="44" r="1.8" fill="#3A2A1E" />
      <path d="M76 50 q4 1 5 3" stroke="#3A2A1E" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
};

export const AVATARS = [
  { key: 'boy1', label: 'ولد' },
  { key: 'boy2', label: 'ولد ٢' },
  { key: 'boy3', label: 'ولد ٣' },
  { key: 'boy4', label: 'ولد ٤' },
  { key: 'girl1', label: 'بنت' },
  { key: 'girl2', label: 'بنت ٢' },
  { key: 'girl3', label: 'بنت ٣' },
  { key: 'girl4', label: 'بنت ٤' },
  { key: 'lantern', label: 'فانوس' },
  { key: 'mosque', label: 'مسجد' },
  { key: 'crescent', label: 'هلال' },
  { key: 'star', label: 'نجمة' },
  { key: 'quran', label: 'مصحف' },
  { key: 'dates', label: 'نخلة' },
  { key: 'rug', label: 'سجادة' },
  { key: 'camel', label: 'جمل' },
];

export function Avatar({ id, size = 56 }: { id?: string; size?: number }) {
  const art = id ? AVATAR_ART[id] : null;

  // Kids created before the avatar set still hold an emoji — show it as-is.
  if (!art) {
    return (
      <span style={{ fontSize: size * 0.62, lineHeight: 1, display: 'inline-block' }}>
        {id || '🌟'}
      </span>
    );
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-hidden="true"
         style={{ display: 'block', borderRadius: '50%' }}>
      {art}
    </svg>
  );
}
