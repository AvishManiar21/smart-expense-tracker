import { asyncHandler } from '../middleware/asyncHandler.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { prisma } from '../server.js';

/**
 * Get expenses with filtering, sorting, and pagination
 * @route GET /api/expenses
 * @access Private
 */
export const getExpenses = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    page = 1,
    limit = 20,
    startDate,
    endDate,
    categoryId,
    paymentMethod,
    minAmount,
    maxAmount,
    search,
    sortBy = 'date',
    sortOrder = 'desc',
  } = req.query;

  // Parse and validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where = {
    userId,
    deletedAt: null,
  };

  // Date range filter
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  // Category filter
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Payment method filter
  if (paymentMethod) {
    where.paymentMethod = paymentMethod;
  }

  // Amount range filter
  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) where.amount.gte = parseFloat(minAmount);
    if (maxAmount) where.amount.lte = parseFloat(maxAmount);
  }

  // Search in description
  if (search) {
    where.description = {
      contains: search,
      mode: 'insensitive',
    };
  }

  // Build orderBy
  const orderBy = {};
  if (sortBy === 'amount') {
    orderBy.amount = sortOrder;
  } else if (sortBy === 'description') {
    orderBy.description = sortOrder;
  } else {
    orderBy.date = sortOrder;
  }

  // Execute queries in parallel
  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
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
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.expense.count({ where }),
  ]);

  // Calculate summary
  const summary = await prisma.expense.aggregate({
    where,
    _sum: {
      amount: true,
    },
    _count: true,
  });

  const totalPages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    data: {
      expenses,
    },
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: totalPages,
    },
    summary: {
      totalAmount: summary._sum.amount ? summary._sum.amount.toString() : '0',
      count: summary._count,
    },
    message: 'Expenses retrieved successfully',
  });
});

/**
 * Create a new expense
 * @route POST /api/expenses
 * @access Private
 */
export const createExpense = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    amount,
    categoryId,
    description,
    date,
    paymentMethod,
    isRecurring = false,
    recurringId,
  } = req.body;

  // Verify category exists and belongs to user or is system default
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [
        { userId: null }, // System default
        { userId: userId }, // User's custom category
      ],
    },
  });

  if (!category) {
    throw new BadRequestError('Invalid category. Category not found or does not belong to you.');
  }

  // Validate date is not too far in the future (allow 1 day for timezone)
  const expenseDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (expenseDate > tomorrow) {
    throw new BadRequestError('Expense date cannot be more than 1 day in the future');
  }

  // Create expense
  const expense = await prisma.expense.create({
    data: {
      userId,
      amount: amount.toString(),
      categoryId,
      description,
      date: expenseDate,
      paymentMethod,
      isRecurring,
      recurringId: recurringId || null,
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
    data: { expense },
    message: 'Expense created successfully',
  });
});

/**
 * Get single expense by ID
 * @route GET /api/expenses/:id
 * @access Private
 */
export const getExpenseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const expense = await prisma.expense.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
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

  if (!expense) {
    throw new NotFoundError('Expense not found');
  }

  res.json({
    success: true,
    data: { expense },
    message: 'Expense retrieved successfully',
  });
});

/**
 * Update expense
 * @route PUT /api/expenses/:id
 * @access Private
 */
export const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { amount, categoryId, description, date, paymentMethod } = req.body;

  // Find expense and verify ownership
  const expense = await prisma.expense.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
  });

  if (!expense) {
    throw new NotFoundError('Expense not found');
  }

  // If categoryId is being updated, verify it exists and is accessible
  if (categoryId && categoryId !== expense.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [
          { userId: null },
          { userId: userId },
        ],
      },
    });

    if (!category) {
      throw new BadRequestError('Invalid category');
    }
  }

  // Validate date if provided
  if (date) {
    const expenseDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (expenseDate > tomorrow) {
      throw new BadRequestError('Expense date cannot be more than 1 day in the future');
    }
  }

  // Update expense
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data: {
      amount: amount !== undefined ? amount.toString() : expense.amount,
      categoryId: categoryId || expense.categoryId,
      description: description || expense.description,
      date: date ? new Date(date) : expense.date,
      paymentMethod: paymentMethod || expense.paymentMethod,
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
    data: { expense: updatedExpense },
    message: 'Expense updated successfully',
  });
});

/**
 * Soft delete expense
 * @route DELETE /api/expenses/:id
 * @access Private
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  // Find expense and verify ownership
  const expense = await prisma.expense.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
  });

  if (!expense) {
    throw new NotFoundError('Expense not found');
  }

  // Soft delete: set deletedAt timestamp
  await prisma.expense.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  res.json({
    success: true,
    data: {},
    message: 'Expense deleted successfully',
  });
});

/**
 * Bulk import expenses from CSV
 * @route POST /api/expenses/bulk
 * @access Private
 */
export const bulkImport = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  if (!req.file) {
    throw new BadRequestError('CSV file is required');
  }

  // Import CSV parser service
  const { parseExpenseCSV } = await import('../services/csvParser.service.js');

  // Parse CSV file
  const { validExpenses, errors } = await parseExpenseCSV(req.file.path, userId);

  // Insert valid expenses in batch
  let importedCount = 0;
  if (validExpenses.length > 0) {
    const result = await prisma.expense.createMany({
      data: validExpenses,
      skipDuplicates: true,
    });
    importedCount = result.count;
  }

  res.json({
    success: true,
    data: {
      imported: importedCount,
      failed: errors.length,
      errors: errors.slice(0, 10), // Return first 10 errors
    },
    message: `Imported ${importedCount} expense(s), ${errors.length} failed`,
  });
});
