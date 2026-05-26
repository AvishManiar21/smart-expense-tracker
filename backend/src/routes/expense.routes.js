import express from 'express';
import multer from 'multer';
import {
  getExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  bulkImport,
} from '../controllers/expense.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  validateCreateExpense,
  validateUpdateExpense,
  validateBulkImport,
} from '../middleware/expense.validation.js';
import { BadRequestError } from '../utils/errors.js';

const router = express.Router();

// Configure multer for CSV upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Only CSV files are allowed'));
    }
  },
});

/**
 * Expense routes
 * All routes require authentication
 */

// Get expenses with filters and pagination
router.get('/', authenticate, getExpenses);

// Create new expense
router.post('/', authenticate, validateCreateExpense, createExpense);

// Bulk import from CSV
router.post('/bulk', authenticate, upload.single('file'), validateBulkImport, bulkImport);

// Get single expense
router.get('/:id', authenticate, getExpenseById);

// Update expense
router.put('/:id', authenticate, validateUpdateExpense, updateExpense);

// Delete expense (soft delete)
router.delete('/:id', authenticate, deleteExpense);

export default router;
