import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { api } from '../services/api.js';
import { getToday } from '../utils/date.js';
import ReadingForm from './ReadingForm.jsx';

vi.mock('../services/api.js', () => ({
    api: { post: vi.fn(), put: vi.fn() },
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

const fillAndSubmit = ({ date, value }) => {
    render(<ReadingForm onSaved={vi.fn()} onCancel={vi.fn()} />);
    if (date) {
        fireEvent.change(screen.getByLabelText('Date'), { target: { value: date } });
    }
    fireEvent.change(screen.getByLabelText('Value (mg/dl)'), { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: 'Add reading' }));
};

describe('ReadingForm', () => {
    test('shows an empty add form with today as the date', () => {
        render(<ReadingForm onSaved={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByLabelText('Date').value).toBe(getToday());
        expect(screen.getByLabelText('Time slot').value).toBe('morning_fasting');
        expect(screen.getByLabelText('Value (mg/dl)').value).toBe('');
        expect(screen.getByRole('button', { name: 'Add reading' })).toBeTruthy();
    });

    test.each([
        ['', 'Please enter a glucose value.'],
        ['39', 'Value must be between 40 and 600 mg/dl.'],
        ['601', 'Value must be between 40 and 600 mg/dl.'],
        ['120.5', 'Value must be between 40 and 600 mg/dl.'],
    ])('value "%s" shows "%s"', (value, message) => {
        fillAndSubmit({ value });

        expect(screen.getByText(message)).toBeTruthy();
        expect(api.post).not.toHaveBeenCalled();
    });

    test('a future date shows an error', () => {
        fillAndSubmit({ date: '2999-01-01', value: '120' });

        expect(screen.getByText('Date cannot be in the future.')).toBeTruthy();
        expect(api.post).not.toHaveBeenCalled();
    });

    test('adds a reading and calls onSaved', async () => {
        const onSaved = vi.fn();
        render(<ReadingForm onSaved={onSaved} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText('Time slot'), { target: { value: 'after_lunch' } });
        fireEvent.change(screen.getByLabelText('Value (mg/dl)'), { target: { value: '120' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add reading' }));

        await waitFor(() => expect(onSaved).toHaveBeenCalled());
        expect(api.post).toHaveBeenCalledWith('/readings', {
            date: getToday(),
            slot: 'after_lunch',
            value: 120,
        });
    });

    test('edits a reading and calls onSaved', async () => {
        const onSaved = vi.fn();
        const reading = { id: 7, date: '2026-11-10', slot: 'after_dinner', value: 150 };
        render(<ReadingForm reading={reading} onSaved={onSaved} onCancel={vi.fn()} />);

        expect(screen.getByLabelText('Date').value).toBe('2026-11-10');
        expect(screen.getByLabelText('Time slot').value).toBe('after_dinner');
        expect(screen.getByLabelText('Value (mg/dl)').value).toBe('150');

        fireEvent.change(screen.getByLabelText('Value (mg/dl)'), { target: { value: '160' } });
        fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

        await waitFor(() => expect(onSaved).toHaveBeenCalled());
        expect(api.put).toHaveBeenCalledWith('/readings/7', {
            date: '2026-11-10',
            slot: 'after_dinner',
            value: 160,
        });
    });

    test('shows the server error and does not call onSaved', async () => {
        api.post.mockRejectedValueOnce({
            response: { data: { error: 'You can add only 4 readings per day.' } },
        });
        const onSaved = vi.fn();
        render(<ReadingForm onSaved={onSaved} onCancel={vi.fn()} />);

        fireEvent.change(screen.getByLabelText('Value (mg/dl)'), { target: { value: '120' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add reading' }));

        expect(await screen.findByText('You can add only 4 readings per day.')).toBeTruthy();
        expect(onSaved).not.toHaveBeenCalled();
    });

    test('Cancel calls onCancel', () => {
        const onCancel = vi.fn();
        render(<ReadingForm onSaved={vi.fn()} onCancel={onCancel} />);

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalled();
    });
});
