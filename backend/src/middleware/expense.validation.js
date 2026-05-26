import { body } from 'express-validator';
import { handleValidationErrors } from './validate.js';

/**
 * Validation rules for creating an expense
 */
export const validateCreateExpense = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('categoryId')
    .notEmpty()
    .withMessage('Category is required')
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['cash', 'card', 'bank'])
    .withMessage('Payment method must be one of: cash, card, bank'),

  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),

  body('recurringId')
    .optional()
    .isUUID()
    .withMessage('Recurring ID must be a valid UUID'),

  handleValidationErrors,
];

/**
 * Validation rules for updating an expense
 */
export const validateUpdateExpense = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'bank'])
    .withMessage('Payment method must be one of: cash, card, bank'),

  // At least one field must be provided
  body()
    .custom((value, { req }) => {
      const hasUpdate = req.body.amount || req.body.categoryId || req.body.description || req.body.date || req.body.paymentMethod;
      if (!hasUpdate) {
        throw new Error('At least one field must be provided for update');
      }
      return true;
    }),

  handleValidationErrors,
];

/**
 * Validation for bulk import
 */
export const validateBulkImport = [
  // File validation is handled by multer
  // This middleware just validates the request after multer
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is required',
      });
    }
    next();
  },
];
