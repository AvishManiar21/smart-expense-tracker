import express from 'express';
import {
  getIncome,
  createIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from '../controllers/income.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  validateCreateIncome,
  validateUpdateIncome,
} from '../middleware/income.validation.js';

const router = express.Router();

// All routes require authentication
router.get('/', authenticate, getIncome);
router.post('/', authenticate, validateCreateIncome, createIncome);
router.get('/:id', authenticate, getIncomeById);
router.put('/:id', authenticate, validateUpdateIncome, updateIncome);
router.delete('/:id', authenticate, deleteIncome);

export default router;
