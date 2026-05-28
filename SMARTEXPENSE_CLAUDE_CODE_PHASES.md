# 🚀 SmartExpense Tracker — Claude Code Phase Instructions
> **How to use:** Open your project in Claude Code and say **"Execute Phase 1"**, **"Execute Phase 2"**, etc.
> Claude Code will use the appropriate agents and follow the instructions for that phase automatically.

---

## 📋 MASTER CONFIGURATION
> **Paste this at the very top of your Claude Code session before starting any phase.**

```
PROJECT: SmartExpense Tracker
STACK:
  - Framework:  Next.js 14 with App Router (TypeScript strict mode)
  - Language:   TypeScript everywhere (no JavaScript)
  - Database:   PostgreSQL (port 5433)
  - ORM:        Drizzle ORM (drizzle-orm/pg-core)
  - Auth:       NextAuth.js v5 (beta) with JWT sessions
  - Styling:    Tailwind CSS + Shadcn/ui + class-variance-authority
  - Charts:     Recharts
  - Forms:      React Hook Form + Zod (@hookform/resolvers)
  - Data Fetch: TanStack Query + fetch API (Next.js extended)
  - Testing:    Vitest + React Testing Library + Playwright
  - Deployment: Vercel (single deployment - frontend + backend together)

AGENTS AVAILABLE:
  - Web Development Agent   → .claude/agents/web-dev-agent.md
  - Data Analysis Agent     → .claude/agents/data-analysis-agent.md
  - DevOps Agent            → .claude/agents/devops-agent.md
  - General Purpose Agent   → .claude/agents/general-purpose-agent.md

RULES:
  - Always use TypeScript with strict mode (no any types)
  - Always define interfaces and types for all data structures
  - Always use Zod for validation (both server and client)
  - Always use Shadcn/ui components (not custom from scratch)
  - Always use Next.js App Router patterns (not Pages Router)
  - Always use Server Components by default, Client Components only when needed
  - Always use Drizzle ORM (never raw SQL)
  - Always use NextAuth.js session (never manual JWT)
  - File structure must match Next.js 14 App Router conventions exactly
```

---

## 🗂️ PROJECT STRUCTURE REFERENCE
```
smart-expense-tracker/
├── src/
│   ├── app/                        (Next.js App Router)
│   │   ├── (auth)/                 (Route group - no layout)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/            (Route group - with layout)
│   │   │   ├── layout.tsx          (Sidebar + Navbar)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── expenses/page.tsx
│   │   │   ├── income/page.tsx
│   │   │   ├── budget/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/                    (API Route Handlers)
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── expenses/route.ts
│   │   │   ├── expenses/[id]/route.ts
│   │   │   ├── income/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── budgets/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   └── reports/route.ts
│   │   ├── layout.tsx              (Root layout)
│   │   └── page.tsx                (Root page → redirect)
│   ├── components/
│   │   ├── ui/                     (Shadcn/ui components)
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── expenses/
│   │   ├── income/
│   │   ├── budget/
│   │   ├── analytics/
│   │   ├── reports/
│   │   └── common/
│   ├── lib/
│   │   ├── db/                     (Drizzle ORM)
│   │   │   ├── index.ts            (DB connection)
│   │   │   ├── schema.ts           (All table definitions)
│   │   │   └── seed.ts             (Seed data)
│   │   ├── auth/
│   │   │   ├── auth.ts             (NextAuth config)
│   │   │   └── auth.config.ts
│   │   ├── validations/            (Zod schemas)
│   │   ├── utils/                  (Helper functions)
│   │   └── hooks/                  (Custom React hooks)
│   ├── types/                      (TypeScript interfaces)
│   └── middleware.ts               (NextAuth middleware)
├── drizzle/                        (Drizzle migrations)
├── public/
├── docker-compose.yml
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── .env.example
```

---

## 🗺️ ALL PHASES AT A GLANCE

| # | Phase Name | Agent(s) Used | Day | Key Deliverables |
|---|-----------|---------------|-----|-----------------|
| **1** | Foundation & Project Setup | General Purpose + DevOps | 1-2 | Next.js init, Docker, Drizzle schema, env config, seed data |
| **2** | Authentication System | Web Dev | 3-4 | NextAuth.js v5, login, register, password reset, middleware |
| **3** | Expense Management | Web Dev | 5-7 | Expense CRUD API routes, categories, filters, pagination, CSV |
| **4** | Income & Budget Management | Web Dev | 8-9 | Income tracking, budgets, recurring expenses, alerts, layout |
| **5** | Analytics & Dashboard | Data Analysis + Web Dev | 10-12 | Dashboard, Recharts, Server Components, AI insights |
| **6** | Reports & Export | Data Analysis + Web Dev | 13-14 | Monthly/yearly reports, PDF export, CSV export, date ranges |
| **7** | Settings & User Profile | Web Dev | 15 | Profile editing, password change, category manager, stats |
| **8** | Testing & Quality Assurance | Web Dev + General Purpose | 16-17 | Vitest, Playwright E2E, TypeScript checks, security audit |
| **9** | CI/CD & Deployment | DevOps | 18-19 | GitHub Actions, Vercel deploy, Sentry, Vercel Analytics |
| **10** | Final Polish & Optimization | General Purpose + Web Dev | 20 | Suspense, error boundaries, accessibility, docs, launch |

---

## ⚡ PHASE EXECUTION COMMANDS

```bash
# How to run each phase — just say this in Claude Code:

"Execute Phase 1"    →  Next.js setup, Docker, Drizzle schema
"Execute Phase 2"    →  NextAuth.js v5 authentication
"Execute Phase 3"    →  Expense CRUD, categories, CSV import
"Execute Phase 4"    →  Income, budgets, recurring, layout
"Execute Phase 5"    →  Dashboard, charts, analytics, insights
"Execute Phase 6"    →  Reports, PDF/CSV export
"Execute Phase 7"    →  Settings, profile, categories
"Execute Phase 8"    →  Vitest, Playwright, TypeScript audit
"Execute Phase 9"    →  CI/CD, deploy to Vercel, monitoring
"Execute Phase 10"   →  Polish, optimize, document, launch

# Other useful commands:
"Run the Phase X verification checklist"
"Phase X Task Y failed with error: [error]. Fix it."
"Re-run Phase X Task Y"
"What is the current status of Phase X?"
"Execute Phase X but skip tasks Y and Z"
```

---

## 📊 PHASE METRICS OVERVIEW

| Phase | Files Created | API Routes | Components | Tests |
|-------|:------------:|:----------:|:----------:|:-----:|
| Phase 1 | ~20 | 0 | 0 | 0 |
| Phase 2 | ~15 | 6 | 4 | ✅ |
| Phase 3 | ~20 | 8 | 8 | ✅ |
| Phase 4 | ~25 | 12 | 12 | ✅ |
| Phase 5 | ~18 | 5 | 8 | ✅ |
| Phase 6 | ~12 | 4 | 6 | ✅ |
| Phase 7 | ~10 | 4 | 5 | ✅ |
| Phase 8 | ~20 | 0 | 0 | ✅ |
| Phase 9 | ~12 | 1 | 0 | ✅ |
| Phase 10 | ~10 | 0 | 5 | ✅ |
| **TOTAL** | **~162** | **~40** | **~48** | **All** |

---

## 🤖 AGENT USAGE MAP

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT ASSIGNMENT                      │
├─────────────────────────┬───────────────────────────────┤
│ General Purpose Agent   │ Phase 1, 8, 10                │
│ Web Development Agent   │ Phase 2, 3, 4, 7, 8, 10       │
│ Data Analysis Agent     │ Phase 5, 6                    │
│ DevOps Agent            │ Phase 1, 9                    │
└─────────────────────────┴───────────────────────────────┘

General Purpose Agent → Phase 1  (project init, structure)
                     → Phase 8   (quality checks, TypeScript audit)
                     → Phase 10  (optimization, documentation)

Web Development Agent → Phase 2  (NextAuth.js + auth UI)
                     → Phase 3   (expenses API routes + UI)
                     → Phase 4   (income + budget + layout)
                     → Phase 7   (settings + profile)
                     → Phase 8   (Vitest testing)
                     → Phase 10  (UI polish, Suspense)

Data Analysis Agent  → Phase 5   (analytics engine + insights)
                     → Phase 6   (reports + CSV/PDF generation)

DevOps Agent         → Phase 1   (Docker + environment setup)
                     → Phase 9   (CI/CD + Vercel deployment)
```

---

## 🔗 TECH STACK QUICK REFERENCE

```
NEXT.JS 14 (Full Stack - Single App)
──────────────────────────────────────────────────────
Framework        Next.js 14 App Router (TypeScript strict)
Language         TypeScript everywhere
Database         PostgreSQL (port 5433)
ORM              Drizzle ORM (drizzle-orm/pg-core)
Auth             NextAuth.js v5 (beta) - JWT sessions
Styling          Tailwind CSS + Shadcn/ui (Radix UI)
Icons            lucide-react
Charts           Recharts
Forms            React Hook Form + Zod
Validation       Zod schemas (shared server + client)
Data Fetching    TanStack Query + fetch API
State            React Server Components + TanStack Query
Password         bcryptjs (12 rounds)
File Upload      Next.js built-in + Cloudinary
PDF Export       PDFKit
CSV              csv-parser + json2csv

TESTING
──────────────────────────────────────────────────────
Unit/Component   Vitest + React Testing Library
E2E              Playwright
API Testing      Vitest + fetch mocking
Type Checking    TypeScript compiler (tsc --noEmit)

DEVOPS & MONITORING
──────────────────────────────────────────────────────
Containers       Docker + Docker Compose
CI/CD            GitHub Actions
Hosting          Vercel (frontend + backend together)
Database Host    Railway (PostgreSQL)
Error Tracking   Sentry
Analytics        Vercel Analytics
Logging          Next.js built-in + Winston
```

---

---

# ═══════════════════════════════════════
# PHASE 1: FOUNDATION & PROJECT SETUP
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 1"` in Claude Code
> **Agent:** General Purpose Agent (Primary) + DevOps Agent (Secondary)
> **Duration:** Day 1-2
> **Goal:** Next.js 14 scaffolding, Drizzle schema, Docker, env config, seed data

---

## PHASE 1 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 1: Foundation & Project Setup
AGENTS: General Purpose Agent + DevOps Agent

=== TASK 1: Initialize Next.js 14 Project ===

Using the General Purpose Agent, create the SmartExpense Tracker:

1. Create root directory: smart-expense-tracker/

2. Initialize Next.js 14 with TypeScript:
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

3. Install core dependencies:
   npm install next-auth@beta drizzle-orm @auth/drizzle-adapter
   npm install pg @neondatabase/serverless
   npm install bcryptjs
   npm install zod @hookform/resolvers react-hook-form
   npm install @tanstack/react-query @tanstack/react-query-devtools
   npm install recharts
   npm install lucide-react
   npm install date-fns
   npm install class-variance-authority clsx tailwind-merge
   npm install pdfkit csv-parser json2csv nodemailer
   npm install uuid

4. Install Shadcn/ui:
   npx shadcn-ui@latest init
   (choose: TypeScript, Default style, Slate base color, src/app globals.css)

   Then add these Shadcn components:
   npx shadcn-ui@latest add button input label card
   npx shadcn-ui@latest add form select checkbox radio-group
   npx shadcn-ui@latest add dialog sheet modal
   npx shadcn-ui@latest add table pagination
   npx shadcn-ui@latest add dropdown-menu avatar
   npx shadcn-ui@latest add progress badge alert
   npx shadcn-ui@latest add tabs separator skeleton
   npx shadcn-ui@latest add toast sonner
   npx shadcn-ui@latest add popover calendar
   npx shadcn-ui@latest add chart

5. Install dev dependencies:
   npm install -D drizzle-kit
   npm install -D vitest @vitejs/plugin-react jsdom
   npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
   npm install -D playwright @playwright/test
   npm install -D @types/bcryptjs @types/pg @types/nodemailer @types/uuid @types/pdfkit

6. Create folder structure:
   src/app/(auth)/login/
   src/app/(auth)/register/
   src/app/(auth)/forgot-password/
   src/app/(auth)/reset-password/
   src/app/(dashboard)/dashboard/
   src/app/(dashboard)/expenses/
   src/app/(dashboard)/income/
   src/app/(dashboard)/budget/
   src/app/(dashboard)/analytics/
   src/app/(dashboard)/reports/
   src/app/(dashboard)/settings/
   src/app/api/auth/[...nextauth]/
   src/app/api/expenses/
   src/app/api/expenses/[id]/
   src/app/api/income/
   src/app/api/income/[id]/
   src/app/api/categories/
   src/app/api/categories/[id]/
   src/app/api/budgets/
   src/app/api/budgets/[id]/
   src/app/api/analytics/
   src/app/api/reports/
   src/app/api/health/
   src/components/ui/          (Shadcn components go here)
   src/components/auth/
   src/components/dashboard/
   src/components/expenses/
   src/components/income/
   src/components/budget/
   src/components/analytics/
   src/components/reports/
   src/components/common/
   src/lib/db/
   src/lib/auth/
   src/lib/validations/
   src/lib/utils/
   src/lib/hooks/
   src/types/
   drizzle/

=== TASK 2: Environment Configuration ===

Create FILE: .env.example
---
# Database (port 5433 for new stack)
DATABASE_URL="postgresql://postgres:password@localhost:5433/expense_tracker"

# NextAuth.js v5
NEXTAUTH_SECRET="your-nextauth-secret-min-32-chars-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_NAME="SmartExpense Tracker"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Email (for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASSWORD=""
EMAIL_FROM="noreply@smartexpense.com"

# File Upload (Cloudinary - optional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Sentry (optional)
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""
---

=== TASK 3: Drizzle ORM Setup ===

Create FILE: drizzle.config.ts
---
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
---

Create FILE: src/lib/db/index.ts
---
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
---

Create FILE: src/lib/db/schema.ts with complete Drizzle schema:
---
import {
  pgTable, uuid, varchar, text, decimal,
  boolean, date, timestamp, index, uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 100 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  icon: varchar('icon', { length: 10 }).notNull(),
  color: varchar('color', { length: 7 }).notNull(),
  budgetLimit: decimal('budget_limit', { precision: 10, scale: 2 }),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userNameIdx: uniqueIndex('categories_user_name_idx').on(table.userId, table.name),
}));

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  description: text('description').notNull(),
  date: date('date').notNull(),
  paymentMethod: varchar('payment_method', { length: 10 }).notNull().default('card'),
  receiptUrl: varchar('receipt_url', { length: 500 }),
  isRecurring: boolean('is_recurring').notNull().default(false),
  recurringId: uuid('recurring_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userDateIdx: index('expenses_user_date_idx').on(table.userId, table.date),
  categoryIdx: index('expenses_category_idx').on(table.categoryId),
  deletedIdx: index('expenses_deleted_idx').on(table.deletedAt),
}));

export const income = pgTable('income', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  source: varchar('source', { length: 50 }).notNull(),
  description: text('description'),
  date: date('date').notNull(),
  isRecurring: boolean('is_recurring').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  userDateIdx: index('income_user_date_idx').on(table.userId, table.date),
}));

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  period: varchar('period', { length: 10 }).notNull().default('monthly'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userCategoryPeriodIdx: uniqueIndex('budgets_user_category_period_idx')
    .on(table.userId, table.categoryId, table.period),
}));

export const recurringExpenses = pgTable('recurring_expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  description: text('description').notNull(),
  frequency: varchar('frequency', { length: 10 }).notNull(),
  nextOccurrence: date('next_occurrence').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  expenses: many(expenses),
  income: many(income),
  categories: many(categories),
  budgets: many(budgets),
  recurringExpenses: many(recurringExpenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, { fields: [expenses.userId], references: [users.id] }),
  category: one(categories, { fields: [expenses.categoryId], references: [categories.id] }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.userId], references: [users.id] }),
  expenses: many(expenses),
  budgets: many(budgets),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(users, { fields: [budgets.userId], references: [users.id] }),
  category: one(categories, { fields: [budgets.categoryId], references: [categories.id] }),
}));

// TypeScript types inferred from schema
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
---

=== TASK 4: Database Seed File ===

Create FILE: src/lib/db/seed.ts
Default categories with TypeScript:
- Food & Dining (🍔, #FF6B6B)
- Transport (🚗, #4ECDC4)
- Entertainment (🎬, #45B7D1)
- Bills & Utilities (💡, #96CEB4)
- Shopping (🛍️, #FFEAA7)
- Health & Medical (🏥, #DDA0DD)
- Education (📚, #98D8C8)
- Travel (✈️, #F7DC6F)
- Personal Care (💅, #BB8FCE)
- Other (📦, #AEB6BF)

=== TASK 5: TypeScript Types ===

Create FILE: src/types/index.ts
Define all shared TypeScript interfaces:
- ApiResponse<T>: { success: boolean, data: T, message: string }
- ApiError: { success: false, message: string, errors?: ZodError[] }
- PaginatedResponse<T>: { data: T[], pagination: Pagination }
- Pagination: { page, limit, total, pages }
- ExpenseWithCategory: Expense & { category: Category }
- BudgetWithStatus: Budget & { spentAmount, remainingAmount, percentageUsed, status }
- InsightType: 'pattern' | 'alert' | 'achievement' | 'suggestion' | 'projection'
- InsightSeverity: 'info' | 'warning' | 'success' | 'danger'
- Insight: { type, title, message, severity, icon, amount?, percentage? }

=== TASK 6: Zod Validation Schemas ===

Create FILE: src/lib/validations/expense.ts
- createExpenseSchema: amount, categoryId, description, date, paymentMethod
- updateExpenseSchema: all fields optional
- expenseFiltersSchema: page, limit, startDate, endDate, categoryId, search, sortBy

Create FILE: src/lib/validations/auth.ts
- registerSchema: name, email, password (strong), confirmPassword
- loginSchema: email, password
- forgotPasswordSchema: email
- resetPasswordSchema: token, password, confirmPassword

Create FILE: src/lib/validations/budget.ts
- createBudgetSchema: categoryId, amount, period
- updateBudgetSchema: amount, period optional

=== TASK 7: Docker Setup ===

Using the DevOps Agent, create:

Create FILE: docker-compose.yml
---
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: expense_tracker_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: expense_tracker
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: expense_tracker_redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
---

Note: PostgreSQL runs on port 5433 (not 5432) for the new stack.

=== TASK 8: Next.js Configuration ===

Update FILE: next.config.ts
- Enable TypeScript strict checking
- Configure image domains
- Add security headers
- Set up redirects (/ → /dashboard)
- Bundle analyzer setup

Create FILE: src/lib/utils/cn.ts
- cn() utility using clsx + tailwind-merge
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }

=== TASK 9: Vitest Configuration ===

Create FILE: vitest.config.ts
---
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: { global: { lines: 70, functions: 70 } }
    }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
});
---

Create FILE: src/test/setup.ts
- Import @testing-library/jest-dom
- Mock next/navigation
- Mock next-auth/react

=== TASK 10: Package.json Scripts ===

Update FILE: package.json scripts:
- "dev": "next dev --turbo"
- "build": "next build"
- "start": "next start"
- "lint": "next lint"
- "type-check": "tsc --noEmit"
- "test": "vitest"
- "test:ui": "vitest --ui"
- "test:coverage": "vitest run --coverage"
- "test:e2e": "playwright test"
- "db:generate": "drizzle-kit generate:pg"
- "db:push": "drizzle-kit push:pg"
- "db:migrate": "drizzle-kit migrate"
- "db:seed": "tsx src/lib/db/seed.ts"
- "db:studio": "drizzle-kit studio"
- "format": "prettier --write ."

=== TASK 11: README ===

Create FILE: README.md with:
- Project overview and features
- New tech stack table (Next.js 14 monolith)
- Prerequisites
- Step-by-step setup instructions
- Development commands
- Database setup with Drizzle
- Testing instructions
- Deployment to Vercel guide

=== VERIFICATION CHECKLIST ===
After completing Phase 1, verify:
[ ] Next.js dev server runs: npm run dev (port 3000)
[ ] TypeScript compiles: npm run type-check (zero errors)
[ ] PostgreSQL in Docker on port 5433: docker-compose up -d postgres
[ ] Drizzle schema pushed: npm run db:push
[ ] Seed data applied: npm run db:seed
[ ] Drizzle Studio opens: npm run db:studio
[ ] Shadcn/ui components installed in src/components/ui/
[ ] .env file created from .env.example
```

---
## ✅ PHASE 1 EXPECTED OUTPUT
```
Files Created: ~20 files
Directories: ~35 folders
Docker: PostgreSQL (5433) + Redis containers ready
Database: Schema applied with 6 tables + seed data (Drizzle)
Dev server: http://localhost:3000 running without errors
TypeScript: Zero type errors
```

---

---

# ═══════════════════════════════════════
# PHASE 2: AUTHENTICATION SYSTEM
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 2"` in Claude Code
> **Agent:** Web Development Agent (Primary)
> **Duration:** Day 3-4
> **Goal:** NextAuth.js v5 with credentials, sessions, middleware, auth UI

---

## PHASE 2 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 2: Authentication System
AGENT: Web Development Agent

=== BACKEND: NextAuth.js v5 Setup ===

TASK 1: NextAuth Configuration
Create FILE: src/lib/auth/auth.config.ts
- Credentials provider configuration
- Zod validation for login credentials
- bcryptjs password comparison
- Return user object on success

Create FILE: src/lib/auth/auth.ts
- NextAuth() configuration with DrizzleAdapter
- JWT strategy (7 day sessions)
- Session callback: include userId in session
- JWT callback: include userId in token
- signIn callback: validate user exists
- Authorized callback for middleware
- Export: auth, signIn, signOut, handlers

Create FILE: src/app/api/auth/[...nextauth]/route.ts
- Export GET and POST from NextAuth handlers

TASK 2: NextAuth Middleware
Create FILE: src/middleware.ts
- Protect all (dashboard) routes
- Redirect unauthenticated users to /login
- Redirect authenticated users away from /login /register
- Use NextAuth auth() in middleware
- Configure matcher for protected paths

TASK 3: Password & Auth Utilities
Create FILE: src/lib/utils/password.ts
- hashPassword(password: string): Promise<string>
  bcryptjs hash with 12 rounds
- comparePassword(password: string, hash: string): Promise<boolean>
  bcryptjs compare
- validatePasswordStrength(password: string): string[]
  Returns array of error messages
  Rules: min 8 chars, uppercase, lowercase, number, special char

Create FILE: src/lib/utils/tokens.ts
- generateResetToken(): string
  crypto.randomBytes(32).toString('hex')
- hashToken(token: string): string
  crypto.createHash('sha256') hash
- isTokenExpired(expiry: Date): boolean

TASK 4: Auth API Routes
Create FILE: src/app/api/auth/register/route.ts
POST handler:
- Parse body with registerSchema (Zod)
- Check if email exists in DB (Drizzle)
- Hash password (bcryptjs, 12 rounds)
- Insert user into DB
- Return: { success: true, message: "Account created" }
- Errors: 409 if email exists, 400 if validation fails

Create FILE: src/app/api/auth/forgot-password/route.ts
POST handler:
- Parse body with forgotPasswordSchema
- Find user by email
- Generate reset token + hash it
- Store hashed token + expiry (1hr) in DB (Drizzle update)
- Send email with reset link
- Always return same success message (security)

Create FILE: src/app/api/auth/reset-password/route.ts
POST handler:
- Parse body with resetPasswordSchema
- Hash the provided token
- Find user where resetToken matches + not expired
- Hash new password
- Update user: new passwordHash, clear resetToken
- Return success

Create FILE: src/lib/utils/email.ts
- sendPasswordResetEmail(email, token, name): Promise<void>
  Uses nodemailer with SMTP config from env
  HTML email template with reset link

=== FRONTEND: Authentication UI ===

TASK 5: Auth Layout
Create FILE: src/app/(auth)/layout.tsx
Server Component:
- Check if user is already logged in → redirect to /dashboard
- Centered layout with card
- App branding (logo text + tagline)
- No sidebar/navbar

TASK 6: Register Page
Create FILE: src/app/(auth)/register/page.tsx
Server Component with metadata

Create FILE: src/components/auth/RegisterForm.tsx
Client Component ('use client'):
- React Hook Form + Zod (registerSchema)
- Fields: name, email, password, confirmPassword
- Real-time password strength indicator (4 rules)
- Password match validation
- Submit: POST /api/auth/register → then signIn()
- Loading state during submit
- Error display with Shadcn Alert
- Link to /login
- TypeScript types for all props

TASK 7: Login Page
Create FILE: src/app/(auth)/login/page.tsx
Server Component with metadata

Create FILE: src/components/auth/LoginForm.tsx
Client Component ('use client'):
- React Hook Form + Zod (loginSchema)
- Fields: email, password
- Show/hide password toggle (Shadcn Button + Eye icon)
- Submit: NextAuth signIn('credentials', {...})
- Handle: CredentialsSignin error → "Invalid email or password"
- Loading state during submit
- Error display
- "Forgot password?" link
- Link to /register
- TypeScript strict types

TASK 8: Forgot Password Page
Create FILE: src/app/(auth)/forgot-password/page.tsx
Create FILE: src/components/auth/ForgotPasswordForm.tsx
Client Component:
- Email field with Zod validation
- POST /api/auth/forgot-password
- Success state: "Check your email" message
- Back to login link

TASK 9: Reset Password Page
Create FILE: src/app/(auth)/reset-password/page.tsx
Create FILE: src/components/auth/ResetPasswordForm.tsx
Client Component:
- Get token from URL searchParams
- New password + confirm password
- Password strength indicator
- POST /api/auth/reset-password with token
- Success: redirect to /login with toast
- Invalid/expired token: error state

TASK 10: Session Utilities
Create FILE: src/lib/auth/session.ts
Server-side session helpers:
- getCurrentUser(): Promise<User | null>
  Calls auth() and returns full user from DB
- requireAuth(): Promise<User>
  Throws redirect to /login if not authenticated
  Use in Server Components and API routes

TASK 11: Auth Tests
Create FILE: src/test/auth/register.test.ts
Vitest tests:
- POST /api/auth/register: valid data creates user
- POST /api/auth/register: duplicate email returns 409
- POST /api/auth/register: weak password returns 400
- POST /api/auth/register: missing fields returns 400

Create FILE: src/test/components/LoginForm.test.tsx
Vitest + RTL:
- Renders all fields
- Validates email format
- Validates required fields
- Shows loading on submit
- Displays error on failure

=== VERIFICATION CHECKLIST ===
[ ] Register: creates user in DB, redirects to dashboard
[ ] Login: NextAuth session created, redirected to dashboard
[ ] Protected routes: redirect to /login when not authenticated
[ ] Authenticated routes (/login): redirect to /dashboard
[ ] Forgot password: email sent (check console in dev)
[ ] Reset password: password updated in DB
[ ] session.ts: getCurrentUser() returns user data
[ ] All auth tests pass: npm test
[ ] TypeScript: npm run type-check (zero errors)
```

---
## ✅ PHASE 2 EXPECTED OUTPUT
```
Files Created: ~15 files
API Routes: 4 auth routes + NextAuth handler
Frontend: Login, Register, Forgot/Reset password pages
Auth: NextAuth.js v5 sessions working
Security: bcryptjs hashing, Zod validation, rate limiting
Tests: Auth tests passing with Vitest
TypeScript: Strict types on all auth files
```

---

---

# ═══════════════════════════════════════
# PHASE 3: EXPENSE MANAGEMENT
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 3"` in Claude Code
> **Agent:** Web Development Agent (Primary)
> **Duration:** Day 5-7
> **Goal:** Expense CRUD API routes, categories, filtering, pagination, CSV import

---

## PHASE 3 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 3: Expense Management System
AGENT: Web Development Agent

=== BACKEND: API Route Handlers ===

TASK 1: Categories API
Create FILE: src/app/api/categories/route.ts
GET handler:
- Call requireAuth() for user session
- Drizzle query: get system categories (userId IS NULL) + user categories
- Include expense count per category
- Return typed response

POST handler:
- requireAuth()
- Validate body with createCategorySchema (Zod)
- Check duplicate name for user (Drizzle)
- Insert category
- Return 201 with new category

Create FILE: src/app/api/categories/[id]/route.ts
PUT handler: validate ownership, update with Zod schema
DELETE handler: check ownership, check if has expenses (count > 0), soft protect

TASK 2: Expenses API
Create FILE: src/app/api/expenses/route.ts
GET handler:
- requireAuth()
- Parse + validate query params with expenseFiltersSchema (Zod)
- Drizzle query with:
  - where: userId = current user, deletedAt IS NULL
  - filters: date range, categoryId, paymentMethod, amount range, description search
  - orderBy: configurable
  - offset + limit for pagination
  - join with categories
- Return: { data, pagination, summary: { totalAmount, count } }

POST handler:
- requireAuth()
- Validate with createExpenseSchema (Zod)
- Verify category belongs to user or is system default
- Insert expense with Drizzle
- Return 201 with expense + category

Create FILE: src/app/api/expenses/[id]/route.ts
GET: requireAuth, find by id, verify ownership, return with category
PUT: requireAuth, verify ownership, validate with Zod, update
DELETE: requireAuth, verify ownership, soft delete (set deletedAt = NOW())

Create FILE: src/app/api/expenses/bulk/route.ts
POST handler:
- requireAuth()
- Accept multipart form data (CSV file)
- Parse CSV: date, amount, description, category (match by name)
- Validate each row with Zod
- Batch insert valid rows
- Return: { imported, failed, errors[] }

TASK 3: Zod Schemas (update validations)
Update FILE: src/lib/validations/expense.ts
Add:
- createCategorySchema: name, icon (emoji), color (#hex), budgetLimit?
- updateCategorySchema: all optional
- bulkImportRowSchema: date, amount, description, category

=== FRONTEND: Expense Management UI ===

TASK 4: TanStack Query Setup
Create FILE: src/app/providers.tsx
'use client' Provider component:
- QueryClientProvider with QueryClient config
- defaultOptions: staleTime 60s, retry 1
- ReactQueryDevtools in development

Update FILE: src/app/layout.tsx
- Wrap children with Providers component
- Keep as Server Component, Providers is Client Component

Create FILE: src/lib/hooks/useExpenses.ts
'use client' custom hooks:
- useExpenses(filters): useQuery fetching /api/expenses
- useExpense(id): useQuery for single expense
- useCreateExpense(): useMutation + toast + invalidate
- useUpdateExpense(): useMutation + toast + invalidate
- useDeleteExpense(): useMutation + confirmation toast
- All with proper TypeScript return types

Create FILE: src/lib/hooks/useCategories.ts
- useCategories(): useQuery
- useCreateCategory(): useMutation
- useUpdateCategory(): useMutation
- useDeleteCategory(): useMutation

TASK 5: Expense List Component
Create FILE: src/components/expenses/ExpenseList.tsx
'use client' component:
- Uses useExpenses() hook
- Shadcn Table component
- Columns: Date | Category | Description | Amount | Payment | Actions
- Sort by clicking column headers
- Loading: Shadcn Skeleton rows
- Empty: EmptyState component
- Responsive: scrollable table on mobile
- TypeScript props interface

TASK 6: Expense Filters Component
Create FILE: src/components/expenses/ExpenseFilters.tsx
'use client' component:
- Shadcn Popover for date range (Calendar component)
- Shadcn Select for category (multi)
- Shadcn Input for amount min/max
- Shadcn Input for search
- Active filter badges (Shadcn Badge)
- Clear all button
- Controlled by URL search params (useSearchParams)

TASK 7: Expense Form Component
Create FILE: src/components/expenses/ExpenseForm.tsx
'use client' component:
- React Hook Form + Zod (createExpenseSchema)
- Shadcn Form, FormField, FormItem, FormLabel, FormMessage
- Fields:
  - Amount: Shadcn Input with currency prefix
  - Category: Shadcn Select with icons
  - Description: Shadcn Input
  - Date: Shadcn Calendar Popover
  - Payment method: Shadcn RadioGroup
  - Is Recurring: Shadcn Switch
- Works for CREATE (no defaultValues) and EDIT (with defaultValues)
- mode prop: 'create' | 'edit'
- onSuccess callback
- Loading state on submit
- TypeScript strict props

TASK 8: Category Picker Component
Create FILE: src/components/common/CategoryPicker.tsx
'use client' component:
- Shadcn Popover + Command (combobox pattern)
- Search categories
- Show icon + color dot + name
- Group: System | Custom
- "Add new" option → opens AddCategoryDialog
- Controlled component with value/onChange props

TASK 9: Expense Page
Create FILE: src/app/(dashboard)/expenses/page.tsx
Server Component:
- Metadata: title "Expenses"
- Fetch initial data server-side (prefetch)
- Render ExpensesPageClient

Create FILE: src/components/expenses/ExpensesPageClient.tsx
'use client' component:
- PageHeader with "Add Expense" button
- Summary cards: Month total, Count, Largest
- ExpenseFilters
- ExpenseList
- Shadcn Dialog for ExpenseForm (add/edit)
- Shadcn Dialog for delete confirmation
- BulkImportDialog

TASK 10: Common Reusable Components
Create FILE: src/components/common/PageHeader.tsx
- title, subtitle?, actions slot
- TypeScript props

Create FILE: src/components/common/SummaryCard.tsx
- icon, title, value, trend? (up/down arrow + %)
- Shadcn Card
- Loading skeleton variant

Create FILE: src/components/common/EmptyState.tsx
- SVG illustration, title, description, action button?
- Shadcn Button

Create FILE: src/components/common/DeleteDialog.tsx
- Shadcn AlertDialog
- itemName prop for dynamic message
- onConfirm async callback
- Loading state on confirm

Create FILE: src/components/common/DataTable.tsx
- Generic typed table component <T>
- columns prop with header + accessorKey + cell renderer
- Sortable headers
- Loading skeleton
- Empty state
- TypeScript generics

TASK 11: Expense Tests
Create FILE: src/test/api/expenses.test.ts
Vitest API tests:
- GET /api/expenses: returns paginated list
- POST /api/expenses: creates with valid data
- POST /api/expenses: rejects without auth (401)
- POST /api/expenses: validates amount > 0
- DELETE /api/expenses/:id: soft deletes own expense
- DELETE /api/expenses/:id: rejects other user's expense (403)

Create FILE: src/test/components/ExpenseForm.test.tsx
RTL tests:
- Renders all fields
- Validates required fields
- Validates positive amount
- Submits correct data
- Edit mode pre-populates values

=== VERIFICATION CHECKLIST ===
[ ] GET /api/expenses: paginated list with filters
[ ] POST /api/expenses: creates and returns expense
[ ] PUT /api/expenses/:id: updates only own expenses
[ ] DELETE /api/expenses/:id: soft deletes
[ ] Categories CRUD working
[ ] Expense form: create and edit modes work
[ ] Filters update URL params and refetch data
[ ] CSV bulk import works with sample file
[ ] TanStack Query caching working
[ ] All tests pass: npm test
[ ] TypeScript: npm run type-check (zero errors)
```

---
## ✅ PHASE 3 EXPECTED OUTPUT
```
Files Created: ~20 files
API Routes: 8 routes (categories + expenses)
Frontend: Full expense management with CRUD
Features: Filtering via URL params, pagination, CSV import
UI: Shadcn/ui components throughout
Tests: Vitest passing
TypeScript: Strict types on all files
```

---

---

# ═══════════════════════════════════════
# PHASE 4: INCOME & BUDGET MANAGEMENT
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 4"` in Claude Code
> **Agent:** Web Development Agent (Primary)
> **Duration:** Day 8-9
> **Goal:** Income tracking, budgets, recurring expenses, alerts, full layout

---

## PHASE 4 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 4: Income Tracking & Budget Management
AGENT: Web Development Agent

=== BACKEND: Income API Routes ===

TASK 1: Income API
Create FILE: src/app/api/income/route.ts
GET: requireAuth, Drizzle query with filters (source, date range, isRecurring), pagination
POST: requireAuth, validate createIncomeSchema (Zod), insert

Create FILE: src/app/api/income/[id]/route.ts
GET, PUT, DELETE: requireAuth, ownership check, Drizzle operations

Zod schemas in src/lib/validations/income.ts:
- createIncomeSchema: amount (positive), source (enum), description?, date, isRecurring
- updateIncomeSchema: all optional
- Income source enum: 'salary' | 'freelance' | 'investment' | 'rental' | 'business' | 'other'

=== BACKEND: Budget API Routes ===

TASK 2: Budget API
Create FILE: src/app/api/budgets/route.ts
GET handler:
- requireAuth()
- Drizzle query: get all user budgets with category
- For each budget calculate:
  - spentAmount: sum of expenses in current period for that category
  - remainingAmount: budgetAmount - spentAmount
  - percentageUsed: (spentAmount / budgetAmount) * 100
  - status: 'good' < 70%, 'warning' 70-99%, 'exceeded' >= 100%
- Return typed BudgetWithStatus[]

POST: requireAuth, validate createBudgetSchema, check no duplicate user+category+period, insert

Create FILE: src/app/api/budgets/[id]/route.ts
PUT, DELETE: requireAuth, ownership check, update/delete

Create FILE: src/app/api/budgets/status/route.ts
GET: requireAuth, return all budgets with status sorted by percentageUsed DESC

Create FILE: src/app/api/budgets/alerts/route.ts
GET: requireAuth, return budgets where percentageUsed >= 80%, grouped by warning/exceeded

=== BACKEND: Recurring Expenses ===

TASK 3: Recurring API
Create FILE: src/app/api/recurring/route.ts
GET, POST: list and create recurring expense templates

Create FILE: src/app/api/recurring/[id]/route.ts
PUT, DELETE: update or deactivate templates

Create FILE: src/app/api/recurring/process/route.ts
POST: find all active recurring where nextOccurrence <= today, create expenses, update nextOccurrence

Create FILE: src/lib/utils/recurring.ts
- calculateNextOccurrence(date: Date, frequency: string): Date
- processAllDueRecurring(userId: string): Promise<number>

=== FRONTEND: Income UI ===

TASK 4: Income Hooks
Create FILE: src/lib/hooks/useIncome.ts
- useIncome(filters), useCreateIncome, useUpdateIncome, useDeleteIncome
- TanStack Query with proper TypeScript types

TASK 5: Income Components
Create FILE: src/components/income/IncomeForm.tsx
'use client':
- React Hook Form + Zod
- Shadcn Form fields: amount, source (Select), description (optional), date, isRecurring (Switch)
- TypeScript props with mode: 'create' | 'edit'

Create FILE: src/components/income/IncomeList.tsx
'use client':
- Shadcn Table
- Columns: Date | Source badge | Description | Amount | Actions
- Source displayed as Shadcn Badge with color per source type
- Loading + empty states

Create FILE: src/components/income/IncomeSummary.tsx
Server Component:
- Fetch income totals server-side
- This month | Last month | YTD | Average monthly
- SummaryCard components

TASK 6: Income Page
Create FILE: src/app/(dashboard)/income/page.tsx
Server Component + metadata
Create FILE: src/components/income/IncomePageClient.tsx
'use client': header, IncomeSummary, IncomeList, add/edit Dialog

=== FRONTEND: Budget UI ===

TASK 7: Budget Hooks
Create FILE: src/lib/hooks/useBudgets.ts
- useBudgets(), useBudgetStatus(), useBudgetAlerts()
- useCreateBudget(), useUpdateBudget(), useDeleteBudget()
- Proper TypeScript with BudgetWithStatus type

TASK 8: Budget Components
Create FILE: src/components/budget/BudgetCard.tsx
'use client':
- Shadcn Card
- Category icon + color + name
- Shadcn Progress bar (colored: green/yellow/red based on %)
- Amount: $spent / $budget
- Remaining amount + days left
- Edit + Delete actions (Shadcn DropdownMenu)
- Alert badge if exceeded (Shadcn Badge variant="destructive")
- TypeScript props

Create FILE: src/components/budget/BudgetForm.tsx
'use client':
- React Hook Form + Zod
- Shadcn: CategoryPicker, Input (amount), Select (period: monthly/yearly)
- Shows only categories without existing budget

Create FILE: src/components/budget/BudgetAlerts.tsx
'use client':
- Shadcn Alert component (variant="destructive" for exceeded)
- Uses useBudgetAlerts() hook
- Dismissed with Shadcn Button
- Shows exceeded first, then warnings

TASK 9: Budget Page
Create FILE: src/app/(dashboard)/budget/page.tsx
Server Component + metadata
Create FILE: src/components/budget/BudgetPageClient.tsx
'use client':
- BudgetAlerts at top (if any)
- Summary: Total budgeted | Total spent | On track | Over budget
- Grid of BudgetCards (2 col desktop, 1 col mobile)
- Add Budget Dialog with BudgetForm

=== FRONTEND: App Layout ===

TASK 10: Dashboard Layout (Critical)
Create FILE: src/app/(dashboard)/layout.tsx
Server Component:
- requireAuth() → redirect to /login if not authenticated
- Render Layout component with children

Create FILE: src/components/common/Layout.tsx
'use client':
- Sidebar (desktop) + mobile drawer (Shadcn Sheet)
- Top Navbar
- Children in main content area

Create FILE: src/components/common/Sidebar.tsx
'use client':
- Navigation links with lucide-react icons:
  LayoutDashboard | Receipt | TrendingUp | PiggyBank | BarChart3 | FileText | Settings
- Active route highlighting (usePathname)
- Shadcn Button variant="ghost" for nav items
- User name + email at bottom
- Sign out button (NextAuth signOut)
- Collapsible on small desktop (icon only)

Create FILE: src/components/common/Navbar.tsx
'use client':
- App name/logo
- Current page title
- Budget alerts bell icon (Shadcn Badge count)
- Shadcn DropdownMenu: avatar, profile link, settings, sign out
- Mobile hamburger (triggers Sidebar Sheet)
- useSession() for user info

=== FRONTEND: Recurring UI ===

TASK 11: Recurring Page
Create FILE: src/app/(dashboard)/recurring/page.tsx
Server Component + metadata
Create FILE: src/components/recurring/RecurringPageClient.tsx
'use client':
- List templates: amount, category, frequency, next date
- Shadcn Switch for active/inactive toggle
- Edit + Delete actions
- Add Recurring Dialog

=== VERIFICATION CHECKLIST ===
[ ] Add income → list updates, totals recalculate
[ ] Create budget → shows with progress bar
[ ] Spend near limit → bar turns yellow (>70%)
[ ] Exceed budget → alert appears, bar turns red (>100%)
[ ] Layout: sidebar navigation fully works
[ ] Protected routes redirect to login
[ ] All pages accessible and styled correctly
[ ] Mobile: Sidebar opens as Sheet drawer
[ ] Recurring templates process correctly
[ ] TypeScript: npm run type-check (zero errors)
```

---
## ✅ PHASE 4 EXPECTED OUTPUT
```
Files Created: ~25 files
API Routes: 12 routes (income, budget, recurring)
Frontend: Income, Budget, Recurring pages
Layout: Complete sidebar + navbar navigation
Features: Budget tracking, alerts, progress bars
TypeScript: Strict types on all files
```

---

---

# ═══════════════════════════════════════
# PHASE 5: ANALYTICS & DASHBOARD
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 5"` in Claude Code
> **Agent:** Data Analysis Agent (Primary) + Web Development Agent (Secondary)
> **Duration:** Day 10-12
> **Goal:** Dashboard, Recharts, Server Components data fetching, AI insights

---

## PHASE 5 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 5: Analytics, Charts & Dashboard
AGENTS: Data Analysis Agent (Primary) + Web Development Agent (Secondary)

=== BACKEND: Analytics API Routes ===

TASK 1: Analytics API
Create FILE: src/app/api/analytics/route.ts
Handles multiple analytics endpoints via searchParams:
- ?type=summary&month=2024-01
- ?type=trends&period=6months
- ?type=category-breakdown&month=2024-01
- ?type=insights
- ?type=comparison
- ?type=income-vs-expense

Create FILE: src/lib/utils/analytics.ts
TypeScript analytics engine:

interface MonthlySummary {
  period: { start: string; end: string; label: string };
  totalExpenses: number;
  totalIncome: number;
  netSavings: number;
  savingsRate: number;
  expenseCount: number;
  topCategory: { name: string; amount: number; percentage: number };
  vsLastMonth: { expenseChange: number; incomeChange: number };
}

interface TrendDataPoint {
  month: string;
  totalExpenses: number;
  totalIncome: number;
  netSavings: number;
}

interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  budgetAmount?: number;
  budgetPercentage?: number;
}

interface Insight {
  type: 'pattern' | 'alert' | 'achievement' | 'suggestion' | 'projection';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success' | 'danger';
  icon: string;
  amount?: number;
  percentage?: number;
}

Implement rule-based insights engine:
Rule 1: Weekend vs weekday spending comparison
Rule 2: Category month-over-month change (flag if > $20 and > 20%)
Rule 3: Budget performance (exceeded, under budget)
Rule 4: Savings rate classification (poor/ok/good/excellent)
Rule 5: Unusual expenses (> 2x category average)
Rule 6: Recurring expenses due this week
Rule 7: Month spending projection based on first N days

=== FRONTEND: Dashboard ===

TASK 2: Dashboard Page (Server Component)
Create FILE: src/app/(dashboard)/dashboard/page.tsx
Server Component (fetch data server-side):
- requireAuth()
- Parallel data fetching with Promise.all():
  - getMonthlySummary(userId, currentMonth)
  - getCategoryBreakdown(userId, currentMonth)
  - getTrends(userId, '6months')
  - getInsights(userId)
  - getRecentExpenses(userId, 10)
  - getBudgetAlerts(userId)
- Pass all data as props to DashboardClient
- Metadata: title "Dashboard"

TASK 3: Dashboard Client Component
Create FILE: src/components/dashboard/DashboardClient.tsx
'use client':
- Month selector (prev/next) using useRouter for URL params
- Re-fetches when month changes
- Renders all dashboard sections
- TypeScript props for all pre-fetched data

TASK 4: Summary Cards
Create FILE: src/components/dashboard/SummaryCards.tsx
'use client':
- 4 Shadcn Cards in a grid (2x2 mobile, 4x1 desktop)
- Total Expenses: amount + trend arrow vs last month
- Total Income: amount + trend arrow
- Net Savings: amount + positive/negative color
- Savings Rate: percentage + Shadcn Progress (circular look)
- Trend: green arrow up (good for income/savings), red arrow (bad for expenses)
- TypeScript props: MonthlySummary type

TASK 5: Pie Chart Component
Create FILE: src/components/analytics/ExpensePieChart.tsx
'use client' (charts must be client):
- Recharts ResponsiveContainer + PieChart
- Donut style (innerRadius=60, outerRadius=100)
- Custom legend below: color dot + name + amount + %
- Custom tooltip showing amount + percentage
- Total amount in center of donut
- Animate on mount (isAnimationActive)
- Empty state: "No expenses this month"
- TypeScript props: CategoryBreakdown[]

TASK 6: Line Chart Component
Create FILE: src/components/analytics/SpendingTrendChart.tsx
'use client':
- Recharts ResponsiveContainer + LineChart
- 3 lines: Expenses (red), Income (green), Savings (blue)
- X axis: month abbreviations
- Y axis: currency format
- Custom tooltip showing all 3 values
- Period selector tabs: 3M | 6M | 12M (Shadcn Tabs)
- On tab change: fetch new data via TanStack Query
- TypeScript props: TrendDataPoint[]

TASK 7: Bar Chart Component
Create FILE: src/components/analytics/MonthlyComparisonChart.tsx
'use client':
- Recharts BarChart grouped bars
- This month vs Last month per category
- Tooltip showing both values + difference
- Responsive container
- TypeScript props

TASK 8: Income vs Expense Chart
Create FILE: src/components/analytics/IncomeVsExpenseChart.tsx
'use client':
- Recharts ComposedChart
- Bars: income (green) and expenses (red)
- Line: net savings (blue)
- Last 12 months on X axis
- TypeScript props

TASK 9: Insight Card
Create FILE: src/components/analytics/InsightCard.tsx
Server Component (static display):
- Shadcn Card with colored left border based on severity
- Icon from lucide-react based on type
- Title (bold) + message
- Amount/percentage badge if present
- Color scheme:
  info=blue, warning=amber, success=green, danger=red
- TypeScript props: Insight type

TASK 10: Insights Panel
Create FILE: src/components/analytics/InsightsPanel.tsx
'use client':
- Grid of InsightCards
- Sort: danger first, then warning, info, success
- Empty state: "Add more expenses to see patterns"
- Skeleton loading state
- Refresh button (refetch query)
- TypeScript props

TASK 11: Recent Transactions
Create FILE: src/components/dashboard/RecentTransactions.tsx
Server Component:
- Shadcn Table
- 10 most recent expenses
- Columns: Category icon | Description | Date | Amount (red/green)
- "View all expenses →" link
- TypeScript props: ExpenseWithCategory[]

TASK 12: Analytics Page
Create FILE: src/app/(dashboard)/analytics/page.tsx
Server Component: fetch data, pass to client
Create FILE: src/components/analytics/AnalyticsPageClient.tsx
'use client':
- Month/Year selector
- Shadcn Tabs: Overview | Trends | Categories | Insights
- Overview: SummaryCards + PieChart + LineChart grid
- Trends: SpendingTrendChart full width + IncomeVsExpenseChart
- Categories: CategoryBreakdown table + MonthlyComparisonChart
- Insights: InsightsPanel full width

TASK 13: Category Breakdown Table
Create FILE: src/components/analytics/CategoryBreakdown.tsx
Server Component:
- Shadcn Table
- Columns: Category | Transactions | Amount | % Total | Budget | Status
- Shadcn Badge for status (green/yellow/red)
- Mini Shadcn Progress bars in Budget column
- Sortable (client enhancement)
- TypeScript props: CategoryBreakdown[]

=== VERIFICATION CHECKLIST ===
[ ] Dashboard loads with real data from DB (Server Component)
[ ] Pie chart shows category breakdown
[ ] Line chart shows 6-month trends
[ ] Insights generate based on actual spending data
[ ] Month selector changes all data
[ ] Budget alerts visible on dashboard
[ ] Analytics page: all 4 tabs work
[ ] Charts are responsive on mobile
[ ] Server Components fetch data, Client Components handle interactivity
[ ] TypeScript: npm run type-check (zero errors)
```

---
## ✅ PHASE 5 EXPECTED OUTPUT
```
Files Created: ~18 files
API Routes: 5 analytics routes
Frontend: Dashboard + Analytics pages with Recharts
Pattern: Server Components for data fetch, Client for charts
Insights: 7 rule-based insight generators (TypeScript)
Features: Monthly comparison, trends, projections
```

---

---

# ═══════════════════════════════════════
# PHASE 6: REPORTS & EXPORT
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 6"` in Claude Code
> **Agent:** Data Analysis Agent (Primary) + Web Development Agent (Secondary)
> **Duration:** Day 13-14
> **Goal:** Report generation, CSV/PDF export, custom date ranges

---

## PHASE 6 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 6: Reports & Export System
AGENTS: Data Analysis Agent (Primary) + Web Development Agent (Secondary)

=== BACKEND: Reports API Routes ===

TASK 1: Reports API
Create FILE: src/app/api/reports/route.ts
GET handler with ?type= param:
- ?type=monthly&year=2024&month=1
- ?type=yearly&year=2024
- ?type=custom&startDate=2024-01-01&endDate=2024-03-31

Returns typed ReportData with:
- period label, summary, categoryBreakdown
- dailyBreakdown, topExpenses (5 largest)
- budgetPerformance, incomeBySource
- insights, previousPeriodComparison

Create FILE: src/app/api/reports/export/route.ts
POST handler with body: { type: 'csv' | 'pdf', reportData, period }
- 'csv': generate CSV, return with Content-Disposition: attachment
- 'pdf': generate PDF buffer with PDFKit, return as application/pdf

TASK 2: Export Services
Create FILE: src/lib/utils/pdfGenerator.ts
TypeScript PDF generator:
- generateReport(reportData: ReportData): Promise<Buffer>
- Uses PDFKit
- Sections: header, summary boxes, category table, top expenses, insights
- Proper TypeScript types throughout

Create FILE: src/lib/utils/csvGenerator.ts
TypeScript CSV generator:
- generateExpensesCSV(expenses: ExpenseWithCategory[]): string
- generateReportCSV(reportData: ReportData): string
- Using json2csv library
- Proper column headers + formatting

=== FRONTEND: Reports UI ===

TASK 3: Reports Hooks
Create FILE: src/lib/hooks/useReports.ts
'use client':
- useMonthlyReport(year, month): useQuery
- useYearlyReport(year): useQuery
- useCustomReport(startDate, endDate): useQuery
- useExportReport(): useMutation (triggers file download)

TASK 4: Report Components
Create FILE: src/components/reports/ReportSummary.tsx
Server Component:
- Shadcn Cards grid showing key metrics
- Period label prominently shown
- Comparison indicators (vs previous period)
- TypeScript props: ReportData

Create FILE: src/components/reports/ReportCategoryTable.tsx
Server Component:
- Shadcn Table
- Full breakdown with totals row
- Sortable columns
- Status badges
- TypeScript props

Create FILE: src/components/reports/DailyBreakdownChart.tsx
'use client':
- Recharts BarChart per day
- Highlight highest spending day
- Average line (ReferenceLine)
- TypeScript props

Create FILE: src/components/reports/ExportButtons.tsx
'use client':
- Export CSV button (Download icon)
- Export PDF button (FileText icon)
- Loading state during export
- Shadcn Sonner toast on success
- TypeScript props

TASK 5: Date Range Picker
Create FILE: src/components/common/DateRangePicker.tsx
'use client':
- Shadcn Popover + Calendar (range mode)
- Preset buttons: This month, Last month, Last 3M, Last 6M, This year
- Validate: end >= start
- onChange: (range: { from: Date; to: Date }) => void
- TypeScript props

TASK 6: Reports Page
Create FILE: src/app/(dashboard)/reports/page.tsx
Server Component + metadata
Create FILE: src/components/reports/ReportsPageClient.tsx
'use client':
- Shadcn Tabs: Monthly | Yearly | Custom
- Month selector (Monthly tab)
- Year selector (Yearly tab)
- DateRangePicker (Custom tab)
- Generate button
- ReportSummary + DailyBreakdownChart + ReportCategoryTable
- ExportButtons
- Print button (window.print())

TASK 7: Toast/Notification Setup
Create FILE: src/components/common/ToastProvider.tsx
'use client':
- Shadcn Sonner component (already installed)
- Add to root layout
- Export toast helper function

=== VERIFICATION CHECKLIST ===
[ ] Monthly report generates with all data
[ ] Yearly report shows all 12 months
[ ] Custom date range works
[ ] CSV downloads correctly
[ ] PDF generates and downloads
[ ] PDF has proper sections and formatting
[ ] Toast notifications appear on export
[ ] Date range picker validates correctly
[ ] Reports page responsive on mobile
[ ] TypeScript: npm run type-check (zero errors)
```

---
## ✅ PHASE 6 EXPECTED OUTPUT
```
Files Created: ~12 files
API Routes: 4 report routes (monthly, yearly, custom, export)
Frontend: Reports page with 3 report types
Export: TypeScript CSV and PDF generation
Features: Monthly, yearly, custom reports + export
```

---

---

# ═══════════════════════════════════════
# PHASE 7: SETTINGS & USER PROFILE
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 7"` in Claude Code
> **Agent:** Web Development Agent (Primary)
> **Duration:** Day 15
> **Goal:** User profile, settings, category management, account stats

---

## PHASE 7 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 7: Settings & User Profile
AGENT: Web Development Agent

=== BACKEND: User API Routes ===

TASK 1: User API
Create FILE: src/app/api/user/profile/route.ts
GET: requireAuth, return user (exclude passwordHash)
PUT: requireAuth, validate updateProfileSchema (Zod: name, currency enum), Drizzle update

Create FILE: src/app/api/user/change-password/route.ts
POST: requireAuth, validate (currentPassword, newPassword, confirmPassword)
- Compare currentPassword with stored hash
- Validate new password strength
- Hash new password, update DB

Create FILE: src/app/api/user/stats/route.ts
GET: requireAuth, return aggregate stats:
- totalExpenses count + sum
- totalIncome count + sum
- topCategory name + amount
- accountAge in days
- budgetsCreated count, categoriesCreated count

Create FILE: src/app/api/user/delete-account/route.ts
POST: requireAuth, require password confirmation
- Verify password matches
- Soft delete user (set deletedAt)
- Call NextAuth signOut
- Return success

Zod schemas in src/lib/validations/user.ts:
- updateProfileSchema: name (2-100), currency (enum: USD/EUR/GBP/INR/CAD/AUD)
- changePasswordSchema: currentPassword, newPassword (strong), confirmPassword
- deleteAccountSchema: password

=== FRONTEND: Settings UI ===

TASK 2: Settings Page
Create FILE: src/app/(dashboard)/settings/page.tsx
Server Component:
- requireAuth()
- Fetch user profile server-side
- Metadata: title "Settings"

Create FILE: src/components/settings/SettingsPageClient.tsx
'use client':
- Shadcn Tabs: Profile | Security | Categories | Danger Zone

TASK 3: Profile Form
Create FILE: src/components/settings/ProfileForm.tsx
'use client':
- React Hook Form + Zod (updateProfileSchema)
- Shadcn Form fields: name (Input), currency (Select)
- Email field: display only, not editable
- Save button with loading state
- Shadcn Sonner toast on success/error
- TypeScript props: initial user data

TASK 4: Change Password Form
Create FILE: src/components/settings/ChangePasswordForm.tsx
'use client':
- React Hook Form + Zod (changePasswordSchema)
- 3 password fields with show/hide toggles
- Real-time password strength indicator
- POST /api/user/change-password
- Clear fields on success
- Toast notification
- TypeScript strict

TASK 5: User Stats
Create FILE: src/components/settings/UserStats.tsx
Server Component:
- Fetch from /api/user/stats server-side
- Shadcn Cards grid:
  Total Transactions | Total Tracked | Account Age | Categories Created
- Clean data visualization

TASK 6: Category Manager
Create FILE: src/components/settings/CategoryManager.tsx
'use client':
- useCategories() hook
- List user custom categories (not system defaults)
- Each category: color swatch + icon + name + expense count
- Edit button → inline edit or Dialog
- Delete: disabled if has expenses (show tooltip)
- Add new category button → Dialog with CategoryForm
- TypeScript props

TASK 7: Danger Zone
Create FILE: src/components/settings/DangerZone.tsx
'use client':
- Shadcn Card with red border
- Delete account button (Shadcn Button variant="destructive")
- Shadcn AlertDialog: type "DELETE" text input + password field
- Warning about permanent data loss
- On confirm: POST /api/user/delete-account → signOut() → redirect /
- TypeScript strict

=== VERIFICATION CHECKLIST ===
[ ] Profile update saves correctly
[ ] Currency change reflects in expense amounts
[ ] Change password: requires correct current password
[ ] Change password: validates new password strength
[ ] Account stats load correctly
[ ] Category manager: add/edit/delete works
[ ] Delete account: requires typing "DELETE" + password
[ ] Settings tabs all work
[ ] TypeScript: npm run type-check (zero errors)
```

---

---

# ═══════════════════════════════════════
# PHASE 8: TESTING & QUALITY ASSURANCE
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 8"` in Claude Code
> **Agent:** Web Development Agent (Primary) + General Purpose Agent (Secondary)
> **Duration:** Day 16-17
> **Goal:** Vitest unit/integration tests, Playwright E2E, TypeScript audit, security

---

## PHASE 8 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 8: Testing & Quality Assurance
AGENTS: Web Development Agent + General Purpose Agent

=== VITEST UNIT & INTEGRATION TESTS ===

TASK 1: Test Utilities
Create FILE: src/test/utils.tsx
- renderWithProviders(): wraps components with QueryClient + auth providers
- createMockUser(): returns typed mock User
- createMockExpense(): returns typed mock Expense
- createMockCategory(): returns typed mock Category
- mockSession(): mocks useSession for client components

TASK 2: API Route Tests
Create FILE: src/test/api/auth.test.ts
- Register: valid data, duplicate email, weak password
- Login: valid, wrong password, missing fields
- Forgot password: valid email, unknown email (same response)
- Reset password: valid token, expired token

Create FILE: src/test/api/expenses.test.ts
- GET with filters: date range, category, pagination
- POST: valid, invalid amount, missing required fields
- PUT: own expense, another user's expense (403)
- DELETE: soft delete, verify not returned after delete

Create FILE: src/test/api/analytics.test.ts
- Summary: correct totals for month
- Category breakdown: correct percentages
- Insights: generates based on test data patterns
- Trends: correct 6-month data

TASK 3: Component Tests
Create FILE: src/test/components/ExpenseForm.test.tsx
- Renders all Shadcn form fields
- Zod validation: required fields, positive amount
- Submits correct typed data
- Edit mode pre-populates values
- Loading state during submit

Create FILE: src/test/components/BudgetCard.test.tsx
- Renders budget info correctly
- Correct progress percentage calculation
- Warning state at 80% (yellow)
- Exceeded state at 100% (red)
- Edit/delete actions trigger correct callbacks

Create FILE: src/test/components/LoginForm.test.tsx
- Renders email and password fields
- Validates email format (Zod)
- Shows loading on submit
- Displays error message from NextAuth

Create FILE: src/test/utils/analytics.test.ts
- calculateMonthlyTotal: correct sum
- generateInsights: returns array of Insight type
- calculateTrends: correct month-over-month data
- detectSpendingPatterns: weekend vs weekday

=== PLAYWRIGHT E2E TESTS ===

TASK 4: Playwright Setup
Create FILE: playwright.config.ts
- baseURL: http://localhost:3000
- Test browsers: Chromium, Firefox
- Screenshots on failure
- Video on first retry
- Parallel: false (auth state shared)

Create FILE: src/test/e2e/auth.spec.ts
Playwright E2E:
- User can register new account
- User can login with credentials
- Unauthenticated user redirected to /login
- Authenticated user redirected from /login to /dashboard

Create FILE: src/test/e2e/expenses.spec.ts
Playwright E2E (full user journey):
- Login → navigate to expenses
- Create new expense via form
- Verify expense appears in list
- Edit expense → verify changes
- Delete expense → verify removed
- Filter by category → verify filtered results

Create FILE: src/test/e2e/dashboard.spec.ts
Playwright E2E:
- Dashboard loads with charts visible
- Summary cards show data
- Navigation links work
- Month selector changes data

=== TYPESCRIPT AUDIT ===

TASK 5: Fix All TypeScript Errors
Run: npm run type-check
Fix ALL errors until output shows: "Found 0 errors"

Common fixes needed:
- Add return types to all async functions
- Replace any types with proper interfaces
- Add null checks where needed
- Ensure Drizzle query results are properly typed
- Ensure Zod inferred types match expected types

TASK 6: ESLint + Prettier Audit
Run: npm run lint
Fix all ESLint errors (warnings OK)

Ensure .eslintrc.json includes:
- @typescript-eslint/no-explicit-any: error
- @typescript-eslint/no-unused-vars: error
- react-hooks/exhaustive-deps: warn
- no-console: warn (not error, for dev logging)

Run: npm run format (Prettier)
Format all files consistently

=== SECURITY AUDIT ===

TASK 7: Security Checklist
Verify and fix:
[ ] All API routes call requireAuth() before DB operations
[ ] All DB queries filter by userId from session (not from request body)
[ ] Zod validation on all POST/PUT route bodies
[ ] No passwordHash returned in any API response (select specific fields)
[ ] NextAuth NEXTAUTH_SECRET is strong (32+ chars)
[ ] No secrets hardcoded anywhere (use process.env)
[ ] .env files in .gitignore
[ ] Rate limiting: add to auth routes using next-rate-limit or custom

Create FILE: src/middleware.ts (update)
- Add rate limiting for /api/auth/* routes
- Max 10 requests per minute per IP
- Return 429 with Retry-After header

=== RUN ALL CHECKS ===

TASK 8: Final Verification
Execute all quality checks:
1. npm run type-check    → must show 0 errors
2. npm test             → all Vitest tests pass
3. npm run test:e2e     → all Playwright tests pass  
4. npm run lint         → zero errors (warnings OK)
5. npm run build        → production build succeeds

Fix any failures before proceeding to Phase 9.

=== VERIFICATION CHECKLIST ===
[ ] npm run type-check: 0 TypeScript errors
[ ] npm test: all Vitest tests pass
[ ] npm run test:e2e: Playwright E2E tests pass
[ ] npm run lint: 0 ESLint errors
[ ] npm run build: builds successfully
[ ] No any types in codebase
[ ] All API routes protected
[ ] Security checklist completed
```

---
## ✅ PHASE 8 EXPECTED OUTPUT
```
Files Created: ~20 test files
Tests: Vitest unit + integration + Playwright E2E
TypeScript: 0 errors (strict mode)
ESLint: 0 errors
Build: Production build succeeds
Security: All routes protected, no sensitive data leaks
```

---

---

# ═══════════════════════════════════════
# PHASE 9: CI/CD & DEPLOYMENT
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 9"` in Claude Code
> **Agent:** DevOps Agent (Primary)
> **Duration:** Day 18-19
> **Goal:** GitHub Actions CI/CD, Vercel deployment, monitoring setup

---

## PHASE 9 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 9: CI/CD Pipeline & Vercel Deployment
AGENT: DevOps Agent

=== GITHUB ACTIONS ===

TASK 1: CI Pipeline
Create FILE: .github/workflows/ci.yml
Triggers: push to any branch, PR to main/develop

Jobs:
1. type-check:
   - Setup Node.js 20
   - npm ci
   - npm run type-check (must be 0 errors)

2. lint:
   - npm run lint (fail on errors)
   - npm run format:check (Prettier check)

3. test:
   - Setup PostgreSQL service (port 5433)
   - Set DATABASE_URL in env
   - npm ci
   - npm run db:push (apply schema)
   - npm run test (Vitest with coverage)
   - Upload coverage to Codecov

4. build:
   - npm run build
   - Fail if build fails
   - Upload build artifact

5. e2e (only on PR to main):
   - Install Playwright browsers
   - npm run dev (background)
   - npm run test:e2e
   - Upload Playwright report on failure

TASK 2: CD Pipeline
Create FILE: .github/workflows/deploy.yml
Triggers: push to main only

Jobs:
1. deploy-vercel:
   - Only if all CI checks pass
   - Use Vercel CLI to deploy
   - Run Drizzle migrations on production DB
   - Health check after deployment
   - Comment deployment URL on commit

2. notify:
   - Slack/email notification on success/failure

TASK 3: PR Checks
Create FILE: .github/workflows/pr-check.yml
Triggers: pull_request to main or develop
- All CI checks + security scan (npm audit)
- Comment test coverage % on PR
- Block merge if type-check fails

=== VERCEL DEPLOYMENT ===

TASK 4: Vercel Configuration
Create FILE: vercel.json
---
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  },
  "crons": [
    {
      "path": "/api/recurring/process",
      "schedule": "0 0 * * *"
    }
  ]
}
---

Note: Next.js 14 on Vercel deploys frontend AND API routes together.
No separate Railway backend needed.
Database (PostgreSQL) still hosted on Railway.

TASK 5: Health Check API Route
Create FILE: src/app/api/health/route.ts
GET handler (public, no auth):
Returns:
{
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: process.env.npm_package_version,
  database: 'connected' | 'disconnected',
  environment: process.env.NODE_ENV
}
Tests DB connection with a simple Drizzle query.

TASK 6: Production Dockerfile (Optional)
Create FILE: Dockerfile
For self-hosted deployment alternative:
- Multi-stage Next.js build
- Node.js 20 Alpine
- Standalone output mode
- Non-root user

Update FILE: next.config.ts
- output: 'standalone' (for Docker deployment)

=== MONITORING ===

TASK 7: Sentry Integration
Install: npm install @sentry/nextjs
Run: npx @sentry/wizard@latest -i nextjs

Create FILE: sentry.client.config.ts
Create FILE: sentry.server.config.ts
Create FILE: sentry.edge.config.ts
- Configure DSN from env
- Set environment (development/production)
- Sample rate: 100% errors, 10% performance
- Filter: don't send 404 or validation errors to Sentry

TASK 8: Vercel Analytics
Update FILE: src/app/layout.tsx
Add: <Analytics /> from @vercel/analytics/react
Add: <SpeedInsights /> from @vercel/speed-insights/next
Install: npm install @vercel/analytics @vercel/speed-insights

TASK 9: Logging
Create FILE: src/lib/utils/logger.ts
TypeScript logger:
- Development: console.log with colors
- Production: structured JSON to stdout (Vercel captures this)
- Levels: error, warn, info, debug
- Include: timestamp, level, message, context
- Never log: passwords, tokens, user PII

=== DEPLOYMENT DOCUMENTATION ===

TASK 10: Deployment Guide
Create FILE: DEPLOYMENT.md
Step-by-step guide:
1. Prerequisites: Node.js 20, Vercel CLI, Railway account
2. Local development setup
3. Railway: create PostgreSQL database (port 5433)
4. Vercel: connect GitHub repo, set env variables
5. Environment variables reference table
6. Drizzle migrations on production
7. Sentry setup
8. Custom domain configuration
9. Vercel cron jobs (for recurring expenses)
10. Monitoring and alerting setup
11. Rollback procedure

=== VERIFICATION CHECKLIST ===
[ ] CI pipeline runs on every push (type-check, lint, test, build)
[ ] CD deploys to Vercel on main push
[ ] Health check returns 200 at /api/health
[ ] Sentry capturing errors in production
[ ] Vercel Analytics active
[ ] Drizzle migrations run on deployment
[ ] Vercel cron: /api/recurring/process runs daily
[ ] All environment variables set in Vercel dashboard
[ ] HTTPS working on production URL
[ ] Production build performance: Lighthouse > 80
```

---
## ✅ PHASE 9 EXPECTED OUTPUT
```
Files Created: ~12 files
CI/CD: GitHub Actions running on all PRs and main push
Deployment: Vercel (Next.js full-stack - frontend + API together)
Database: Railway PostgreSQL
Monitoring: Sentry + Vercel Analytics
Cron: Daily recurring expenses processing
```

---

---

# ═══════════════════════════════════════
# PHASE 10: FINAL POLISH & OPTIMIZATION
# ═══════════════════════════════════════
> **Trigger:** Say `"Execute Phase 10"` in Claude Code
> **Agent:** General Purpose Agent (Primary) + Web Development Agent (Secondary)
> **Duration:** Day 20
> **Goal:** Suspense boundaries, error handling, performance, docs, launch

---

## PHASE 10 — PROMPT FOR CLAUDE CODE

```
EXECUTE PHASE 10: Final Polish & Launch Preparation
AGENTS: General Purpose Agent + Web Development Agent

=== NEXT.JS PERFORMANCE OPTIMIZATION ===

TASK 1: Suspense Boundaries
Update all page.tsx Server Components:
- Wrap async data sections in <Suspense fallback={<Skeleton />}>
- Each chart wrapped in Suspense
- Summary cards wrapped in Suspense
- This enables streaming SSR for faster page loads

Example pattern:
import { Suspense } from 'react';
import { SummaryCardsSkeleton } from '@/components/dashboard/SummaryCards';

<Suspense fallback={<SummaryCardsSkeleton />}>
  <SummaryCards userId={user.id} month={month} />
</Suspense>

TASK 2: Server Component Data Fetching
Convert components to Server Components where possible:
- Components that only display data (no onClick, useState)
- Pass data as props to 'use client' chart components
- Use parallel data fetching with Promise.all() in page.tsx

TASK 3: Image & Asset Optimization
- Add next/image for any user avatars or illustrations
- Configure next.config.ts image domains
- Add metadata with OG tags for all pages

Create FILE: src/lib/utils/metadata.ts
- generatePageMetadata(title, description): Metadata
- Shared app name, OG image defaults

TASK 4: Loading UI
Create loading.tsx files for each dashboard page:
Create FILE: src/app/(dashboard)/dashboard/loading.tsx
Create FILE: src/app/(dashboard)/expenses/loading.tsx
Create FILE: src/app/(dashboard)/analytics/loading.tsx
Each: return full page skeleton using Shadcn Skeleton

=== ERROR HANDLING ===

TASK 5: Error Boundaries
Create FILE: src/app/(dashboard)/dashboard/error.tsx
Create FILE: src/app/(dashboard)/expenses/error.tsx
'use client' error boundaries:
- Show friendly error message
- "Try again" button (calls reset())
- "Go to Dashboard" link
- Log to Sentry

Create FILE: src/app/global-error.tsx
'use client' global error boundary:
- Catches errors in root layout
- Minimal UI (no providers available)

TASK 6: Not Found Pages
Create FILE: src/app/not-found.tsx
- Friendly 404 message
- Simple SVG illustration
- "Back to Dashboard" button
- Consistent with app design

=== UI/UX POLISH ===

TASK 7: Responsive Design Audit
Test and fix on all breakpoints:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px, 1440px

Fix any:
- Table overflow on mobile (make scrollable)
- Chart responsiveness (ResponsiveContainer)
- Form layout on mobile (stack fields)
- Sidebar on mobile (Sheet drawer)

TASK 8: Accessibility Audit
Check and fix:
- All form inputs have associated labels
- All Shadcn components have proper ARIA
- Color contrast meets WCAG AA
- Keyboard navigation works on all interactive elements
- Focus indicators visible
- Charts have aria-label descriptions

TASK 9: Empty States Audit
Ensure all lists have proper empty states:
- Expenses: "No expenses found. Add your first expense!"
- Income: "No income tracked yet. Add your first income source."
- Budget: "No budgets created. Start tracking with a budget!"
- Analytics: "Not enough data. Keep tracking to see insights."

=== DOCUMENTATION ===

TASK 10: API Documentation
Create FILE: docs/API.md
For every API route, document:
- Method + path
- Auth required: Yes/No
- Request body (TypeScript interface)
- Query params (typed)
- Success response (typed example)
- Error responses
- Example fetch call

TASK 11: Architecture Documentation
Create FILE: docs/ARCHITECTURE.md
- Next.js 14 App Router architecture diagram (ASCII)
- Server Components vs Client Components decision tree
- Drizzle ORM schema ERD (text)
- NextAuth.js session flow
- Data flow: Server Component → Client Component → TanStack Query
- TypeScript type hierarchy

TASK 12: Final README Update
Update FILE: README.md with:
- Badges: Build, Coverage, TypeScript, License
- Live demo link placeholder
- Screenshots section
- Complete new tech stack (Next.js 14)
- Updated setup instructions
- Development workflow
- Testing guide (Vitest + Playwright)

=== LAUNCH PREPARATION ===

TASK 13: Security Final Checklist
Verify:
[ ] NEXTAUTH_SECRET is 32+ random characters
[ ] No .env files in git history
[ ] All API routes use requireAuth()
[ ] No passwordHash in any API response
[ ] Zod validation on all route inputs
[ ] Rate limiting on auth routes
[ ] TypeScript: no any types, no @ts-ignore
[ ] npm audit: no high/critical vulnerabilities

TASK 14: Performance Final Check
Run Lighthouse on production URL:
- Performance score > 80
- Accessibility score > 90
- Best Practices > 90
- SEO > 80

Check bundle analysis:
- Run: ANALYZE=true npm run build
- Identify and fix any oversized chunks
- Verify code splitting by route is working

TASK 15: Complete User Journey Test
Manual test everything:
1. Register new account
2. Login
3. Add 10 expenses across 5 categories
4. Add 2 income entries
5. Create 3 budgets (one near limit)
6. Check dashboard shows correct data and charts
7. View analytics (all 4 tabs)
8. Generate monthly report
9. Export CSV and PDF
10. Change profile settings
11. Test on mobile viewport
12. Logout → verify redirect to /login
13. Try to access /dashboard without auth → verify redirect

TASK 16: Launch Checklist File
Create FILE: LAUNCH_CHECKLIST.md
Complete pre-launch verification:

INFRASTRUCTURE:
[ ] Next.js app deployed to Vercel
[ ] PostgreSQL database on Railway
[ ] Environment variables set in Vercel
[ ] Custom domain configured (optional)
[ ] SSL certificate active (automatic on Vercel)

FUNCTIONALITY:
[ ] Registration + login working in production
[ ] Expense CRUD working
[ ] Charts loading with real data
[ ] Reports generating and downloading
[ ] Password reset email working
[ ] CSV import working
[ ] Vercel cron jobs active

MONITORING:
[ ] Sentry capturing errors
[ ] Vercel Analytics active
[ ] Health check: /api/health returns 200
[ ] Logs visible in Vercel dashboard

PERFORMANCE:
[ ] Lighthouse score > 80
[ ] Page load < 3 seconds on 3G
[ ] API responses < 500ms
[ ] TypeScript: 0 errors
[ ] No console errors in browser

=== FINAL VERIFICATION ===
[ ] All 10 phases complete
[ ] npm run type-check: 0 errors
[ ] npm test: all Vitest tests pass
[ ] npm run test:e2e: Playwright tests pass
[ ] npm run build: succeeds
[ ] Production URL working
[ ] Launch checklist completed
[ ] Ready to ship! 🚀
```

---
## ✅ PHASE 10 EXPECTED OUTPUT
```
Files Created: ~10 files
Performance: Suspense streaming, optimized bundle
Error handling: Error boundaries on all pages
Loading UI: loading.tsx for each dashboard page
Accessibility: WCAG AA compliant
Documentation: Complete API docs + Architecture docs
Launch: All checklists verified, production ready
```

---

---

# 📊 COMPLETE PROJECT SUMMARY

## Files Created Per Phase

| Phase | Files | API Routes | Components | Tests |
|-------|:-----:|:----------:|:----------:|:-----:|
| Phase 1 | ~20 | 0 | 0 | 0 |
| Phase 2 | ~15 | 6 | 4 | ✅ |
| Phase 3 | ~20 | 8 | 8 | ✅ |
| Phase 4 | ~25 | 12 | 12 | ✅ |
| Phase 5 | ~18 | 5 | 8 | ✅ |
| Phase 6 | ~12 | 4 | 6 | ✅ |
| Phase 7 | ~10 | 4 | 5 | ✅ |
| Phase 8 | ~20 | 0 | 0 | ✅ |
| Phase 9 | ~12 | 1 | 0 | ✅ |
| Phase 10 | ~10 | 0 | 5 | ✅ |
| **TOTAL** | **~162** | **~40** | **~48** | **All** |

---

## Quick Reference Commands

```bash
# Start development
docker-compose up -d postgres
npm run dev

# Database
npm run db:push      # Apply schema changes
npm run db:seed      # Seed default categories
npm run db:studio    # Open Drizzle Studio (GUI)
npm run db:generate  # Generate migration files

# Testing
npm test             # Vitest unit + integration
npm run test:ui      # Vitest with browser UI
npm run test:e2e     # Playwright E2E
npm run test:coverage # Coverage report

# Quality
npm run type-check   # TypeScript strict check (must be 0 errors)
npm run lint         # ESLint
npm run format       # Prettier

# Build & Deploy
npm run build        # Production build
git push origin main # Triggers Vercel deployment via GitHub Actions
```

---

## Key Architecture Decisions (New Stack)

```
OLD → NEW
──────────────────────────────────────────────────────
React 18 + Vite     →  Next.js 14 App Router
Express.js backend  →  Next.js API Route Handlers
Prisma ORM          →  Drizzle ORM (TypeScript-first)
Custom JWT auth     →  NextAuth.js v5
PropTypes           →  TypeScript interfaces
express-validator   →  Zod schemas
Jest                →  Vitest (faster, ESM native)
Vite proxy          →  Same-origin API routes
Separate deploys    →  Single Vercel deployment
PostgreSQL:5432     →  PostgreSQL:5433
```

---

## Phase Execution Tips

> 💡 **Tip 1:** Complete each phase fully before starting the next.

> 💡 **Tip 2:** After each phase run type-check:
> `npm run type-check` must show **0 errors** before next phase.

> 💡 **Tip 3:** If something fails, say:
> `"Phase X Task Y failed with error: [error message]. Fix it."`

> 💡 **Tip 4:** TypeScript errors blocking progress:
> `"Fix all TypeScript errors in Phase X files"`

> 💡 **Tip 5:** To skip optional tasks:
> `"Execute Phase X but skip tasks Y and Z"`

> 💡 **Tip 6:** Server vs Client Component confusion:
> `"Should [ComponentName] be a Server Component or Client Component and why?"`

---

*Updated for Next.js 14 + Drizzle ORM + NextAuth.js v5 + TypeScript + Vitest*
*SmartExpense Tracker | 10 Phases | ~162 Files | 20 Days*
