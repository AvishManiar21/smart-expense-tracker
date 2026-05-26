import PropTypes from 'prop-types';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export default function BudgetAlerts({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const exceededAlerts = alerts.filter(alert => alert.percentageUsed >= 100);
  const warningAlerts = alerts.filter(alert => alert.percentageUsed >= 70 && alert.percentageUsed < 100);

  if (exceededAlerts.length === 0 && warningAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {/* Exceeded Alerts */}
      {exceededAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-2">
                Budget Exceeded ({exceededAlerts.length})
              </h3>
              <div className="space-y-2">
                {exceededAlerts.map((alert) => (
                  <div key={alert.budgetId} className="text-sm text-red-700">
                    <span className="font-medium">{alert.category?.name || 'Unknown'}:</span>{' '}
                    ${parseFloat(alert.spentAmount).toFixed(2)} spent of ${parseFloat(alert.budgetAmount).toFixed(2)} budget
                    ({alert.percentageUsed.toFixed(1)}%)
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                Budget Warning ({warningAlerts.length})
              </h3>
              <div className="space-y-2">
                {warningAlerts.map((alert) => (
                  <div key={alert.budgetId} className="text-sm text-yellow-700">
                    <span className="font-medium">{alert.category?.name || 'Unknown'}:</span>{' '}
                    ${parseFloat(alert.spentAmount).toFixed(2)} spent of ${parseFloat(alert.budgetAmount).toFixed(2)} budget
                    ({alert.percentageUsed.toFixed(1)}%)
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

BudgetAlerts.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      budgetId: PropTypes.string.isRequired,
      category: PropTypes.shape({
        name: PropTypes.string,
      }),
      budgetAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      spentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      percentageUsed: PropTypes.number.isRequired,
    })
  ),
};
