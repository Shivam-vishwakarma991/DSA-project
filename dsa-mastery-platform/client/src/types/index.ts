export interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar?: string;
    role: 'student' | 'admin' | 'moderator';
    bio?: string;
    preferences: {
      theme: 'light' | 'dark' | 'system';
      difficulty: string;
      dailyGoal: number;
      emailNotifications: boolean;
    };
    stats: {
      totalSolved: number;
      easySolved: number;
      mediumSolved: number;
      hardSolved: number;
      streak: number;
      longestStreak: number;
      lastActiveDate: string;
      totalTimeSpent: number;
    };
    profileCompletion?: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Topic {
    _id: string;
    title: string;
    slug: string;
    description: string;
    icon?: string;
    order: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    totalProblems: number;
    estimatedHours: number;
    prerequisites?: string[];
    resources: Resource[];
    tags?: string[];
    problems?: Problem[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Problem {
    _id: string;
    topicId: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    order: number;
    tags: string[];
    companies?: string[];
    frequency?: number;
    links: {
      leetcode?: string;
      codeforces?: string;
      youtube?: string;
      article?: string;
      solution?: string;
      editorial?: string;
    };
    hints?: string[];
    estimatedTime: number;
    concepts?: string[];
    userStatus?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Progress {
    _id: string;
    userId: string;
    problemId: string;
    topicId: string;
    status: 'pending' | 'attempted' | 'completed' | 'revisit';
    notes?: string;
    code?: string;
    language?: string;
    timeSpent: number;
    attempts: number;
    lastAttemptDate: string;
    completedDate?: string;
    confidence?: number;
    isBookmarked: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Resource {
    type: 'video' | 'article' | 'book' | 'course';
    title: string;
    url: string;
    isPremium: boolean;
    author?: string;
    duration?: number;
  }
  
  export interface UserStats {
    completionStats: {
      _id: string;
      count: number;
      avgTime: number;
      avgConfidence: number;
    }[];
    topicProgress: {
      topic: string;
      slug: string;
      total: number;
      completed: number;
      attempted: number;
      percentage: number;
    }[];
    recentActivity: Progress[];
    userStats: User['stats'];
  }
  
  export interface StreakInfo {
    current: number;
    longest: number;
    lastActiveDate: string;
    streakDates: string[];
    gapDays: number;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }