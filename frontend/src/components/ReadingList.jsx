import { getSlotLabel } from '../constants/slots.js';
import { formatDate } from '../utils/date.js';

const ReadingList = ({ readings, onEdit, onDelete }) => {
    return (
        <div className="rounded-2xl bg-white p-4 shadow dark:bg-gray-900">
            <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Your readings
            </h2>

            {readings.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    No readings yet. Add your first one! 🌱
                </p>
            ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {readings.map((reading) => (
                        <li key={reading.id} className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">
                                    {reading.value} mg/dl
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(reading.date)} · {getSlotLabel(reading.slot)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(reading)}
                                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(reading.id)}
                                    className="rounded-lg border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReadingList;
