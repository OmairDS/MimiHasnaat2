'use client';

export default function ReportTools({ offset }: { offset: number }) {
  return (
    <div className="tools">
      <a className="btn-ghost btn btn-sm" href="/dashboard">🏠 اللوحة</a>
      <a className="btn-ghost btn btn-sm" href={`/report?w=${offset - 1}`}>الأسبوع السابق ›</a>
      {offset < 0 && <a className="btn-ghost btn btn-sm" href={`/report?w=${offset + 1}`}>‹ الأسبوع التالي</a>}
      <button onClick={() => window.print()}>🖨️ اطبع التقرير</button>
    </div>
  );
}
