import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  decimal,
  boolean,
  date,
  index,
  unique,
} from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('USD').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories table
export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id),
    name: varchar('name', { length: 100 }).notNull(),
    icon: varchar('icon', { length: 50 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(),
    budgetLimit: decimal('budget_limit', { precision: 10, scale: 2 }),
    isDefault: boolean('is_default').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userNameUnique: unique('categories_user_id_name_unique').on(table.userId, table.name),
  })
);

// Expenses table
export const expenses = pgTable(
  'expenses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    categoryId: uuid('category_id')
      .references(() => categories.id)
      .notNull(),
    description: varchar('description', { length: 500 }).notNull(),
    date: date('date', { mode: 'date' }).notNull(),
    paymentMethod: varchar('payment_method', { length: 50 }).default('card').notNull(),
    receiptUrl: varchar('receipt_url', { length: 500 }),
    isRecurring: boolean('is_recurring').default(false).notNull(),
    recurringId: uuid('recurring_id').references(() => recurringExpenses.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    userIdDateIdx: index('expenses_user_id_date_idx').on(table.userId, table.date.desc()),
    categoryIdIdx: index('expenses_category_id_idx').on(table.categoryId),
  })
);

// Income table
export const income = pgTable(
  'income',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    source: varchar('source', { length: 255 }).notNull(),
    description: varchar('description', { length: 500 }),
    date: date('date', { mode: 'date' }).notNull(),
    isRecurring: boolean('is_recurring').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    userIdDateIdx: index('income_user_id_date_idx').on(table.userId, table.date.desc()),
  })
);

// Budgets table
export const budgets = pgTable(
  'budgets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: uuid('category_id')
      .references(() => categories.id)
      .notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    period: varchar('period', { length: 50 }).default('monthly').notNull(),
    startDate: date('start_date', { mode: 'date' }).notNull(),
    endDate: date('end_date', { mode: 'date' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userCategoryPeriodUnique: unique('budgets_user_category_period_unique').on(
      table.userId,
      table.categoryId,
      table.period
    ),
  })
);

// Recurring Expenses table
export const recurringExpenses = pgTable('recurring_expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id')
    .references(() => categories.id)
    .notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  frequency: varchar('frequency', { length: 50 }).notNull(),
  nextOccurrence: date('next_occurrence', { mode: 'date' }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
  income: many(income),
  budgets: many(budgets),
  categories: many(categories),
  recurringExpenses: many(recurringExpenses),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  expenses: many(expenses),
  budgets: many(budgets),
  recurringExpenses: many(recurringExpenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
  recurring: one(recurringExpenses, {
    fields: [expenses.recurringId],
    references: [recurringExpenses.id],
  }),
}));

export const incomeRelations = relations(income, ({ one }) => ({
  user: one(users, {
    fields: [income.userId],
    references: [users.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

export const recurringExpensesRelations = relations(recurringExpenses, ({ one, many }) => ({
  user: one(users, {
    fields: [recurringExpenses.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [recurringExpenses.categoryId],
    references: [categories.id],
  }),
  expenses: many(expenses),
}));
