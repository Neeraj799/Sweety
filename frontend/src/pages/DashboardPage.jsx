import Navbar from '../components/Navbar.jsx';

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-pink-50 dark:bg-gray-950">
            <Navbar />

            <main className="mx-auto max-w-4xl p-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h2>
            </main>
        </div>
    );
};

export default DashboardPage;
