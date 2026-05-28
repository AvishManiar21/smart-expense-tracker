'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Monthly Comparison Data Item
 * Represents spending comparison between this month and last month for a category
 */
export interface MonthlyComparisonData {
  /** Category name (e.g., "Food & Dining") */
  categoryName: string;
  /** Amount spent this month */
  thisMonth: number;
  /** Amount spent last month */
  lastMonth: number;
  /** Dollar change (thisMonth - lastMonth) */
  change: number;
  /** Percentage change */
  changePercent: number;
}

/**
 * Monthly Comparison Chart Props
 */
interface MonthlyComparisonChartProps {
  /** Array of category comparison data */
  data: MonthlyComparisonData[];
}

/**
 * Custom Tooltip Component
 * Displays detailed comparison information on hover
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const change = data.thisMonth - data.lastMonth;
  const changePercent = data.lastMonth > 0
    ? ((change / data.lastMonth) * 100).toFixed(1)
    : '0';
  const isIncrease = change > 0;
  const isDecrease = change < 0;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-2">{data.categoryName}</p>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-blue-600">This Month:</span>
          <span className="font-medium">${data.thisMonth.toFixed(2)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Last Month:</span>
          <span className="font-medium">${data.lastMonth.toFixed(2)}</span>
        </div>

        <div className="pt-2 mt-2 border-t border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-700">Change:</span>
            <div className="flex items-center gap-1">
              {isIncrease && <TrendingUp className="h-3 w-3 text-red-500" />}
              {isDecrease && <TrendingDown className="h-3 w-3 text-green-500" />}
              {!isIncrease && !isDecrease && <Minus className="h-3 w-3 text-gray-400" />}
              <span
                className={`font-semibold ${
                  isIncrease ? 'text-red-500' : isDecrease ? 'text-green-500' : 'text-gray-500'
                }`}
              >
                {isIncrease ? '+' : ''}{change.toFixed(2)} ({changePercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Monthly Comparison Bar Chart Component
 *
 * Displays a grouped bar chart comparing spending by category for this month vs last month.
 *
 * Features:
 * - Grouped bars (This Month in blue, Last Month in gray)
 * - X-axis shows category names
 * - Y-axis shows amounts in currency
 * - Tooltip displays differences with trend indicators
 * - Legend for easy identification
 * - Responsive container for all screen sizes
 * - Smooth animations on load
 *
 * @example
 * ```tsx
 * const data = [
 *   {
 *     categoryName: 'Food & Dining',
 *     thisMonth: 450.25,
 *     lastMonth: 380.50,
 *     change: 69.75,
 *     changePercent: 18.3
 *   },
 *   // ... more categories
 * ];
 *
 * <MonthlyComparisonChart data={data} />
 * ```
 */
export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  // Calculate total changes for header
  const totalThisMonth = data.reduce((sum, item) => sum + item.thisMonth, 0);
  const totalLastMonth = data.reduce((sum, item) => sum + item.lastMonth, 0);
  const totalChange = totalThisMonth - totalLastMonth;
  const totalChangePercent = totalLastMonth > 0
    ? ((totalChange / totalLastMonth) * 100).toFixed(1)
    : '0';

  const isIncrease = totalChange > 0;
  const isEmpty = data.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
        <CardDescription>
          {isEmpty ? (
            'No data available for comparison'
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <span>Category spending: This month vs Last month</span>
              <span className="text-sm font-semibold flex items-center gap-1">
                {isIncrease ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">
                      +${Math.abs(totalChange).toFixed(2)} ({totalChangePercent}%)
                    </span>
                  </>
                ) : totalChange < 0 ? (
                  <>
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">
                      -${Math.abs(totalChange).toFixed(2)} ({Math.abs(parseFloat(totalChangePercent))}%)
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">No change</span>
                )}
              </span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm mt-1">Start adding expenses to see comparisons</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="categoryName"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
              />
              <Bar
                dataKey="thisMonth"
                name="This Month"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
              <Bar
                dataKey="lastMonth"
                name="Last Month"
                fill="#9ca3af"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
