create table if not exists generation_attempts (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  task_id text,
  media_type text not null check (media_type in ('image', 'video')),
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed')),
  model text not null,
  prompt text not null,
  output_url text,
  input_urls text,
  aspect_ratio text,
  resolution text,
  output_format text,
  native_audio integer not null default 0 check (native_audio in (0, 1)),
  tool_slug text,
  tool_label text,
  source_path text,
  failure_reason text,
  credit_transaction_id text,
  consumption_id text,
  created_at text not null,
  updated_at text not null
);

create index if not exists idx_generation_attempts_user_created_at
  on generation_attempts(user_id, created_at desc);

create index if not exists idx_generation_attempts_task_id
  on generation_attempts(task_id)
  where task_id is not null;

create index if not exists idx_generation_attempts_status_created_at
  on generation_attempts(status, created_at desc);
