-- perfis + RLS + trigger (igual pacote anterior)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  is_verified boolean default false,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy if not exists "profiles: read public"
  on public.profiles for select using (true);

create policy if not exists "profiles: update own"
  on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
