import { body } from 'express-validator';
import { handleValidationErrors } from './validate.js';

const VALID_FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];

export const validateCreateRecurring = [
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

  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isIn(VALID_FREQUENCIES)
    .withMessage(`Frequency must be one of: ${VALID_FREQUENCIES.join(', ')}`),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  handleValidationErrors,
];

export const validateUpdateRecurring = [
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

  body('frequency')
    .optional()
    .isIn(VALID_FREQUENCIES)
    .withMessage(`Frequency must be one of: ${VALID_FREQUENCIES.join(', ')}`),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),

  handleValidationErrors,
];
