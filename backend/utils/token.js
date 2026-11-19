import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECONDS = 15 * 60;
const REFRESH_TOKEN_SECONDS = 7 * 24 * 60 * 60;

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
};

const refreshCookieOptions = { ...cookieOptions, path: '/auth' };

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

export const setAuthCookies = (res, userId) => {
    const payload = { sub: String(userId) };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_SECONDS,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_SECONDS,
    });

    res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: ACCESS_TOKEN_SECONDS * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
        ...refreshCookieOptions,
        maxAge: REFRESH_TOKEN_SECONDS * 1000,
    });
};

export const clearAuthCookies = (res) => {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', refreshCookieOptions);
};
