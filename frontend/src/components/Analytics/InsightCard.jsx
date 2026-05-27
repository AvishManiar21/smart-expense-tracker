import PropTypes from 'prop-types';
import { AlertCircle, Info, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';

/**
 * Insight Card Component
 * Displays a single AI-generated insight
 */
export default function InsightCard({ insight }) {
  if (!insight) return null;

  const { type, title, message, severity, amount, percentage } = insight;

  // Severity configuration
  const severityConfig = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
    },
  };

  // Type icons
  const typeIcons = {
    pattern: TrendingUp,
    alert: AlertCircle,
    achievement: CheckCircle,
    suggestion: Lightbulb,
    projection: TrendingUp,
  };

  const config = severityConfig[severity] || severityConfig.info;
  const IconComponent = config.icon;
  const TypeIcon = typeIcons[type] || Info;

  return (
    <div
      className={`${config.bg} ${config.border} border-l-4 rounded-lg p-4 hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className={`text-sm font-semibold ${config.titleColor} mb-1`}>
            {title}
          </h4>

          {/* Message */}
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>

          {/* Additional info */}
          {(amount || percentage) && (
            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
              {amount && (
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Amount:</span>
                  <span className={`font-semibold ${config.iconColor}`}>
                    ${parseFloat(amount).toFixed(2)}
                  </span>
                </div>
              )}
              {percentage && (
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Change:</span>
                  <span className={`font-semibold ${config.iconColor}`}>
                    {parseFloat(percentage).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Type badge */}
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.iconColor} border ${config.border}`}>
              <TypeIcon className="w-3 h-3 mr-1" />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

InsightCard.propTypes = {
  insight: PropTypes.shape({
    type: PropTypes.oneOf(['pattern', 'alert', 'achievement', 'suggestion', 'projection']).isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(['info', 'warning', 'success', 'danger']).isRequired,
    icon: PropTypes.string,
    amount: PropTypes.string,
    percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};
