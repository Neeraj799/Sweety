import Navbar from './Navbar.jsx';

const PageLayout = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-pink-50 dark:bg-gray-950">
            <Navbar />

            <main className="mx-auto max-w-4xl space-y-6 p-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
