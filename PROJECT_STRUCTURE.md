# Smart Expense Tracker - Project Structure Analysis

**Generated**: 2026-05-28
**Project**: Next.js 14 Smart Expense Tracker
**Current Phase**: Phase 5 (Analytics & Reporting) - 75% Complete

---

## Executive Summary

The current Next.js 14 project structure is **well-organized** with a solid foundation following App Router best practices. However, as the project approaches phases 6-10, there are opportunities for improvement in component organization, code colocation, and scalability.

### Overall Assessment: 7.5/10

**Strengths:**
- Clean separation of concerns (API, pages, components, lib)
- Proper use of route groups for auth and dashboard
- Consistent naming conventions
- Good TypeScript type organization

**Areas for Improvement:**
- Component organization lacks feature-based grouping
- Deep nesting in some page directories (4+ levels)
- Missing shared hooks and contexts
- No testing infrastructure
- Limited use of Next.js 14 optimizations (loading, error boundaries)

---

## Current Structure Overview

```
smart-expense-tracker/
├── src/
│   ├── app/                          # Next.js App Router (121KB)
│   │   ├── (auth)/                   # Auth route group (12KB)
│   │   │   ├── login/
│   │   │   │   └── page.tsx          (122 lines)
│   │   │   └── register/
│   │   │       └── page.tsx          (203 lines)
│   │   ├── (dashboard)/              # Dashboard route group (110KB)
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx          (445 lines - LARGE)
│   │   │   ├── budgets/
│   │   │   │   ├── budgets-client.tsx (155 lines)
│   │   │   │   └── page.tsx          (50 lines)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          (246 lines)
│   │   │   ├── expenses/
│   │   │   │   ├── expense-dialog.tsx (216 lines)
│   │   │   │   ├── expense-filters.tsx (134 lines)
│   │   │   │   ├── expense-table.tsx (142 lines)
│   │   │   │   ├── expenses-client.tsx (180 lines)
│   │   │   │   └── page.tsx          (17 lines)
│   │   │   ├── income/
│   │   │   │   ├── income-client.tsx (143 lines)
│   │   │   │   ├── income-dialog.tsx (185 lines)
│   │   │   │   ├── income-filters.tsx (101 lines)
│   │   │   │   ├── income-table.tsx  (138 lines)
│   │   │   │   └── page.tsx          (17 lines)
│   │   │   └── layout.tsx            (82 lines)
│   │   ├── api/                      # API Routes (121KB - 38 endpoints)
│   │   │   ├── analytics/            (6 endpoints)
│   │   │   ├── auth/                 (2 endpoints)
│   │   │   ├── budgets/              (6 endpoints)
│   │   │   ├── categories/           (4 endpoints)
│   │   │   ├── expenses/             (6 endpoints)
│   │   │   ├── income/               (5 endpoints)
│   │   │   └── recurring/            (5 endpoints)
│   │   ├── layout.tsx                (4KB - root layout)
│   │   └── page.tsx                  (1KB - landing page)
│   │
│   ├── components/                   # React Components
│   │   ├── analytics/                (16KB - 1 component)
│   │   │   └── category-breakdown-table.tsx (430 lines - LARGE)
│   │   ├── charts/                   (36KB - 4 components)
│   │   │   ├── expense-pie-chart.tsx
│   │   │   ├── income-expense-chart.tsx
│   │   │   ├── monthly-comparison-chart.tsx
│   │   │   └── spending-trend-chart.tsx
│   │   ├── dashboard/                (32KB - 3 components)
│   │   │   ├── insights-panel.tsx
│   │   │   ├── recent-transactions.tsx
│   │   │   └── summary-cards.tsx
│   │   └── ui/                       (64KB - 13 shadcn components)
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── progress.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       └── tabs.tsx
│   │
│   ├── lib/                          # Business Logic & Utilities
│   │   ├── auth/                     (9KB - NextAuth config)
│   │   │   ├── auth.config.ts
│   │   │   ├── index.ts
│   │   │   └── password.ts
│   │   ├── db/                       (16KB - Database)
│   │   │   ├── index.ts
│   │   │   ├── schema.ts             (197 lines - all tables)
│   │   │   └── seed.ts
│   │   ├── services/                 (28KB - Business logic)
│   │   │   └── analytics.ts
│   │   ├── utils/                    (8KB - Utility functions)
│   │   │   ├── api.ts
│   │   │   └── date.ts
│   │   ├── validations/              (24KB - Zod schemas)
│   │   │   ├── budget.ts
│   │   │   ├── category.ts
│   │   │   ├── expense.ts
│   │   │   ├── income.ts
│   │   │   └── recurring.ts
│   │   └── utils.ts                  (1KB - cn() utility)
│   │
│   ├── types/                        # TypeScript Types
│   │   ├── index.ts                  (161 lines - all types)
│   │   └── next-auth.d.ts
│   │
│   └── middleware.ts                 # Route protection

```

---

## Identified Issues

### 1. Component Organization Issues

**Problem**: Mixed concerns and lack of feature grouping

**Current State:**
```
components/
├── analytics/          # 1 component (430 lines!)
├── charts/             # 4 components
├── dashboard/          # 3 components
└── ui/                 # 13 shadcn components
```

**Issues:**
- `category-breakdown-table.tsx` is 430 lines (too large)
- Chart components are separate from dashboard components
- No clear distinction between shared vs feature-specific components
- Missing common patterns: hooks, contexts, providers

### 2. Deep Nesting in Pages

**Problem**: 4-5 levels of nesting for page-specific components

**Example:**
```
app/(dashboard)/expenses/
├── expense-dialog.tsx      # 216 lines
├── expense-filters.tsx     # 134 lines
├── expense-table.tsx       # 142 lines
├── expenses-client.tsx     # 180 lines
└── page.tsx                # 17 lines (just wrapper)
```

**Issues:**
- Page-specific components mixed with route definitions
- Difficult to reuse components across features
- Import paths become complex
- Hard to understand component hierarchy

### 3. Large Component Files

**Problematic Files:**
- `src/app/(dashboard)/analytics/page.tsx` (445 lines)
- `src/components/analytics/category-breakdown-table.tsx` (430 lines)
- `src/app/(dashboard)/dashboard/page.tsx` (246 lines)
- `src/app/(dashboard)/expenses/expense-dialog.tsx` (216 lines)

**Recommendation:** Split into smaller, focused components

### 4. Missing Infrastructure

**Not Present:**
- Shared hooks directory (`src/hooks/`)
- Context providers (`src/contexts/` or `src/providers/`)
- Testing setup (`__tests__/` or `.test.tsx` files)
- Loading states (`loading.tsx` files)
- Error boundaries (`error.tsx` files)
- API client layer (currently using fetch directly)

### 5. Type Organization

**Current:**
```
types/
├── index.ts            # 161 lines - ALL types
└── next-auth.d.ts
```

**Issue:** Single file contains all type definitions (database, API, filters, analytics)

---

## Recommended Structure (Feature-Based Hybrid)

### Proposed Organization

```
smart-expense-tracker/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── _components/              # NEW: Shared dashboard components
│   │   │   │   ├── page-header.tsx
│   │   │   │   ├── stat-card.tsx
│   │   │   │   └── data-table-skeleton.tsx
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── _components/          # NEW: Feature-specific components
│   │   │   │   │   ├── analytics-tabs.tsx
│   │   │   │   │   ├── category-breakdown/
│   │   │   │   │   │   ├── breakdown-table.tsx
│   │   │   │   │   │   ├── breakdown-card.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── trend-section.tsx
│   │   │   │   │   └── insights-section.tsx
│   │   │   │   ├── page.tsx              (simplified to ~100 lines)
│   │   │   │   ├── loading.tsx           # NEW: Loading state
│   │   │   │   └── error.tsx             # NEW: Error boundary
│   │   │   │
│   │   │   ├── budgets/
│   │   │   │   ├── _components/
│   │   │   │   │   ├── budget-card.tsx
│   │   │   │   │   ├── budget-form.tsx
│   │   │   │   │   ├── budget-list.tsx
│   │   │   │   │   └── budget-alerts.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── _components/
│   │   │   │   │   ├── dashboard-summary.tsx
│   │   │   │   │   ├── quick-stats/
│   │   │   │   │   │   ├── stat-cards.tsx
│   │   │   │   │   │   ├── stat-card-item.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── recent-activity.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── _components/
│   │   │   │   │   ├── expense-form/
│   │   │   │   │   │   ├── expense-dialog.tsx
│   │   │   │   │   │   ├── expense-form-fields.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── expense-list/
│   │   │   │   │   │   ├── expense-table.tsx
│   │   │   │   │   │   ├── expense-row.tsx
│   │   │   │   │   │   ├── expense-actions.tsx
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── expense-filters.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── error.tsx
│   │   │   │
│   │   │   ├── income/
│   │   │   │   ├── _components/
│   │   │   │   │   ├── income-form/
│   │   │   │   │   ├── income-list/
│   │   │   │   │   └── income-filters.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                          # Keep existing structure (good)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── features/                     # NEW: Feature-specific shared components
│   │   │   ├── analytics/
│   │   │   │   ├── chart-wrapper.tsx
│   │   │   │   └── insight-card.tsx
│   │   │   ├── budgets/
│   │   │   │   └── progress-ring.tsx
│   │   │   └── transactions/
│   │   │       ├── transaction-row.tsx
│   │   │       └── category-badge.tsx
│   │   │
│   │   ├── charts/                       # Keep existing, add more
│   │   │   ├── expense-pie-chart.tsx
│   │   │   ├── income-expense-chart.tsx
│   │   │   ├── monthly-comparison-chart.tsx
│   │   │   ├── spending-trend-chart.tsx
│   │   │   └── chart-container.tsx       # NEW: Wrapper with error handling
│   │   │
│   │   ├── layout/                       # NEW: Layout components
│   │   │   ├── page-header.tsx
│   │   │   ├── page-container.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── mobile-nav.tsx
│   │   │
│   │   └── ui/                           # Keep shadcn components
│   │
│   ├── features/                         # NEW: Feature modules (for phases 6-10)
│   │   ├── export/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── types.ts
│   │   ├── notifications/
│   │   ├── reports/
│   │   └── settings/
│   │
│   ├── hooks/                            # NEW: Custom React hooks
│   │   ├── use-expenses.ts
│   │   ├── use-budgets.ts
│   │   ├── use-analytics.ts
│   │   ├── use-categories.ts
│   │   ├── use-income.ts
│   │   ├── use-debounce.ts
│   │   ├── use-local-storage.ts
│   │   └── use-toast.ts
│   │
│   ├── providers/                        # NEW: Context providers
│   │   ├── theme-provider.tsx
│   │   ├── query-provider.tsx
│   │   ├── toast-provider.tsx
│   │   └── currency-provider.tsx
│   │
│   ├── lib/
│   │   ├── api/                          # NEW: API client layer
│   │   │   ├── client.ts
│   │   │   ├── expenses.ts
│   │   │   ├── budgets.ts
│   │   │   ├── analytics.ts
│   │   │   └── types.ts
│   │   ├── auth/
│   │   ├── db/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validations/
│   │   └── utils.ts
│   │
│   ├── types/
│   │   ├── api.ts                        # API response types
│   │   ├── database.ts                   # Database models
│   │   ├── analytics.ts                  # Analytics types
│   │   ├── filters.ts                    # Filter types
│   │   ├── forms.ts                      # Form types
│   │   ├── index.ts                      # Re-exports
│   │   └── next-auth.d.ts
│   │
│   └── middleware.ts

```

---

## Key Changes Explained

### 1. `_components` Convention

Use underscore prefix for route-specific component folders:
- Not treated as routes by Next.js
- Clear indication of colocation
- Keeps components close to where they're used

```
expenses/
├── _components/         # Only used in /expenses
│   ├── expense-form/
│   └── expense-list/
└── page.tsx
```

### 2. Feature-Based Grouping

Components organized by feature domain:
```
components/
├── features/           # Cross-route feature components
├── charts/             # Visualization components
├── layout/             # Layout components
└── ui/                 # Base UI primitives
```

### 3. Hooks Directory

Extract data fetching and business logic:
```typescript
// hooks/use-expenses.ts
export function useExpenses(filters: ExpenseFilters) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  // ... fetch logic
  return { expenses, loading, refetch, error };
}
```

Usage in components:
```typescript
// Before: 50+ lines of fetch logic in component
const { expenses, loading } = useExpenses({
  startDate,
  endDate
});
```

### 4. API Client Layer

Centralize API calls:
```typescript
// lib/api/expenses.ts
export const expensesApi = {
  list: (filters: ExpenseFilters) =>
    fetch('/api/expenses', { ... }),
  create: (data: NewExpense) =>
    fetch('/api/expenses', { method: 'POST', ... }),
  // ...
};
```

### 5. Type Organization

Split by domain:
```
types/
├── api.ts              # ApiResponse, PaginatedResponse
├── database.ts         # User, Expense, Category
├── analytics.ts        # MonthlySummary, TrendData
├── filters.ts          # ExpenseFilters, DateRange
└── forms.ts            # FormData types
```

---

## Migration Plan

### Phase 1: Foundation (Week 1)

**Priority: HIGH**

1. **Create new directories**
   ```bash
   mkdir -p src/hooks
   mkdir -p src/providers
   mkdir -p src/lib/api
   mkdir -p src/components/layout
   mkdir -p src/components/features
   ```

2. **Split types file**
   - Break `types/index.ts` into domain files
   - Update imports across codebase

3. **Add loading and error states**
   - Create `loading.tsx` for each route
   - Create `error.tsx` for each route
   - Test error boundaries

### Phase 2: Extract Hooks (Week 1-2)

**Priority: HIGH**

1. **Create data hooks**
   ```
   src/hooks/
   ├── use-expenses.ts
   ├── use-income.ts
   ├── use-budgets.ts
   ├── use-analytics.ts
   └── use-categories.ts
   ```

2. **Extract from components**
   - Move fetch logic from components to hooks
   - Update components to use hooks
   - Test each extraction

### Phase 3: Reorganize Components (Week 2)

**Priority: MEDIUM**

1. **Create `_components` folders**
   ```bash
   # For each route
   cd src/app/(dashboard)/expenses
   mkdir _components
   mv expense-*.tsx _components/
   ```

2. **Split large components**
   - Break down 400+ line components
   - Create component hierarchies
   - Add index.ts for clean exports

3. **Move page-specific to `_components`**
   - Keep only page.tsx at route level
   - Move all other TSX files to `_components`

### Phase 4: API Client Layer (Week 3)

**Priority: MEDIUM**

1. **Create API client**
   ```typescript
   // lib/api/client.ts
   export async function apiRequest<T>(
     endpoint: string,
     options?: RequestInit
   ): Promise<ApiResponse<T>> {
     // Centralized error handling
     // Auth token management
     // Response parsing
   }
   ```

2. **Create resource clients**
   - `lib/api/expenses.ts`
   - `lib/api/budgets.ts`
   - `lib/api/analytics.ts`
   - etc.

3. **Update hooks to use clients**

### Phase 5: Layout Components (Week 3)

**Priority: LOW**

1. **Extract layout components**
   ```
   components/layout/
   ├── page-header.tsx
   ├── page-container.tsx
   ├── stat-card.tsx
   └── empty-state.tsx
   ```

2. **Standardize page layouts**

### Phase 6: Providers & Contexts (Week 4)

**Priority: LOW**

1. **Add providers**
   ```
   providers/
   ├── query-provider.tsx     # React Query (optional)
   ├── toast-provider.tsx
   └── currency-provider.tsx
   ```

2. **Update root layout**

---

## File Move Commands

```bash
# From project root
cd c:/dev/Project2.0/smart-expense-tracker

# 1. Create new directories
mkdir -p src/hooks
mkdir -p src/providers
mkdir -p src/lib/api
mkdir -p src/components/layout
mkdir -p src/components/features/analytics
mkdir -p src/components/features/budgets
mkdir -p src/components/features/transactions

# 2. Move analytics components
mkdir -p src/app/\(dashboard\)/analytics/_components
mv src/components/analytics/category-breakdown-table.tsx \
   src/app/\(dashboard\)/analytics/_components/

# 3. Move dashboard components to features
mv src/components/dashboard/* src/components/features/

# 4. Create _components for expenses
mkdir -p src/app/\(dashboard\)/expenses/_components
mv src/app/\(dashboard\)/expenses/expense-*.tsx \
   src/app/\(dashboard\)/expenses/_components/

# 5. Create _components for income
mkdir -p src/app/\(dashboard\)/income/_components
mv src/app/\(dashboard\)/income/income-*.tsx \
   src/app/\(dashboard\)/income/_components/

# 6. Create _components for budgets
mkdir -p src/app/\(dashboard\)/budgets/_components
mv src/app/\(dashboard\)/budgets/budgets-client.tsx \
   src/app/\(dashboard\)/budgets/_components/

# 7. Move summary cards to features
mv src/components/features/summary-cards.tsx \
   src/components/features/analytics/

# 8. Create layout components directory
mkdir -p src/components/layout

# 9. Split types (manual - requires code changes)
# types/index.ts -> types/database.ts, types/api.ts, etc.

```

---

## Import Path Updates

### Current Paths
```typescript
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ExpenseTable } from './expense-table';
```

### After Reorganization
```typescript
// From features
import { SummaryCards } from '@/components/features/analytics/summary-cards';

// From _components (same route)
import { ExpenseTable } from './_components/expense-list';

// From hooks
import { useExpenses } from '@/hooks/use-expenses';

// From API client
import { expensesApi } from '@/lib/api/expenses';
```

### tsconfig.json Paths
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/features/*": ["./src/features/*"]
    }
  }
}
```

---

## Best Practices for Future Development

### 1. Component Size Guidelines

**Keep components under 200 lines**
- Break down larger components
- Extract sub-components
- Use composition over large files

**Example:**
```typescript
// Instead of 400-line component
<CategoryBreakdownTable>
  {/* 400 lines of JSX */}
</CategoryBreakdownTable>

// Split into
<CategoryBreakdown>
  <BreakdownHeader />
  <BreakdownTable>
    <BreakdownRow />
  </BreakdownTable>
  <BreakdownSummary />
</CategoryBreakdown>
```

### 2. Colocation Rules

**Place components close to usage**
- Route-specific components in `_components`
- Feature-shared in `components/features`
- Global in `components/`

### 3. Loading and Error States

**Always provide for data routes**
```typescript
// app/(dashboard)/expenses/loading.tsx
export default function Loading() {
  return <ExpensesSkeleton />;
}

// app/(dashboard)/expenses/error.tsx
export default function Error({ error, reset }) {
  return <ErrorCard error={error} onRetry={reset} />;
}
```

### 4. Server vs Client Components

**Default to Server Components**
```typescript
// Server Component (default)
export default async function ExpensesPage() {
  const expenses = await getExpenses();
  return <ExpenseList expenses={expenses} />;
}

// Client Component (when needed)
'use client';
export function ExpenseFilters() {
  const [filters, setFilters] = useState({});
  // ... interactive logic
}
```

### 5. Type Safety

**Use discriminated unions for complex types**
```typescript
// types/analytics.ts
export type Insight =
  | { type: 'pattern'; pattern: string; }
  | { type: 'alert'; severity: 'high' | 'medium'; }
  | { type: 'achievement'; badge: string; };
```

### 6. Naming Conventions

**Consistent naming across project**
```typescript
// Components: PascalCase
ExpenseDialog, CategoryCard

// Files: kebab-case
expense-dialog.tsx, category-card.tsx

// Hooks: camelCase with 'use' prefix
useExpenses, useDebounce

// Utils: camelCase
formatCurrency, calculateTotal

// Types: PascalCase
ExpenseFilters, ApiResponse

// Constants: UPPER_SNAKE_CASE
MAX_FILE_SIZE, DEFAULT_CURRENCY
```

---

## Validation Checklist

### Pre-Migration
- [ ] Commit all current changes
- [ ] Create feature branch: `feature/structure-refactor`
- [ ] Run tests (if any exist)
- [ ] Document current import patterns

### During Migration
- [ ] Create directories first
- [ ] Move files with git mv (preserves history)
- [ ] Update imports incrementally
- [ ] Test after each major change
- [ ] Commit frequently with clear messages

### Post-Migration
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] All pages load correctly
- [ ] All API endpoints work
- [ ] No console errors
- [ ] Update documentation
- [ ] Create PR for review

---

## Scalability for Phases 6-10

### Phase 6: Reports & Export (Estimated)

**New Structure Needed:**
```
src/features/reports/
├── components/
│   ├── report-builder.tsx
│   ├── report-preview.tsx
│   └── export-dialog.tsx
├── hooks/
│   ├── use-report-data.ts
│   └── use-export.ts
├── utils/
│   ├── pdf-generator.ts
│   └── excel-generator.ts
└── types.ts

src/app/(dashboard)/reports/
├── _components/
├── page.tsx
└── loading.tsx
```

### Phase 7: Notifications & Alerts

```
src/features/notifications/
├── components/
│   ├── notification-center.tsx
│   ├── notification-item.tsx
│   └── alert-badge.tsx
├── hooks/
│   └── use-notifications.ts
├── context/
│   └── notification-context.tsx
└── types.ts
```

### Phase 8: User Settings & Preferences

```
src/features/settings/
├── components/
│   ├── settings-form.tsx
│   ├── currency-selector.tsx
│   └── theme-toggle.tsx
├── hooks/
│   └── use-settings.ts
└── types.ts

src/app/(dashboard)/settings/
├── _components/
├── page.tsx
└── loading.tsx
```

### Phase 9: Multi-Currency Support

```
src/lib/currency/
├── converter.ts
├── rates.ts
└── types.ts

src/providers/currency-provider.tsx
src/hooks/use-currency.ts
```

### Phase 10: Mobile Optimization

```
src/components/mobile/
├── mobile-nav.tsx
├── mobile-header.tsx
└── mobile-table.tsx

src/hooks/use-mobile.ts
src/hooks/use-touch-gestures.ts
```

---

## Performance Optimizations

### 1. Code Splitting

**Dynamic imports for heavy components**
```typescript
// Instead of
import { HeavyChart } from '@/components/charts/heavy-chart';

// Use
const HeavyChart = dynamic(
  () => import('@/components/charts/heavy-chart'),
  { loading: () => <ChartSkeleton /> }
);
```

### 2. React Server Components

**Leverage RSC for data fetching**
```typescript
// app/(dashboard)/expenses/page.tsx
export default async function ExpensesPage() {
  // Runs on server, no client bundle
  const expenses = await db.select().from(expenses);

  return <ExpenseList expenses={expenses} />;
}
```

### 3. Route Prefetching

**Use Link for navigation**
```typescript
<Link
  href="/analytics"
  prefetch={true}  // Prefetch on hover
>
  Analytics
</Link>
```

### 4. Image Optimization

**Use Next.js Image component**
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  width={200}
  height={100}
  alt="Logo"
  priority  // For above-fold images
/>
```

---

## Testing Strategy (Phase 8+)

### Directory Structure
```
src/
├── app/
│   └── (dashboard)/
│       └── expenses/
│           ├── _components/
│           │   ├── expense-table.tsx
│           │   └── expense-table.test.tsx    # Co-located
│           └── page.test.tsx
├── components/
│   └── features/
│       └── analytics/
│           ├── insight-card.tsx
│           └── insight-card.test.tsx
└── hooks/
    ├── use-expenses.ts
    └── use-expenses.test.ts
```

### Testing Layers

1. **Unit Tests**: Hooks, utilities, pure components
2. **Integration Tests**: API routes, data flows
3. **E2E Tests**: Critical user flows (login, create expense)

---

## Monitoring Structure Changes

### Before Changes
```bash
# Save current structure
find src -type f -name "*.tsx" -o -name "*.ts" | sort > structure-before.txt

# Count components
echo "Components: $(find src/components -name "*.tsx" | wc -l)"
echo "Pages: $(find src/app -name "page.tsx" | wc -l)"
echo "API Routes: $(find src/app/api -name "route.ts" | wc -l)"
```

### After Changes
```bash
# Compare
find src -type f -name "*.tsx" -o -name "*.ts" | sort > structure-after.txt
diff structure-before.txt structure-after.txt

# Verify no missing files
npm run build
```

---

## Quick Reference

### When to use _components
- ✅ Components used only in specific route
- ✅ Route-specific forms, tables, dialogs
- ❌ Shared across multiple routes (use features/)
- ❌ Generic UI components (use components/)

### When to extract a hook
- ✅ Data fetching logic
- ✅ Complex state management
- ✅ Reusable logic across components
- ❌ Simple useState calls
- ❌ One-time logic

### When to create a feature module
- ✅ Complex feature with multiple files
- ✅ Has own components, hooks, utils
- ✅ Used across multiple routes
- ❌ Simple single-component features

---

## Conclusion

The current structure is solid for phases 1-5. The recommended changes will:

1. **Improve maintainability**: Clear component organization
2. **Enable scalability**: Ready for phases 6-10
3. **Enhance DX**: Better file discovery, cleaner imports
4. **Follow best practices**: Next.js 14 conventions

**Recommendation**: Implement Phase 1-2 of migration plan before starting Phase 6 development.

**Priority**: MEDIUM - Current structure works, but refactoring now will prevent technical debt.

**Effort**: 2-3 weeks part-time, or 1 week full-time

---

## Additional Resources

- [Next.js Project Structure](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [React Component Patterns](https://react.dev/learn/thinking-in-react)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

**Document Version**: 1.0
**Last Updated**: 2026-05-28
**Author**: project-structure-architect agent
