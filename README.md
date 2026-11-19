# Sweety – Blood Glucose Tracker

A web app where a diabetes patient records up to 4 blood glucose readings a day and views reports.

## Features

- Register and log in (passwords hashed with bcrypt)
- JWT access token (15 minutes) and refresh token (7 days), both in httpOnly cookies; the frontend refreshes the access token automatically
- Each user sees only their own readings
- Add, view, edit and delete readings (date, time slot, value in mg/dl)
- Dashboard with pagination
- Reports for a selected date: **Daily**, **Month-to-date** and **Monthly** (previous month), each with highest, lowest, average and count
- Line chart (Recharts) of the daily average for the month
- Frontend tests for the reading form (Vitest + React Testing Library)
- Validation on both the frontend and the backend:
    - value is a whole number between 40 and 600 mg/dl
    - one reading per time slot per day, at most 4 readings per day
    - date cannot be in the future

## Tech stack

| Part     | Tech                                                                 |
| -------- | -------------------------------------------------------------------- |
| Backend  | Node.js 24, Express 5, PostgreSQL (`pg`, no ORM), bcrypt, JWT, cookie-parser, Zod |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, axios, Zod, react-toastify, Recharts |
| Tests    | Vitest, React Testing Library, jsdom                                 |
| Docker   | Docker Compose with PostgreSQL 17, the backend, and nginx serving the frontend |

## Run with Docker (quickest)

You only need [Docker Desktop](https://www.docker.com/products/docker-desktop/). No Node.js or database setup needed.

```bash
docker compose up -d --build
docker compose exec backend npm run seed
```

Open http://localhost:5173 and log in with `demo@sweety.com` / `secret123`.

Docker uses ports 5173 and 4800, so stop any `npm run dev` servers first.

| Command                     | What it does                          |
| --------------------------- | ------------------------------------- |
| `docker compose logs backend` | Show the backend's output           |
| `docker compose down`       | Stop everything (data is kept)        |
| `docker compose down -v`    | Stop everything and delete the database |

## Run without Docker

### Requirements

- Node.js 24 or newer
- A PostgreSQL database (local, or a free one from [Neon](https://neon.tech))

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:

| Variable       | Example                                         |
| -------------- | ----------------------------------------------- |
| `DATABASE_URL` | `postgresql://user:password@host:5432/sweety`   |
| `JWT_SECRET`   | any long random string (signs access tokens)    |
| `JWT_REFRESH_SECRET` | a different long random string (signs refresh tokens) |
| `PORT`         | `4800`                                          |

To make a random string: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

```bash
npm run dev
```

The API runs on http://localhost:4800. The tables are created automatically on startup (`schema.sql`).

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on http://localhost:5173.

### 3. Demo data (optional)

```bash
cd backend
npm run seed
```

This creates a demo user with readings for the last 60 days:

- Email: `demo@sweety.com`
- Password: `secret123`

## Tests

```bash
cd frontend
npm test
```

The tests are in `frontend/src/components/ReadingForm.test.jsx`. They run in a fake browser (jsdom) and use a fake API, so the backend does not need to be running. They check that the reading form:

- starts empty for a new reading and pre-filled when editing
- shows the right error for an empty value, a value outside 40–600, a decimal value, and a future date
- sends the right data (`POST /readings` to add, `PUT /readings/:id` to edit)
- shows the server's error message when saving fails
- calls Cancel when the Cancel button is clicked

## API

Login and register set two httpOnly cookies: `accessToken` (15 minutes, sent to every route) and `refreshToken` (7 days, sent only to `/auth`). All `/readings` and `/reports` routes need the `accessToken` cookie.

| Method | Route                       | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/auth/register`            | Create an account, sets the cookies  |
| POST   | `/auth/login`               | Log in, sets the cookies             |
| POST   | `/auth/refresh`             | New access and refresh cookies from the refresh cookie |
| POST   | `/auth/logout`              | Clear both cookies                   |
| GET    | `/readings?page=1&limit=10` | List readings (newest first)         |
| GET    | `/readings/:id`             | Get one reading                      |
| POST   | `/readings`                 | Add a reading                        |
| PUT    | `/readings/:id`             | Edit a reading                       |
| DELETE | `/readings/:id`             | Delete a reading                     |
| GET    | `/reports?date=2026-10-15`  | Daily, month-to-date and monthly reports (date defaults to today) |

## Project structure

```
backend/
  routes/        URL → controller
  controllers/   request handling and business rules
  models/        SQL queries
  validators/    Zod schemas
  middleware/    requireAuth (checks the accessToken cookie)
  utils/         dates, tokens and auth cookies
  schema.sql     database tables
  seed.js        demo data
  Dockerfile

frontend/src/
  pages/         Login, Register, Dashboard, Add/Edit reading, Reports
  components/    Navbar, forms, ReadingList, ReportCard, route guards, ReadingForm tests
  context/       auth state (the logged-in user)
  services/      axios instance (sends cookies, refreshes the access token on 401)
  validators/    the same Zod rules as the backend
frontend/
  Dockerfile     builds the app, then serves it with nginx
  nginx.conf

docker-compose.yml   db + backend + frontend
```
