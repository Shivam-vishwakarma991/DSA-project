/**
 * Async Handler - Wraps async functions to handle errors automatically
 * This eliminates the need for try-catch blocks in every controller
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
