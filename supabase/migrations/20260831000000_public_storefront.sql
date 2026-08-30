-- Storefront: browser uses the anon key (not service_role).
-- Products are public. Orders can be created, but not listed, so customer data stays hidden.
-- Admin writes stay on Express for later.

grant select on table public.products to anon, authenticated;
grant insert on table public.orders to anon, authenticated;

create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can place an order"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);
