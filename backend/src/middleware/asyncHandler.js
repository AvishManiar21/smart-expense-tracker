/**
 * Async handler wrapper to avoid try/catch in every controller
 * Catches any errors and passes them to the error handling middleware
 *
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await prisma.user.findMany();
 *   res.json({ success: true, data: users });
 * }));
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
