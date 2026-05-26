import { Prisma } from '@prisma/client';
import { AppError } from '../utils/errors.js';

/**
 * Handle Prisma errors
 * @param {Error} error - Prisma error
 * @returns {AppError} Formatted app error
 */
function handlePrismaError(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return new AppError(`${field} already exists`, 409);
    }

    // Record not found
    if (error.code === 'P2025') {
      return new AppError('Record not found', 404);
    }

    // Foreign key constraint failed
    if (error.code === 'P2003') {
      return new AppError('Related record not found', 400);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError('Invalid data provided', 400);
  }

  return new AppError('Database error occurred', 500);
}

/**
 * Handle JWT errors
 * @param {Error} error - JWT error
 * @returns {AppError} Formatted app error
 */
function handleJWTError(error) {
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401);
  }
  if (error.name === 'TokenExpiredError') {
    return new AppError('Token expired', 401);
  }
  return new AppError('Authentication failed', 401);
}

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export function errorHandler(err, req, res, next) {
  let error = err;

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError ||
      err instanceof Prisma.PrismaClientValidationError) {
    error = handlePrismaError(err);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTError(err);
  }

  // Default to 500 if not an AppError
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal server error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
}
