import { asyncHandler } from '../middleware/asyncHandler.js';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/errors.js';
import { prisma } from '../server.js';

/**
 * Get all budgets with current status
 * @route GET /api/budgets
 * @access Private
 */
export const getBudgets = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: { budgets },
    message: 'Budgets retrieved successfully',
  });
});

/**
 * Get budget status with spending data
 * @route GET /api/budgets/status
 * @access Private
 */
export const getBudgetStatus = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  // Calculate spent amount for each budget
  const budgetsWithStatus = await Promise.all(
    budgets.map(async (budget) => {
      // Determine period dates
      const now = new Date();
      let startDate, endDate;

      if (budget.period === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      } else {
        // yearly
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      }

      // Get total spent in this period for this category
      const result = await prisma.expense.aggregate({
        where: {
          userId,
          categoryId: budget.category.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
          deletedAt: null,
        },
        _sum: {
          amount: true,
        },
      });

      const Decimal = budget.amount.constructor;
      const spentAmountDecimal = result._sum.amount ?? new Decimal(0);
      const budgetAmountDecimal = budget.amount;
      const remainingAmountDecimal = budgetAmountDecimal.minus(spentAmountDecimal);
      const percentageUsed = budgetAmountDecimal.gt(0)
        ? spentAmountDecimal.dividedBy(budgetAmountDecimal).times(100).toNumber()
        : 0;

      // Determine status
      let status;
      if (percentageUsed >= 100) {
        status = 'exceeded';
      } else if (percentageUsed >= 70) {
        status = 'warning';
      } else {
        status = 'good';
      }

      // Calculate days left in period
      const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

      return {
        ...budget,
        budgetAmount: budgetAmountDecimal.toString(),
        spentAmount: spentAmountDecimal.toString(),
        remainingAmount: remainingAmountDecimal.toString(),
        percentageUsed: Math.round(percentageUsed * 100) / 100,
        status,
        periodStart: startDate.toISOString(),
        periodEnd: endDate.toISOString(),
        daysLeft,
      };
    })
  );

  // Sort by percentage used (highest first)
  budgetsWithStatus.sort((a, b) => b.percentageUsed - a.percentageUsed);

  res.json({
    success: true,
    data: { budgets: budgetsWithStatus },
    message: 'Budget status retrieved successfully',
  });
});

/**
 * Get budget alerts (budgets over 70%)
 * @route GET /api/budgets/alerts
 * @access Private
 */
export const getBudgetAlerts = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  // Calculate status for each budget
  const budgetsWithStatus = await Promise.all(
    budgets.map(async (budget) => {
      const now = new Date();
      let startDate, endDate;

      if (budget.period === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      } else {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      }

      const result = await prisma.expense.aggregate({
        where: {
          userId,
          categoryId: budget.category.id,
          date: { gte: startDate, lte: endDate },
          deletedAt: null,
        },
        _sum: { amount: true },
      });

      const spentAmount = result._sum.amount ? parseFloat(result._sum.amount) : 0;
      const budgetAmount = parseFloat(budget.amount);
      const percentageUsed = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

      return {
        ...budget,
        budgetAmount: budget.amount.toString(),
        spentAmount: spentAmount.toString(),
        percentageUsed: Math.round(percentageUsed * 100) / 100,
      };
    })
  );

  // Filter only alerts (>= 70%) to match UI warning threshold
  const alerts = budgetsWithStatus.filter((b) => b.percentageUsed >= 70);

  // Group by severity
  const exceeded = alerts.filter((b) => b.percentageUsed >= 100);
  const warning = alerts.filter((b) => b.percentageUsed >= 70 && b.percentageUsed < 100);

  res.json({
    success: true,
    data: {
      exceeded,
      warning,
      total: alerts.length,
    },
    message: 'Budget alerts retrieved successfully',
  });
});

/**
 * Create a new budget
 * @route POST /api/budgets
 * @access Private
 */
export const createBudget = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { categoryId, amount, period = 'monthly', startDate } = req.body;

  // Check for duplicate budget
  const existing = await prisma.budget.findFirst({
    where: {
      userId,
      categoryId,
      period,
    },
  });

  if (existing) {
    throw new ConflictError(`A ${period} budget already exists for this category`);
  }

  // Verify category belongs to user or is system default
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [{ userId: null }, { userId: userId }],
    },
  });

  if (!category) {
    throw new BadRequestError('Invalid category');
  }

  // Set start date to beginning of current period if not provided
  let budgetStartDate;
  if (startDate) {
    budgetStartDate = new Date(startDate);
  } else {
    const now = new Date();
    if (period === 'monthly') {
      budgetStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      budgetStartDate = new Date(now.getFullYear(), 0, 1);
    }
  }

  const budget = await prisma.budget.create({
    data: {
      userId,
      categoryId,
      amount: amount.toString(),
      period,
      startDate: budgetStartDate,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    data: { budget },
    message: 'Budget created successfully',
  });
});

/**
 * Update a budget
 * @route PUT /api/budgets/:id
 * @access Private
 */
export const updateBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { amount, period } = req.body;

  const budget = await prisma.budget.findFirst({
    where: { id, userId },
  });

  if (!budget) {
    throw new NotFoundError('Budget not found');
  }

  // Check for unique constraint violation if period is being changed
  if (period && period !== budget.period) {
    const existing = await prisma.budget.findFirst({
      where: {
        userId,
        categoryId: budget.categoryId,
        period,
        id: { not: id }, // Exclude current budget
      },
    });

    if (existing) {
      throw new ConflictError(`A ${period} budget already exists for this category`);
    }
  }

  const updatedBudget = await prisma.budget.update({
    where: { id },
    data: {
      amount: amount !== undefined ? amount.toString() : budget.amount,
      period: period || budget.period,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: { budget: updatedBudget },
    message: 'Budget updated successfully',
  });
});

/**
 * Delete a budget
 * @route DELETE /api/budgets/:id
 * @access Private
 */
export const deleteBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const budget = await prisma.budget.findFirst({
    where: { id, userId },
  });

  if (!budget) {
    throw new NotFoundError('Budget not found');
  }

  await prisma.budget.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: {},
    message: 'Budget deleted successfully',
  });
});
