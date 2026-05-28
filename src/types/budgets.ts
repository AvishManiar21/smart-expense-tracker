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
