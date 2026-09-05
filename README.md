# 🌙 نجوم الحسنات — Hasanat Stars

A family good-deeds tracker for three households. Each parent signs in with a 4-digit PIN, picks the kids they follow, awards **حسنات** (plus stars) or records **مخالفات** (minus stars) with a reason, and prints a kid-friendly Friday report.

Stack: **Next.js 15 (App Router) · Neon Postgres · Vercel**. Arabic RTL, night-sky Islamic theme, mobile-first.

---

## Package overview

| File / folder | Format | Audience | What it's for |
|---|---|---|---|
| `db/schema.sql` | SQL | You, once | Creates the 5 tables in Neon |
| `db/seed.sql` | SQL | You, once | Loads the 3 families, 6 admins, 8 placeholder kids |
| `app/page.tsx` + `LoginClient.tsx` | Next.js | Parents | Family → parent → PIN sign-in |
| `app/dashboard/` | Next.js | Parents | Kid cards, plus/minus sheet, add kid, pick my kids |
| `app/report/` | Next.js | Kids + parents | The printable Friday report |
| `app/api/` | Route handlers | — | login, logout, kids, select, points |
| `lib/week.ts` | TS | — | Defines the week as Saturday → Friday, Riyadh time |
| `app/globals.css` | CSS | — | The whole theme lives here |

## Structure at a glance

```
hasanat-stars/
├─ app/
│  ├─ page.tsx · LoginClient.tsx       ← sign in
│  ├─ dashboard/page.tsx · DashboardClient.tsx
│  ├─ report/page.tsx · ReportTools.tsx
│  ├─ api/{login,logout,kids,select,points}/route.ts
│  ├─ layout.tsx · globals.css
├─ lib/{db,session,week}.ts
├─ db/{schema,seed}.sql
└─ package.json · next.config.mjs · .env.example
```

---

## Set it up (about 15 minutes)

**1 — GitHub**

```bash
cd hasanat-stars
git init && git add . && git commit -m "Hasanat Stars"
gh repo create OmairDS/hasanat-stars --private --source=. --push
```

**2 — Neon**

1. Create a project at [neon.tech](https://neon.tech) (region: `eu-central-1` or `me-central`).
2. Open the **SQL Editor**, paste `db/schema.sql`, run it.
3. Paste `db/seed.sql`, run it.
4. Copy the pooled connection string.

**3 — Vercel**

1. [vercel.com/new](https://vercel.com/new) → import the repo.
2. Add environment variable `DATABASE_URL` = the Neon string (all three environments).
3. Deploy. Done.

**Run locally instead:** copy `.env.example` to `.env.local`, paste your `DATABASE_URL`, then `npm install && npm run dev`.

---

## First things to change

**PINs.** The seed ships with defaults — change them before you share the link:

| Family | Dad | Mom |
|---|---|---|
| آل العمير | `1111` | `1122` |
| آل باسفر | `2211` | `2222` |
| آل السويدي | `3311` | `3322` |

```sql
update admins set pin = '4821' where id = 1;
update admins set name_ar = 'براء' where id = 1;
```

**Kid names.** The seed creates 3 + 3 + 2 placeholders. Rename them inside the app — tap the ✏️ on any card. New kids get added from **➕ إضافة طفل** and are automatically assigned to whoever added them.

## How to use it

- **Award a star:** tap `+ حسنة` on a kid's card → pick how many (1, 2, 3, 5, 10) → pick a reason from the chips or type your own → confirm. Minus points work the same way through `− مخالفة`.
- **Undo:** each card shows the last 3 entries with a `↩︎` to delete a mistake.
- **My kids vs the whole family:** every parent picks their own kids from **اختيار أطفالي**. Both parents in a family can see and score every kid in that family — the selection just controls what shows on your own screen.
- **Friday:** open **📜 تقرير الجمعة** and hit print (or Save as PDF). The report covers Saturday → Friday, ranks the kids with medals, awards badges (نجم الأسبوع, أسبوع بلا مخالفات, الأكثر تطورًا), lists every deed, and closes with an ayah. `الأسبوع السابق` walks back through past weeks.

Families are isolated: a parent can only see, score, and add kids inside their own family.

## Extend this package

Natural next additions, roughly in order of value:

1. **Rewards store** — kids spend stars on a prize list (`rewards` + `redemptions` tables); a spend is just a negative point row with a `kind` column.
2. **Kid view** — a read-only PIN per child so they can watch their own jar fill without being able to score themselves.
3. **Prayer streak** — a daily 5-checkbox grid that auto-awards stars, since الصلاة is the most repeated reason in the list.
4. **WhatsApp Friday push** — a Vercel cron at Friday 18:00 Riyadh that renders the report to an image and sends it to a family group.
5. **Cross-family leaderboard** — an opt-in view where the three families compare weekly totals.
6. **Ramadan mode** — a seasonal skin plus a taraweeh/juz tracker.
