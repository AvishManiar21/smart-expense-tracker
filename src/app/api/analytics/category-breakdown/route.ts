import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { expenses, categories } from '@/lib/db/schema';
import { requireAuth, successResponse, errorResponse } from '@/lib/utils/api';
import { eq, and, gte, lte, isNull, sql, desc } from 'drizzle-orm';

/**
 * GET /api/analytics/category-breakdown
 * Get expense breakdown by category
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM

    let startDate: Date;
    let endDate: Date;

    if (month) {
      const [yearNum, monthNum] = month.split('-');
      startDate = new Date(parseInt(yearNum), parseInt(monthNum) - 1, 1);
      endDate = new Date(parseInt(yearNum), parseInt(monthNum), 0, 23, 59, 59, 999);
    } else {
      // Current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    // Get category breakdown
    const breakdown = await db
      .select({
        categoryId: expenses.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
        total: sql<string>`COALESCE(SUM(${expenses.amount}), 0)`,
        count: sql<number>`COUNT(*)::int`,
        avgAmount: sql<string>`COALESCE(AVG(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          eq(expenses.userId, user.id),
          gte(expenses.date, startDate),
          lte(expenses.date, endDate),
          isNull(expenses.deletedAt)
        )
      )
      .groupBy(
        expenses.categoryId,
        categories.name,
        categories.icon,
        categories.color
      )
      .orderBy(desc(sql`SUM(${expenses.amount})`));

    // Calculate total for percentages
    const totalExpenses = breakdown.reduce(
      (sum, cat) => sum + parseFloat(cat.total),
      0
    );

    // Add percentage to each category
    const categoriesWithPercentage = breakdown.map((cat) => ({
      categoryId: cat.categoryId,
      categoryName: cat.categoryName || 'Uncategorized',
      categoryIcon: cat.categoryIcon,
      categoryColor: cat.categoryColor,
      total: parseFloat(cat.total),
      count: cat.count,
      avgAmount: parseFloat(cat.avgAmount),
      percentage:
        totalExpenses > 0
          ? Math.round((parseFloat(cat.total) / totalExpenses) * 100 * 100) / 100
          : 0,
    }));

    return successResponse({
      breakdown: categoriesWithPercentage,
      totalExpenses,
      period: {
        start: startDate,
        end: endDate,
      },
    });
  } catch (err: any) {
    console.error('GET /api/analytics/category-breakdown error:', err);
    return errorResponse(err.message || 'Failed to fetch category breakdown', 500);
  }
}
