import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../models/userModel.js';
import { signToken } from '../utils/token.js';
import { loginSchema, registerSchema } from '../validators/authSchemas.js';

export const register = async (req, res) => {
    try {
        const { success, data, error } = registerSchema.safeParse(req.body ?? {});
        if (!success) {
            return res.status(400).json({ error: error.issues[0].message });
        }

        const { name, email, password } = data;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await createUser(name, email, passwordHash);

        const token = signToken(user);

        return res.status(201).json({ token, user });
    } catch (error) {
        console.error('Register failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

export const login = async (req, res) => {
    try {
        const { success, data, error } = loginSchema.safeParse(req.body ?? {});
        if (!success) {
            return res.status(400).json({ error: error.issues[0].message });
        }

        const { email, password } = data;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = signToken(user);

        return res.status(200).json({
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error('Login failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
