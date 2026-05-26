import express from 'express';
import {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  processRecurring,
} from '../controllers/recurring.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  validateCreateRecurring,
  validateUpdateRecurring,
} from '../middleware/recurring.validation.js';

const router = express.Router();

// All routes require authentication
router.get('/', authenticate, getRecurring);
router.post('/', authenticate, validateCreateRecurring, createRecurring);
router.post('/process', authenticate, processRecurring);
router.put('/:id', authenticate, validateUpdateRecurring, updateRecurring);
router.delete('/:id', authenticate, deleteRecurring);

export default router;
