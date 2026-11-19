import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import PageLayout from '../components/PageLayout.jsx';
import { api } from '../services/api.js';

const PatientsPage = () => {
    const [patients, setPatients] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPatients = async () => {
            try {
                const { data } = await api.get('/doctor/patients');
                setPatients(data);
            } catch (err) {
                setError(err.response?.data?.error || 'Something went wrong. Please try again.');
            }
        };

        loadPatients();
    }, []);

    return (
        <PageLayout title="My patients">
            <ErrorMessage message={error} />

            {patients === null ? (
                !error && <p className="text-gray-500">Loading…</p>
            ) : patients.length === 0 ? (
                <p className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow">
                    No patients are assigned to you yet.
                </p>
            ) : (
                <ul className="divide-y divide-gray-100 rounded-2xl bg-white shadow">
                    {patients.map((patient) => (
                        <li key={patient.id}>
                            <Link
                                to={`/patients/${patient.id}`}
                                className="flex items-center justify-between p-4 hover:bg-pink-50"
                            >
                                <span>
                                    <span className="block font-medium text-gray-800">
                                        {patient.name}
                                    </span>
                                    <span className="text-sm text-gray-500">{patient.email}</span>
                                </span>
                                <span className="text-sm font-semibold text-pink-600">
                                    View reports →
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </PageLayout>
    );
};

export default PatientsPage;
