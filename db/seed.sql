-- Seed آل العمير. Edit the names and PINs, then run once.

insert into families (slug, name_ar, name_en, emoji) values
  ('omair', 'آل العمير', 'Al-Omair', '🌙')
on conflict (slug) do nothing;

-- Two admins per family. PINs are 4 digits — change them.
insert into admins (family_id, name_ar, role_ar, pin, emoji)
select f.id, a.name_ar, a.role_ar, a.pin, a.emoji
from families f
join (values
  ('omair', 'أبو الأطفال', 'الأب', '1111', '👨'),
  ('omair', 'أم الأطفال',  'الأم', '1122', '👩')
) as a(slug, name_ar, role_ar, pin, emoji) on a.slug = f.slug
where not exists (select 1 from admins x where x.family_id = f.id and x.name_ar = a.name_ar and x.role_ar = a.role_ar);

-- Placeholder kids: 3 for آل العمير. Rename them inside the app (tap the pencil on a card).
insert into kids (family_id, name_ar, emoji, color)
select f.id, k.name_ar, k.emoji, k.color
from families f
join (values
  ('omair', 'الطفل الأول',  'boy1',  '#F2B705'),
  ('omair', 'الطفل الثاني', 'girl1', '#17A67B'),
  ('omair', 'الطفل الثالث', 'boy2',  '#5B8DEF')
) as k(slug, name_ar, emoji, color) on k.slug = f.slug
where not exists (select 1 from kids x where x.family_id = f.id and x.name_ar = k.name_ar);

-- Every admin starts with all of their family's kids selected.
insert into admin_kids (admin_id, kid_id)
select a.id, k.id from admins a join kids k on k.family_id = a.family_id
on conflict do nothing;
