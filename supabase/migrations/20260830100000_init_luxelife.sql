-- LuxeLife e-commerce schema
-- Run in Supabase SQL Editor or via: supabase db push

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  subtitle text not null default '',
  description text not null default '',
  price numeric(12, 2) not null,
  currency text not null check (currency in ('$', 'AED')),
  image text not null,
  gallery jsonb not null default '[]'::jsonb,
  category text not null,
  badge text check (badge is null or badge in ('New Arrival', 'Limited')),
  in_stock boolean not null default true,
  preorder boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric(12, 2) not null,
  currency text not null check (currency in ('$', 'AED')),
  payment_method text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.products enable row level security;
alter table public.orders enable row level security;

-- No public policies: the Express API uses the service role key (bypasses RLS).
-- This blocks direct anon access via the Supabase Data API.
