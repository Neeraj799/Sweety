import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorMessage from '../components/ErrorMessage.jsx';
import PageLayout from '../components/PageLayout.jsx';
import ReadingForm from '../components/ReadingForm.jsx';
import { api } from '../services/api.js';

const EditReadingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reading, setReading] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadReading = async () => {
            try {
                const { data } = await api.get(`/readings/${id}`);
                setReading(data);
            } catch (err) {
                setError(err.response?.data?.error || 'Something went wrong. Please try again.');
            }
        };

        loadReading();
    }, [id]);

    const handleSaved = () => {
        toast.success('Reading updated.');
        navigate('/');
    };

    return (
        <PageLayout title="Edit reading">
            <ErrorMessage message={error} />
            {reading && (
                <ReadingForm
                    reading={reading}
                    onSaved={handleSaved}
                    onCancel={() => navigate('/')}
                />
            )}
        </PageLayout>
    );
};

export default EditReadingPage;
