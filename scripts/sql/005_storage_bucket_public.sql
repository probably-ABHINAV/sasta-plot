-- Create/ensure a public 'plots' bucket without relying on storage.create_bucket()
-- and without changing storage.objects policies (avoids 'must be owner of table objects')

-- Idempotent upsert of bucket. If it exists, just ensure it's public.
insert into storage.buckets (id, name, public)
values ('plots', 'plots', true)
on conflict (id) do update set public = excluded.public;

/*
Verification after running:
1) In Admin (/admin/plots), upload an image; it should succeed when signed in.
2) On public pages (/plots, /plots/[id]), images should load via getPublicUrl('plots', path).
If you still see 403 on images, tell me and I’ll add a follow-up script that creates
policies using a DO block that only runs when the current role owns storage.objects.
*/
