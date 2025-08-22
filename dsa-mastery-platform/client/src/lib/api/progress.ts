import api from './index';
import { Progress, UserStats, StreakInfo } from '@/types';

export const progressAPI = {
  getUserProgress: (userId: string, params?: { 
    topicId?: string; 
    status?: string; 
    sort?: string 
  }) => 
    api.get<Progress[]>('/progress', { params }),

  updateProgress: (data: {
    problemId: string;
    topicId?: string;
    status: string;
    timeSpent?: number;
    notes?: string;
    confidence?: number;
    code?: string;
    language?: string;
  }) => 
    api.post<Progress>('/progress/update', data),

  getStats: () => 
    api.get<UserStats>('/progress/stats'),

  getStreak: () => 
    api.get<StreakInfo>('/progress/streak'),

  getActivityHeatmap: (year?: number) => 
    api.get('/progress/activity', { params: { year } }),

  getLeaderboard: (period: 'daily' | 'weekly' | 'monthly' | 'all' = 'all', limit = 10) => 
    api.get('/progress/leaderboard', { params: { period, limit } }),

  resetProgress: (problemId: string) => 
    api.delete(`/progress/reset/${problemId}`),
};
