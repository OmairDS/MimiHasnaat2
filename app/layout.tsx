import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'نجوم الحسنات',
  description: 'لوحة نجوم الحسنات لأطفال العائلات الثلاث',
};

export const viewport: Viewport = { themeColor: '#0A1B36' };

function Sky() {
  const stars = Array.from({ length: 46 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    return {
      left: `${(r * 100).toFixed(2)}%`,
      top: `${(((i * 37) % 100)).toFixed(2)}%`,
      delay: `${(r * 4).toFixed(2)}s`,
      scale: 0.6 + r,
    };
  });
  return (
    <div className="sky" aria-hidden="true">
      {stars.map((s, i) => (
        <i key={i} style={{ left: s.left, top: s.top, animationDelay: s.delay, transform: `scale(${s.scale})` }} />
      ))}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@500;700;800&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Sky />
        {children}
      </body>
    </html>
  );
}
