const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://43.204.112.237:3000'
      ]
  
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
  };
  
  module.exports = corsOptions;
