import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import PropTypes from 'prop-types';

/**
 * Monthly Comparison Bar Chart Component
 * Displays side-by-side comparison of this month vs last month by category
 */
export default function MonthlyComparisonChart({ data, currency = 'USD', loading }) {
  // Empty state
  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm">No comparison data available</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    category: item.categoryName,
    'This Month': parseFloat(item.thisMonth),
    'Last Month': parseFloat(item.lastMonth),
    change: parseFloat(item.change),
    percentChange: parseFloat(item.percentChange),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const change = payload[0].payload.change;
      const percentChange = payload[0].payload.percentChange;
      const isIncrease = change > 0;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center justify-between space-x-4 text-sm mb-1">
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold" style={{ color: entry.fill }}>
                ${entry.value.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Change:</span>
              <span className={`font-semibold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                {isIncrease ? '+' : ''}${change.toFixed(2)} ({isIncrease ? '+' : ''}{percentChange.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis ticks
  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  // Custom bar color based on change
  const getBarColor = (entry, barName) => {
    if (barName === 'This Month') {
      return entry.change > 0 ? '#ef4444' : '#10b981'; // Red if increased, green if decreased
    }
    return '#94a3b8'; // Gray for last month
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            stroke="#d1d5db"
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Bar dataKey="Last Month" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="This Month" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry, 'This Month')} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend explanation */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Decreased spending</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Increased spending</span>
        </div>
      </div>
    </div>
  );
}

MonthlyComparisonChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      categoryName: PropTypes.string,
      thisMonth: PropTypes.string,
      lastMonth: PropTypes.string,
      change: PropTypes.string,
      percentChange: PropTypes.string,
    })
  ),
  currency: PropTypes.string,
  loading: PropTypes.bool,
};
