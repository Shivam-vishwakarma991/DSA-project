import api from './instance';
import { Progress, UserStats, StreakInfo } from '../../types';

export const progressAPI = {
  // Get user's overall progress
  getUserProgress: () => 
    api.get<{ success: boolean; data: UserStats }>('/progress/user'),

  // Get progress for a specific topic
  getTopicProgress: (topicId: string) => 
    api.get<{ success: boolean; data: Progress[] }>(`/progress/topic/${topicId}`),

  // Update problem progress
  updateProblemProgress: (problemId: string, data: {
    status: 'pending' | 'attempted' | 'completed' | 'revisit';
    notes?: string;
    code?: string;
    language?: string;
    timeSpent: number;
    confidence?: number;
    isBookmarked?: boolean;
  }) => 
    api.put<{ success: boolean; data: Progress }>(`/progress/problem/${problemId}`, data),

  // Get user's streak information
  getStreakInfo: () => 
    api.get<{ success: boolean; data: StreakInfo }>('/progress/streak'),

  // Get recent activity
  getRecentActivity: (limit?: number) => 
    api.get<{ success: boolean; data: Progress[] }>(`/progress/recent?limit=${limit || 10}`),

  // Get topic completion stats
  getTopicStats: () => 
    api.get<{ success: boolean; data: any }>('/progress/topics'),

  // Get achievements
  getAchievements: () => 
    api.get<{ success: boolean; data: any[] }>('/progress/achievements'),
};
