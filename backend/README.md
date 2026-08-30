# LuxeLife Backend

Express API backed by [Supabase](https://supabase.com) (Postgres).

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a project.
2. Open **SQL Editor** and run the migration in `../supabase/migrations/20260830100000_init_luxelife.sql`.

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in from **Project Settings → API**:

| Variable | Where to find it |
|----------|------------------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (server only — never expose to the browser) |

### 3. Install and run

```bash
npm install
npm run dev
```

The API starts on `http://localhost:3001`. On first run it seeds 7 products if the table is empty.

Upload product images to Supabase Storage (after configuring `.env`):

```bash
npm run migrate-images
```

Images are stored in the public `product-images` bucket. Admin uploads go through `POST /api/admin/upload`.

To seed manually:

```bash
npm run seed
```

## Admin login

Default credentials (override via `.env`):

- **ID:** `admin`
- **Password:** `admin`

## API routes

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/products` | Public |
| GET | `/api/products/:slug` | Public |
| POST | `/api/orders` | Public |
| POST | `/api/admin/login` | Public |
| GET | `/api/admin/stats` | Admin |
| CRUD | `/api/admin/products` | Admin |
| GET/PATCH | `/api/admin/orders` | Admin |

## Deploy

Host this API separately (Railway, Render, Fly.io, etc.) and set the same env vars. Point the frontend's `VITE_API_URL` at your deployed API base URL (without `/api`).
