# DSA Mastery Platform

A comprehensive platform for learning Data Structures and Algorithms with progress tracking, community features, and leaderboards.

## Features

- **Authentication System**: Secure login/register with JWT tokens
- **Progress Tracking**: Monitor your learning progress across topics
- **Community**: Share solutions and discuss problems with other learners
- **Leaderboard**: Compete with other users and track achievements
- **Topic Management**: Organized learning paths with curated problems
- **Modern UI**: Beautiful, responsive interface with dark mode support

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **Framer Motion** for animations
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsa-mastery-platform
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5003
   MONGODB_URI=mongodb://localhost:27017/dsa-mastery
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

   Create `.env.local` file in the client directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5003/api
   ```

4. **Start the application**

   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm start
   ```

   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5003/api

## Authentication Fixes

The authentication system has been updated to resolve the "unauthorized access" issues:

### Changes Made:

1. **Token Storage**: Changed from httpOnly cookies to localStorage for better client-side access
2. **API Configuration**: Updated API base URL to use port 5003
3. **Token Refresh**: Improved token refresh mechanism
4. **CORS Configuration**: Updated to allow proper cross-origin requests

### Key Files Modified:

- `client/src/lib/api/index.ts` - Updated token handling
- `server/src/controllers/authController.js` - Modified token response format
- `client/src/store/slices/authSlice.ts` - Updated token storage
- `client/src/components/providers/AuthProvider.tsx` - Updated to use localStorage

### Testing Authentication:

Run the test script to verify authentication is working:
```bash
cd server
node test-auth.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### Progress
- `GET /api/progress/user` - Get user's overall progress
- `GET /api/progress/topic/:topicId` - Get topic-specific progress
- `PUT /api/progress/problem/:problemId` - Update problem progress
- `GET /api/progress/streak` - Get streak information
- `GET /api/progress/recent` - Get recent activity

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
- `POST /api/community/posts/:postId/like` - Like/unlike post
- `GET /api/community/members/online` - Get online members

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard rankings
- `GET /api/leaderboard/rank` - Get user's rank
- `GET /api/leaderboard/achievements` - Get achievements

## Project Structure

```
dsa-mastery-platform/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and API
│   │   ├── store/        # Redux store
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   └── logs/             # Application logs
└── shared/               # Shared types and constants
```

## Troubleshooting

### Common Issues:

1. **"Unauthorized Access" Error**
   - Ensure the server is running on port 5003
   - Check that the API URL in client environment is correct
   - Clear browser localStorage and try logging in again

2. **CORS Errors**
   - Verify the CORS configuration in `server/src/config/cors.js`
   - Ensure the frontend URL is included in allowed origins

3. **Database Connection Issues**
   - Check MongoDB connection string in server `.env`
   - Ensure MongoDB is running locally or Atlas connection is valid

4. **Token Refresh Issues**
   - Check browser console for token refresh errors
   - Verify JWT secrets are properly set in environment variables

### Development Tips:

- Use the test script (`test-auth.js`) to verify API endpoints
- Check server logs in `server/logs/` for detailed error information
- Use browser developer tools to inspect network requests
- Clear localStorage when testing authentication flows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
