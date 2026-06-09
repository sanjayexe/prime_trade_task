## Prime Trade — simple task API (MERN)

This repository is a small, practical starter: an Express + MongoDB backend and a Vite + React frontend you can run locally to try authentication and simple task CRUD.

Key points

- Backend: Node + Express + Mongoose
- Auth: bcrypt password hashing and JWT stored in an httpOnly cookie
- Frontend: Vite + React (JSX)
- Docs: built-in Swagger UI and a Postman collection for quick testing

This version is intentionally simple — minimal validation, straightforward controllers, and task ownership checks (users can only modify their own tasks).

Quick start (recommended)

1. Install root dependencies (uses npm workspaces):

```powershell
npm install
```

2. Install server dependencies and seed the DB (MongoDB must be running locally):

```powershell
npm --workspace=server install
npm --workspace=server run db:seed
```

3. Start both apps (server + client):

```powershell
npm run dev
```

Or run them separately:

```powershell
# start server
npm --workspace=server run dev

# start client
npm --workspace=client run dev
```

Environment

- Copy examples if present and edit values for your machine:

```powershell
copy server\\.env.example server\\.env
copy client\\.env.example client\\.env
```

- The server expects `MONGO_URI` and `JWT_SECRET` in `server/.env`.

Useful URLs

- API base: http://localhost:4000/api/v1
- Swagger UI: http://localhost:4000/api/docs
- Frontend: http://localhost:5173

Testing and seed account

- A seed script creates a default admin account to help with testing if you run `npm --workspace=server run db:seed`.
- Seed credentials (if used):
  - Email: admin@primetrade.local
  - Password: Admin123!

Notes

- This repo is meant as a lightweight demo — validation and RBAC are intentionally kept simple.
- If you want stricter validation, role-based overrides, or more production-ready security, I can add them back in.

If you'd like, I can also simplify the frontend to match this pared-down backend or wire up a README section with example API calls. Which would you prefer next?

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
copy server\\.env.example server\\.env
copy client\\.env.example client\\.env
```

3. Start MongoDB and make sure `server/.env` points to it.

4. Seed the database:

```bash
npm run db:seed
```

5. Run both apps:

```bash
npm run dev
```

## URLs

- API: `http://localhost:4000/api/v1`
- Swagger: `http://localhost:4000/api/docs`
- Frontend: `http://localhost:5173`

## Postman collection

A Postman collection is available at [docs/postman.collection.json](docs/postman.collection.json).

## Default admin seed

The seed script creates an admin account so role-based access can be tested quickly.

- Email: `admin@primetrade.local`
- Password: `Admin123!`

## Scalability note

The project is structured around isolated modules and thin route handlers, which makes it easy to split into services later. Common scale-up paths include Redis caching for read-heavy endpoints, background jobs for async work, and horizontal scaling behind a load balancer with stateless JWT verification.
