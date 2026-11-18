import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string('Name is required.').trim().min(1, 'Name is required.'),
    email: z.string('Email is required.').trim().toLowerCase().pipe(z.email('Please enter a valid email address.')),
    password: z.string('Password is required.').min(6, 'Password must be at least 6 characters.'),
});
