import {
  users,
  expenses,
  income,
  categories,
  budgets,
  recurringExpenses
} from '@/lib/db/schema';

// Database table types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

export type Income = typeof income.$inferSelect;
export type NewIncome = typeof income.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

export type RecurringExpense = typeof recurringExpenses.$inferSelect;
export type NewRecurringExpense = typeof recurringExpenses.$inferInsert;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  currency?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  currency: string;
}

// Expense filter types
export interface ExpenseFilters {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'amount' | 'category';
  sortOrder?: 'asc' | 'desc';
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

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

// Budget Alert types
export interface BudgetAlert {
  budgetId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  budgetAmount: string;
  spent: string;
  remaining: string;
  percentUsed: number;
  status: 'exceeded' | 'warning' | 'on-track';
}
