import jwt from 'jsonwebtoken';

export const signToken = (user) =>
    jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
