import jwt from 'jsonwebtoken';

export const signToken = (user) =>
    jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, { expiresIn: '7d' });
