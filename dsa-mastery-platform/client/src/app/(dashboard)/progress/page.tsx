'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserProgress, fetchRecentActivity, fetchStats, fetchStreak, fetchAchievements } from '@/store/slices/progressSlice';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  FireIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import ProgressChart from '@/components/dashboard/ProgressChart';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';

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
  const dispatch = useDispatch<AppDispatch>();
  const { userProgress, statistics, streak, achievements, loading } = useSelector((state: RootState) => state.progress);

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    // Fetch all progress data
    const fetchProgressData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUserProgress()).unwrap(),
          dispatch(fetchRecentActivity(10)).unwrap(),
          dispatch(fetchStats()).unwrap(),
          dispatch(fetchStreak()).unwrap(),
          dispatch(fetchAchievements()).unwrap(),
        ]);
      } catch (error) {
        console.error('Failed to fetch progress data:', error);
      }
    };

    fetchProgressData();
  }, [dispatch, mounted, user]);

  // Update stats when data is loaded
  useEffect(() => {
    if (user && statistics) {
      console.log('📊 Progress Data Loaded:', {
        userStats: user.stats,
        statistics,
        userProgress: userProgress.length,
        topicProgress: topicProgress.length,
        achievements: achievements.length,
        achievementsData: achievements
      });
      
      setStats({
        totalSolved: user.stats.totalSolved,
        easySolved: user.stats.easySolved,
        mediumSolved: user.stats.mediumSolved,
        hardSolved: user.stats.hardSolved,
        streak: user.stats.streak,
        longestStreak: user.stats.longestStreak,
        totalTimeSpent: user.stats.totalTimeSpent,
        accuracy: userProgress.length > 0 
          ? Math.round((userProgress.filter(p => p.status === 'completed').length / userProgress.length) * 100)
          : 0,
        topicsCompleted: topicProgress.filter(t => t.percentage === 100).length,
        totalTopics: topicProgress.length,
      });
    }
  }, [user, statistics, userProgress, topicProgress]);

  // Update topic progress when data is loaded
  useEffect(() => {
    if (statistics && 'topicProgress' in statistics) {
      const topics = statistics.topicProgress || [];
      setTopicProgress(topics.map((topic: any) => ({
        topic: topic.topicName || topic.topic,
        slug: topic.topicSlug || topic.slug,
        total: topic.total || 0,
        completed: topic.completed || 0,
        attempted: topic.attempted || 0,
        percentage: topic.percentage || 0,
      })));
    }
  }, [statistics]);

  // Update recent activity when data is loaded
  useEffect(() => {
    if (userProgress && userProgress.length > 0) {
      setRecentActivity(userProgress.slice(0, 10).map((activity: any) => ({
        _id: activity._id,
        problemTitle: activity.problemTitle || activity.problemId?.title || 'Unknown Problem',
        topic: activity.topic || activity.topicId?.title || 'Unknown Topic',
        status: activity.status,
        date: activity.date || activity.updatedAt || activity.createdAt,
        timeSpent: activity.timeSpent || 0,
      })));
    }
  }, [userProgress]);

  // Debug achievements data
  useEffect(() => {
    console.log('🏆 Achievements Data:', {
      achievements,
      achievementsLength: achievements?.length,
      unlockedAchievements: achievements?.filter((a: any) => a.unlocked)?.length
    });
  }, [achievements]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader fullScreen text="Loading your progress..." />
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
              {achievements && achievements.length > 0 ? (
                achievements
                  .filter((achievement: any) => achievement.unlocked)
                  .map((achievement: any, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <TrophyIcon className="h-8 w-8 text-yellow-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{achievement.name}</p>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No achievements unlocked yet</p>
                  <p className="text-sm text-gray-400">Keep solving problems to earn achievements!</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
