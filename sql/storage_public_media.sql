-- Bucket público: public-media (imagens)
do $$
begin
  if not exists (select 1 from storage.buckets where name = 'public-media') then
    perform storage.create_bucket('public-media', true);
  end if;
end $$;

-- Políticas de Storage
create policy if not exists "storage: public read"
on storage.objects for select
using (bucket_id = 'public-media');

create policy if not exists "storage: user upload"
on storage.objects for insert
with check (bucket_id = 'public-media' and auth.role() = 'authenticated');

create policy if not exists "storage: user update own"
on storage.objects for update
using (bucket_id = 'public-media' and owner = auth.uid());

create policy if not exists "storage: user delete own"
on storage.objects for delete
using (bucket_id = 'public-media' and owner = auth.uid());
