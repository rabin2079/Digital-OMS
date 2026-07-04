-- ============================================================
-- IDP Guide & Assistance by Digital Solution
-- Supabase schema — run in the SQL editor of your project.
-- All access goes through the Next.js server using the
-- service-role key, so RLS denies everything to anon users.
-- ============================================================

-- Sequential counter used to build request IDs like DS-IDP-2026-00001
create sequence if not exists request_id_seq;

create or replace function next_request_id()
returns text
language sql
volatile
as $$
  select 'DS-IDP-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('request_id_seq')::text, 5, '0');
$$;

-- ── requests ────────────────────────────────────────────────
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  request_id text unique not null,
  full_name text not null,
  email text not null,
  whatsapp_number text not null,
  destination_country text not null,
  has_valid_license text not null,
  license_issue_country text,
  preferred_idp_type text not null,
  validity_preference text not null,
  delivery_preference text not null,
  message text,
  consent_accepted boolean not null default false,
  status text not null default 'New Request',
  payment_status text not null default 'Not Required Yet',
  payment_method text,
  transaction_id text,
  admin_note text,
  user_visible_message text,
  document_download_url text,
  document_file_url text,
  is_download_available boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists requests_status_idx on requests (status);
create index if not exists requests_created_at_idx on requests (created_at desc);
create index if not exists requests_email_idx on requests (lower(email));
create index if not exists requests_whatsapp_idx on requests (whatsapp_number);

-- ── uploaded_files ──────────────────────────────────────────
create table if not exists uploaded_files (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests (id) on delete cascade,
  file_type text not null, -- 'license_photo' | 'payment_receipt' | 'document'
  file_url text not null,  -- storage object path (private bucket)
  file_name text not null,
  file_size bigint not null,
  mime_type text not null,
  uploaded_at timestamptz not null default now()
);

create index if not exists uploaded_files_request_idx on uploaded_files (request_id);

-- ── status_history ──────────────────────────────────────────
create table if not exists status_history (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests (id) on delete cascade,
  old_status text,
  new_status text not null,
  changed_by text not null default 'system',
  note text,
  created_at timestamptz not null default now()
);

create index if not exists status_history_request_idx on status_history (request_id);

-- ── admin_users ─────────────────────────────────────────────
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  must_change_password boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- keep updated_at fresh
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists requests_set_updated_at on requests;
create trigger requests_set_updated_at
  before update on requests
  for each row execute function set_updated_at();

drop trigger if exists admin_users_set_updated_at on admin_users;
create trigger admin_users_set_updated_at
  before update on admin_users
  for each row execute function set_updated_at();

-- ── Row Level Security ──────────────────────────────────────
-- Enable RLS with no policies: anon/authenticated clients get
-- nothing; the server's service-role key bypasses RLS.
alter table requests enable row level security;
alter table uploaded_files enable row level security;
alter table status_history enable row level security;
alter table admin_users enable row level security;

-- ── Storage ─────────────────────────────────────────────────
-- Create a PRIVATE bucket named "uploads" (Dashboard → Storage → New bucket,
-- keep "Public bucket" OFF). Files are served only via short-lived signed
-- URLs generated on the server.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;
