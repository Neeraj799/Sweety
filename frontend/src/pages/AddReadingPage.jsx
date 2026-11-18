import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageLayout from '../components/PageLayout.jsx';
import ReadingForm from '../components/ReadingForm.jsx';

const AddReadingPage = () => {
    const navigate = useNavigate();

    const handleSaved = () => {
        toast.success('Reading added.');
        navigate('/');
    };

    return (
        <PageLayout title="Add reading">
            <ReadingForm onSaved={handleSaved} onCancel={() => navigate('/')} />
        </PageLayout>
    );
};

export default AddReadingPage;
