# Structure Refactor - Action Plan

**Status**: Ready to Execute
**Estimated Time**: 1-2 weeks
**Priority**: Recommended before Phase 6

---

## Quick Commands

### Setup
```bash
cd c:/dev/Project2.0/smart-expense-tracker
git checkout -b feature/structure-refactor
```

### Verify Before Starting
```bash
npm run build  # Should succeed
git status     # Clean working directory
```

---

## Week 1: Foundation & Hooks

### Day 1: Create Infrastructure

```bash
# Create directories
mkdir -p src/hooks
mkdir -p src/providers
mkdir -p src/lib/api
mkdir -p src/components/layout
mkdir -p src/components/features/analytics
mkdir -p src/components/features/budgets
mkdir -p src/components/features/transactions

# Add loading states
touch src/app/\(dashboard\)/analytics/loading.tsx
touch src/app/\(dashboard\)/budgets/loading.tsx
touch src/app/\(dashboard\)/dashboard/loading.tsx
touch src/app/\(dashboard\)/expenses/loading.tsx
touch src/app/\(dashboard\)/income/loading.tsx

# Add error boundaries
touch src/app/\(dashboard\)/analytics/error.tsx
touch src/app/\(dashboard\)/budgets/error.tsx
touch src/app/\(dashboard\)/dashboard/error.tsx
touch src/app/\(dashboard\)/expenses/error.tsx
touch src/app/\(dashboard\)/income/error.tsx
```

**Implement:**
1. Basic loading skeletons
2. Error boundary components
3. Test each route's loading/error states

**Commit**: `feat: Add loading and error boundaries to all dashboard routes`

---

### Day 2: Split Types

**Create new type files:**
```bash
touch src/types/api.ts
touch src/types/database.ts
touch src/types/analytics.ts
touch src/types/filters.ts
touch src/types/forms.ts
```

**Move types from `types/index.ts`:**

**`types/database.ts`** - Move:
- User, NewUser
- Expense, NewExpense
- Income, NewIncome
- Category, NewCategory
- Budget, NewBudget
- RecurringExpense, NewRecurringExpense

**`types/api.ts`** - Move:
- ApiResponse
- LoginCredentials
- RegisterData
- AuthUser

**`types/analytics.ts`** - Move:
- MonthlySummary
- TrendData
- CategoryBreakdownItem
- Insight
- ComparisonData
- IncomeVsExpenseData

**`types/filters.ts`** - Move:
- ExpenseFilters
- Add: IncomeFilters, BudgetFilters, DateRange

**`types/forms.ts`** - New:
- ExpenseFormData
- IncomeFormData
- BudgetFormData
- CategoryFormData

**Update `types/index.ts`:**
```typescript
// Re-export everything
export * from './api';
export * from './database';
export * from './analytics';
export * from './filters';
export * from './forms';
export * from './next-auth';
```

**Find and update imports:**
```bash
# Check which files import from types
grep -r "from '@/types'" src/ --include="*.ts" --include="*.tsx"
```

**Test:**
```bash
npm run build
```

**Commit**: `refactor: Split types into domain-specific files`

---

### Day 3: Create Data Hooks

**Create `src/hooks/use-expenses.ts`:**
```typescript
import { useState, useEffect } from 'react';
import { Expense, ExpenseFilters } from '@/types';

export function useExpenses(filters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(
        filters as Record<string, string>
      );
      const response = await fetch(`/api/expenses?${params}`);
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data);
      } else {
        setError(data.error || 'Failed to fetch expenses');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [JSON.stringify(filters)]);

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
  };
}
```

**Create similar hooks:**
- `src/hooks/use-income.ts`
- `src/hooks/use-budgets.ts`
- `src/hooks/use-categories.ts`
- `src/hooks/use-analytics.ts`

**Create utility hooks:**
- `src/hooks/use-debounce.ts`
- `src/hooks/use-local-storage.ts`

**Commit**: `feat: Add custom data hooks for expenses, income, budgets`

---

### Day 4: Create API Client Layer

**`src/lib/api/client.ts`:**
```typescript
import { ApiResponse } from '@/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error', 500);
  }
}
```

**`src/lib/api/expenses.ts`:**
```typescript
import { apiRequest } from './client';
import { Expense, NewExpense, ExpenseFilters } from '@/types';

export const expensesApi = {
  list: (filters?: ExpenseFilters) => {
    const params = new URLSearchParams(filters as any);
    return apiRequest<Expense[]>(`/api/expenses?${params}`);
  },

  get: (id: string) =>
    apiRequest<Expense>(`/api/expenses/${id}`),

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
    apiRequest<void>(`/api/expenses/${id}`, {
      method: 'DELETE',
    }),
};
```

**Create similar clients:**
- `src/lib/api/income.ts`
- `src/lib/api/budgets.ts`
- `src/lib/api/categories.ts`
- `src/lib/api/analytics.ts`

**`src/lib/api/index.ts`:**
```typescript
export * from './client';
export * from './expenses';
export * from './income';
export * from './budgets';
export * from './categories';
export * from './analytics';
```

**Commit**: `feat: Add centralized API client layer`

---

### Day 5: Update Hooks to Use API Client

**Update `use-expenses.ts` to use client:**
```typescript
import { expensesApi } from '@/lib/api';

export function useExpenses(filters?: ExpenseFilters) {
  // ... existing state

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expensesApi.list(filters);
      if (response.success) {
        setExpenses(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ... rest
}
```

**Update all hooks**
**Test all pages work**

**Commit**: `refactor: Update hooks to use API client layer`

---

## Week 2: Component Reorganization

### Day 6: Create _components Folders

```bash
# Expenses
mkdir -p src/app/\(dashboard\)/expenses/_components/expense-form
mkdir -p src/app/\(dashboard\)/expenses/_components/expense-list
git mv src/app/\(dashboard\)/expenses/expense-dialog.tsx \
       src/app/\(dashboard\)/expenses/_components/expense-form/
git mv src/app/\(dashboard\)/expenses/expense-filters.tsx \
       src/app/\(dashboard\)/expenses/_components/
git mv src/app/\(dashboard\)/expenses/expense-table.tsx \
       src/app/\(dashboard\)/expenses/_components/expense-list/
git mv src/app/\(dashboard\)/expenses/expenses-client.tsx \
       src/app/\(dashboard\)/expenses/_components/

# Income
mkdir -p src/app/\(dashboard\)/income/_components/income-form
mkdir -p src/app/\(dashboard\)/income/_components/income-list
git mv src/app/\(dashboard\)/income/income-dialog.tsx \
       src/app/\(dashboard\)/income/_components/income-form/
git mv src/app/\(dashboard\)/income/income-filters.tsx \
       src/app/\(dashboard\)/income/_components/
git mv src/app/\(dashboard\)/income/income-table.tsx \
       src/app/\(dashboard\)/income/_components/income-list/
git mv src/app/\(dashboard\)/income/income-client.tsx \
       src/app/\(dashboard\)/income/_components/

# Budgets
mkdir -p src/app/\(dashboard\)/budgets/_components
git mv src/app/\(dashboard\)/budgets/budgets-client.tsx \
       src/app/\(dashboard\)/budgets/_components/

# Analytics
mkdir -p src/app/\(dashboard\)/analytics/_components
```

**Update imports in page.tsx files**

**Commit**: `refactor: Move page-specific components to _components folders`

---

### Day 7: Move Shared Components to Features

```bash
# Move dashboard components
git mv src/components/dashboard/summary-cards.tsx \
       src/components/features/analytics/
git mv src/components/dashboard/insights-panel.tsx \
       src/components/features/analytics/
git mv src/components/dashboard/recent-transactions.tsx \
       src/components/features/transactions/

# Move analytics component
git mv src/components/analytics/category-breakdown-table.tsx \
       src/components/features/analytics/
```

**Update all imports**

**Commit**: `refactor: Move shared components to features directory`

---

### Day 8: Split Large Components

**Split `analytics/page.tsx` (445 lines):**

Create:
- `_components/analytics-tabs.tsx`
- `_components/overview-section.tsx`
- `_components/trends-section.tsx`
- `_components/categories-section.tsx`
- `_components/insights-section.tsx`

**Split `category-breakdown-table.tsx` (430 lines):**

Create:
- `features/analytics/category-breakdown/breakdown-table.tsx`
- `features/analytics/category-breakdown/breakdown-row.tsx`
- `features/analytics/category-breakdown/breakdown-header.tsx`
- `features/analytics/category-breakdown/index.ts`

**Commit**: `refactor: Split large components into smaller modules`

---

### Day 9: Add Layout Components

**Create `components/layout/page-header.tsx`:**
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  action
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
```

**Create:**
- `components/layout/page-container.tsx`
- `components/layout/stat-card.tsx`
- `components/layout/empty-state.tsx`
- `components/layout/data-table-skeleton.tsx`

**Update pages to use layout components**

**Commit**: `feat: Add reusable layout components`

---

### Day 10: Final Testing & Documentation

**Test all pages:**
- [ ] Login/Register
- [ ] Dashboard
- [ ] Expenses (list, create, edit, delete)
- [ ] Income (list, create, edit, delete)
- [ ] Budgets (list, create, edit, delete)
- [ ] Analytics (all tabs)

**Run checks:**
```bash
npm run build
npm run lint
```

**Update tsconfig.json paths:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/features/*": ["./src/features/*"]
    }
  }
}
```

**Update documentation:**
- [ ] README.md (update structure section)
- [ ] Add component guidelines
- [ ] Add hook usage examples

**Commit**: `docs: Update documentation for new structure`

---

## Verification Checklist

### Pre-Merge
- [ ] All pages load without errors
- [ ] All API calls work correctly
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console errors in browser
- [ ] Loading states display correctly
- [ ] Error boundaries work
- [ ] All imports resolve
- [ ] Git history preserved (used `git mv`)

### Code Quality
- [ ] No components over 250 lines
- [ ] All hooks follow naming convention
- [ ] All types properly organized
- [ ] API client used consistently
- [ ] Layout components reused

### Documentation
- [ ] PROJECT_STRUCTURE.md updated
- [ ] README.md updated
- [ ] Component usage documented
- [ ] Hook usage documented

---

## Rollback Plan

If issues occur:

```bash
# Rollback changes
git checkout main
git branch -D feature/structure-refactor

# Or reset to specific commit
git log --oneline
git reset --hard <commit-hash>
```

---

## Post-Merge Tasks

1. **Update team**
   - Share new structure guidelines
   - Review component patterns
   - Demo new hooks

2. **Monitor**
   - Check for broken imports
   - Verify all pages in production
   - Monitor error logs

3. **Iterate**
   - Gather feedback
   - Refine patterns
   - Add missing abstractions

---

## Quick Reference

### Component Placement
```
route-specific        → app/(dashboard)/route/_components/
feature-shared        → components/features/
global-shared         → components/
layout                → components/layout/
ui primitives         → components/ui/
```

### Import Examples
```typescript
// Hooks
import { useExpenses } from '@/hooks/use-expenses';

// API Client
import { expensesApi } from '@/lib/api';

// Types
import type { Expense, ExpenseFilters } from '@/types';

// Features
import { SummaryCards } from '@/components/features/analytics/summary-cards';

// Layout
import { PageHeader } from '@/components/layout/page-header';

// Route components
import { ExpenseDialog } from './_components/expense-form/expense-dialog';
```

---

## Success Metrics

After refactor:
- ✅ No components over 250 lines
- ✅ All data fetching in hooks
- ✅ All API calls through client
- ✅ Loading states on all routes
- ✅ Error boundaries on all routes
- ✅ Types organized by domain
- ✅ Clean import paths
- ✅ Improved DX (file discovery)

---

**Next Steps After Completion:**

Ready for Phase 6 development with:
- Scalable structure
- Reusable patterns
- Clear conventions
- Easy onboarding

---

**Document Version**: 1.0
**Last Updated**: 2026-05-28
