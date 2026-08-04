create table if not exists media_library_assets (
  id text primary key,
  type text not null check (type in ('image', 'video')),
  url text not null unique,
  title text,
  source text not null check (source in ('history', 'upload', 'generated')),
  source_role text,
  source_history_id text,
  source_tool_slug text,
  source_tool_label text,
  source_path text,
  source_model text,
  source_prompt text,
  source_user_id text,
  source_user_email text,
  source_created_at text,
  review_status text not null default 'candidate' check (review_status in ('candidate', 'needs_review', 'approved', 'rejected')),
  metadata text,
  ai_tags text,
  manual_tags text,
  safety_tags text,
  confidence text,
  usage_count integer not null default 0 check (usage_count >= 0),
  created_at text not null,
  updated_at text not null
);

create index if not exists idx_media_library_assets_source_history
  on media_library_assets(source_history_id, source_role);

create index if not exists idx_media_library_assets_review_status
  on media_library_assets(review_status, created_at desc);
