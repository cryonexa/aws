Simple Chat (WhatsApp-style)

Minimal full-stack chat app with:
- Backend: Node.js + Express + Socket.IO
- Frontend: React (Vite)
- Database: PostgreSQL
- Docker Compose for local dev

## Features
- See online users and start a chat
- Real-time messaging via websockets
- Message history stored in Postgres

## Quick start (Docker)
```bash
docker compose up --build
```

Open `http://localhost:5173`.

## Local dev (no Docker)

Backend:
```bash
cd backend
npm install
PGHOST=localhost PGUSER=postgres PGPASSWORD=postgres PGDATABASE=chatapp PGPORT=5432 node src/index.js
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Environment

Backend (`backend/src/index.js`):
- `PGHOST` (default `db`)
- `PGUSER` (default `postgres`)
- `PGPASSWORD` (default `postgres`)
- `PGDATABASE` (default `chatapp`)
- `PGPORT` (default `5432`)
- `PORT` (default `3000`)

Frontend:
- `VITE_API_URL` (default `http://localhost:3000`)