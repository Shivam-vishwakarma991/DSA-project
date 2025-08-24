import api from './instance';

export const adminAPI = {
  // Dashboard statistics
  getDashboard: () =>
    api.get<{ success: boolean; data: {
      overview: {
        totalUsers: number;
        activeUsers: number;
        totalProblems: number;
        totalTopics: number;
        totalProgressRecords: number;
        completedProblems: number;
        attemptedProblems: number;
      };
      userMetrics: {
        avgProblemsSolved: number;
        avgStreak: number;
        avgTimeSpent: number;
        totalTimeSpent: number;
      };
      recentUsers: Array<{
        _id: string;
        username: string;
        email: string;
        fullName: string;
        role: string;
        stats: {
          lastActiveDate: string;
        };
        createdAt: string;
      }>;
      mostActiveUsers: Array<{
        _id: string;
        username: string;
        email: string;
        fullName: string;
        stats: {
          totalSolved: number;
          streak: number;
        };
      }>;
      topicPopularity: Array<{
        _id: string;
        topicName: string;
        totalAttempts: number;
        completedCount: number;
        completionRate: number;
      }>;
      dailyActivity: Array<{
        _id: string;
        count: number;
      }>;
    } }>('/admin/dashboard'),

  // Get all users
  getAllUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) =>
    api.get<{ success: boolean; data: {
      users: Array<{
        _id: string;
        username: string;
        email: string;
        fullName: string;
        role: string;
        stats: {
          totalSolved: number;
          easySolved: number;
          mediumSolved: number;
          hardSolved: number;
          streak: number;
          longestStreak: number;
          totalTimeSpent: number;
          lastActiveDate: string;
        };
        createdAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    } }>('/admin/users', { params }),

  // Get user details
  getUserDetails: (userId: string) =>
    api.get<{ success: boolean; data: {
      user: {
        _id: string;
        username: string;
        email: string;
        fullName: string;
        role: string;
        stats: {
          totalSolved: number;
          easySolved: number;
          mediumSolved: number;
          hardSolved: number;
          streak: number;
          longestStreak: number;
          totalTimeSpent: number;
          lastActiveDate: string;
        };
        createdAt: string;
      };
      progress: {
        total: number;
        completed: number;
        attempted: number;
        percentage: number;
        totalTimeSpent: number;
        avgConfidence: number;
      };
      topicProgress: Array<{
        _id: string;
        topicName: string;
        topicSlug: string;
        total: number;
        completed: number;
        attempted: number;
        percentage: number;
      }>;
      recentActivity: Array<{
        _id: string;
        problemTitle: string;
        problemDifficulty: string;
        topic: string;
        status: string;
        date: string;
        timeSpent: number;
        confidence: number;
      }>;
      activityTimeline: Array<{
        _id: string;
        problemsSolved: number;
        problemsAttempted: number;
        timeSpent: number;
      }>;
    } }>(`/admin/users/${userId}`),

  // Update user role
  updateUserRole: (userId: string, role: string) =>
    api.put<{ success: boolean; data: any }>(`/admin/users/${userId}/role`, { role }),

  // Delete user
  deleteUser: (userId: string) =>
    api.delete<{ success: boolean; message: string }>(`/admin/users/${userId}`),

  // Get platform analytics
  getAnalytics: (period?: number) =>
    api.get<{ success: boolean; data: {
      userGrowth: Array<{
        _id: string;
        newUsers: number;
      }>;
      problemActivity: Array<{
        _id: string;
        problemsSolved: number;
        problemsAttempted: number;
        totalTimeSpent: number;
      }>;
      topicEngagement: Array<{
        _id: string;
        topicName: string;
        totalActivity: number;
        completedCount: number;
        avgTimeSpent: number;
        completionRate: number;
      }>;
      difficultyDistribution: Array<{
        _id: string;
        totalAttempts: number;
        completedCount: number;
        avgTimeSpent: number;
        completionRate: number;
      }>;
    } }>('/admin/analytics', { params: { period } }),
};
