import { body } from 'express-validator';
import { handleValidationErrors } from './validate.js';

const VALID_SOURCES = ['salary', 'freelance', 'investment', 'other', 'rental', 'business'];

export const validateCreateIncome = [
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .isIn(VALID_SOURCES)
    .withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  body('isRecurring')
    .optional()
    .isBoolean()
    .withMessage('isRecurring must be a boolean'),

  handleValidationErrors,
];

export const validateUpdateIncome = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('source')
    .optional()
    .isIn(VALID_SOURCES)
    .withMessage(`Source must be one of: ${VALID_SOURCES.join(', ')}`),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),

  handleValidationErrors,
];
