import { body } from 'express-validator';
import { handleValidationErrors } from './validate.js';

/**
 * Validation rules for creating a category
 */
export const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name must not exceed 50 characters'),

  body('icon')
    .trim()
    .notEmpty()
    .withMessage('Category icon is required')
    .isLength({ max: 10 })
    .withMessage('Icon must not exceed 10 characters'),

  body('color')
    .trim()
    .notEmpty()
    .withMessage('Category color is required')
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color (e.g., #FF6B6B)'),

  body('budgetLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget limit must be a positive number'),

  handleValidationErrors,
];

/**
 * Validation rules for updating a category
 */
export const validateUpdateCategory = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Category name must not exceed 50 characters'),

  body('icon')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Icon cannot be empty')
    .isLength({ max: 10 })
    .withMessage('Icon must not exceed 10 characters'),

  body('color')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Color cannot be empty')
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('Color must be a valid hex color (e.g., #FF6B6B)'),

  body('budgetLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget limit must be a positive number'),

  handleValidationErrors,
];
