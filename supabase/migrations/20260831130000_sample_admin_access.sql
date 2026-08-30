-- Sample storefront: no real auth. The browser anon key can manage catalog and orders.
-- Replace with proper auth before going to production.

grant insert, update, delete on table public.products to anon, authenticated;
grant select, update on table public.orders to anon, authenticated;

create policy "Sample admin can insert products"
  on public.products for insert
  to anon, authenticated
  with check (true);

create policy "Sample admin can update products"
  on public.products for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Sample admin can delete products"
  on public.products for delete
  to anon, authenticated
  using (true);

create policy "Sample admin can read orders"
  on public.orders for select
  to anon, authenticated
  using (true);

create policy "Sample admin can update orders"
  on public.orders for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Sample admin can upload product images"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'product-images');

create policy "Sample admin can update product images"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');
