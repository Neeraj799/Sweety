import fs from 'node:fs';
import pg from 'pg';

// DATE columns stay 'YYYY-MM-DD' strings; pg's default JS Date shifts the day across timezones
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value);

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
    console.error('Idle database connection lost:', err.message);
});

export const initDb = async () => {
    const schema = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
    await pool.query(schema);
};
