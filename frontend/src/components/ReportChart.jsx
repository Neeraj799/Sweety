import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { formatDate } from '../utils/date.js';

const ReportChart = ({ data }) => {
    return (
        <div className="rounded-2xl bg-white p-4 shadow">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Daily average this month</h2>

            {data.length === 0 ? (
                <p className="text-sm text-gray-500">No readings yet for this period 🌱</p>
            ) : (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid stroke="#f3f4f6" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date) => Number(date.slice(8))}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                        <Tooltip
                            labelFormatter={(date) => formatDate(date)}
                            formatter={(value) => [`${value} mg/dl`, 'Average']}
                        />
                        <Line
                            type="monotone"
                            dataKey="average"
                            stroke="#db2777"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default ReportChart;
