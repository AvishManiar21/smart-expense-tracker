import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import PropTypes from 'prop-types';

/**
 * Expense Pie Chart Component
 * Displays category breakdown as a donut chart
 */
export default function ExpensePieChart({ data, currency = 'USD', loading }) {
  // Empty state
  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <p className="text-sm">No expense data for this period</p>
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

  // Format data for Recharts
  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: parseFloat(item.amount),
    color: item.categoryColor || '#AEB6BF',
    percentage: parseFloat(item.percentage),
    icon: item.categoryIcon || '📦',
  }));

  // Calculate total
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Custom label to show total in center
  const renderCenterLabel = () => (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-0.5em" className="text-sm font-medium fill-gray-600">
        Total
      </tspan>
      <tspan x="50%" dy="1.5em" className="text-2xl font-bold fill-gray-900">
        ${total.toFixed(2)}
      </tspan>
    </text>
  );

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="grid grid-cols-1 gap-2 mt-4 text-sm">
        {payload.map((entry, index) => (
          <li key={`legend-${index}`} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">
                {entry.payload.icon} {entry.value}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900">
                ${entry.payload.value.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">
                {entry.payload.percentage.toFixed(1)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-1">
            {data.icon} {data.name}
          </p>
          <p className="text-sm text-gray-600">
            Amount: <span className="font-semibold">${data.value.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-semibold">{data.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
      {renderCenterLabel()}
    </div>
  );
}

ExpensePieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      categoryName: PropTypes.string,
      amount: PropTypes.string,
      percentage: PropTypes.string,
      categoryColor: PropTypes.string,
      categoryIcon: PropTypes.string,
    })
  ),
  currency: PropTypes.string,
  loading: PropTypes.bool,
};
