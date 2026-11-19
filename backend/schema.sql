CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS doctor_id INT REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS readings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reading_date DATE NOT NULL,
  slot TEXT NOT NULL CHECK (slot IN ('morning_fasting', 'after_breakfast', 'after_lunch', 'after_dinner')),
  value INT NOT NULL CHECK (value BETWEEN 40 AND 600),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, reading_date, slot)
);
