import { body } from 'express-validator';
import { handleValidationErrors } from './validate.js';

export const validateCreateBudget = [
  body('categoryId')
    .notEmpty()
    .withMessage('Category is required')
    .isUUID()
    .withMessage('Category ID must be a valid UUID'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('period')
    .optional()
    .isIn(['monthly', 'yearly'])
    .withMessage('Period must be either monthly or yearly'),

  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),

  handleValidationErrors,
];

export const validateUpdateBudget = [
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number greater than 0'),

  body('period')
    .optional()
    .isIn(['monthly', 'yearly'])
    .withMessage('Period must be either monthly or yearly'),

  handleValidationErrors,
];
