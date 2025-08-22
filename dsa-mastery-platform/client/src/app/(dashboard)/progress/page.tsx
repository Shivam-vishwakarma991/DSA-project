'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  FireIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import  ProgressChart  from '@/components/dashboard/ProgressChart';
import { Card } from '@/components/common/Card';

interface ProgressStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streak: number;
  longestStreak: number;
  totalTimeSpent: number;
  accuracy: number;
  topicsCompleted: number;
  totalTopics: number;
}

interface TopicProgress {
  topic: string;
  slug: string;
  total: number;
  completed: number;
  attempted: number;
  percentage: number;
}

interface RecentActivity {
  _id: string;
  problemTitle: string;
  topic: string;
  status: 'completed' | 'attempted' | 'pending';
  date: string;
  timeSpent: number;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProgressStats>({
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    streak: 0,
    longestStreak: 0,
    totalTimeSpent: 0,
    accuracy: 0,
    topicsCompleted: 0,
    totalTopics: 50,
  });
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, you would fetch this data from the API
      setStats({
        totalSolved: user.stats.totalSolved,
        easySolved: user.stats.easySolved,
        mediumSolved: user.stats.mediumSolved,
        hardSolved: user.stats.hardSolved,
        streak: user.stats.streak,
        longestStreak: user.stats.longestStreak,
        totalTimeSpent: user.stats.totalTimeSpent,
        accuracy: 85, // Mock data
        topicsCompleted: 12, // Mock data
        totalTopics: 50,
      });

      // Mock topic progress data
      setTopicProgress([
        { topic: 'Arrays', slug: 'arrays', total: 15, completed: 12, attempted: 14, percentage: 80 },
        { topic: 'Strings', slug: 'strings', total: 12, completed: 8, attempted: 10, percentage: 67 },
        { topic: 'Linked Lists', slug: 'linked-lists', total: 10, completed: 6, attempted: 8, percentage: 60 },
        { topic: 'Trees', slug: 'trees', total: 18, completed: 5, attempted: 7, percentage: 28 },
        { topic: 'Graphs', slug: 'graphs', total: 20, completed: 3, attempted: 5, percentage: 15 },
      ]);

      // Mock recent activity
      setRecentActivity([
        { _id: '1', problemTitle: 'Two Sum', topic: 'Arrays', status: 'completed', date: '2024-01-15', timeSpent: 25 },
        { _id: '2', problemTitle: 'Valid Parentheses', topic: 'Stacks', status: 'completed', date: '2024-01-14', timeSpent: 30 },
        { _id: '3', problemTitle: 'Binary Tree Inorder Traversal', topic: 'Trees', status: 'attempted', date: '2024-01-13', timeSpent: 45 },
        { _id: '4', problemTitle: 'Merge Two Sorted Lists', topic: 'Linked Lists', status: 'completed', date: '2024-01-12', timeSpent: 20 },
        { _id: '5', problemTitle: 'Valid Anagram', topic: 'Strings', status: 'completed', date: '2024-01-11', timeSpent: 15 },
      ]);

      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'attempted':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <BookmarkIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning journey and celebrate your achievements
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Solved</p>
                <p className="text-3xl font-bold">{stats.totalSolved}</p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Current Streak</p>
                <p className="text-3xl font-bold">{stats.streak} days</p>
              </div>
              <FireIcon className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Accuracy</p>
                <p className="text-3xl font-bold">{stats.accuracy}%</p>
              </div>
              <TrophyIcon className="h-12 w-12 text-purple-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Time Spent</p>
                <p className="text-3xl font-bold">{Math.round(stats.totalTimeSpent / 60)}h</p>
              </div>
              <ClockIcon className="h-12 w-12 text-orange-200" />
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Progress Overview
              </h3>
              <ProgressChart
                easySolved={stats.easySolved}
                mediumSolved={stats.mediumSolved}
                hardSolved={stats.hardSolved}
              />
            </Card>
          </motion.div>

          {/* Topic Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Topic Progress
              </h3>
              <div className="space-y-4">
                {topicProgress.map((topic, index) => (
                  <div key={topic.slug} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {topic.topic}
                      </span>
                      <span className="text-sm text-gray-500">
                        {topic.completed}/{topic.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.problemTitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.topic} • {activity.timeSpent} min
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <TrophyIcon className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">First Problem</p>
                  <p className="text-sm text-gray-500">Solved your first problem</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FireIcon className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">7-Day Streak</p>
                  <p className="text-sm text-gray-500">Maintained a 7-day solving streak</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">50 Problems</p>
                  <p className="text-sm text-gray-500">Solved 50 problems</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
