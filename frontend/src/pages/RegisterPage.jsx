import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../components/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import FormInput from '../components/FormInput.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { api } from '../services/api.js';
import { registerSchema } from '../validators/authSchemas.js';

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { success, data: body, error: validationError } = registerSchema.safeParse(form);
        if (!success) {
            setError(validationError.issues[0].message);
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', body);
            login(data);
            toast.success('Account created.');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <FormInput
                    label="Name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={form.name}
                    onChange={handleChange}
                />
                <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={form.email}
                    onChange={handleChange}
                />
                <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                />

                <ErrorMessage message={error} />

                <Button type="submit" disabled={loading}>
                    {loading ? 'Please wait…' : 'Create account'}
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-pink-600 hover:underline">
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default RegisterPage;
