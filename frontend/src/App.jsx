import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import { useAuth } from './hooks/useAuth.js';
import AddReadingPage from './pages/AddReadingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditReadingPage from './pages/EditReadingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PatientsPage from './pages/PatientsPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';

const App = () => {
    const { user } = useAuth();
    const isDoctor = user?.role === 'doctor';

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />

            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    {isDoctor ? (
                        <>
                            <Route path="/" element={<PatientsPage />} />
                            <Route path="/patients/:id" element={<ReportsPage />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/readings/new" element={<AddReadingPage />} />
                            <Route path="/readings/:id/edit" element={<EditReadingPage />} />
                            <Route path="/reports" element={<ReportsPage />} />
                        </>
                    )}
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default App;
