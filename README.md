# Digital OMS (MVP v1)

Simple internal order management system for Digital Solution Pvt. Ltd.

## Stack
- Next.js + TypeScript + Tailwind CSS
- Prisma ORM + SQLite
- Simple email/password auth (admin only)

## Features
- Admin login/logout and protected routes
- Dashboard summary cards
- Customer management (1:N customers to orders)
- Service management
- Order management with custom pricing and order code format `DS-YY-M-###`
- Payment management (partial payment supported)
- Local file uploads in `public/uploads`
- Order detail page with payments, due amount, files
- Search/filter in orders
- Admin settings for company and Nepali year/month code

## Setup
1. Install dependencies:
```bash
npm install
```
2. Copy env:
```bash
cp .env.example .env
```
3. Prisma generate + migrate:
```bash
npm run prisma:generate
npm run prisma:migrate
```
4. Seed first admin user:
```bash
npm run prisma:seed
```

Default admin:
- Email: `admin@digitalsolution.com.np`
- Password: `admin123`

⚠️ **Change this password immediately after first login.**

## Run
```bash
npm run dev
```

## Production build
```bash
npm run build
npm start
```

## VPS Deployment (Hostinger)
1. Install Node.js LTS and npm.
2. Upload project and run `npm install`.
3. Set `.env` values.
4. Run Prisma commands:
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
5. Build and start app:
   - `npm run build`
   - `npm start`
6. Use Nginx reverse proxy for port 3000 and run app with PM2/systemd.

## Notes
- Uploaded files are stored locally in `public/uploads` for MVP v1.
- Keep regular backups of SQLite DB file and uploads folder.
