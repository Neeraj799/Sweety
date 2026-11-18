const AuthLayout = ({ children }) => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-pink-50 p-4 dark:bg-gray-950">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900">
                <h1 className="text-center text-3xl font-bold text-pink-600">Sweety</h1>
                <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">Your blood glucose diary</p>
                {children}
            </div>
        </main>
    );
};

export default AuthLayout;
