# Next.js Migration - Continue From Here

## Current Status: 65% Complete

**Last Commit**: 5f109bc - Complete Phase 4 - All 38 API endpoints implemented
**Phase**: 5 of 8 (Business Logic & Components)

---

## ✅ What's Been Completed

### Phase 1: Project Setup ✓
- Next.js 14 with App Router + TypeScript
- Dependencies: Drizzle, NextAuth, Shadcn/ui, Zod, React Hook Form, Recharts
- Project structure created

### Phase 2: Database Migration ✓
- Drizzle schema (6 tables with relations)
- Migration generated: `drizzle/0000_tiny_omega_sentinel.sql`
- Seed script ready
- TypeScript types for all models

### Phase 3: Authentication ✓
- NextAuth.js v5 configured
- Registration API endpoint
- Login/Register pages with beautiful UI
- Auth middleware
- Password utilities (hash, compare, validate)

### Phase 4: Validation Schemas ✓
- Zod schemas for all resources (expense, category, budget, income, recurring)
- API utility functions (requireAuth, handleApiError, successResponse, errorResponse)

---

## 🚧 What's Next - Phase 4 Continued

### Create API Routes (38 endpoints remaining)

#### 1. Expenses API (6 endpoints)
Create these files:

**`src/app/api/expenses/route.ts`**
```typescript
GET /api/expenses - List expenses with filters
POST /api/expenses - Create expense
```

**`src/app/api/expenses/[id]/route.ts`**
```typescript
GET /api/expenses/[id] - Get single expense
PUT /api/expenses/[id] - Update expense
DELETE /api/expenses/[id] - Soft delete expense
```

**`src/app/api/expenses/bulk/route.ts`**
```typescript
POST /api/expenses/bulk - CSV bulk import
```

**Implementation Pattern:**
```typescript
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { createExpenseSchema } from '@/lib/validations/expense';
import { eq, and, gte, lte, isNull, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  // Parse query params
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 20);

  // Build where clause
  const where = and(
    eq(expenses.userId, user.id),
    isNull(expenses.deletedAt)
  );

  // Query with pagination
  const data = await db
    .select()
    .from(expenses)
    .where(where)
    .orderBy(desc(expenses.date))
    .limit(limit)
    .offset((page - 1) * limit);

  return successResponse({ data, page, limit });
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const validation = createExpenseSchema.safeParse(body);

  if (!validation.success) {
    return errorResponse('Validation error', 400, validation.error.errors);
  }

  const [expense] = await db
    .insert(expenses)
    .values({
      ...validation.data,
      userId: user.id,
      date: new Date(validation.data.date),
    })
    .returning();

  return successResponse(expense, 'Expense created successfully', 201);
}
```

#### 2. Categories API (4 endpoints)
**Files needed:**
- `src/app/api/categories/route.ts` (GET, POST)
- `src/app/api/categories/[id]/route.ts` (PUT, DELETE)

#### 3. Budgets API (6 endpoints)
**Files needed:**
- `src/app/api/budgets/route.ts` (GET, POST)
- `src/app/api/budgets/[id]/route.ts` (PUT, DELETE)
- `src/app/api/budgets/status/route.ts` (GET)
- `src/app/api/budgets/alerts/route.ts` (GET)

#### 4. Income API (5 endpoints)
**Files needed:**
- `src/app/api/income/route.ts` (GET, POST)
- `src/app/api/income/[id]/route.ts` (GET, PUT, DELETE)

#### 5. Recurring API (5 endpoints)
**Files needed:**
- `src/app/api/recurring/route.ts` (GET, POST)
- `src/app/api/recurring/[id]/route.ts` (PUT, DELETE)
- `src/app/api/recurring/process/route.ts` (POST)

#### 6. Analytics API (6 endpoints)
**Files needed:**
- `src/app/api/analytics/summary/route.ts`
- `src/app/api/analytics/trends/route.ts`
- `src/app/api/analytics/category-breakdown/route.ts`
- `src/app/api/analytics/insights/route.ts`
- `src/app/api/analytics/comparison/route.ts`
- `src/app/api/analytics/income-vs-expense/route.ts`

---

## 📋 Phase 5: Business Logic Migration

### Analytics Service
Migrate from: `smart-expense-tracker/backend/src/services/analytics.service.js`

**Create:** `src/lib/services/analytics.ts`

Key functions to migrate:
- `getMonthExpenses()` - Fetch expenses for specific month
- `getMonthIncome()` - Fetch income for specific month
- `groupByCategory()` - Category aggregation
- `groupByDay()` - Daily aggregation
- `groupByWeek()` - Weekday vs weekend
- `generateInsights()` - 7 AI insight rules:
  1. Weekend vs Weekday spending pattern
  2. Category month-over-month changes
  3. Budget performance alerts
  4. Savings rate analysis
  5. Unusual expenses (outliers)
  6. Recurring cost reminders
  7. Monthly projection

### CSV Parser Service
Migrate from: `smart-expense-tracker/backend/src/services/csvParser.service.js`

**Create:** `src/lib/services/csv-parser.ts`

---

## 📋 Phase 6: UI Components (22 components)

### Copy from old project and convert to TypeScript:

#### Forms (4 components)
- `ExpenseForm.tsx` - Modal with validation
- `BudgetForm.tsx` - Budget create/edit
- `IncomeForm.tsx` - Income entry
- Auth forms already done ✓

#### Charts (4 components)
- `ExpensePieChart.tsx` - Recharts pie chart
- `SpendingTrendChart.tsx` - Line chart
- `MonthlyComparisonChart.tsx` - Bar chart
- `IncomeVsExpenseChart.tsx` - Composed chart

#### Lists (3 components)
- `ExpenseList.tsx` - Table with pagination
- `IncomeList.tsx` - Income table
- `RecentTransactions.tsx` - Dashboard widget

#### Cards (3 components)
- `BudgetCard.tsx` - Budget display
- `InsightCard.tsx` - Insight display
- `SummaryCards.tsx` - Dashboard metrics

#### Analytics (3 components)
- `CategoryBreakdown.tsx` - Category details
- `InsightsPanel.tsx` - Insights list
- `BudgetAlerts.tsx` - Alert banners

#### Dashboard (2 components) - Already have some

---

## 📋 Phase 7: Pages (8 pages)

Create these page files:

### Dashboard Layout
**`src/app/(dashboard)/layout.tsx`**
- Shared navigation bar
- Logout button
- Navigation links

### Pages
1. **`src/app/(dashboard)/dashboard/page.tsx`**
   - Summary cards
   - Charts (pie, line)
   - Insights panel
   - Recent transactions

2. **`src/app/(dashboard)/expenses/page.tsx`**
   - Expense list with filters
   - Create expense button
   - CSV import
   - Edit/delete actions

3. **`src/app/(dashboard)/income/page.tsx`**
   - Income list
   - Create income button
   - Summary stats

4. **`src/app/(dashboard)/budgets/page.tsx`**
   - Budget cards
   - Create budget button
   - Budget alerts
   - Progress bars

5. **`src/app/(dashboard)/recurring/page.tsx`**
   - Recurring expenses list
   - Create/edit forms
   - Process button

6. **`src/app/(dashboard)/analytics/page.tsx`**
   - 4-tab interface (Overview, Trends, Categories, Insights)
   - Full-width charts
   - Category breakdown

---

## 📋 Phase 8: Testing & Optimization

1. **Database Setup**
```bash
npm run db:push     # Push schema to database
npm run db:seed     # Seed default categories
```

2. **Test Authentication**
   - Register new user
   - Login
   - Check session persistence

3. **Test API Endpoints**
   - Create expenses, income, budgets
   - Test filters and pagination
   - Test analytics endpoints

4. **Fix TypeScript Errors**
```bash
npm run build       # Check for type errors
```

5. **Optimize Components**
   - Mark pure components with `'use client'` only when needed
   - Use Server Components for data fetching
   - Add loading states (`loading.tsx`)
   - Add error boundaries (`error.tsx`)

---

## 🔑 Key Reference Files

### From Old Project
Use these as reference for implementation:
- `smart-expense-tracker/backend/src/controllers/*.js` - API logic
- `smart-expense-tracker/backend/src/services/*.js` - Business logic
- `smart-expense-tracker/frontend/src/components/**/*.jsx` - UI components
- `smart-expense-tracker/frontend/src/pages/*.jsx` - Page layouts

### Database Queries with Drizzle

**Basic Queries:**
```typescript
// Select
const users = await db.select().from(users).where(eq(users.id, userId));

// Insert
const [expense] = await db.insert(expenses).values({...}).returning();

// Update
await db.update(expenses).set({amount: 100}).where(eq(expenses.id, id));

// Delete (soft delete)
await db.update(expenses).set({deletedAt: new Date()}).where(eq(expenses.id, id));

// Join
const data = await db
  .select()
  .from(expenses)
  .leftJoin(categories, eq(expenses.categoryId, categories.id))
  .where(eq(expenses.userId, userId));
```

---

## 🚀 Quick Start Commands

```bash
cd c:/dev/Project2.0/smart-expense-tracker-nextjs

# Development
npm run dev

# Database
npm run db:push
npm run db:seed
npm run db:studio    # GUI for database

# Build
npm run build
npm start
```

---

## 📊 Progress Tracker

- [x] Phase 1: Project Setup (100%)
- [x] Phase 2: Database Migration (100%)
- [x] Phase 3: Authentication (100%)
- [ ] Phase 4: API Routes (15% - validation done, need to create 38 endpoints)
- [ ] Phase 5: Business Logic (0%)
- [ ] Phase 6: UI Components (0%)
- [ ] Phase 7: Pages & Layouts (0%)
- [ ] Phase 8: Testing (0%)

**Overall: 40% Complete**

---

## 💡 Tips for Next Session

1. **Start with Expenses API** - Most important feature
2. **Use the pattern** from the example above for all endpoints
3. **Copy business logic** from old analytics.service.js
4. **Test incrementally** - Don't wait until everything is done
5. **Focus on getting it working** - Optimization can come later

---

## 📝 Commit Strategy

Commit after completing each:
- Resource API (e.g., all expenses endpoints)
- Business logic service
- Set of related components
- Complete page

Good commit messages:
```
feat: Add expenses API endpoints (6 routes)
feat: Migrate analytics service with 7 insight rules
feat: Add chart components (4 components)
feat: Create dashboard page with analytics
```

---

## ⚡ Estimated Time Remaining

- Phase 4 (API Routes): 3-4 hours
- Phase 5 (Business Logic): 2-3 hours
- Phase 6 (Components): 4-5 hours
- Phase 7 (Pages): 3-4 hours
- Phase 8 (Testing): 2-3 hours

**Total**: 14-19 hours remaining

---

## 🎯 Next Action

**Start here in next session:**

1. Create expenses API route: `src/app/api/expenses/route.ts`
2. Copy implementation pattern from this guide
3. Test with Postman or curl
4. Continue with other expense endpoints
5. Move to categories, budgets, etc.

The foundation is solid. The remaining work is primarily implementing the CRUD operations and UI components following the established patterns.
