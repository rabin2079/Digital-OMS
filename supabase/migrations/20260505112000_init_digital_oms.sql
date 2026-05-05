create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  email text,
  phone text,
  role text not null check (role in ('admin','staff')),
  status text not null default 'active' check (status in ('active','inactive')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp_number text not null,
  alternative_number text,
  email text,
  country text,
  address text,
  customer_type text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_customers_whatsapp on public.customers(whatsapp_number);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(), service_name text not null, category text, description text,
  default_price numeric, required_documents jsonb, internal_instruction text, public_instruction text,
  estimated_days integer, status text not null default 'active' check (status in ('active','inactive')),
  created_by uuid references public.profiles(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), order_code text unique not null, customer_id uuid not null references public.customers(id),
  service_id uuid references public.services(id), service_name_snapshot text not null, nepali_year integer not null, nepali_month integer not null,
  monthly_sequence integer not null, final_price numeric not null default 0, discount numeric not null default 0, extra_charge numeric not null default 0,
  total_amount numeric not null default 0, paid_amount numeric not null default 0, remaining_amount numeric not null default 0,
  order_status text not null, payment_status text not null, priority text check (priority in ('Normal','Urgent','Very Urgent')),
  source text, assigned_to uuid references public.profiles(id), deadline_date date, public_note text, internal_note text,
  tracking_token text unique not null, created_by uuid references public.profiles(id), deleted_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (nepali_year, nepali_month, monthly_sequence)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), amount_received numeric not null,
  payment_method text not null, transaction_id text, payment_date date not null, screenshot_url text,
  received_by uuid references public.profiles(id), note text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), payment_id uuid references public.payments(id),
  receipt_number text unique not null, receipt_type text not null default 'Payment Received Slip', pdf_url text,
  generated_by uuid references public.profiles(id), created_at timestamptz not null default now()
);

create table if not exists public.order_files (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), file_name text not null,
  file_url text not null, file_type text, visibility text not null check (visibility in ('internal','public')),
  uploaded_by uuid references public.profiles(id), created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.profiles(id), action_type text not null,
  module text not null, record_id uuid, old_value jsonb, new_value jsonb, description text not null, created_at timestamptz not null default now()
);

create table if not exists public.feature_settings (
  id uuid primary key default gen_random_uuid(), feature_key text unique not null, feature_name text not null,
  is_enabled boolean not null default true, updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);

create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(), setting_key text unique not null, setting_value jsonb,
  updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.receipts enable row level security;
alter table public.order_files enable row level security;
alter table public.activity_logs enable row level security;
alter table public.feature_settings enable row level security;
alter table public.system_settings enable row level security;

create policy "authenticated read" on public.customers for select using (auth.role() = 'authenticated');
create policy "authenticated write" on public.customers for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create or replace function public.recalculate_order_payment_totals(p_order_id uuid)
returns void language plpgsql security definer as $$
declare v_total_paid numeric;
declare v_total_amount numeric;
begin
  select coalesce(sum(amount_received),0) into v_total_paid from public.payments where order_id = p_order_id;
  select total_amount into v_total_amount from public.orders where id = p_order_id;
  update public.orders
    set paid_amount = v_total_paid,
        remaining_amount = greatest(v_total_amount - v_total_paid, 0),
        payment_status = case when v_total_paid <= 0 then 'Unpaid' when v_total_paid < v_total_amount then 'Partially Paid' else 'Fully Paid' end,
        updated_at = now()
  where id = p_order_id;
end;
$$;
