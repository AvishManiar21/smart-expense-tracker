'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Props for the ExpensePieChart component
 * @interface ExpensePieChartProps
 * @property {Array} data - Category breakdown data
 * @property {string} data[].categoryName - Name of the expense category
 * @property {string} data[].categoryColor - Hex color code for the category
 * @property {string} data[].amount - Formatted currency amount
 * @property {number} data[].percentage - Percentage of total expenses
 */
interface ExpensePieChartProps {
  data: Array<{
    categoryName: string;
    categoryColor: string;
    amount: string;
    percentage: number;
  }>;
}

/**
 * Custom label component for the center of the donut chart
 * Displays the total amount in the center
 */
interface CenterLabelProps {
  viewBox?: { cx: number; cy: number };
  total: string;
}

const CenterLabel = ({ viewBox, total }: CenterLabelProps) => {
  const { cx = 0, cy = 0 } = viewBox || {};
  return (
    <text
      x={cx}
      y={cy}
      fill="#374151"
      className="text-center"
      textAnchor="middle"
      dominantBaseline="central"
    >
      <tspan x={cx} y={cy - 10} className="text-2xl font-bold">
        {total}
      </tspan>
      <tspan x={cx} y={cy + 15} className="text-sm fill-gray-500">
        Total
      </tspan>
    </text>
  );
};

/**
 * Custom tooltip for pie chart hover interactions
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      categoryName: string;
      amount: string;
      percentage: number;
      categoryColor: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900">{data.categoryName}</p>
      <p className="text-sm text-gray-600 mt-1">Amount: {data.amount}</p>
      <p className="text-sm text-gray-600">Percentage: {data.percentage.toFixed(1)}%</p>
    </div>
  );
};

/**
 * Custom legend component with amounts and percentages
 */
interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: {
      categoryName: string;
      amount: string;
      percentage: number;
      categoryColor: string;
    };
  }>;
}

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload || !payload.length) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 mt-4">
      {payload.map((entry, index) => {
        const data = entry.payload;
        return (
          <div key={`legend-${index}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: data.categoryColor }}
              />
              <span className="text-gray-700">{data.categoryName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900">{data.amount}</span>
              <span className="text-gray-500 text-xs w-12 text-right">
                {data.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Expense Pie Chart Component
 *
 * Displays category breakdown as an interactive donut chart with:
 * - Animated donut/pie visualization
 * - Total amount displayed in center
 * - Custom legend with amounts and percentages
 * - Hover tooltips with detailed information
 * - Responsive container for mobile and desktop
 * - Empty state when no data is available
 *
 * Uses Recharts library for chart rendering and Shadcn/ui for card wrapper.
 *
 * @param {ExpensePieChartProps} props - Component props
 * @returns {JSX.Element} Pie chart card component
 */
export function ExpensePieChart({ data }: ExpensePieChartProps) {
  // Calculate total for center label
  const total = data.reduce((sum, item) => {
    const amount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ''));
    return sum + amount;
  }, 0);

  const totalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total);

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">No expense data available</p>
            <p className="text-gray-500 text-sm mt-1">
              Add expenses to see your category breakdown
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for Recharts
  const chartData = data.map((item) => ({
    ...item,
    value: parseFloat(item.amount.replace(/[^0-9.-]+/g, '')),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={<CenterLabel total={totalFormatted} />}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.categoryColor} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
