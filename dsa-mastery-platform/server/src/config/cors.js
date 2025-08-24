const corsOptions = {
    origin: function (origin, callback) {
      // Allow all origins for development/production flexibility
      // You can restrict this later by setting CORS_ORIGIN environment variable
      const allowedOrigins = process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : true; // Allow all origins when CORS_ORIGIN is not set
  
      if (allowedOrigins === true) {
        // Allow all origins
        callback(null, true);
      } else if (Array.isArray(allowedOrigins)) {
        // Allow specific origins
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.log('CORS blocked origin:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  
  module.exports = corsOptions;
