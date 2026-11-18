import { getReadingStats, listReadingsOnDate } from '../models/readingModel.js';
import { getReportRanges, getToday } from '../utils/date.js';
import { reportDateSchema } from '../validators/readingSchemas.js';

export const getReports = async (req, res) => {
    try {
        const { success, data: date, error } = reportDateSchema.safeParse(req.query.date ?? getToday());
        if (!success) {
            return res.status(400).json({ error: error.issues[0].message });
        }

        const { daily, monthToDate, previousMonth } = getReportRanges(date);

        const dailyStats = await getReadingStats(req.userId, daily.from, daily.to);
        const dailyReadings = await listReadingsOnDate(req.userId, date);
        const monthToDateStats = await getReadingStats(req.userId, monthToDate.from, monthToDate.to);
        const previousMonthStats = await getReadingStats(req.userId, previousMonth.from, previousMonth.to);

        return res.status(200).json({
            daily: { ...daily, ...dailyStats, readings: dailyReadings },
            monthToDate: { ...monthToDate, ...monthToDateStats },
            previousMonth: { ...previousMonth, ...previousMonthStats },
        });
    } catch (error) {
        console.error('Get reports failed:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
};
