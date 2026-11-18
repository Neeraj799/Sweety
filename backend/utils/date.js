export const getToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

const toDateString = (date) => date.toISOString().slice(0, 10);

export const getReportRanges = (date) => {
    const [year, month] = date.split('-').map(Number);

    return {
        daily: { from: date, to: date },
        monthToDate: { from: `${date.slice(0, 7)}-01`, to: date },
        previousMonth: {
            from: toDateString(new Date(Date.UTC(year, month - 2, 1))),
            to: toDateString(new Date(Date.UTC(year, month - 1, 0))),
        },
    };
};
