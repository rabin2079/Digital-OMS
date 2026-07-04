# IDP Guide & Assistance by Digital Solution

A minimal, SEO-friendly education and assistance web app for International Driving
Permit (IDP) inquiries, built for **idp.digitalsolutionnepal.com**.

> **Positioning:** Digital Solution does **not** directly issue official International
> Driving Permits. This platform provides education, guidance, documentation support
> and application assistance. Final approval, document type, validity, delivery time
> and acceptance depend on the relevant issuing/processing body and destination-country
> rules.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** — white background, blue/dark-gray text, light-blue accent
- **Supabase** — Postgres database + private file storage
- **Custom admin auth** — bcrypt password hashing + signed JWT session cookie (`jose`)

## Features

- Public pages: Home, How It Works, IDP Guide, Required Documents, Packages, FAQ,
  Track Request, Contact, Privacy Policy, Terms, Disclaimer, Refund & Service Policy
- Simple lead form (`/apply`) with license photo upload (JPG/PNG/PDF, max 10MB),
  optional payment-receipt upload, honeypot spam protection and per-IP rate limiting
- Request IDs in the `DS-IDP-2026-00001` format (Postgres sequence)
- Public tracking (`/track`) via Request ID + WhatsApp number or email
- Dynamic WhatsApp CTAs with prefilled request context
- Admin dashboard (`/admin`): stats cards, searchable/filterable table, request
  detail with status + payment updates, internal notes, user-visible messages,
  document upload / external download link with availability toggle, status
  history, CSV export, delete with confirmation, change password, logout
- Forced password change after first login with a temporary password
- Files stored in a **private** bucket; served only through short-lived signed URLs,
  and the user's document link is visible only when admin marks it available
- SEO: metadata, keywords, OpenGraph, FAQ JSON-LD, `sitemap.xml`, `robots.txt`

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
   This creates the tables, the `next_request_id()` function and the private
   `uploads` storage bucket.

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server-only) |
| `AUTH_SECRET` | Long random string for signing admin session cookies |
| `ADMIN_EMAIL` | Initial admin email (seed script only) |
| `ADMIN_INITIAL_PASSWORD` | Temporary admin password (seed script only) |
| `NEXT_PUBLIC_SITE_URL` | `https://idp.digitalsolutionnepal.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number, international format without `+` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Support email shown on the site |

### 3. Seed the admin account

```bash
npm install
npm run seed:admin
```

The admin is created with `must_change_password = true`, so the first login at
`/admin/login` forces a password change. No password is ever hard-coded in the
frontend. Re-running the script resets the password (useful for recovery).

### 4. Run

```bash
npm run dev    # http://localhost:3000
npm run build  # production build
npm start
```

## Deployment (Vercel + idp.digitalsolutionnepal.com)

1. Import the repo into Vercel and set all environment variables from `.env.example`
   (use a strong `AUTH_SECRET`, never commit `.env.local`).
2. Add the custom domain `idp.digitalsolutionnepal.com` in Vercel and point a CNAME
   record at `cname.vercel-dns.com`.
3. Run `npm run seed:admin` once locally (with production env vars) to create the
   admin user, then log in and change the password.

> Rate limiting is in-memory per instance — good enough for this MVP. If you scale
> to multiple instances, switch `src/lib/rate-limit.ts` to a shared store (e.g.
> Upstash Redis).

## Project structure

```
supabase/schema.sql        # Database schema + storage bucket
scripts/seed-admin.mjs     # Secure admin seed/reset script
src/middleware.ts          # Admin route protection (JWT cookie)
src/lib/                   # Supabase client, auth, validation, rate limiting
src/components/            # Header, Footer, WhatsApp CTA, FAQ accordion, etc.
src/content/faq.ts         # FAQ content (shared by FAQ page + homepage)
src/app/                   # Public pages, legal pages, admin pages, API routes
```
