# TinyLink - Node + Express

Minimal URL shortener project.

## Setup
1. Copy `.env.example` to `.env` and fill `DATABASE_URL`.
2. Run SQL in `sql/init.sql` to create tables.
3. `npm install`
4. `npm run dev` (requires nodemon) or `npm start`

## Endpoints
- POST /api/shorten { destination, custom, title, owner_email }
- GET /api/links
- GET /api/stats/:code
- GET /:code -> redirect

## Deploy
Use Neon for Postgres, and Render/Vercel for hosting. Set `DATABASE_URL` in environment.
