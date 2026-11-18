import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmToast from '../components/ConfirmToast.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import PageLayout from '../components/PageLayout.jsx';
import ReadingList from '../components/ReadingList.jsx';
import { api } from '../services/api.js';

const PAGE_SIZE = 5;

const DashboardPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [readings, setReadings] = useState(null);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        // Each run gets its own flag. If the page changes before the answer arrives,
        // the cleanup below sets this run's flag to true and its late answer is ignored.
        let isOutdated = false;

        const loadReadings = async () => {
            try {
                const { data } = await api.get('/readings', {
                    params: { page, limit: PAGE_SIZE },
                });
                // A newer request has started, so this answer is old: ignore it
                if (isOutdated) {
                    return;
                }
                if (data.items.length === 0 && page > 1) {
                    setPage(page - 1);
                    return;
                }
                setReadings(data.items);
                setTotal(data.total);
                setError('');
            } catch (err) {
                if (isOutdated) {
                    return;
                }
                setError(err.response?.data?.error || 'Something went wrong. Please try again.');
            }
        };

        loadReadings();

        // React runs this cleanup before the next run (page or refresh changed)
        return () => {
            isOutdated = true;
        };
    }, [page, refresh]);

    const handleDelete = (id) => {
        toast(
            ({ closeToast }) => (
                <ConfirmToast
                    message="Delete this reading?"
                    onConfirm={() => deleteReading(id)}
                    closeToast={closeToast}
                />
            ),
            { autoClose: false, closeOnClick: false }
        );
    };

    const deleteReading = async (id) => {
        try {
            await api.delete(`/readings/${id}`);
            toast.success('Reading deleted.');
            setRefresh((count) => count + 1);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Something went wrong. Please try again.');
        }
    };

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <PageLayout title="Dashboard">
            <ErrorMessage message={error} />

            {readings === null ? (
                <p className="text-gray-500 dark:text-gray-400">Loading…</p>
            ) : (
                <>
                    <ReadingList
                        readings={readings}
                        onEdit={(reading) => navigate(`/readings/${reading.id}/edit`)}
                        onDelete={handleDelete}
                    />

                    {total > PAGE_SIZE && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                ← Previous
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </PageLayout>
    );
};

export default DashboardPage;
