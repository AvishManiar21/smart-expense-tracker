import { asyncHandler } from './asyncHandler.js';
import { UnauthorizedError } from '../utils/errors.js';
import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  if (!token) {
    throw new UnauthorizedError('No token provided');
  }

  // Verify token
  const decoded = verifyAccessToken(token);

  // Attach user info to request
  req.user = decoded;

  next();
});
