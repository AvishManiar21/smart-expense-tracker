'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Top Expense Item
 * Represents a single expense transaction within a category
 */
interface TopExpense {
  /** Expense description */
  description: string;
  /** Expense amount (formatted as currency string) */
  amount: string;
  /** Expense date (ISO string or formatted date) */
  date: string;
}

/**
 * Category Data Item
 * Represents a single category with its breakdown information
 */
export interface CategoryBreakdownItem {
  /** Category unique identifier */
  id: string;
  /** Category name (e.g., "Food & Dining") */
  name: string;
  /** Category icon (emoji or icon name) */
  icon: string;
  /** Category color (hex code) */
  color: string;
  /** Total amount spent (formatted as currency string) */
  amount: string;
  /** Percentage of total expenses */
  percentage: number;
  /** Number of transactions in this category */
  transactionCount: number;
  /** Budget amount (optional, formatted as currency string) */
  budgetAmount?: string;
  /** Budget used percentage (0-100+) */
  budgetUsedPercent?: number;
  /** Top 3 expenses in this category (optional) */
  topExpenses?: TopExpense[];
}

/**
 * Category Breakdown Table Props
 */
interface CategoryBreakdownTableProps {
  /** Array of category breakdown data */
  categories: CategoryBreakdownItem[];
}

/**
 * Sort Configuration
 */
type SortField = 'name' | 'amount' | 'percentage' | 'transactionCount' | 'budget';
type SortDirection = 'asc' | 'desc';

/**
 * Budget Status Badge Component
 * Displays the budget status with appropriate styling
 */
function BudgetStatusBadge({ usedPercent }: { usedPercent: number }) {
  if (usedPercent >= 100) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Over Budget
      </Badge>
    );
  } else if (usedPercent >= 80) {
    return (
      <Badge variant="outline" className="border-yellow-500 text-yellow-700 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Near Limit
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="border-green-500 text-green-700 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        On Track
      </Badge>
    );
  }
}

/**
 * Category Breakdown Table Component
 *
 * Displays a detailed, sortable table of expense categories with budget tracking.
 *
 * Features:
 * - Sortable columns (click header to sort)
 * - Columns: Category, Amount, % of Total, Budget, Status
 * - Progress bars for budget usage
 * - Color-coded status indicators
 * - Expandable rows showing top 3 expenses in category
 * - Empty state with helpful message
 * - Responsive design with horizontal scroll on mobile
 *
 * @example
 * ```tsx
 * const categories = [
 *   {
 *     id: '1',
 *     name: 'Food & Dining',
 *     icon: '🍔',
 *     color: '#f59e0b',
 *     amount: '$450.25',
 *     percentage: 35.2,
 *     transactionCount: 28,
 *     budgetAmount: '$500.00',
 *     budgetUsedPercent: 90.05,
 *     topExpenses: [
 *       { description: 'Restaurant', amount: '$65.00', date: '2024-05-20' }
 *     ]
 *   },
 *   // ... more categories
 * ];
 *
 * <CategoryBreakdownTable categories={categories} />
 * ```
 */
export function CategoryBreakdownTable({ categories }: CategoryBreakdownTableProps) {
  const [sortField, setSortField] = useState<SortField>('amount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const isEmpty = categories.length === 0;

  /**
   * Handle column header click for sorting
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  /**
   * Toggle row expansion
   */
  const toggleRow = (categoryId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedRows(newExpanded);
  };

  /**
   * Sort categories based on current sort configuration
   */
  const sortedCategories = [...categories].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'amount':
        aValue = parseFloat(a.amount.replace(/[$,]/g, ''));
        bValue = parseFloat(b.amount.replace(/[$,]/g, ''));
        break;
      case 'percentage':
        aValue = a.percentage;
        bValue = b.percentage;
        break;
      case 'transactionCount':
        aValue = a.transactionCount;
        bValue = b.transactionCount;
        break;
      case 'budget':
        aValue = a.budgetUsedPercent || 0;
        bValue = b.budgetUsedPercent || 0;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  /**
   * Render sort icon for column header
   */
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          Detailed breakdown of expenses by category with budget tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">No categories found</p>
              <p className="text-sm mt-1">Start adding expenses to see category breakdowns</p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Category
                      <SortIcon field="name" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('amount')}
                      className="hover:bg-transparent p-0 h-auto font-semibold ml-auto"
                    >
                      Amount
                      <SortIcon field="amount" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('percentage')}
                      className="hover:bg-transparent p-0 h-auto font-semibold ml-auto"
                    >
                      % of Total
                      <SortIcon field="percentage" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('transactionCount')}
                      className="hover:bg-transparent p-0 h-auto font-semibold ml-auto"
                    >
                      Transactions
                      <SortIcon field="transactionCount" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('budget')}
                      className="hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Budget
                      <SortIcon field="budget" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCategories.map((category) => {
                  const isExpanded = expandedRows.has(category.id);
                  const hasTopExpenses = category.topExpenses && category.topExpenses.length > 0;

                  return (
                    <>
                      {/* Main category row */}
                      <TableRow key={category.id} className="hover:bg-muted/50">
                        <TableCell>
                          {hasTopExpenses && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRow(category.id)}
                              className="h-8 w-8 p-0"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className="flex items-center justify-center w-8 h-8 rounded-full text-lg"
                              style={{ backgroundColor: `${category.color}20` }}
                            >
                              {category.icon}
                            </span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {category.amount}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-muted-foreground">
                            {category.percentage.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {category.transactionCount}
                        </TableCell>
                        <TableCell>
                          {category.budgetAmount && category.budgetUsedPercent !== undefined ? (
                            <div className="space-y-1 min-w-[150px]">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {category.amount} / {category.budgetAmount}
                                </span>
                              </div>
                              <Progress
                                value={Math.min(category.budgetUsedPercent, 100)}
                                className="h-2"
                                indicatorClassName={
                                  category.budgetUsedPercent >= 100
                                    ? 'bg-red-500'
                                    : category.budgetUsedPercent >= 80
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }
                              />
                              <div className="text-xs text-muted-foreground text-right">
                                {category.budgetUsedPercent.toFixed(0)}% used
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No budget</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {category.budgetUsedPercent !== undefined ? (
                            <BudgetStatusBadge usedPercent={category.budgetUsedPercent} />
                          ) : (
                            <Badge variant="outline" className="text-gray-500">N/A</Badge>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Expanded row showing top expenses */}
                      {isExpanded && hasTopExpenses && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/30 p-0">
                            <div className="px-12 py-4">
                              <p className="text-sm font-semibold text-muted-foreground mb-2">
                                Top Expenses:
                              </p>
                              <div className="space-y-2">
                                {category.topExpenses!.map((expense, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center text-sm p-2 rounded bg-white"
                                  >
                                    <div className="flex-1">
                                      <span className="font-medium">{expense.description}</span>
                                      <span className="text-muted-foreground ml-2 text-xs">
                                        {new Date(expense.date).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                        })}
                                      </span>
                                    </div>
                                    <span className="font-semibold">{expense.amount}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
