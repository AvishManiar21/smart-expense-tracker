'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Props for the SpendingTrendChart component
 * @interface SpendingTrendChartProps
 * @property {Array} data - Monthly trend data
 * @property {string} data[].month - Month label (e.g., "Jan 2024")
 * @property {number} data[].totalExpenses - Total expenses for the month
 * @property {number} data[].totalIncome - Total income for the month
 * @property {number} data[].netSavings - Net savings (income - expenses)
 */
interface SpendingTrendChartProps {
  data: Array<{
    month: string;
    totalExpenses: number;
    totalIncome: number;
    netSavings: number;
  }>;
}

/**
 * Custom tooltip for line chart hover interactions
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-2">{label}</p>
      {payload.map((entry, index) => {
        let displayName = entry.name;
        if (entry.dataKey === 'totalExpenses') displayName = 'Expenses';
        if (entry.dataKey === 'totalIncome') displayName = 'Income';
        if (entry.dataKey === 'netSavings') displayName = 'Savings';

        return (
          <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{displayName}:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Format Y-axis values as currency
 */
const formatYAxis = (value: number) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
};

/**
 * Spending Trend Line Chart Component
 *
 * Displays a multi-line chart showing trends over time for:
 * - Expenses (red line)
 * - Income (green line)
 * - Savings (blue line)
 *
 * Features:
 * - Responsive container for mobile and desktop
 * - Animated line transitions
 * - Interactive tooltips with formatted currency
 * - Legend for line identification
 * - Grid lines for easier reading
 * - Y-axis formatted as currency (with k for thousands)
 * - X-axis showing month labels
 * - Empty state when no data is available
 *
 * Uses Recharts library for chart rendering and Shadcn/ui for card wrapper.
 *
 * @param {SpendingTrendChartProps} props - Component props
 * @returns {JSX.Element} Line chart card component
 */
export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No trend data available</p>
            <p className="text-gray-500 text-sm mt-1">
              Add transactions to see your spending trends
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
              formatter={(value) => {
                if (value === 'totalExpenses') return 'Expenses';
                if (value === 'totalIncome') return 'Income';
                if (value === 'netSavings') return 'Savings';
                return value;
              }}
            />
            <Line
              type="monotone"
              dataKey="totalExpenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="totalIncome"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="netSavings"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
