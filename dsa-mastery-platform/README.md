# DSA Mastery Platform

A comprehensive Data Structures and Algorithms learning platform built with Next.js, Express.js, and MongoDB. The platform provides an interactive learning experience with progress tracking, problem management, and comprehensive analytics.

## 🚀 Features

### For Students
- **Interactive Learning**: Solve DSA problems with real-time feedback
- **Progress Tracking**: Monitor your learning journey with detailed statistics
- **Topic-based Learning**: Organized learning paths by DSA concepts
- **Time Tracking**: Track time spent on each problem
- **Achievement System**: Unlock achievements based on your progress
- **Personal Dashboard**: View your statistics, streaks, and recent activity
- **Responsive Design**: Learn on any device with mobile-friendly interface

### For Admins
- **Comprehensive Dashboard**: Platform-wide statistics and analytics
- **User Management**: Manage all users, roles, and permissions
- **Content Management**: Create, edit, and manage topics and problems
- **Analytics**: Detailed platform usage analytics and user engagement
- **Settings Management**: Configure platform settings and preferences
- **Real-time Monitoring**: Track user activity and platform health

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Custom components with Heroicons
- **Animations**: Framer Motion
- **Authentication**: JWT-based authentication

### Backend (Express.js)
- **Framework**: Express.js
- **Language**: JavaScript (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Validation**: Custom validation middleware
- **Error Handling**: Centralized error handling
- **Logging**: Winston logger

## 📁 Project Structure

```
dsa-mastery-platform/
├── client/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── (auth)/              # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   └── forgot-password/
│   │   │   ├── (dashboard)/         # Main dashboard pages
│   │   │   │   ├── dashboard/       # User dashboard
│   │   │   │   ├── topics/          # Topics listing and detail
│   │   │   │   ├── progress/        # Progress tracking
│   │   │   │   ├── leaderboard/     # User rankings
│   │   │   │   ├── community/       # Community features
│   │   │   │   ├── settings/        # User settings
│   │   │   │   └── admin/           # Admin pages
│   │   │   │       ├── dashboard/   # Admin dashboard
│   │   │   │       ├── users/       # User management
│   │   │   │       ├── analytics/   # Platform analytics
│   │   │   │       └── settings/    # Admin settings
│   │   │   └── api/                 # API routes
│   │   ├── components/              # Reusable components
│   │   │   ├── common/              # Common UI components
│   │   │   ├── dashboard/           # Dashboard-specific components
│   │   │   ├── features/            # Feature-specific components
│   │   │   └── layout/              # Layout components
│   │   ├── lib/                     # Utilities and configurations
│   │   │   ├── api/                 # API client functions
│   │   │   ├── hooks/               # Custom React hooks
│   │   │   ├── utils/               # Utility functions
│   │   │   └── constants/           # Application constants
│   │   ├── store/                   # Redux store
│   │   │   ├── slices/              # Redux slices
│   │   │   └── index.ts             # Store configuration
│   │   ├── styles/                  # Global styles
│   │   └── types/                   # TypeScript type definitions
│   ├── public/                      # Static assets
│   └── package.json
├── server/                          # Backend (Express.js)
│   ├── src/
│   │   ├── controllers/             # Route controllers
│   │   ├── models/                  # MongoDB models
│   │   ├── routes/                  # API routes
│   │   ├── middleware/              # Custom middleware
│   │   ├── services/                # Business logic services
│   │   ├── utils/                   # Utility functions
│   │   ├── config/                  # Configuration files
│   │   └── app.js                   # Express app setup
│   ├── scripts/                     # Database seeding scripts
│   ├── logs/                        # Application logs
│   └── package.json
├── shared/                          # Shared types and constants
├── docker-compose.yml               # Docker configuration
├── Dockerfile                       # Frontend Dockerfile
├── Dockerfile.backend               # Backend Dockerfile
└── README.md
```

## 🔧 Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **Framer Motion**: Animation library
- **Heroicons**: Icon library
- **React Hot Toast**: Toast notifications
- **Axios**: HTTP client

### Backend
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Winston**: Logging
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **AWS EC2**: Cloud deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dsa-mastery-platform
```

2. **Install dependencies**
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

3. **Environment Setup**
```bash
# Copy environment files
cp .env.example .env
```

4. **Database Setup**
```bash
# Start MongoDB
mongod

# Seed the database
cd server
node scripts/seed.js
```

5. **Start Development Servers**
```bash
# Backend (Terminal 1)
cd server
npm run dev

# Frontend (Terminal 2)
cd client
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📊 Database Schema

### Users
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  role: String (student/moderator/admin),
  stats: {
    totalSolved: Number,
    easySolved: Number,
    mediumSolved: Number,
    hardSolved: Number,
    streak: Number,
    longestStreak: Number,
    totalTimeSpent: Number,
    lastActiveDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Topics
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,
  description: String,
  estimatedHours: Number,
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Problems
```javascript
{
  _id: ObjectId,
  topicId: ObjectId,
  title: String,
  description: String,
  difficulty: String (Easy/Medium/Hard),
  order: Number,
  tags: [String],
  companies: [String],
  links: {
    leetcode: String,
    youtube: String,
    article: String
  },
  hints: [String],
  estimatedTime: Number,
  frequency: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Progress
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  problemId: ObjectId,
  topicId: ObjectId,
  status: String (pending/attempted/completed/revisit),
  timeSpent: Number,
  confidence: Number,
  notes: String,
  code: String,
  language: String,
  isBookmarked: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication & Authorization

### JWT Authentication
- Token-based authentication
- Secure password hashing with bcrypt
- Role-based access control (RBAC)

### User Roles
- **Student**: Access to learning features
- **Moderator**: Content management + student features
- **Admin**: Full platform access

## 📈 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/me` - Get current user

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:slug` - Get topic details
- `POST /api/topics` - Create topic (admin)
- `PUT /api/topics/:id` - Update topic (admin)
- `DELETE /api/topics/:id` - Delete topic (admin)

### Problems
- `GET /api/topics/:slug/problems` - Get topic problems
- `POST /api/topics/problems` - Create problem (admin)
- `PUT /api/topics/problems/:id` - Update problem (admin)
- `DELETE /api/topics/problems/:id` - Delete problem (admin)

### Progress
- `GET /api/progress/user` - Get user progress
- `GET /api/progress/topic/:slug/detailed` - Get detailed topic progress
- `PUT /api/progress/problem/:problemId` - Update problem progress

### Admin (Admin only)
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user details
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/analytics` - Platform analytics

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blue, gray tones, semantic colors
- **Typography**: Consistent font hierarchy
- **Spacing**: 8px grid system
- **Components**: Reusable, accessible components

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interactions

### Dark Mode
- System preference detection
- Manual theme toggle
- Consistent theming across components

## 🔧 Development Features

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Git Hooks**: Pre-commit checks

### Performance
- **Next.js Optimization**: Automatic code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Component and route lazy loading
- **Caching**: API response caching

### Security
- **Input Validation**: Server-side validation
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Cross-site request forgery protection
- **Rate Limiting**: API rate limiting

## 🚀 Deployment

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5001

# Backend (.env)
PORT=5001
MONGODB_URI=mongodb://localhost:27017/dsa-mastery
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

### Production Build
```bash
# Frontend
cd client
npm run build
npm start

# Backend
cd server
npm run build
npm start
```

### Docker Deployment
```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📊 Monitoring & Analytics

### User Analytics
- Problem completion rates
- Time spent per topic
- User engagement metrics
- Learning progress tracking

### Platform Analytics
- User growth trends
- Topic popularity
- System performance metrics
- Error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Real-time Collaboration**: Live coding sessions
- **AI-powered Hints**: Intelligent problem-solving assistance
- **Mobile App**: Native mobile application
- **Advanced Analytics**: Machine learning insights
- **Community Features**: Forums and discussions
- **Integration**: Third-party platform integrations
