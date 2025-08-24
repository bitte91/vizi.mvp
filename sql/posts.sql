-- Feed persistente
create table if not exists public.posts (
  id bigserial primary key,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1000),
  images jsonb default '[]',
  created_at timestamptz default now()
);
alter table public.posts enable row level security;

create policy if not exists "posts: read public" on public.posts
  for select using (true);
create policy if not exists "posts: author insert" on public.posts
  for insert with check (auth.uid() = author_id);
create policy if not exists "posts: author update" on public.posts
  for update using (auth.uid() = author_id);
create policy if not exists "posts: author delete" on public.posts
  for delete using (auth.uid() = author_id);
