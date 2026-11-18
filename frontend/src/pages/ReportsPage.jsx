import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage.jsx';
import FormInput from '../components/FormInput.jsx';
import PageLayout from '../components/PageLayout.jsx';
import ReportCard from '../components/ReportCard.jsx';
import ReportChart from '../components/ReportChart.jsx';
import { api } from '../services/api.js';
import { getToday } from '../utils/date.js';

const ReportsPage = () => {
    const [date, setDate] = useState(getToday());
    const [reports, setReports] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let isOutdated = false;

        const loadReports = async () => {
            try {
                const { data } = await api.get('/reports', { params: { date } });
                if (isOutdated) {
                    return;
                }
                setReports(data);
                setError('');
            } catch (err) {
                if (isOutdated) {
                    return;
                }
                setError(err.response?.data?.error || 'Something went wrong. Please try again.');
            }
        };

        loadReports();

        return () => {
            isOutdated = true;
        };
    }, [date]);

    return (
        <PageLayout title="Reports">
            <div className="max-w-xs">
                <FormInput
                    label="Date"
                    type="date"
                    value={date}
                    max={getToday()}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <ErrorMessage message={error} />

            {reports === null ? (
                <p className="text-gray-500 dark:text-gray-400">Loading…</p>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <ReportCard title="Daily" report={reports.daily} />
                        <ReportCard title="Month-to-date" report={reports.monthToDate} />
                        <ReportCard title="Monthly" report={reports.previousMonth} />
                    </div>

                    <ReportChart data={reports.monthToDate.dailyAverages} />
                </>
            )}
        </PageLayout>
    );
};

export default ReportsPage;
