alter table users
add column first_login_at text;

alter table users
add column last_login_at text;

update users
set
  first_login_at = coalesce(first_login_at, created_at),
  last_login_at = coalesce(
    last_login_at,
    (
      select max(event_at)
      from (
        select created_at as event_at
        from sessions
        where sessions.user_id = users.id
        union all
        select created_at as event_at
        from generation_history
        where generation_history.user_id = users.id
        union all
        select created_at as event_at
        from credit_transactions
        where credit_transactions.user_id = users.id
          and credit_transactions.amount < 0
        union all
        select updated_at as event_at
        where updated_at is not null
        union all
        select created_at as event_at
        where created_at is not null
      )
    )
  )
where first_login_at is null
  or last_login_at is null;

create index if not exists idx_users_last_login_at
  on users(last_login_at desc);
