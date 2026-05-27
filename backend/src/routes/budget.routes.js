import express from 'express';
import {
  getBudgets,
  getBudgetStatus,
  getBudgetAlerts,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  validateCreateBudget,
  validateUpdateBudget,
} from '../middleware/budget.validation.js';

const router = express.Router();

// All routes require authentication
router.get('/status', authenticate, getBudgetStatus);
router.get('/alerts', authenticate, getBudgetAlerts);
router.get('/', authenticate, getBudgets);
router.post('/', authenticate, validateCreateBudget, createBudget);
router.put('/:id', authenticate, validateUpdateBudget, updateBudget);
router.delete('/:id', authenticate, deleteBudget);

export default router;
