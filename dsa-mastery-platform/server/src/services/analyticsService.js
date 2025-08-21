const logger = require('../utils/logger');

class AnalyticsService {
  async trackProblemAttempt(data) {
    try {
      // Log to analytics system (Google Analytics, Mixpanel, etc.)
      logger.info('Problem attempt tracked', data);
      
      // Store in database for custom analytics
      // This could be sent to a time-series database or analytics platform
      const event = {
        type: 'problem_attempt',
        userId: data.userId,
        problemId: data.problemId,
        topicId: data.topicId,
        status: data.status,
        difficulty: data.difficulty,
        timeSpent: data.timeSpent,
        timestamp: new Date(),
      };

      // In production, send to analytics service
      if (process.env.NODE_ENV === 'production') {
        // await this.sendToAnalyticsPlatform(event);
      }

      return event;
    } catch (error) {
      logger.error('Failed to track problem attempt:', error);
    }
  }

  async trackUserActivity(userId, action, metadata = {}) {
    try {
      const event = {
        type: 'user_activity',
        userId,
        action,
        metadata,
        timestamp: new Date(),
      };

      logger.info('User activity tracked', event);
      return event;
    } catch (error) {
      logger.error('Failed to track user activity:', error);
    }
  }

  async generateUserReport(userId, period = 'weekly') {
    try {
      // Generate analytics report for user
      const Progress = require('../models/Progress');
      const User = require('../models/User');

      const user = await User.findById(userId);
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case 'daily':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }

      const progressData = await Progress.aggregate([
        {
          $match: {
            userId,
            updatedAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalTime: { $sum: '$timeSpent' },
          },
        },
      ]);

      const topicsData = await Progress.aggregate([
        {
          $match: {
            userId,
            updatedAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$topicId',
            problemsSolved: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'topics',
            localField: '_id',
            foreignField: '_id',
            as: 'topic',
          },
        },
        { $unwind: '$topic' },
        {
          $project: {
            topicName: '$topic.title',
            problemsSolved: 1,
          },
        },
      ]);

      return {
        user: user.username,
        period,
        startDate,
        endDate,
        summary: {
          totalActivity: progressData.reduce((acc, item) => acc + item.count, 0),
          totalTimeSpent: progressData.reduce((acc, item) => acc + item.totalTime, 0),
          currentStreak: user.stats.streak,
        },
        progressBreakdown: progressData,
        topicsCovered: topicsData,
      };
    } catch (error) {
      logger.error('Failed to generate user report:', error);
      throw error;
    }
  }

  async getSystemMetrics() {
    try {
      const User = require('../models/User');
      const Progress = require('../models/Progress');
      const Problem = require('../models/Problem');

      const [
        totalUsers,
        activeUsers,
        totalProblems,
        totalProgress,
      ] = await Promise.all([
        User.countDocuments({ isActive: true }),
        User.countDocuments({
          isActive: true,
          'stats.lastActiveDate': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
        Problem.countDocuments({ isActive: true }),
        Progress.countDocuments(),
      ]);

      return {
        totalUsers,
        activeUsers,
        totalProblems,
        totalProgress,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Failed to get system metrics:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();