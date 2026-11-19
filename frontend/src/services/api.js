import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let refreshRequest = null;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config;
        const isAuthCall = request.url.startsWith('/auth/');

        if (error.response?.status !== 401 || isAuthCall || request.retried) {
            return Promise.reject(error);
        }

        request.retried = true;
        try {
            refreshRequest ??= api.post('/auth/refresh').finally(() => {
                refreshRequest = null;
            });
            await refreshRequest;
            return api(request);
        } catch {
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(error);
        }
    }
);
