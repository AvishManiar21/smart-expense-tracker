'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/date';

/**
 * Props for the SummaryCards component
 * @interface SummaryCardsProps
 * @property {object} summary - Financial summary data
 * @property {string} summary.totalExpenses - Total expenses amount
 * @property {string} summary.totalIncome - Total income amount
 * @property {string} summary.netSavings - Net savings amount (income - expenses)
 * @property {number} summary.savingsRate - Savings rate percentage (0-100)
 * @property {object} summary.vsLastMonth - Month-over-month comparison
 * @property {number} summary.vsLastMonth.expenseChange - Expense change percentage
 * @property {number} summary.vsLastMonth.incomeChange - Income change percentage
 */
interface SummaryCardsProps {
  summary: {
    totalExpenses: string;
    totalIncome: string;
    netSavings: string;
    savingsRate: number;
    vsLastMonth: {
      expenseChange: number;
      incomeChange: number;
    };
  };
}

/**
 * Summary Cards Component
 *
 * Displays four key financial metric cards with month-over-month comparisons:
 * 1. Total Expenses - Shows total spending with trend indicator
 * 2. Total Income - Shows total income with trend indicator
 * 3. Net Savings - Shows income minus expenses with color coding
 * 4. Savings Rate - Shows percentage saved with progress indicator
 *
 * Features:
 * - Color-coded trend indicators (green for positive, red for negative)
 * - Icons from lucide-react for visual clarity
 * - Responsive grid layout
 * - Accessible card design with proper semantic HTML
 *
 * @param {SummaryCardsProps} props - Component props
 * @returns {JSX.Element} Grid of summary cards
 */
export function SummaryCards({ summary }: SummaryCardsProps) {
  const {
    totalExpenses,
    totalIncome,
    netSavings,
    savingsRate,
    vsLastMonth,
  } = summary;

  // Parse currency strings to numbers for comparison
  const netSavingsValue = parseFloat(netSavings.replace(/[^0-9.-]+/g, ''));
  const isPositiveSavings = netSavingsValue >= 0;

  // Determine savings rate quality
  const getSavingsRateStatus = (rate: number): { text: string; color: string } => {
    if (rate >= 20) return { text: 'Excellent!', color: 'text-green-600' };
    if (rate >= 10) return { text: 'Good', color: 'text-blue-600' };
    if (rate >= 5) return { text: 'Fair', color: 'text-yellow-600' };
    return { text: 'Need improvement', color: 'text-red-600' };
  };

  const savingsStatus = getSavingsRateStatus(savingsRate);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Wallet className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{totalExpenses}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {vsLastMonth.expenseChange !== 0 && (
              <>
                {vsLastMonth.expenseChange > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-red-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                )}
                <span className={vsLastMonth.expenseChange > 0 ? 'text-red-500' : 'text-green-500'}>
                  {Math.abs(vsLastMonth.expenseChange).toFixed(1)}%
                </span>
                <span className="ml-1">vs last month</span>
              </>
            )}
            {vsLastMonth.expenseChange === 0 && <span>No change from last month</span>}
          </div>
        </CardContent>
      </Card>

      {/* Total Income Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalIncome}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {vsLastMonth.incomeChange !== 0 && (
              <>
                {vsLastMonth.incomeChange > 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={vsLastMonth.incomeChange > 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(vsLastMonth.incomeChange).toFixed(1)}%
                </span>
                <span className="ml-1">vs last month</span>
              </>
            )}
            {vsLastMonth.incomeChange === 0 && <span>No change from last month</span>}
          </div>
        </CardContent>
      </Card>

      {/* Net Savings Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <PiggyBank className={`h-4 w-4 ${isPositiveSavings ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositiveSavings ? 'text-green-600' : 'text-red-600'}`}>
            {netSavings}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isPositiveSavings ? 'Great job saving!' : 'Expenses exceed income'}
          </p>
        </CardContent>
      </Card>

      {/* Savings Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
          <div className="mt-2">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  savingsRate >= 20 ? 'bg-green-600' :
                  savingsRate >= 10 ? 'bg-blue-600' :
                  savingsRate >= 5 ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              />
            </div>
            <p className={`text-xs ${savingsStatus.color} font-medium`}>
              {savingsStatus.text}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
