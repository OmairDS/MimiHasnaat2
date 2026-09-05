-- Run this ONCE in the Neon SQL Editor, after the new code is deployed.
-- Step 1 permanently removes the other two families and everything attached
-- to them (their admins, kids, and points). There is no undo.

-- 1) Keep آل العمير only.
delete from families where slug in ('basfar', 'suwaidi');

-- 2) Give the three existing kids illustrated avatars instead of animal emojis.
--    Run the select first to see which id is which child, then adjust the
--    avatar keys below to match (boy1..boy4, girl1..girl4, lantern, mosque,
--    crescent, star, quran, dates, rug, camel).
select id, name_ar, emoji from kids order by id;

update kids set emoji = 'boy1'  where id = 1;
update kids set emoji = 'girl1' where id = 2;
update kids set emoji = 'boy2'  where id = 3;

-- 3) Optional: rename the parents and set real PINs.
--    ids 1 and 2 are the two آل العمير admins.
-- update admins set name_ar = 'براء', pin = '4821' where id = 1;
-- update admins set name_ar = '...',  pin = '4822' where id = 2;

-- 4) Check the result.
select k.id, k.name_ar, k.emoji from kids k order by k.id;
