import { listPatients } from '../models/userModel.js';

export const getPatients = async (req, res) => {
    try {
        const patients = await listPatients(req.userId);

        return res.status(200).json(patients);
    } catch (error) {
        console.error('Get patients failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
