import api from './instance';

interface LeaderboardEntry {
  _id: string;
  rank: number;
  username: string;
  avatar: string;
  role: string;
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    streak: number;
    longestStreak: number;
    totalTimeSpent: number;
    accuracy: number;
  };
  achievements: string[];
  isCurrentUser: boolean;
}

export const leaderboardAPI = {
  // Get leaderboard
  getLeaderboard: (params?: {
    period?: 'all-time' | 'monthly' | 'weekly';
    category?: 'problems' | 'streak' | 'accuracy' | 'time';
    limit?: number;
    page?: number;
  }) => 
    api.get<{ success: boolean; data: LeaderboardEntry[]; total: number }>('/leaderboard', { params }),

  // Get user's rank
  getUserRank: (params?: {
    period?: 'all-time' | 'monthly' | 'weekly';
    category?: 'problems' | 'streak' | 'accuracy' | 'time';
  }) => 
    api.get<{ success: boolean; data: { rank: number; total: number } }>('/leaderboard/rank', { params }),

  // Get achievements
  getAchievements: () => 
    api.get<{ success: boolean; data: any[] }>('/leaderboard/achievements'),

  // Get leaderboard stats
  getLeaderboardStats: () => 
    api.get<{ success: boolean; data: any }>('/leaderboard/stats'),
};
