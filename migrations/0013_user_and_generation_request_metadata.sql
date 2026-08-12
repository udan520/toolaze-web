alter table users add column signup_ip text;
alter table users add column signup_country text;
alter table users add column last_login_ip text;
alter table users add column last_login_country text;

alter table generation_history add column request_ip text;
alter table generation_history add column request_country text;

alter table generation_attempts add column request_ip text;
alter table generation_attempts add column request_country text;

create index if not exists idx_users_signup_ip
  on users(signup_ip)
  where signup_ip is not null;

create index if not exists idx_users_last_login_ip
  on users(last_login_ip)
  where last_login_ip is not null;

create index if not exists idx_generation_history_request_ip_created_at
  on generation_history(request_ip, created_at desc)
  where request_ip is not null;

create index if not exists idx_generation_attempts_request_ip_created_at
  on generation_attempts(request_ip, created_at desc)
  where request_ip is not null;
