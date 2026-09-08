-- payment_status/payment_provider/payment_reference now carry real financial
-- meaning (they gate whether an order is treated as paid). The sample admin
-- policy in 20260831130000_sample_admin_access.sql grants anon/authenticated
-- a permissive update on public.orders (using(true) with check(true)), which
-- lets a customer set their own order's payment_status to 'paid' from
-- devtools without ever paying, bypassing the backend and Ziina entirely.
--
-- This migration does NOT touch that grant or policy (admin panel still
-- needs it for the `status` fulfillment column and is out of scope here).
-- Instead it adds a trigger that silently reverts the three payment-meaning
-- columns to their pre-update values whenever the write isn't coming from
-- the backend's service_role key. Fulfillment `status` stays writable by
-- anon as before.

create or replace function public.lock_order_payment_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Checked two ways rather than relying solely on the auth.role() helper:
  -- Postgres role Supabase's PostgREST switches into per-request (current_user),
  -- and the raw JWT role claim, for robustness across Supabase versions.
  if not (
    current_user = 'service_role'
    or coalesce(current_setting('request.jwt.claim.role', true), '') = 'service_role'
  ) then
    new.payment_status := old.payment_status;
    new.payment_provider := old.payment_provider;
    new.payment_reference := old.payment_reference;
  end if;
  return new;
end;
$$;

drop trigger if exists lock_order_payment_fields on public.orders;

create trigger lock_order_payment_fields
  before update on public.orders
  for each row
  execute function public.lock_order_payment_fields();
