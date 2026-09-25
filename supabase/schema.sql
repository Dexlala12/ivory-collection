-- IVORY — Supabase schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query → paste → Run).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / DROP ... IF EXISTS.

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ============================================================================
-- TABLES
-- ============================================================================

-- Staff accounts. One row per auth.users row (created automatically by the
-- handle_new_user trigger below). role controls what the admin portal shows.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  sort_order int not null default 0
);

create table if not exists public.activities (
  id text primary key,
  name text not null,
  sort_order int not null default 0
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(10, 2) not null default 0,
  description text not null default '',
  images text[] not null default '{}',
  category text not null references public.categories(id) on update cascade,
  activities text[] not null default '{}',
  sizes text[] not null default '{}',
  colors jsonb not null default '[]',       -- [{ name, hex }]
  rating numeric(2, 1) not null default 5,
  in_stock boolean not null default true,
  highlights text[] not null default '{}',
  specs jsonb not null default '{}',        -- { material, fit, care }
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_tiles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  image text not null default '',
  link text not null default '',
  type text not null default 'category' check (type in ('category', 'activity')),
  sort_order int not null default 0
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0
);

-- About / Terms / Privacy static page copy.
-- `title`/`subtitle` are the page banner text; `heading` is the content-area
-- section heading (Terms/Privacy only). `sections` is an ordered array of
-- { heading?: string, paragraphs: string[] }. `images` (About page only) is
-- an ordered array of { url: string, caption: string }.
create table if not exists public.pages (
  slug text primary key check (slug in ('about', 'terms', 'privacy')),
  title text not null default '',
  subtitle text not null default '',
  heading text not null default '',
  sections jsonb not null default '[]',
  images jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- Header / footer / home-hero copy. One row per section, keyed by `key`.
-- header  -> { announcement, navLabels: { home, shop, concept, contact }, megaMenu: { tag, heading, image } }
-- footer  -> { tagline, copyright }
-- home_hero -> { eyebrow, heading, subheading }
create table if not exists public.site_content (
  key text primary key check (key in ('header', 'footer', 'home_hero')),
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Single-row store configuration.
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  whatsapp_number text not null default '',
  bank_name text not null default '',
  bank_account_name text not null default '',
  bank_account_number text not null default '',
  bank_branch text not null default '',
  bank_swift_code text not null default '',
  free_shipping_threshold numeric(10, 2) not null default 150,
  standard_shipping_cost numeric(10, 2) not null default 15,
  express_shipping_cost numeric(10, 2) not null default 25,
  tax_rate numeric(5, 4) not null default 0.08
);

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  rate numeric(5, 4) not null,
  active boolean not null default true
);

-- Checkout inquiries land here (see src/pages/Checkout.tsx sendWhatsAppInquiry()).
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  items jsonb not null,
  customer_info jsonb not null,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null,
  tax numeric(10, 2) not null,
  total numeric(10, 2) not null,
  payment_method text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'success', 'failed')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- NEW-USER TRIGGER — auto-create a profiles row for every Supabase auth user.
-- New staff default to 'editor'; promote the first account to 'admin' manually
-- (see supabase/README.md).
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- HELPER — is_admin(), used by profiles/staff RLS policies.
-- SECURITY DEFINER so it can read public.profiles without recursing through
-- the very policy it's used in.
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- Public storefront (anon key, signed out) may only READ content tables and
-- INSERT orders. Any signed-in staff account (authenticated) may read/write
-- all content. Only admins may read/write profiles (Staff screen).
-- ============================================================================

alter table public.categories enable row level security;
alter table public.activities enable row level security;
alter table public.products enable row level security;
alter table public.promo_tiles enable row level security;
alter table public.faqs enable row level security;
alter table public.pages enable row level security;
alter table public.site_content enable row level security;
alter table public.settings enable row level security;
alter table public.promo_codes enable row level security;
alter table public.orders enable row level security;
alter table public.profiles enable row level security;

-- Public read on all storefront content tables.
do $$
declare
  t text;
begin
  foreach t in array array['categories', 'activities', 'products', 'promo_tiles', 'faqs', 'pages', 'site_content', 'settings', 'promo_codes']
  loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);

    execute format('drop policy if exists "staff write" on public.%I', t);
    execute format(
      'create policy "staff write" on public.%I for all using (auth.uid() is not null) with check (auth.uid() is not null)',
      t
    );
  end loop;
end $$;

-- Orders: anyone (including anonymous shoppers) can create an inquiry;
-- only signed-in staff can read or manage the list.
drop policy if exists "anyone can create an order" on public.orders;
create policy "anyone can create an order" on public.orders
  for insert with check (true);

drop policy if exists "staff read orders" on public.orders;
create policy "staff read orders" on public.orders
  for select using (auth.uid() is not null);

drop policy if exists "staff update orders" on public.orders;
create policy "staff update orders" on public.orders
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

-- Profiles: everyone can see their own row (so the portal knows its own
-- role); only admins can see or edit the full staff list.
drop policy if exists "self or admin read" on public.profiles;
create policy "self or admin read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "admin manage roles" on public.profiles;
create policy "admin manage roles" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin delete staff" on public.profiles;
create policy "admin delete staff" on public.profiles
  for delete using (public.is_admin());

-- ============================================================================
-- STORAGE — public-read "media" bucket for product / site images uploaded
-- from the admin portal.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media staff upload" on storage.objects;
create policy "media staff upload" on storage.objects
  for insert with check (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media staff manage" on storage.objects;
create policy "media staff manage" on storage.objects
  for all using (bucket_id = 'media' and auth.uid() is not null)
  with check (bucket_id = 'media' and auth.uid() is not null);
