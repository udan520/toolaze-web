create table if not exists page_demo_assignments (
  id text primary key,
  page_slug text not null,
  locale text not null default 'all',
  placement text not null check (placement in ('hero_demo', 'default_reference', 'prompt_example')),
  apply_mode text not null default 'demo_only' check (apply_mode in ('demo_only', 'demo_with_parameters')),
  title text,
  asset text not null,
  input_assets text not null default '[]',
  prompt text,
  model text,
  params text not null default '{}',
  source_history_id text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  version integer not null default 1 check (version >= 1),
  created_at text not null,
  updated_at text not null,
  published_at text
);

create index if not exists idx_page_demo_assignments_review
  on page_demo_assignments(status, updated_at desc);

create index if not exists idx_page_demo_assignments_slot
  on page_demo_assignments(page_slug, locale, placement, status);

create index if not exists idx_page_demo_assignments_published_slot
  on page_demo_assignments(page_slug, locale, placement, published_at desc)
  where status = 'published';
