import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const PublicRoute = () => {
    const { token } = useAuth();

    return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
