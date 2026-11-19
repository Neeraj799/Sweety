import { pool } from '../db.js';

export const findUserByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
};

export const createUser = async (name, email, passwordHash) => {
    const { rows } = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
        [name, email, passwordHash]
    );
    return rows[0];
};

export const listPatients = async (doctorId) => {
    const { rows } = await pool.query('SELECT id, name, email FROM users WHERE doctor_id = $1 ORDER BY name', [
        doctorId,
    ]);
    return rows;
};

export const findPatient = async (doctorId, patientId) => {
    const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id = $1 AND doctor_id = $2', [
        patientId,
        doctorId,
    ]);
    return rows[0];
};
