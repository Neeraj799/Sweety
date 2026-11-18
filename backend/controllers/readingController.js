import { SLOT_LABELS } from '../constants/slots.js';
import {
    countReadings,
    countReadingsOnDate,
    createReading,
    deleteReading,
    findReadingById,
    findReadingBySlot,
    listReadingsPage,
    updateReading,
} from '../models/readingModel.js';
import { readingSchema } from '../validators/readingSchemas.js';

export const getReadings = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const items = await listReadingsPage(req.userId, limit, offset);
        const total = await countReadings(req.userId);

        return res.status(200).json({ items, total, page, limit });
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

export const editReading = async (req, res) => {
    try {
        const { success, data, error } = readingSchema.safeParse(req.body ?? {});
        if (!success) {
            return res.status(400).json({ error: error.issues[0].message });
        }

        const { date, slot, value } = data;

        const reading = await findReadingById(req.userId, req.params.id);
        if (!reading) {
            return res.status(404).json({ error: 'Reading not found.' });
        }

        if (date !== reading.date) {
            const count = await countReadingsOnDate(req.userId, date);
            if (count >= 4) {
                return res.status(409).json({ error: 'You can add only 4 readings per day.' });
            }
        }

        const sameSlotReading = await findReadingBySlot(req.userId, date, slot);
        if (sameSlotReading && sameSlotReading.id !== reading.id) {
            return res.status(409).json({ error: `You already have a reading for ${SLOT_LABELS[slot]} on this date.` });
        }

        const updatedReading = await updateReading(req.userId, reading.id, date, slot, value);

        return res.status(200).json(updatedReading);
    } catch (error) {
        console.error('Edit reading failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

export const removeReading = async (req, res) => {
    try {
        const deletedCount = await deleteReading(req.userId, req.params.id);
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Reading not found.' });
        }

        return res.status(200).json({ message: 'Reading deleted.' });
    } catch (error) {
        console.error('Delete reading failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
