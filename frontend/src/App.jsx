import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import AddReadingPage from './pages/AddReadingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditReadingPage from './pages/EditReadingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

const App = () => {
    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/readings/new" element={<AddReadingPage />} />
                    <Route path="/readings/:id/edit" element={<EditReadingPage />} />                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default App;
