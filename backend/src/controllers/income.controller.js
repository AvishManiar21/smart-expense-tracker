import { asyncHandler } from '../middleware/asyncHandler.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { prisma } from '../server.js';

/**
 * Get income entries with filtering and pagination
 * @route GET /api/income
 * @access Private
 */
export const getIncome = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    page = 1,
    limit = 20,
    startDate,
    endDate,
    source,
    isRecurring,
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

  // Source filter
  if (source) {
    where.source = source;
  }

  // Recurring filter
  if (isRecurring !== undefined) {
    where.isRecurring = isRecurring === 'true';
  }

  // Build orderBy
  const orderBy = {};
  if (sortBy === 'amount') {
    orderBy.amount = sortOrder;
  } else {
    orderBy.date = sortOrder;
  }

  // Execute queries in parallel
  const [income, total] = await Promise.all([
    prisma.income.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.income.count({ where }),
  ]);

  // Calculate summary
  const summary = await prisma.income.aggregate({
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
      income,
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
    message: 'Income retrieved successfully',
  });
});

/**
 * Create a new income entry
 * @route POST /api/income
 * @access Private
 */
export const createIncome = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    amount,
    source,
    description,
    date,
    isRecurring = false,
  } = req.body;

  // Validate date is not too far in the future (allow 1 day for timezone)
  const incomeDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (incomeDate > tomorrow) {
    throw new BadRequestError('Income date cannot be more than 1 day in the future');
  }

  // Create income
  const income = await prisma.income.create({
    data: {
      userId,
      amount: amount.toString(),
      source,
      description: description || '',
      date: incomeDate,
      isRecurring,
    },
  });

  res.status(201).json({
    success: true,
    data: { income },
    message: 'Income created successfully',
  });
});

/**
 * Get single income entry by ID
 * @route GET /api/income/:id
 * @access Private
 */
export const getIncomeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const income = await prisma.income.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
  });

  if (!income) {
    throw new NotFoundError('Income not found');
  }

  res.json({
    success: true,
    data: { income },
    message: 'Income retrieved successfully',
  });
});

/**
 * Update income entry
 * @route PUT /api/income/:id
 * @access Private
 */
export const updateIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { amount, source, description, date } = req.body;

  // Find income and verify ownership
  const income = await prisma.income.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
  });

  if (!income) {
    throw new NotFoundError('Income not found');
  }

  // Validate date if provided
  if (date) {
    const incomeDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (incomeDate > tomorrow) {
      throw new BadRequestError('Income date cannot be more than 1 day in the future');
    }
  }

  // Update income
  const updatedIncome = await prisma.income.update({
    where: { id },
    data: {
      amount: amount !== undefined ? amount.toString() : income.amount,
      source: source || income.source,
      description: description !== undefined ? description : income.description,
      date: date ? new Date(date) : income.date,
    },
  });

  res.json({
    success: true,
    data: { income: updatedIncome },
    message: 'Income updated successfully',
  });
});

/**
 * Soft delete income entry
 * @route DELETE /api/income/:id
 * @access Private
 */
export const deleteIncome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  // Find income and verify ownership
  const income = await prisma.income.findFirst({
    where: {
      id,
      userId,
      deletedAt: null,
    },
  });

  if (!income) {
    throw new NotFoundError('Income not found');
  }

  // Soft delete: set deletedAt timestamp
  await prisma.income.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  res.json({
    success: true,
    data: {},
    message: 'Income deleted successfully',
  });
});
