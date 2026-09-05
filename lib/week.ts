// The reporting week runs Saturday 00:00 -> Friday 23:59 (Riyadh, UTC+3),
// so the Friday report always covers the week that just finished.
const TZ = 3 * 60 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;

export function weekRange(offset = 0) {
  const riyadhNow = new Date(Date.now() + TZ);
  const dow = riyadhNow.getUTCDay();            // 0=Sun ... 6=Sat
  const sinceSaturday = (dow + 1) % 7;
  const midnight = Date.UTC(riyadhNow.getUTCFullYear(), riyadhNow.getUTCMonth(), riyadhNow.getUTCDate());
  const startLocal = midnight - sinceSaturday * DAY + offset * 7 * DAY;
  return { start: new Date(startLocal - TZ), end: new Date(startLocal - TZ + 7 * DAY) };
}

export function arabicDate(d: Date) {
  return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Riyadh',
  }).format(d);
}

export function hijri(d: Date) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-latn', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Riyadh',
  }).format(d);
}
