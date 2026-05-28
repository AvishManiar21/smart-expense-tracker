// Analytics types
export interface MonthlySummary {
  period: {
    start: string;
    end: string;
  };
  totalExpenses: string;
  totalIncome: string;
  netSavings: string;
  savingsRate: string;
  expenseCount: number;
  topCategory: {
    name: string;
    amount: string;
    percentage: string;
  } | null;
  budgetStatus: {
    onTrack: number;
    warning: number;
    exceeded: number;
  };
  vsLastMonth: {
    expenseChange: string;
    incomeChange: string;
  };
}

export interface TrendData {
  month: string;
  monthKey: string;
  totalExpenses: number;
  totalIncome: number;
  netSavings: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: string;
  percentage: string;
  count: number;
  budgetAmount?: string | null;
  budgetPercentageUsed?: string | null;
  status?: 'exceeded' | 'warning' | 'good' | 'none';
}

export interface Insight {
  type: 'pattern' | 'alert' | 'achievement' | 'suggestion' | 'projection';
  title: string;
  message: string;
  severity: 'danger' | 'warning' | 'info' | 'success';
  icon: string;
  amount?: string;
  percentage?: string;
}

export interface ComparisonData {
  currentMonth: string;
  previousMonth: string;
  comparison: Array<{
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    thisMonth: string;
    lastMonth: string;
    change: string;
    percentChange: string;
  }>;
}

export interface IncomeVsExpenseData {
  month: string;
  monthFull: string;
  income: number;
  expenses: number;
  savings: number;
}
