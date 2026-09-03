# Lumen Studio — Photography Platform

Three apps share one backend API and database:

| App | Folder | Local URL | Production example |
|-----|--------|-----------|-------------------|
| Customer website | `frontend/` | http://localhost:3000 | https://www.example-lumenstudio.com |
| Admin dashboard | `admin-dashboard/` | http://localhost:3001 | https://admin.example-lumenstudio.com |
| Backend API | `backend/` | http://localhost:5000 | https://api.example-lumenstudio.com |

## Environment variables

Copy each app’s `.env.example` to `.env.local` (frontend/admin) or `.env` (backend).

**All three apps must use the same `NEXT_PUBLIC_API_URL` / `PUBLIC_API_URL` pointing at the backend.**

### Backend (`backend/.env`)
```
DATABASE_URL=...
PUBLIC_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Admin (`admin-dashboard/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
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

Replace example URLs in each environment:

| Variable | Example production value |
|----------|-------------------------|
| `PUBLIC_API_URL` | `https://api.example-lumenstudio.com` |
| `NEXT_PUBLIC_API_URL` (frontend + admin) | `https://api.example-lumenstudio.com` |
| `FRONTEND_URL` | `https://www.example-lumenstudio.com` |
| `ADMIN_URL` | `https://admin.example-lumenstudio.com` |

Changes made in the admin dashboard (bookings, availability, services, portfolio, testimonials, website settings) appear on the customer website immediately because both use the same backend API.
