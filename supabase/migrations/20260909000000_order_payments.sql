-- Adds payment tracking columns for online payment providers (Ziina).
alter table public.orders
  add column if not exists payment_provider text not null default 'cod'
    check (payment_provider in ('cod', 'ziina')),
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'failed')),
  add column if not exists payment_reference text;

create index if not exists orders_payment_reference_idx
  on public.orders (payment_reference);
