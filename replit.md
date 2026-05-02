# Điện Lạnh Store — Workspace

## Overview

pnpm workspace monorepo using TypeScript. Vietnamese e-commerce website selling air conditioners and washing machines.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (`artifacts/dien-lanh-store`)
- **Backend**: Express 5 (`artifacts/api-server`)
- **Database**: PostgreSQL + Drizzle ORM (`lib/db`)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec`)
- **Session store**: connect-pg-simple (PostgreSQL-backed, serverless-safe)
- **Build**: esbuild

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Features

- Product catalog: 12 products (6 điều hòa, 6 máy giặt), 2 categories
- Shopping cart (session-based, no login required)
- Checkout flow
- Warranty check (`/warranty`)
- Admin dashboard (`/admin`):
  - Thống Kê tab: revenue charts (Recharts), orders by status donut chart, KPI cards
  - Đơn Hàng tab: order management with status updates
  - Sản Phẩm tab: product CRUD
  - Bảo Hành tab: warranty record management
- Auth: express-session + bcryptjs, sessions stored in PostgreSQL

## Admin Access

- URL: `/admin`
- Username: `admin`
- Password: `admin123`

## Database Tables

- `users` — admin accounts
- `categories` — product categories
- `products` — product catalog
- `orders` + `order_items` — customer orders
- `cart` + `cart_items` — shopping cart
- `warranties` — warranty records
- `session` — express-session store (connect-pg-simple)

## Vercel Deployment

See `DEPLOY.md` for full step-by-step deployment guide.

- `vercel.json` — deployment config at repo root
- `api/index.ts` — Express app wrapped as Vercel serverless function
- Build command: `pnpm install --frozen-lockfile && BASE_PATH=/ pnpm --filter @workspace/dien-lanh-store run build`
- Output: `artifacts/dien-lanh-store/dist/public`
- Required env vars: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`, `ALLOWED_ORIGINS`

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — session signing secret
- `ALLOWED_ORIGINS` — comma-separated list of allowed CORS origins (for production)
- `NODE_ENV` — `development` or `production`
