import { verifyToken } from '../utils/token.js';

export const requireAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Please log in.' });
        }

        const payload = verifyToken(token);
        req.userId = Number(payload.sub);

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
    }
};
