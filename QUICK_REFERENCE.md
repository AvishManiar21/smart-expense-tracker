# Quick Reference - Project Structure Patterns

**For**: Smart Expense Tracker Next.js 14
**Use**: When adding new features or components

---

## Where Do I Put This File?

### Components

```
┌─────────────────────────────────────────────────────┐
│ Question: Is this component used in ONE route only? │
└─────────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
       YES                     NO
        │                       │
        ▼                       ▼
  app/(dashboard)/route/   Is it feature-specific?
    _components/                │
                    ┌───────────┴───────────┐
                   YES                     NO
                    │                       │
                    ▼                       ▼
            components/features/     Is it a chart?
              {feature}/                   │
                                ┌──────────┴──────────┐
                               YES                   NO
                                │                     │
                                ▼                     ▼
                          components/         Is it a layout?
                            charts/                  │
                                          ┌──────────┴──────────┐
                                         YES                   NO
                                          │                     │
                                          ▼                     ▼
                                   components/          components/ui/
                                     layout/         (base primitives)
```

### Examples

| Component | Location | Reason |
|-----------|----------|--------|
| ExpenseDialog | `app/(dashboard)/expenses/_components/expense-form/` | Only used in /expenses |
| BudgetCard | `app/(dashboard)/budgets/_components/` | Only used in /budgets |
| SummaryCards | `components/features/analytics/` | Used in dashboard + analytics |
| TransactionRow | `components/features/transactions/` | Used across multiple pages |
| SpendingTrendChart | `components/charts/` | Reusable chart component |
| PageHeader | `components/layout/` | Reusable layout component |
| Button | `components/ui/` | Base UI primitive |

---

## Naming Conventions

### Files
```typescript
// Components: kebab-case.tsx
expense-dialog.tsx
summary-cards.tsx
page-header.tsx

// Hooks: use-{name}.ts
use-expenses.ts
use-debounce.ts
use-analytics.ts

// Utils: {name}.ts
format-currency.ts
calculate-total.ts
api-client.ts

// Types: {domain}.ts
database.ts
analytics.ts
filters.ts
```

### Components
```typescript
// PascalCase
export function ExpenseDialog() {}
export function SummaryCards() {}
export const PageHeader = () => {}
```

### Hooks
```typescript
// camelCase with 'use' prefix
export function useExpenses() {}
export function useDebounce() {}
```

### Functions
```typescript
// camelCase
export function formatCurrency() {}
export function calculateTotal() {}
```

### Constants
```typescript
// UPPER_SNAKE_CASE
export const MAX_FILE_SIZE = 5000000;
export const DEFAULT_CURRENCY = 'USD';
export const API_BASE_URL = '/api';
```

---

## Import Patterns

### Current Working Directory
```typescript
// From same route (_components)
import { ExpenseDialog } from './_components/expense-form';
import { ExpenseTable } from './_components/expense-list';

// From sibling files
import { ExpenseFilters } from './_components/expense-filters';
```

### Absolute Imports
```typescript
// Hooks
import { useExpenses } from '@/hooks/use-expenses';

// API Client
import { expensesApi } from '@/lib/api';

// Types
import type { Expense, ExpenseFilters } from '@/types';

// Features
import { SummaryCards } from '@/components/features/analytics/summary-cards';

// Charts
import { ExpensePieChart } from '@/components/charts/expense-pie-chart';

// Layout
import { PageHeader } from '@/components/layout/page-header';

// UI
import { Button } from '@/components/ui/button';

// Utils
import { formatCurrency } from '@/lib/utils/date';

// Services
import { analyticsService } from '@/lib/services/analytics';
```

---

## Common Patterns

### Page Structure
```typescript
// app/(dashboard)/expenses/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ExpensesClient } from './_components/expenses-client';

export default async function ExpensesPage() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user) redirect('/login');

  // 2. Optional: Server-side data fetching
  // const expenses = await db.select()...

  // 3. Return client component
  return (
    <div className="px-4 py-6">
      <ExpensesClient />
    </div>
  );
}
```

### Client Component with Hooks
```typescript
// _components/expenses-client.tsx
'use client';

import { useExpenses } from '@/hooks/use-expenses';
import { ExpenseTable } from './expense-list/expense-table';
import { ExpenseFilters } from './expense-filters';

export function ExpensesClient() {
  const [filters, setFilters] = useState({});
  const { expenses, loading, error } = useExpenses(filters);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <ExpenseFilters onChange={setFilters} />
      <ExpenseTable expenses={expenses} />
    </>
  );
}
```

### Custom Hook
```typescript
// hooks/use-expenses.ts
import { useState, useEffect } from 'react';
import { expensesApi } from '@/lib/api';
import type { Expense, ExpenseFilters } from '@/types';

export function useExpenses(filters?: ExpenseFilters) {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await expensesApi.list(filters);
      setData(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { expenses: data, loading, error, refetch: fetchData };
}
```

### API Client
```typescript
// lib/api/expenses.ts
import { apiRequest } from './client';
import type { Expense, NewExpense } from '@/types';

export const expensesApi = {
  list: (filters?: ExpenseFilters) =>
    apiRequest<Expense[]>(`/api/expenses?${new URLSearchParams(filters)}`),

  create: (data: NewExpense) =>
    apiRequest<Expense>('/api/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<NewExpense>) =>
    apiRequest<Expense>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<void>(`/api/expenses/${id}`, { method: 'DELETE' }),
};
```

### Loading State
```typescript
// app/(dashboard)/expenses/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
```

### Error Boundary
```typescript
// app/(dashboard)/expenses/error.tsx
'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

---

## Component Size Guidelines

```
┌──────────────────────────────────────────┐
│ Component Size Limits                    │
├──────────────────────────────────────────┤
│ 0-100 lines    │ ✅ Perfect              │
│ 100-200 lines  │ ✅ Good                 │
│ 200-300 lines  │ ⚠️  Consider splitting  │
│ 300+ lines     │ ❌ Must split           │
└──────────────────────────────────────────┘

If over 200 lines, split by:
- Sub-components (extract JSX sections)
- Custom hooks (extract logic)
- Utility functions (extract helpers)
- Separate files (extract features)
```

---

## Server vs Client Components

### Use Server Component (default)
```typescript
// No 'use client' directive
// Can do async/await
// Can access database directly
// Cannot use useState, useEffect, etc.

export default async function Page() {
  const data = await db.select()...
  return <ClientComponent data={data} />
}
```

### Use Client Component
```typescript
'use client';

// Can use hooks
// Can use browser APIs
// Cannot do server-side data fetching
// Cannot access database directly

export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={...}>
}
```

### Rule of Thumb
```
Data fetching in page → Server Component
Interactivity needed → Client Component
```

---

## Type Imports

### Import Types Only
```typescript
// Use 'type' keyword for type-only imports
import type { Expense, ExpenseFilters } from '@/types';
import type { ReactNode } from 'react';

// Not needed for values
import { expensesApi } from '@/lib/api';
```

### Type Organization
```typescript
// types/database.ts - Database models
export type Expense = ...
export type Income = ...

// types/api.ts - API types
export interface ApiResponse<T> = ...

// types/analytics.ts - Analytics types
export interface MonthlySummary = ...

// types/filters.ts - Filter types
export interface ExpenseFilters = ...

// types/forms.ts - Form data types
export interface ExpenseFormData = ...

// types/index.ts - Re-exports
export * from './database';
export * from './api';
// ...
```

---

## Folder Structure Templates

### New Page
```
app/(dashboard)/new-page/
├── _components/
│   ├── page-specific-component.tsx
│   └── another-component.tsx
├── page.tsx
├── loading.tsx
└── error.tsx
```

### New Feature
```
components/features/new-feature/
├── feature-component.tsx
├── feature-card.tsx
└── index.ts
```

### New Hook
```
hooks/
├── use-new-feature.ts
└── use-new-feature.test.ts
```

### New API Route
```
app/api/new-resource/
├── route.ts
├── [id]/
│   └── route.ts
└── special-endpoint/
    └── route.ts
```

---

## Testing Colocation

```
src/
├── hooks/
│   ├── use-expenses.ts
│   └── use-expenses.test.ts     ← Colocated
│
├── lib/utils/
│   ├── format-currency.ts
│   └── format-currency.test.ts  ← Colocated
│
└── components/features/
    └── analytics/
        ├── summary-cards.tsx
        └── summary-cards.test.tsx  ← Colocated
```

---

## Git Commit Patterns

### Good Commits
```bash
feat: Add expense filtering functionality
fix: Correct budget calculation logic
refactor: Extract data fetching to useExpenses hook
docs: Update API documentation
style: Format code with prettier
test: Add tests for analytics service
```

### Component Changes
```bash
feat(expenses): Add bulk delete functionality
fix(budgets): Correct progress bar calculation
refactor(analytics): Split large component into modules
```

### Scope Options
- feat: New feature
- fix: Bug fix
- refactor: Code restructure
- docs: Documentation
- style: Formatting
- test: Testing
- chore: Maintenance

---

## Common Mistakes to Avoid

### ❌ Don't Do
```typescript
// Mixing route files with components
app/(dashboard)/expenses/
├── expense-dialog.tsx      ❌ Should be in _components
├── expense-table.tsx       ❌ Should be in _components
└── page.tsx

// Direct fetch in components
const response = await fetch('/api/expenses');  ❌ Use hook

// All types in one file
types/index.ts (500 lines)  ❌ Split by domain

// Large components
Component.tsx (600 lines)   ❌ Split into smaller parts
```

### ✅ Do
```typescript
// Clean route structure
app/(dashboard)/expenses/
├── _components/
│   ├── expense-dialog.tsx  ✅
│   └── expense-table.tsx   ✅
└── page.tsx

// Use hooks for data
const { expenses } = useExpenses();  ✅

// Organized types
types/
├── database.ts   ✅
├── api.ts        ✅
└── analytics.ts  ✅

// Focused components
Component.tsx (120 lines)  ✅
```

---

## Debugging Import Issues

### Issue: Module not found
```bash
# Check tsconfig.json paths
{
  "paths": {
    "@/*": ["./src/*"]
  }
}

# Restart dev server
npm run dev
```

### Issue: Type errors
```bash
# Rebuild types
npm run build

# Check import path
import type { Expense } from '@/types';  # Correct
import type { Expense } from '@/types/index';  # Also works
```

---

## Performance Tips

### Code Splitting
```typescript
// Dynamic import for heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/charts/heavy-chart'),
  { loading: () => <Skeleton /> }
);
```

### Memoization
```typescript
// Memo expensive components
import { memo } from 'react';

export const ExpensiveComponent = memo(function ExpensiveComponent(props) {
  // ...
});

// useMemo for expensive calculations
const total = useMemo(
  () => expenses.reduce((sum, e) => sum + e.amount, 0),
  [expenses]
);
```

---

## Quick Decision Tree

```
Adding new code?
│
├─ Is it a page?
│  └─ app/(dashboard)/{route}/page.tsx
│
├─ Is it only for one page?
│  └─ app/(dashboard)/{route}/_components/
│
├─ Is it used across multiple pages in one feature?
│  └─ components/features/{feature}/
│
├─ Is it a chart?
│  └─ components/charts/
│
├─ Is it a layout component?
│  └─ components/layout/
│
├─ Is it a UI primitive?
│  └─ components/ui/
│
├─ Is it data fetching logic?
│  └─ hooks/use-{name}.ts
│
├─ Is it an API call?
│  └─ lib/api/{resource}.ts
│
├─ Is it a utility function?
│  └─ lib/utils/{name}.ts
│
└─ Is it a type definition?
   └─ types/{domain}.ts
```

---

## Resources

- **Full Analysis**: `PROJECT_STRUCTURE.md`
- **Implementation Guide**: `REFACTOR_ACTION_PLAN.md`
- **Visual Comparison**: `STRUCTURE_COMPARISON.md`
- **Executive Summary**: `STRUCTURE_ANALYSIS_SUMMARY.md`
- **This Reference**: `QUICK_REFERENCE.md`

---

**Print this file or keep it open while coding!**

**Last Updated**: 2026-05-28
