'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

/**
 * Income vs Expense Data Point
 * Represents financial data for a specific month
 */
export interface IncomeExpenseData {
  /** Month label (e.g., "Jan 2024") */
  month: string;
  /** Total income for the month */
  income: number;
  /** Total expenses for the month */
  expenses: number;
  /** Net savings (income - expenses) */
  savings: number;
}

/**
 * Income vs Expense Chart Props
 */
interface IncomeExpenseChartProps {
  /** Array of monthly income/expense data (typically last 12 months) */
  data: IncomeExpenseData[];
}

/**
 * Custom Tooltip Component
 * Displays detailed financial information on hover
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const savingsRate = data.income > 0
    ? ((data.savings / data.income) * 100).toFixed(1)
    : '0';
  const isPositiveSavings = data.savings >= 0;

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
      <p className="font-semibold text-gray-900 mb-3">{data.month}</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-6">
          <span className="text-green-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Income:
          </span>
          <span className="font-medium">${data.income.toFixed(2)}</span>
        </div>

        <div className="flex justify-between gap-6">
          <span className="text-red-600 flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            Expenses:
          </span>
          <span className="font-medium">${data.expenses.toFixed(2)}</span>
        </div>

        <div className="pt-2 mt-2 border-t border-gray-200">
          <div className="flex justify-between gap-6">
            <span className={`font-semibold flex items-center gap-1 ${
              isPositiveSavings ? 'text-blue-600' : 'text-orange-600'
            }`}>
              <DollarSign className="h-3 w-3" />
              Net Savings:
            </span>
            <span className={`font-semibold ${
              isPositiveSavings ? 'text-blue-600' : 'text-orange-600'
            }`}>
              ${data.savings.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between gap-6 mt-1 text-xs">
            <span className="text-gray-600">Savings Rate:</span>
            <span className={`font-medium ${
              isPositiveSavings ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {savingsRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Income vs Expense Chart Component
 *
 * Displays a composed chart showing income vs expenses over time with net savings.
 *
 * Features:
 * - Bars for income (green) and expenses (red)
 * - Line for net savings (blue/orange based on positive/negative)
 * - X-axis shows months (last 12 months)
 * - Y-axis shows currency amounts
 * - Tooltip with all values and savings rate
 * - Legend for easy identification
 * - Zero reference line for net savings
 * - Responsive container for all screen sizes
 * - Smooth animations on load
 *
 * @example
 * ```tsx
 * const data = [
 *   {
 *     month: 'Jan 2024',
 *     income: 5000,
 *     expenses: 3500,
 *     savings: 1500
 *   },
 *   // ... more months
 * ];
 *
 * <IncomeExpenseChart data={data} />
 * ```
 */
export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  // Calculate summary statistics
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;
  const avgSavingsRate = totalIncome > 0
    ? ((totalSavings / totalIncome) * 100).toFixed(1)
    : '0';

  const isEmpty = data.length === 0;
  const isPositiveSavings = totalSavings >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>
          {isEmpty ? (
            'No data available'
          ) : (
            <div className="flex flex-col gap-1 mt-1">
              <span>Monthly income, expenses, and net savings over time</span>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <span className="text-green-600">
                  Income: ${totalIncome.toFixed(2)}
                </span>
                <span className="text-red-600">
                  Expenses: ${totalExpenses.toFixed(2)}
                </span>
                <span className={isPositiveSavings ? 'text-blue-600' : 'text-orange-600'}>
                  Savings: ${totalSavings.toFixed(2)} ({avgSavingsRate}%)
                </span>
              </div>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm mt-1">Start tracking income and expenses to see trends</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
              />

              {/* Zero reference line for savings */}
              <ReferenceLine
                y={0}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                label={{ value: '$0', position: 'left', fill: '#94a3b8', fontSize: 12 }}
              />

              {/* Income bars (green) */}
              <Bar
                dataKey="income"
                name="Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />

              {/* Expense bars (red) */}
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />

              {/* Net savings line (blue/orange) */}
              <Line
                type="monotone"
                dataKey="savings"
                name="Net Savings"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
