import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-10 border-b border-pink-100 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
                <Link to="/" className="text-2xl font-bold text-pink-600">
                    Sweety
                </Link>

                <div className="flex items-center gap-3">
                    <span className="hidden text-gray-700 sm:inline dark:text-gray-300">Hello, {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-pink-600 px-3 py-1 text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800"
                    >
                        Log out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
