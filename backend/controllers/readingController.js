import { SLOT_LABELS } from '../constants/slots.js';
import {
    countReadingsOnDate,
    createReading,
    findReadingById,
    findReadingBySlot,
    listReadings,
} from '../models/readingModel.js';
import { readingSchema } from '../validators/readingSchemas.js';

export const getReadings = async (req, res) => {
    try {
        const { from, to } = req.query;

        const readings = await listReadings(req.userId, from, to);

        return res.status(200).json(readings);
    } catch (error) {
        console.error('Get readings failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

export const getReading = async (req, res) => {
    try {
        const reading = await findReadingById(req.userId, req.params.id);
        if (!reading) {
            return res.status(404).json({ error: 'Reading not found.' });
        }

        return res.status(200).json(reading);
    } catch (error) {
        console.error('Get reading failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

export const addReading = async (req, res) => {
    try {
        const { success, data, error } = readingSchema.safeParse(req.body ?? {});
        if (!success) {
            return res.status(400).json({ error: error.issues[0].message });
        }

        const { date, slot, value } = data;

        const count = await countReadingsOnDate(req.userId, date);
        if (count >= 4) {
            return res.status(409).json({ error: 'You can add only 4 readings per day.' });
        }

        const existingReading = await findReadingBySlot(req.userId, date, slot);
        if (existingReading) {
            return res.status(409).json({ error: `You already have a reading for ${SLOT_LABELS[slot]} on this date.` });
        }

        const reading = await createReading(req.userId, date, slot, value);

        return res.status(201).json(reading);
    } catch (error) {
        console.error('Add reading failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
