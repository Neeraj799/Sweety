# Sweety – Blood Glucose Tracker

A web app where a diabetes patient records up to 4 blood glucose readings a day and views reports.

## Features

- Register and log in (passwords hashed with bcrypt, JWT auth)
- Each user sees only their own readings
- Add, view, edit and delete readings (date, time slot, value in mg/dl)
- Dashboard with pagination
- Reports for a selected date: **Daily**, **Month-to-date** and **Monthly** (previous month), each with highest, lowest, average and count
- Validation on both the frontend and the backend:
    - value is a whole number between 40 and 600 mg/dl
    - one reading per time slot per day, at most 4 readings per day
    - date cannot be in the future

## Tech stack

| Part     | Tech                                                                 |
| -------- | -------------------------------------------------------------------- |
| Backend  | Node.js 24, Express 5, PostgreSQL (`pg`, no ORM), bcrypt, JWT, Zod    |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7, axios, Zod, react-toastify |

## Getting started

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
| `JWT_SECRET`   | any long random string                          |
| `PORT`         | `4800`                                          |

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

## API

All `/readings` and `/reports` routes need an `Authorization: Bearer <token>` header.

| Method | Route                       | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/auth/register`            | Create an account                    |
| POST   | `/auth/login`               | Log in, returns a token              |
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
  middleware/    requireAuth (JWT check)
  utils/         dates and tokens
  schema.sql     database tables
  seed.js        demo data

frontend/src/
  pages/         Login, Register, Dashboard, Add/Edit reading, Reports
  components/    Navbar, forms, ReadingList, ReportCard, route guards
  context/       auth state (token + user)
  services/      axios instance (adds the token, handles expired logins)
  validators/    the same Zod rules as the backend
```
