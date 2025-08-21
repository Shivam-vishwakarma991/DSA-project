module.exports = {
    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  
    // Auth
    JWT_COOKIE_EXPIRE: 7, // days
    REFRESH_TOKEN_EXPIRE: 30, // days
    PASSWORD_RESET_EXPIRE: 10, // minutes
    EMAIL_VERIFICATION_EXPIRE: 24, // hours
  
    // Rate Limiting
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 100,
  
    // File Upload
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
    // Cache
    CACHE_TTL: 60 * 60, // 1 hour in seconds
  
    // Problem Difficulty
    DIFFICULTY_LEVELS: {
      EASY: 'Easy',
      MEDIUM: 'Medium',
      HARD: 'Hard',
    },
  
    // User Roles
    USER_ROLES: {
      STUDENT: 'student',
      ADMIN: 'admin',
      MODERATOR: 'moderator',
    },
  
    // Progress Status
    PROGRESS_STATUS: {
      PENDING: 'pending',
      ATTEMPTED: 'attempted',
      COMPLETED: 'completed',
      REVISIT: 'revisit',
    },
  
    // Response Messages
    MESSAGES: {
      AUTH: {
        LOGIN_SUCCESS: 'Logged in successfully',
        LOGOUT_SUCCESS: 'Logged out successfully',
        REGISTER_SUCCESS: 'Registration successful',
        UNAUTHORIZED: 'Unauthorized access',
        INVALID_CREDENTIALS: 'Invalid email or password',
        TOKEN_EXPIRED: 'Token has expired',
        TOKEN_INVALID: 'Invalid token',
      },
      CRUD: {
        CREATE_SUCCESS: 'Created successfully',
        UPDATE_SUCCESS: 'Updated successfully',
        DELETE_SUCCESS: 'Deleted successfully',
        FETCH_SUCCESS: 'Fetched successfully',
        NOT_FOUND: 'Resource not found',
      },
      VALIDATION: {
        INVALID_INPUT: 'Invalid input data',
        REQUIRED_FIELDS: 'Please provide all required fields',
      },
      SERVER: {
        INTERNAL_ERROR: 'Internal server error',
        DATABASE_ERROR: 'Database operation failed',
      },
    },
  };