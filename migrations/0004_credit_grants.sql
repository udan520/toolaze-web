create table if not exists credit_grants (
  id text primary key,
  request_id text not null unique,
  user_id text not null references users(id) on delete cascade,
  original_amount integer not null check(original_amount > 0),
  remaining_amount integer not null check(remaining_amount >= 0),
  expires_at text,
  reason text not null,
  description text not null,
  metadata text,
  created_at text not null,
  updated_at text not null
);

create index if not exists idx_credit_grants_user_expiry
  on credit_grants(user_id, expires_at, created_at);

create index if not exists idx_credit_grants_expiration
  on credit_grants(expires_at)
  where remaining_amount > 0 and expires_at is not null;

create table if not exists credit_consumptions (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  transaction_id text not null unique references credit_transactions(id) on delete cascade,
  total_amount integer not null check(total_amount > 0),
  permanent_amount integer not null default 0 check(permanent_amount >= 0),
  refunded_permanent_amount integer not null default 0 check(refunded_permanent_amount >= 0),
  created_at text not null,
  updated_at text not null
);

create table if not exists credit_consumption_grants (
  consumption_id text not null references credit_consumptions(id) on delete cascade,
  grant_id text not null references credit_grants(id) on delete cascade,
  amount integer not null check(amount > 0),
  refunded_amount integer not null default 0 check(refunded_amount >= 0),
  primary key(consumption_id, grant_id)
);

create index if not exists idx_credit_consumptions_user_created_at
  on credit_consumptions(user_id, created_at desc);
