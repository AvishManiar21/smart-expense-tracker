import {
  users,
  expenses,
  income,
  categories,
  budgets,
  recurringExpenses
} from '@/lib/db/schema';

// User types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Expense types
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

// Income types
export type Income = typeof income.$inferSelect;
export type NewIncome = typeof income.$inferInsert;

// Category types
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

// Budget types
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

// Recurring Expense types
export type RecurringExpense = typeof recurringExpenses.$inferSelect;
export type NewRecurringExpense = typeof recurringExpenses.$inferInsert;
