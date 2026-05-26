import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateCreateCategory, validateUpdateCategory } from '../middleware/category.validation.js';

const router = express.Router();

/**
 * Category routes
 * All routes require authentication
 */

// Get all categories (system + user custom)
router.get('/', authenticate, getCategories);

// Create custom category
router.post('/', authenticate, validateCreateCategory, createCategory);

// Update custom category
router.put('/:id', authenticate, validateUpdateCategory, updateCategory);

// Delete custom category
router.delete('/:id', authenticate, deleteCategory);

export default router;
