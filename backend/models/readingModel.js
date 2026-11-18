import { SLOTS } from '../constants/slots.js';
import { pool } from '../db.js';

export const listReadingsPage = async (userId, limit, offset) => {
    const { rows } = await pool.query(
        `SELECT id, reading_date AS date, slot, value
         FROM readings
         WHERE user_id = $1
         ORDER BY reading_date DESC, array_position($2::text[], slot)
         LIMIT $3 OFFSET $4`,
        [userId, SLOTS, limit, offset]
    );
    return rows;
};

export const countReadings = async (userId) => {
    const { rows } = await pool.query(
        'SELECT COUNT(*)::int AS total FROM readings WHERE user_id = $1',
        [userId]
    );
    return rows[0].total;
};

export const findReadingById = async (userId, id) => {
    const { rows } = await pool.query(
        'SELECT id, reading_date AS date, slot, value FROM readings WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    return rows[0];
};

export const countReadingsOnDate = async (userId, date) => {
    const { rows } = await pool.query(
        'SELECT COUNT(*)::int AS count FROM readings WHERE user_id = $1 AND reading_date = $2',
        [userId, date]
    );
    return rows[0].count;
};

export const findReadingBySlot = async (userId, date, slot) => {
    const { rows } = await pool.query(
        'SELECT id FROM readings WHERE user_id = $1 AND reading_date = $2 AND slot = $3',
        [userId, date, slot]
    );
    return rows[0];
};

export const createReading = async (userId, date, slot, value) => {
    const { rows } = await pool.query(
        `INSERT INTO readings (user_id, reading_date, slot, value)
         VALUES ($1, $2, $3, $4)
         RETURNING id, reading_date AS date, slot, value`,
        [userId, date, slot, value]
    );
    return rows[0];
};

export const updateReading = async (userId, id, date, slot, value) => {
    const { rows } = await pool.query(
        `UPDATE readings
         SET reading_date = $1, slot = $2, value = $3, updated_at = now()
         WHERE id = $4 AND user_id = $5
         RETURNING id, reading_date AS date, slot, value`,
        [date, slot, value, id, userId]
    );
    return rows[0];
};

export const deleteReading = async (userId, id) => {
    const { rowCount } = await pool.query('DELETE FROM readings WHERE id = $1 AND user_id = $2', [id, userId]);
    return rowCount;
};

export const getReadingStats = async (userId, from, to) => {
    const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS count,
                MAX(value) AS highest,
                MIN(value) AS lowest,
                ROUND(AVG(value), 1)::float AS average
         FROM readings
         WHERE user_id = $1 AND reading_date BETWEEN $2 AND $3`,
        [userId, from, to]
    );
    return rows[0];
};

export const getDailyAverages = async (userId, from, to) => {
    const { rows } = await pool.query(
        `SELECT reading_date AS date, ROUND(AVG(value), 1)::float AS average
         FROM readings
         WHERE user_id = $1 AND reading_date BETWEEN $2 AND $3
         GROUP BY reading_date
         ORDER BY reading_date`,
        [userId, from, to]
    );
    return rows;
};

export const listReadingsOnDate = async (userId, date) => {
    const { rows } = await pool.query(
        `SELECT id, reading_date AS date, slot, value
         FROM readings
         WHERE user_id = $1 AND reading_date = $2
         ORDER BY array_position($3::text[], slot)`,
        [userId, date, SLOTS]
    );
    return rows;
};
