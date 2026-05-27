import PropTypes from 'prop-types';

export default function BudgetProgressBar({ percentage }) {
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-600';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBackgroundColor = () => {
    if (percentage >= 100) return 'bg-red-100';
    if (percentage >= 70) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const displayPercentage = Math.min(percentage, 100);

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className={`w-full h-3 ${getBackgroundColor()} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${getProgressColor()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${displayPercentage}%` }}
        ></div>
      </div>

      {/* Percentage Label */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Progress</span>
        <span className={`font-semibold ${
          percentage >= 100 ? 'text-red-600' :
          percentage >= 70 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

BudgetProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
};
