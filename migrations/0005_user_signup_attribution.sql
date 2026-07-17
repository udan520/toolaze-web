create table if not exists user_signup_attribution (
  user_id text primary key references users(id) on delete cascade,
  signup_path text,
  signup_url text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  created_at text not null,
  updated_at text not null
);

