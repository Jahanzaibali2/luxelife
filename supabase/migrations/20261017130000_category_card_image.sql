-- Portrait image for category tiles (home, menu, collections). hero_image stays wide for banners.
alter table public.categories add column if not exists card_image text;
