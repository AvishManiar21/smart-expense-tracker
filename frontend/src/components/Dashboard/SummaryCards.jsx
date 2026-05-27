import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Percent } from 'lucide-react';

/**
 * Summary Cards Component
 * Displays key financial metrics in card format
 */
export default function SummaryCards({ summary, loading, currency = 'USD' }) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const {
    totalExpenses,
    totalIncome,
    netSavings,
    savingsRate,
    vsLastMonth,
  } = summary;

  // Parse values
  const expenses = parseFloat(totalExpenses || 0);
  const income = parseFloat(totalIncome || 0);
  const savings = parseFloat(netSavings || 0);
  const rate = parseFloat(savingsRate || 0);
  const expenseChange = parseFloat(vsLastMonth?.expenseChange || 0);
  const incomeChange = parseFloat(vsLastMonth?.incomeChange || 0);

  // Helper to render change indicator
  const renderChange = (change, isExpense = false) => {
    if (change === 0) return null;

    // For expenses, decrease is good (green), increase is bad (red)
    // For income, increase is good (green), decrease is bad (red)
    const isPositive = isExpense ? change < 0 : change > 0;
    const Icon = change > 0 ? TrendingUp : TrendingDown;

    return (
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <Icon className="w-4 h-4 mr-1" />
        <span>{Math.abs(change).toFixed(1)}% vs last month</span>
      </div>
    );
  };

  // Cards configuration
  const cards = [
    {
      title: 'Total Expenses',
      value: `$${expenses.toFixed(2)}`,
      icon: DollarSign,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      change: renderChange(expenseChange, true),
    },
    {
      title: 'Total Income',
      value: `$${income.toFixed(2)}`,
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      change: renderChange(incomeChange, false),
    },
    {
      title: 'Net Savings',
      value: `$${savings.toFixed(2)}`,
      icon: PiggyBank,
      iconBg: savings >= 0 ? 'bg-blue-100' : 'bg-red-100',
      iconColor: savings >= 0 ? 'text-blue-600' : 'text-red-600',
      subtitle: savings < 0 ? 'Deficit this month' : 'Saved this month',
    },
    {
      title: 'Savings Rate',
      value: `${rate.toFixed(1)}%`,
      icon: Percent,
      iconBg: rate >= 20 ? 'bg-green-100' : rate >= 10 ? 'bg-yellow-100' : 'bg-red-100',
      iconColor: rate >= 20 ? 'text-green-600' : rate >= 10 ? 'text-yellow-600' : 'text-red-600',
      subtitle: rate >= 20 ? 'Excellent!' : rate >= 10 ? 'Good' : 'Could be better',
      progress: Math.min(rate, 100),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.iconBg}`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>

          {/* Value */}
          <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>

          {/* Change or Subtitle */}
          {card.change && <div className="mt-2">{card.change}</div>}
          {card.subtitle && !card.progress && (
            <p className="text-sm text-gray-500">{card.subtitle}</p>
          )}

          {/* Progress bar for savings rate */}
          {card.progress !== undefined && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    rate >= 20 ? 'bg-green-600' : rate >= 10 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${card.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

SummaryCards.propTypes = {
  summary: PropTypes.shape({
    totalExpenses: PropTypes.string,
    totalIncome: PropTypes.string,
    netSavings: PropTypes.string,
    savingsRate: PropTypes.string,
    vsLastMonth: PropTypes.shape({
      expenseChange: PropTypes.string,
      incomeChange: PropTypes.string,
    }),
  }),
  loading: PropTypes.bool,
  currency: PropTypes.string,
};
