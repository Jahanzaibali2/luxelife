-- The role check added in 20260909010000_lock_order_payment_fields.sql relies on
-- current_setting('request.jwt.claim.role', true), a flat-claim GUC style that
-- current PostgREST/Supabase versions no longer populate (they expose a single
-- JSON GUC, request.jwt.claims, instead). That made the check never match
-- 'service_role' for any request — including the backend's own writes — so
-- payment_status/payment_provider/payment_reference silently reverted on every
-- update, even legitimate ones from the backend's service-role key.
--
-- Fix: use auth.role(), Supabase's own helper for this (it reads
-- request.jwt.claims correctly across versions), keeping current_user as a
-- fallback for direct Postgres connections that bypass PostgREST entirely.

create or replace function public.lock_order_payment_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not (
    current_user = 'service_role'
    or auth.role() = 'service_role'
  ) then
    new.payment_status := old.payment_status;
    new.payment_provider := old.payment_provider;
    new.payment_reference := old.payment_reference;
  end if;
  return new;
end;
$$;
