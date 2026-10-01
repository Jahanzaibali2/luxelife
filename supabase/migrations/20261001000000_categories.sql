-- Categories become first-class: each has its own landing page (/collections/:slug),
-- copy and hero image, managed from /admin/categories.
-- Also adds a Gifts edit flag on products and re-files the catalog into the new taxonomy.

create table if not exists public.categories (
  slug text primary key,
  name text not null,
  tagline text not null default '',
  intro text not null default '',
  hero_image text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

grant select on table public.categories to anon, authenticated;
-- Sample admin (no real auth yet) - same pattern as 20260831130000_sample_admin_access.sql.
-- Replace with proper auth before going to production.
grant insert, update, delete on table public.categories to anon, authenticated;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Sample admin can insert categories" on public.categories;
create policy "Sample admin can insert categories"
  on public.categories for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Sample admin can update categories" on public.categories;
create policy "Sample admin can update categories"
  on public.categories for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Sample admin can delete categories" on public.categories;
create policy "Sample admin can delete categories"
  on public.categories for delete
  to anon, authenticated
  using (true);

insert into public.categories (slug, name, tagline, intro, hero_image, sort_order) values
  ('fashion', 'Fashion', 'Pieces that wear well, for years.',
   'Tailoring, bags and everyday layers chosen for their cut, their cloth and how long they last.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDuLcu-YoGMpPa-kPAlcK3vcKFCJZTKVfg1EqvcR2B_6Lo_hUiXftBZIjCR7iYvZimqtx_JqSu98y9JtN2ajHUPVz1rmG0M2LMtyJK_Bz2p3OzOijL77qOMfwOp0D8QAZBgLA-CRQcqpapqCj4ZlJsMwjV3-iaAOz9uL54z_eRxV7tjf8-1ZNTIonBcVo_VV33G6IzvG_cSDJnfc5pjt6hCcO0_cLWWEyhwk0AdLAcaeFADBmYlV6QdHQ',
   10),
  ('beauty', 'Beauty', 'Tools for the daily ritual.',
   'Styling tools and care, selected for performance and kindness to hair and skin.',
   null, 20),
  ('home-living', 'Home & Living', 'Quiet objects for considered rooms.',
   'Ceramics, scent and small sculptural pieces that make a space feel finished.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDbl1As4q9r7ZAhle_SbZyNgOa-ylZ9KQVuOHKltEShprjpY63G3MGb4gm8xecfp-jM9iC7Wy_FhDI_TShvGVM-lmOO1iX33VXGPG8-oSy47UA7wmHSq-ekzITiGzV7dfHE1aV2ZIUNV5Jsy043ATPQzYEchaFw-uuXk8O8rohRg3FsH2waacEIogeNhwJoeZhKu9Y6aDPg6vsv5TAx1pT1a9EiESwK5NHzXrBg_Xz0DuRbJBFM3UtGHA',
   30),
  ('jewellery-watches', 'Jewellery & Watches', 'Made to be worn every day.',
   'Fine jewellery and precise timepieces with a restrained, lasting design.',
   null, 40),
  ('tech', 'Tech', 'Useful, beautifully made.',
   'Devices and accessories that earn their place on the desk and in the home.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDkQNHzabu2onH-OgL5lYjXoSlQF330ufKOB982WG3pmxWoytH1U1PLtr47yG3-AIr-UP657DCZPvc5cTPG9y4NkdOvwe4KmaLwf-nDFiemHOvetksZsrXXhFp9gAevEMPolISmApFymo4p5z4sQb4ZKR3K_c5vHxk9mAD-QkkI38rEQdN53lQlTub5g2xB3k0PoU7iOsgIjC2EOvidFuVhbW40GJX_iWzSEPAxaDlt7fEaJpmo2v3NiQ',
   50)
on conflict (slug) do nothing;

-- Gifts is a curated edit across categories, not a category.
alter table public.products add column if not exists is_gift boolean not null default false;

-- Re-file the catalog into the new taxonomy.
update public.products set category = 'beauty'
  where category = 'fashion' and slug like '%hair%';
update public.products set category = 'home-living' where category = 'home-lifestyle';
update public.products set category = 'jewellery-watches' where category in ('jewelry', 'gadgets');
update public.products set category = 'fashion' where category = 'accessories';
update public.products set category = 'fashion', is_gift = true where category = 'gifts';

-- Any category left over that has no row yet becomes its own (hidden) category instead of breaking the FK.
insert into public.categories (slug, name, visible)
  select distinct p.category, initcap(replace(p.category, '-', ' ')), false
  from public.products p
  left join public.categories c on c.slug = p.category
  where c.slug is null
on conflict (slug) do nothing;

alter table public.products drop constraint if exists products_category_fkey;
alter table public.products
  add constraint products_category_fkey
  foreign key (category) references public.categories (slug)
  on update cascade on delete restrict;

create index if not exists products_category_idx on public.products (category);
