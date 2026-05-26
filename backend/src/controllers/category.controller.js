import { asyncHandler } from '../middleware/asyncHandler.js';
import { ConflictError, NotFoundError, BadRequestError } from '../utils/errors.js';
import { prisma } from '../server.js';

/**
 * Get all categories (system defaults + user custom)
 * @route GET /api/categories
 * @access Private
 */
export const getCategories = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get all categories: system defaults (userId = null) + user's custom categories
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: null }, // System defaults
        { userId: userId }, // User's custom categories
      ],
    },
    include: {
      _count: {
        select: {
          expenses: {
            where: {
              userId: userId,
              deletedAt: null,
            },
          },
        },
      },
      budgets: {
        where: {
          userId: userId,
        },
        select: {
          amount: true,
          period: true,
        },
      },
    },
    orderBy: [
      { isDefault: 'desc' }, // System categories first
      { name: 'asc' },
    ],
  });

  // Transform to include expense count and budget info
  const categoriesWithStats = categories.map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    color: category.color,
    isDefault: category.isDefault,
    expenseCount: category._count.expenses,
    budget: category.budgets[0]?.amount || null,
    budgetPeriod: category.budgets[0]?.period || null,
  }));

  res.json({
    success: true,
    data: { categories: categoriesWithStats },
    message: 'Categories retrieved successfully',
  });
});

/**
 * Create custom category
 * @route POST /api/categories
 * @access Private
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, color, budgetLimit } = req.body;
  const userId = req.user.userId;

  // Check for duplicate category name for this user
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: userId,
      name: name,
    },
  });

  if (existingCategory) {
    throw new ConflictError('You already have a category with this name');
  }

  // Create custom category
  const category = await prisma.category.create({
    data: {
      userId,
      name,
      icon,
      color,
      budgetLimit: budgetLimit || null,
      isDefault: false,
    },
  });

  res.status(201).json({
    success: true,
    data: { category },
    message: 'Category created successfully',
  });
});

/**
 * Update custom category
 * @route PUT /api/categories/:id
 * @access Private
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, icon, color, budgetLimit } = req.body;
  const userId = req.user.userId;

  // Find category
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  // Only allow updating own categories (not system defaults)
  if (category.userId !== userId) {
    throw new BadRequestError('Cannot update system default categories');
  }

  // Check for duplicate name (excluding current category)
  if (name && name !== category.name) {
    const duplicate = await prisma.category.findFirst({
      where: {
        userId: userId,
        name: name,
        id: { not: id },
      },
    });

    if (duplicate) {
      throw new ConflictError('You already have a category with this name');
    }
  }

  // Update category
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name: name || category.name,
      icon: icon || category.icon,
      color: color || category.color,
      budgetLimit: budgetLimit !== undefined ? budgetLimit : category.budgetLimit,
    },
  });

  res.json({
    success: true,
    data: { category: updatedCategory },
    message: 'Category updated successfully',
  });
});

/**
 * Delete custom category
 * @route DELETE /api/categories/:id
 * @access Private
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  // Find category
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          expenses: {
            where: {
              userId: userId,
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  // Only allow deleting own categories
  if (category.userId !== userId) {
    throw new BadRequestError('Cannot delete system default categories');
  }

  // Check if category has expenses
  const expenseCount = category._count.expenses;
  if (expenseCount > 0) {
    throw new BadRequestError(
      `Cannot delete category with ${expenseCount} expense(s). Please reassign or delete the expenses first.`
    );
  }

  // Delete category
  await prisma.category.delete({
    where: { id },
  });

  res.json({
    success: true,
    data: {},
    message: 'Category deleted successfully',
  });
});
