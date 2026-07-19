create table if not exists app_settings (
  key text primary key,
  value text not null,
  updated_at text not null
);

insert into app_settings (key, value, updated_at)
values ('creem_prompt_moderation_enabled', 'false', datetime('now'))
on conflict(key) do nothing;
