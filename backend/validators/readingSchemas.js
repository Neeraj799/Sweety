import { z } from 'zod';
import { SLOTS } from '../constants/slots.js';
import { getToday } from '../utils/date.js';

const RANGE = 'Value must be between 40 and 600 mg/dl.';

export const readingSchema = z.object({
    value: z.number('Please enter a glucose value.').int(RANGE).min(40, RANGE).max(600, RANGE),
    date: z.iso.date('Please choose a valid date.').refine((date) => date <= getToday(), 'Date cannot be in the future.'),
    slot: z.enum(SLOTS, 'Please choose a valid time slot.'),
});