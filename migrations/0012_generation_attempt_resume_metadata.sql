alter table generation_attempts add column task_provider text;
alter table generation_attempts add column required_credits integer;
alter table generation_attempts add column history_id text;

create index if not exists idx_generation_attempts_history_id
  on generation_attempts(history_id)
  where history_id is not null;
