const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW, RATE_LIMIT_MAX_REQUESTS } = require('../config/constants');

// General rate limiter
exports.generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth routes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// API rate limiter with higher limits for authenticated users
exports.apiLimiter = (req, res, next) => {
  const limit = req.user ? 200 : 100; // Higher limit for authenticated users
  
  const limiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW,
    max: limit,
    message: 'API rate limit exceeded.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for admin users
      return req.user && req.user.role === 'admin';
    },
  });

  limiter(req, res, next);
};
