/**
 * Wraps an async Express route handler so that any unhandled rejection
 * is automatically forwarded to Express's next(err), triggering the
 * global error handler instead of hanging the request (504 Gateway Timeout).
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }));
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
