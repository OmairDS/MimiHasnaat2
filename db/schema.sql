-- نجوم الحسنات | Hasanat Stars — schema
-- Run once in the Neon SQL Editor.

create table if not exists families (
  id         serial primary key,
  slug       text unique not null,
  name_ar    text not null,
  name_en    text not null,
  emoji      text not null default '🏡'
);

create table if not exists admins (
  id         serial primary key,
  family_id  int not null references families(id) on delete cascade,
  name_ar    text not null,
  role_ar    text not null default 'ولي أمر',
  pin        text not null,
  emoji      text not null default '👤'
);

create table if not exists kids (
  id         serial primary key,
  family_id  int not null references families(id) on delete cascade,
  name_ar    text not null,
  emoji      text not null default '🌟',
  color      text not null default '#17A67B',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

-- which kids each admin has picked as "theirs"
create table if not exists admin_kids (
  admin_id int not null references admins(id) on delete cascade,
  kid_id   int not null references kids(id) on delete cascade,
  primary key (admin_id, kid_id)
);

create table if not exists points (
  id         serial primary key,
  kid_id     int not null references kids(id) on delete cascade,
  admin_id   int references admins(id) on delete set null,
  delta      int not null,           -- positive = حسنة، negative = مخالفة
  reason     text not null,
  created_at timestamptz not null default now()
);

create index if not exists points_kid_time on points (kid_id, created_at desc);
create index if not exists kids_family on kids (family_id);
