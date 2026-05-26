import PropTypes from 'prop-types';
import { startOfMonth, endOfMonth, startOfYear, subMonths } from 'date-fns';

export default function IncomeSummary({ income }) {
  const now = new Date();

  // Calculate this month's total
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const thisMonthIncome = income
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= thisMonthStart && itemDate <= thisMonthEnd;
    })
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  // Calculate last month's total
  const lastMonthDate = subMonths(now, 1);
  const lastMonthStart = startOfMonth(lastMonthDate);
  const lastMonthEnd = endOfMonth(lastMonthDate);
  const lastMonthIncome = income
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= lastMonthStart && itemDate <= lastMonthEnd;
    })
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  // Calculate year-to-date total
  const yearStart = startOfYear(now);
  const yearToDateIncome = income
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= yearStart;
    })
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  // Calculate average monthly income (last 12 months)
  const twelveMonthsAgo = subMonths(now, 12);
  const last12MonthsIncome = income
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= twelveMonthsAgo;
    })
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const averageMonthlyIncome = last12MonthsIncome / 12;

  const summaryCards = [
    {
      title: 'This Month',
      amount: thisMonthIncome,
      icon: '📊',
      color: 'blue',
    },
    {
      title: 'Last Month',
      amount: lastMonthIncome,
      icon: '📅',
      color: 'purple',
    },
    {
      title: 'Year to Date',
      amount: yearToDateIncome,
      icon: '📈',
      color: 'green',
    },
    {
      title: 'Avg. Monthly',
      amount: averageMonthlyIncome,
      icon: '💰',
      color: 'yellow',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      purple: 'bg-purple-50 border-purple-200',
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className={`${getColorClasses(card.color)} border rounded-lg p-4 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${card.amount.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}

IncomeSummary.propTypes = {
  income: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};
