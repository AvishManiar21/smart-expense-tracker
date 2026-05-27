import express from 'express';
import {
  getSummary,
  getTrends,
  getCategoryBreakdown,
  getInsights,
  getComparison,
  getIncomeVsExpense,
} from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication to all analytics routes
router.use(authenticate);

/**
 * @route   GET /api/analytics/summary
 * @desc    Get monthly summary with key metrics
 * @access  Private
 */
router.get('/summary', getSummary);

/**
 * @route   GET /api/analytics/trends
 * @desc    Get spending trends over time
 * @access  Private
 */
router.get('/trends', getTrends);

/**
 * @route   GET /api/analytics/category-breakdown
 * @desc    Get category breakdown for a month
 * @access  Private
 */
router.get('/category-breakdown', getCategoryBreakdown);

/**
 * @route   GET /api/analytics/insights
 * @desc    Get AI-powered insights
 * @access  Private
 */
router.get('/insights', getInsights);

/**
 * @route   GET /api/analytics/comparison
 * @desc    Get month-over-month comparison
 * @access  Private
 */
router.get('/comparison', getComparison);

/**
 * @route   GET /api/analytics/income-vs-expense
 * @desc    Get income vs expense for last 12 months
 * @access  Private
 */
router.get('/income-vs-expense', getIncomeVsExpense);

export default router;
