alter table generation_history
add column native_audio integer not null default 0 check (native_audio in (0, 1));
