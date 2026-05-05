# Digital OMS

Production-ready starter architecture for **Digital Solution Pvt. Ltd. (Nepal)** to manage documentation service orders, payments, receipts, tracking pages, and office workflows.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + Storage
- React Hook Form + Zod
- Activity log + RBAC oriented data model

## Quick start
1. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_COMPANY_NAME`

## Hostinger / Docker Deployment Fix
If your Hostinger build logs show `No Docker compose files found`, this repo now includes:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

### Deploy steps
1. Add runtime secrets in `.env` on server (or platform env panel).
2. Build and run:
   ```bash
   docker compose up -d --build
   ```
3. Verify:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

## Delivered in this implementation
- Initial Next.js app shell with:
  - Auth login placeholder route
  - Dashboard route with responsive shell
  - Public tracking route scaffold
- Utility for OMS order and receipt code generation:
  - `DSYM-SEQ`
  - `RCPT-DS-Y-M-SEQ`
- Supabase migration with:
  - Core tables requested for v1
  - Base indexes and unique constraints
  - RLS enabled
  - Payment total recalculation stored function
- Docker deployment files for Hostinger-compatible compose detection

## Next milestone implementation order
1. Auth wiring and role guards
2. Shared UI components (shadcn)
3. CRUD modules: customers/services/orders/payments
4. Receipt PDF rendering + storage
5. Order files + public tracking resource policies
6. Activity timeline + reports + CSV export
7. Production deployment hardening

## Notes
- This repository currently contains scaffolded code and migration SQL; run migrations in Supabase before feature development.
- When implementing server actions, always log sensitive changes into `activity_logs`.
