import { getSlotLabel } from '../constants/slots.js';
import { formatDate } from '../utils/date.js';

const ReportCard = ({ title, report }) => {
    const range =
        report.from === report.to
            ? formatDate(report.from)
            : `${formatDate(report.from)} – ${formatDate(report.to)}`;

    const stats = [
        { label: 'Highest', value: `${report.highest} mg/dl` },
        { label: 'Lowest', value: `${report.lowest} mg/dl` },
        { label: 'Average', value: `${report.average?.toFixed(1)} mg/dl` },
        { label: 'Count', value: report.count },
    ];

    return (
        <div className="rounded-2xl bg-white p-4 shadow dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{range}</p>

            {report.count === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No readings yet for this period 🌱
                </p>
            ) : (
                <>
                    <dl className="grid grid-cols-2 gap-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-lg bg-pink-50 p-2 dark:bg-gray-800"
                            >
                                <dt className="text-xs text-gray-500 dark:text-gray-400">
                                    {stat.label}
                                </dt>
                                <dd className="font-semibold text-gray-800 dark:text-gray-100">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    {report.readings && (
                        <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
                            {report.readings.map((reading) => (
                                <li key={reading.id} className="flex justify-between py-2 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {getSlotLabel(reading.slot)}
                                    </span>
                                    <span className="font-medium text-gray-800 dark:text-gray-100">
                                        {reading.value} mg/dl
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default ReportCard;
