'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Award,
  Info,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

/**
 * Props for the InsightsPanel component
 * @interface InsightsPanelProps
 * @property {Array} insights - Array of AI-generated insights
 * @property {string} insights[].type - Type of insight (pattern, alert, achievement, suggestion, projection)
 * @property {string} insights[].title - Short insight title
 * @property {string} insights[].message - Detailed insight message
 * @property {string} insights[].severity - Severity level (info, warning, success, danger)
 * @property {string} insights[].icon - Icon identifier
 * @property {string} [insights[].amount] - Optional amount for financial insights
 * @property {number} [insights[].percentage] - Optional percentage value
 */
interface InsightsPanelProps {
  insights: Array<{
    type: 'pattern' | 'alert' | 'achievement' | 'suggestion' | 'projection';
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'success' | 'danger';
    icon: string;
    amount?: string;
    percentage?: number;
  }>;
}

/**
 * Get icon component based on insight type and icon string
 */
const getIcon = (type: string, iconStr: string, severity: string) => {
  const iconProps = {
    className: 'h-5 w-5',
  };

  // Map icon strings to components
  switch (iconStr) {
    case 'trending-up':
      return <TrendingUp {...iconProps} />;
    case 'trending-down':
      return <TrendingDown {...iconProps} />;
    case 'alert':
      return <AlertCircle {...iconProps} />;
    case 'warning':
      return <AlertTriangle {...iconProps} />;
    case 'lightbulb':
      return <Lightbulb {...iconProps} />;
    case 'target':
      return <Target {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'check':
      return <CheckCircle2 {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'info':
    default:
      return <Info {...iconProps} />;
  }
};

/**
 * Get styling classes based on severity level
 */
const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'success':
      return {
        border: 'border-l-4 border-l-green-500',
        bg: 'bg-green-50',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-800',
      };
    case 'warning':
      return {
        border: 'border-l-4 border-l-yellow-500',
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-800',
      };
    case 'danger':
      return {
        border: 'border-l-4 border-l-red-500',
        bg: 'bg-red-50',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-800',
      };
    case 'info':
    default:
      return {
        border: 'border-l-4 border-l-blue-500',
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800',
      };
  }
};

/**
 * Get human-readable label for insight type
 */
const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'pattern':
      return 'Pattern Detected';
    case 'alert':
      return 'Alert';
    case 'achievement':
      return 'Achievement';
    case 'suggestion':
      return 'Suggestion';
    case 'projection':
      return 'Projection';
    default:
      return 'Insight';
  }
};

/**
 * Loading skeleton component
 */
const InsightsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/**
 * Insights Panel Component
 *
 * Displays AI-generated financial insights in a grid layout.
 * Each insight card shows:
 * - Type badge (Pattern, Alert, Achievement, etc.)
 * - Severity-colored icon and border
 * - Title and detailed message
 * - Optional amount or percentage data
 *
 * Features:
 * - Color-coded by severity (info, warning, success, danger)
 * - Icon-based visual indicators
 * - Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
 * - Empty state for when no insights are available
 * - Loading skeleton for async data loading
 *
 * @param {InsightsPanelProps} props - Component props
 * @returns {JSX.Element} Insights panel with cards
 */
export function InsightsPanel({ insights }: InsightsPanelProps) {
  // Empty state
  if (!insights || insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-400 mb-3">
              <Lightbulb className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 font-medium">No insights yet</p>
            <p className="text-gray-500 text-sm mt-1 max-w-md">
              Add more expenses and income to see patterns, alerts, and personalized suggestions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        <p className="text-sm text-gray-600">
          Personalized financial insights based on your spending patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const styles = getSeverityStyles(insight.severity);
          const icon = getIcon(insight.type, insight.icon, insight.severity);

          return (
            <Card
              key={`insight-${index}`}
              className={`${styles.border} ${styles.bg} transition-all hover:shadow-md`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`${styles.icon} mt-0.5`}>{icon}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Type Badge */}
                    <Badge className={`${styles.badge} mb-2 text-xs`}>
                      {getTypeLabel(insight.type)}
                    </Badge>

                    {/* Title */}
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {insight.title}
                    </h4>

                    {/* Message */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {insight.message}
                    </p>

                    {/* Optional Amount/Percentage */}
                    {(insight.amount || insight.percentage !== undefined) && (
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                        {insight.amount && (
                          <span className="text-gray-900">{insight.amount}</span>
                        )}
                        {insight.percentage !== undefined && (
                          <span className={styles.icon}>
                            {insight.percentage > 0 ? '+' : ''}
                            {insight.percentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Export loading skeleton for use in parent components
 */
export { InsightsSkeleton };
