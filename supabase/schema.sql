create extension if not exists "pgcrypto";

create type public.product_type as enum (
  'roasted_bean_half_pound',
  'drip_bag'
);

create type public.order_status as enum (
  'new_order',
  'contacted',
  'pending_payment',
  'completed',
  'cancelled'
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  origin text,
  process text,
  roast_level text,
  flavor_notes text,
  bean_price integer not null default 0 check (bean_price >= 0),
  drip_price integer not null default 0 check (drip_price >= 0),
  image_url text,
  is_active boolean not null default true
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  note text,
  total_amount integer not null default 0 check (total_amount >= 0),
  order_status public.order_status not null default 'new_order',
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_type public.product_type not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  subtotal integer not null check (subtotal >= 0)
);

create index products_active_idx on public.products (is_active, name);
create index orders_created_at_idx on public.orders (created_at desc);
create index orders_status_idx on public.orders (order_status);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Public can read active products"
on public.products
for select
using (is_active = true);

create policy "Public can create orders"
on public.orders
for insert
with check (true);

create policy "Public can read orders"
on public.orders
for select
using (true);

create policy "Public can update order status"
on public.orders
for update
using (true)
with check (true);

create policy "Public can create order items"
on public.order_items
for insert
with check (true);

create policy "Public can read order items"
on public.order_items
for select
using (true);
