# Black Mafia Photography — Photography Platform

Three apps share one backend API and database:

| App | Folder | Local URL | Production example |
|-----|--------|-----------|-------------------|
| Customer website | `frontend/` | http://localhost:3000 | https://blackmafiaphotography-17yndgh8x-sir-nic.vercel.app |
| Admin dashboard | `admin-dashboard/` | http://localhost:3001 | https://blackmafiaphotography-bm5g.vercel.app |
| Backend API | `backend/` | http://localhost:5000 | https://blackmafiaphotography.onrender.com |

## Environment variables

Copy each app’s `.env.example` to `.env.local` (frontend/admin) or `.env` (backend).

**All three apps must use the same `NEXT_PUBLIC_API_URL` / `PUBLIC_API_URL` pointing at the backend.**

### Backend (`backend/.env`)
```
DATABASE_URL=...
DIRECT_URL=...
PUBLIC_API_URL=https://blackmafiaphotography.onrender.com
FRONTEND_URL=https://blackmafiaphotography.vercel.app
ADMIN_URL=https://blackmafiaphotography-bm5g.vercel.app
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=https://blackmafiaphotography.onrender.com
NEXT_PUBLIC_SITE_URL=https://blackmafiaphotography-17yndgh8x-sir-nic.vercel.app
```

### Admin (`admin-dashboard/.env.local`)
```
NEXT_PUBLIC_API_URL=https://blackmafiaphotography.onrender.com
NEXT_PUBLIC_ADMIN_URL=https://blackmafiaphotography-bm5g.vercel.app
```

## Local development

```bash
# Terminal 1 — backend
cd backend
npm install
npx prisma migrate deploy --schema=src/prisma/schema.prisma
npx prisma db seed
npm run dev

# Terminal 2 — customer website
cd frontend
npm install
npm run dev

# Terminal 3 — admin dashboard
cd admin-dashboard
npm install
npm run dev
```

Admin login (after seed): `admin@lumenstudio.com` / `admin123`

## Production deployment

The backend `start` script runs `prisma migrate deploy` before starting Express.
On Render, use the repository's backend start command (`npm start`) rather than
overriding it with `node dist/server.js`. This applies the `PortfolioItem`
migration to the production database, which is required by `GET /api/portfolio`.

Replace example URLs in each environment:

| Variable | Example production value |
|----------|-------------------------|
| `PUBLIC_API_URL` | `https://blackmafiaphotography.onrender.com` |
| `NEXT_PUBLIC_API_URL` (frontend + admin) | `https://blackmafiaphotography.onrender.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://blackmafiaphotography.vercel.app` |
| `FRONTEND_URL` | `https://blackmafiaphotography.vercel.app` |
| `NEXT_PUBLIC_ADMIN_URL` | `https://blackmafiaphotography-bm5g.vercel.app` |
| `ADMIN_URL` | `https://blackmafiaphotography-bm5g.vercel.app` |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Set as secret environment variables in Render; never commit them. |

Changes made in the admin dashboard (bookings, availability, services, portfolio, testimonials, website settings) appear on the customer website immediately because both use the same backend API.
