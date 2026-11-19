import { getDailyAverages, getReadingStats, listReadingsOnDate } from '../models/readingModel.js';
import { findPatient } from '../models/userModel.js';
import { getReportRanges, getToday } from '../utils/date.js';
import { reportDateSchema } from '../validators/readingSchemas.js';

const buildReports = async (userId, date) => {
    const { daily, monthToDate, previousMonth } = getReportRanges(date);

    const dailyStats = await getReadingStats(userId, daily.from, daily.to);
    const dailyReadings = await listReadingsOnDate(userId, date);
    const monthToDateStats = await getReadingStats(userId, monthToDate.from, monthToDate.to);
    const dailyAverages = await getDailyAverages(userId, monthToDate.from, monthToDate.to);
    const previousMonthStats = await getReadingStats(userId, previousMonth.from, previousMonth.to);

    return {
        daily: { ...daily, ...dailyStats, readings: dailyReadings },
        monthToDate: { ...monthToDate, ...monthToDateStats, dailyAverages },
        previousMonth: { ...previousMonth, ...previousMonthStats },
    };
};

export const getReports = async (req, res) => {
    try {
        const { success, data: date, error } = reportDateSchema.safeParse(req.query.date ?? getToday());
        if (!success) {
            return res.status(400).json({ error: error.issues[0].message });
        }

        const reports = await buildReports(req.userId, date);

        return res.status(200).json(reports);
    } catch (error) {
        console.error('Get reports failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};

export const getPatientReports = async (req, res) => {
    try {
        const { success, data: date, error } = reportDateSchema.safeParse(req.query.date ?? getToday());
        if (!success) {
            return res.status(400).json({ error: error.issues[0].message });
        }

        const patient = await findPatient(req.userId, req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found.' });
        }

        const reports = await buildReports(patient.id, date);

        return res.status(200).json({ patient, ...reports });
    } catch (error) {
        console.error('Get patient reports failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
