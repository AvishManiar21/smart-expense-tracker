import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';

/**
 * Income vs Expense Composed Chart Component
 * Displays income and expenses as bars with savings as a line
 */
export default function IncomeVsExpenseChart({ data, currency = 'USD', loading }) {
  // Empty state
  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm">No income vs expense data available</p>
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const income = payload.find(p => p.dataKey === 'income')?.value || 0;
      const expenses = payload.find(p => p.dataKey === 'expenses')?.value || 0;
      const savings = payload.find(p => p.dataKey === 'savings')?.value || 0;
      const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Income:</span>
              </div>
              <span className="font-semibold text-green-600">
                ${income.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Expenses:</span>
              </div>
              <span className="font-semibold text-red-600">
                ${expenses.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4 text-sm pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Net Savings:</span>
              </div>
              <span className={`font-semibold ${savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ${savings.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4 text-xs text-gray-500">
              <span>Savings Rate:</span>
              <span className={savingsRate >= 20 ? 'text-green-600' : 'text-gray-600'}>
                {savingsRate}%
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
    if (value <= -1000) {
      return `-$${(Math.abs(value) / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#d1d5db"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar
            dataKey="income"
            name="Income"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="savings"
            name="Net Savings"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Summary info */}
      <div className="mt-4 text-center text-xs text-gray-600">
        <p>Last 12 months overview • Bars: Income & Expenses • Line: Net Savings</p>
      </div>
    </div>
  );
}

IncomeVsExpenseChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      income: PropTypes.number,
      expenses: PropTypes.number,
      savings: PropTypes.number,
    })
  ),
  currency: PropTypes.string,
  loading: PropTypes.bool,
};
