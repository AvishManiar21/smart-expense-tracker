import { asyncHandler } from '../middleware/asyncHandler.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { prisma } from '../server.js';

/**
 * Calculate next occurrence based on frequency
 */
function calculateNextOccurrence(date, frequency) {
  const nextDate = new Date(date);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      throw new Error('Invalid frequency');
  }

  return nextDate;
}

/**
 * Get all recurring expense templates
 * @route GET /api/recurring
 * @access Private
 */
export const getRecurring = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const recurring = await prisma.recurringExpense.findMany({
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
    orderBy: { nextOccurrence: 'asc' },
  });

  res.json({
    success: true,
    data: { recurring },
    message: 'Recurring expenses retrieved successfully',
  });
});

/**
 * Create recurring expense template
 * @route POST /api/recurring
 * @access Private
 */
export const createRecurring = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { amount, categoryId, description, frequency, startDate } = req.body;

  // Verify category exists
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [{ userId: null }, { userId: userId }],
    },
  });

  if (!category) {
    throw new BadRequestError('Invalid category');
  }

  // Calculate next occurrence
  const start = startDate ? new Date(startDate) : new Date();
  const nextOccurrence = calculateNextOccurrence(start, frequency);

  const recurring = await prisma.recurringExpense.create({
    data: {
      userId,
      amount: amount.toString(),
      categoryId,
      description,
      frequency,
      nextOccurrence,
      isActive: true,
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
    data: { recurring },
    message: 'Recurring expense created successfully',
  });
});

/**
 * Update recurring expense template
 * @route PUT /api/recurring/:id
 * @access Private
 */
export const updateRecurring = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { amount, categoryId, description, frequency, isActive } = req.body;

  const recurring = await prisma.recurringExpense.findFirst({
    where: { id, userId },
  });

  if (!recurring) {
    throw new NotFoundError('Recurring expense not found');
  }

  // If category is being updated, verify it
  if (categoryId && categoryId !== recurring.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ userId: null }, { userId: userId }],
      },
    });

    if (!category) {
      throw new BadRequestError('Invalid category');
    }
  }

  // If frequency changes, recalculate next occurrence
  let nextOccurrence = recurring.nextOccurrence;
  if (frequency && frequency !== recurring.frequency) {
    nextOccurrence = calculateNextOccurrence(recurring.nextOccurrence, frequency);
  }

  const updated = await prisma.recurringExpense.update({
    where: { id },
    data: {
      amount: amount !== undefined ? amount.toString() : recurring.amount,
      categoryId: categoryId || recurring.categoryId,
      description: description !== undefined ? description : recurring.description,
      frequency: frequency || recurring.frequency,
      nextOccurrence,
      isActive: isActive !== undefined ? isActive : recurring.isActive,
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
    data: { recurring: updated },
    message: 'Recurring expense updated successfully',
  });
});

/**
 * Deactivate recurring expense
 * @route DELETE /api/recurring/:id
 * @access Private
 */
export const deleteRecurring = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const recurring = await prisma.recurringExpense.findFirst({
    where: { id, userId },
  });

  if (!recurring) {
    throw new NotFoundError('Recurring expense not found');
  }

  // Deactivate instead of delete
  await prisma.recurringExpense.update({
    where: { id },
    data: { isActive: false },
  });

  res.json({
    success: true,
    data: {},
    message: 'Recurring expense deactivated successfully',
  });
});

/**
 * Process due recurring expenses
 * @route POST /api/recurring/process
 * @access Private
 */
export const processRecurring = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Find all active recurring expenses that are due
  const dueRecurring = await prisma.recurringExpense.findMany({
    where: {
      userId,
      isActive: true,
      nextOccurrence: {
        lte: today,
      },
    },
  });

  let processedCount = 0;

  for (const recurring of dueRecurring) {
    // Create expense from recurring template
    await prisma.expense.create({
      data: {
        userId,
        amount: recurring.amount,
        categoryId: recurring.categoryId,
        description: recurring.description,
        date: recurring.nextOccurrence,
        paymentMethod: 'card', // Default for recurring
        isRecurring: true,
        recurringId: recurring.id,
      },
    });

    // Update next occurrence
    const nextOccurrence = calculateNextOccurrence(recurring.nextOccurrence, recurring.frequency);
    await prisma.recurringExpense.update({
      where: { id: recurring.id },
      data: { nextOccurrence },
    });

    processedCount++;
  }

  res.json({
    success: true,
    data: { processed: processedCount },
    message: `Processed ${processedCount} recurring expense(s)`,
  });
});
