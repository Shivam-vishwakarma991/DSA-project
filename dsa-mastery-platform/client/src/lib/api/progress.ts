import api from './instance';
import { Progress, UserStats, StreakInfo } from '../../types';

export const progressAPI = {
  // Get user's overall progress with comprehensive stats
  getUserProgress: () => 
    api.get<{ success: boolean; data: {
      completionStats: {
        total: number;
        completed: number;
        attempted: number;
        percentage: number;
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
        topic: string;
        status: string;
        date: string;
        timeSpent: number;
      }>;
      userStats: {
        totalSolved: number;
        easySolved: number;
        mediumSolved: number;
        hardSolved: number;
        streak: number;
        longestStreak: number;
        totalTimeSpent: number;
        lastActiveDate: string;
      };
    } }>('/progress/user'),

  getTopicDetailedProgress: (slug: string) =>
    api.get<{ success: boolean; data: {
      topic: any;
      problems: Array<any>;
      progress: {
        total: number;
        completed: number;
        attempted: number;
        pending: number;
        percentage: number;
      };
    } }>(`/progress/topic/${slug}/detailed`),

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

  // Get all user progress records
  getAllUserProgress: () => 
    api.get<{ success: boolean; data: Progress[] }>('/progress/all'),

  // Get topic completion stats
  getTopicStats: () => 
    api.get<{ success: boolean; data: any }>('/progress/topics'),

  // Get achievements
  getAchievements: () => 
    api.get<{ success: boolean; data: any[] }>('/progress/achievements'),
};
