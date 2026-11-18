import bcrypt from 'bcrypt';
import { SLOTS } from './constants/slots.js';
import { initDb, pool } from './db.js';
import { createUser, findUserByEmail } from './models/userModel.js';
import { getToday } from './utils/date.js';

const DEMO_EMAIL = 'demo@sweety.com';
const DEMO_PASSWORD = 'secret123';
const DAYS = 60;

const RANGES = {
    morning_fasting: [80, 130],
    after_breakfast: [120, 200],
    after_lunch: [120, 220],
    after_dinner: [110, 210],
};

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const daysAgo = (today, days) => {
    const [year, month, day] = today.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day - days)).toISOString().slice(0, 10);
};

const seed = async () => {
    await initDb();

    let user = await findUserByEmail(DEMO_EMAIL);
    if (!user) {
        const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
        user = await createUser('Demo User', DEMO_EMAIL, passwordHash);
    }

    await pool.query('DELETE FROM readings WHERE user_id = $1', [user.id]);

    const dates = [];
    const slots = [];
    const values = [];
    const today = getToday();

    for (let i = 0; i < DAYS; i++) {
        const date = daysAgo(today, i);
        const count = randomBetween(2, 4);
        for (const slot of SLOTS.slice(0, count)) {
            const [min, max] = RANGES[slot];
            dates.push(date);
            slots.push(slot);
            values.push(randomBetween(min, max));
        }
    }

    await pool.query(
        `INSERT INTO readings (user_id, reading_date, slot, value)
         SELECT $1, * FROM unnest($2::date[], $3::text[], $4::int[])`,
        [user.id, dates, slots, values]
    );

    console.log(`Seeded ${values.length} readings over ${DAYS} days for ${DEMO_EMAIL}`);
    console.log(`Log in with: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    await pool.end();
};

seed().catch(async (error) => {
    console.error('Seeding failed:', error);
    await pool.end();
    process.exit(1);
});
