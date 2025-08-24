'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchUserProgress, fetchRecentActivity, fetchStats, fetchStreak, fetchAchievements, fetchAllUserProgress } from '@/store/slices/progressSlice';
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
import toast from 'react-hot-toast';

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
  totalAttempted: number;
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
  console.log('=== REDUX STATE DEBUG ===');
  console.log('statistics:', statistics);
  console.log('statistics.data:', statistics?.data);
  console.log('statistics.completionStats:', statistics?.completionStats);
  console.log('statistics.data?.completionStats:', statistics?.data?.completionStats);
  console.log('userProgress:', userProgress);
  console.log('userProgress.length:', userProgress.length);
  console.log('achievements:', achievements);
  console.log('streak:', streak);
  console.log('=== END DEBUG ===');

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
    totalTopics: 0,
    totalAttempted: 0,
  });
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    console.log('🔄 Fetching progress data for user:', user.email);

    // Fetch all progress data
    const fetchProgressData = async () => {
      try {
        console.log('📊 Starting to fetch progress data...');
        
        // Fetch user progress first (this contains the main data)
        await dispatch(fetchUserProgress()).unwrap();
        console.log('✅ fetchUserProgress completed');
        
        // Fetch additional data
        await Promise.all([
          dispatch(fetchAllUserProgress()).unwrap(),
          dispatch(fetchRecentActivity(10)).unwrap(),
          dispatch(fetchStats()).unwrap(),
          dispatch(fetchStreak()).unwrap(),
          dispatch(fetchAchievements()).unwrap(),
        ]);
        
        console.log('✅ All progress data fetched successfully');
      } catch (error) {
        console.error('❌ Failed to fetch progress data:', error);
      }
    };

    fetchProgressData();
  }, [dispatch, mounted, user]);

  // Refresh progress data when component mounts to ensure latest data
  useEffect(() => {
    if (mounted && user) {
      // Force refresh to get the latest progress data
      dispatch(fetchAllUserProgress());
      dispatch(fetchUserProgress());
    }
  }, [dispatch, mounted, user]);

  // Update stats when data is loaded
  useEffect(() => {
    if (statistics) {
      console.log('📊 Processing statistics:', statistics);
      
      try {
        // The data is nested under statistics.data
        const completionStats = statistics.data?.completionStats;
        const userStats = statistics.data?.userStats;
        
        console.log('📈 Completion stats:', completionStats);
        console.log('👤 User stats:', userStats);
        
        if (completionStats && userStats) {
          // Calculate total time spent from userStats
          const totalTimeSpent = userStats.totalTimeSpent || 0;
          
          // Calculate accuracy from completion stats
          const accuracy = completionStats.percentage || 0;
          
          // Calculate total attempted from completion stats
          const totalAttempted = completionStats.attempted || 0;
          
          const newStats = {
            totalSolved: userStats.totalSolved || 0,
            easySolved: userStats.easySolved || 0,
            mediumSolved: userStats.mediumSolved || 0,
            hardSolved: userStats.hardSolved || 0,
            streak: userStats.streak || 0,
            longestStreak: userStats.longestStreak || 0,
            totalTimeSpent: totalTimeSpent,
            accuracy: accuracy,
            topicsCompleted: topicProgress.filter(t => t.percentage === 100).length,
            totalTopics: topicProgress.length,
            totalAttempted: totalAttempted,
          };
          
          console.log('📊 Setting new stats:', newStats);
          setStats(newStats);
        }
      } catch (error) {
        console.error('❌ Error processing statistics:', error);
        console.log('Statistics object:', statistics);
      }
    }
  }, [statistics, topicProgress]);

  // Update topic progress when data is loaded
  useEffect(() => {
    if (statistics?.data?.topicProgress) {
      console.log('📚 Processing topic progress from statistics.data.topicProgress:', statistics.data.topicProgress);
      try {
        const topicProgressData = statistics.data.topicProgress;
        if (Array.isArray(topicProgressData)) {
          const mappedTopics = topicProgressData.map((topic) => ({
            topic: topic.topicName,
            slug: topic.topicSlug,
            total: topic.total,
            completed: topic.completed,
            attempted: topic.attempted,
            percentage: topic.percentage,
          }));
          console.log('📚 Mapped topic progress:', mappedTopics);
          setTopicProgress(mappedTopics);
        }
      } catch (error) {
        console.error('❌ Error processing topic progress:', error);
        setTopicProgress([]);
      }
    }
  }, [statistics]);

  // Update recent activity when data is loaded
  useEffect(() => {
    if (statistics?.data?.recentActivity) {
      console.log('🕒 Processing recent activity from statistics.data.recentActivity:', statistics.data.recentActivity);
      const recentActivityData = statistics.data.recentActivity;
      if (Array.isArray(recentActivityData)) {
        const mappedActivity = recentActivityData.map((activity: any) => ({
          _id: activity._id,
          problemTitle: activity.problemTitle || 'Unknown Problem',
          topic: activity.topic || 'Unknown Topic',
          status: activity.status,
          date: activity.date || activity.updatedAt || activity.createdAt,
          timeSpent: activity.timeSpent || 0,
        }));
        console.log('🕒 Mapped recent activity:', mappedActivity);
        setRecentActivity(mappedActivity);
      }
    } else if (userProgress && userProgress.length > 0) {
      console.log('🕒 Using userProgress for recent activity:', userProgress);
      const mappedActivity = userProgress.slice(0, 10).map((activity: any) => ({
        _id: activity._id,
        problemTitle: activity.problemTitle || 'Unknown Problem',
        topic: activity.topic || 'Unknown Topic',
        status: activity.status,
        date: activity.date || activity.updatedAt || activity.createdAt,
        timeSpent: activity.timeSpent || 0,
      }));
      setRecentActivity(mappedActivity);
    }
  }, [statistics, userProgress]);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Progress
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your learning journey and celebrate your achievements
              </p>
            </div>
            <button
              onClick={async () => {
                try {
                  await Promise.all([
                    dispatch(fetchUserProgress()),
                    dispatch(fetchAllUserProgress()),
                    dispatch(fetchStats()),
                    dispatch(fetchStreak())
                  ]);
                  toast.success('Progress data refreshed!');
                } catch (error) {
                  toast.error('Failed to refresh progress data');
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Completion Summary */}
        {statistics?.data?.completionStats ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
                  <p className="text-primary-100">
                    {statistics.data.completionStats.completed} problems completed • {statistics.data.completionStats.attempted} attempted • {statistics.data.completionStats.total} total problems
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{statistics.data.completionStats.percentage}%</div>
                  <div className="text-primary-100">Completion Rate</div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
                  <p className="text-primary-100">Loading your progress data...</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">0%</div>
                  <div className="text-primary-100">Completion Rate</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

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
                <p className="text-blue-200 text-sm">
                  {stats.easySolved} Easy • {stats.mediumSolved} Medium • {stats.hardSolved} Hard
                </p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-blue-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Total Attempted</p>
                <p className="text-3xl font-bold">{stats.totalAttempted}</p>
                <p className="text-yellow-200 text-sm">
                  Problems in progress
                </p>
              </div>
              <ExclamationTriangleIcon className="h-12 w-12 text-yellow-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Current Streak</p>
                <p className="text-3xl font-bold">{stats.streak} days</p>
                <p className="text-green-200 text-sm">
                  Longest: {stats.longestStreak} days
                </p>
              </div>
              <FireIcon className="h-12 w-12 text-green-200" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Time Spent</p>
                <p className="text-3xl font-bold">
                  {stats.totalTimeSpent >= 60 
                    ? `${Math.round(stats.totalTimeSpent / 60)}h ${stats.totalTimeSpent % 60}m`
                    : `${stats.totalTimeSpent}m`
                  }
                </p>
                <p className="text-orange-200 text-sm">
                  {recentActivity.length} activities
                </p>
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
              
              {/* Difficulty Breakdown */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.easySolved}</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Easy</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mediumSolved}</div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">Medium</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.hardSolved}</div>
                  <div className="text-sm text-red-600 dark:text-red-400">Hard</div>
                </div>
              </div>
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
                {topicProgress.length > 0 ? (
                  topicProgress.map((topic, index) => (
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
                          className={`h-2 rounded-full transition-all duration-300 ${
                            topic.percentage === 100 
                              ? 'bg-green-500' 
                              : topic.percentage >= 50 
                                ? 'bg-yellow-500' 
                                : 'bg-primary-500'
                          }`}
                          style={{ width: `${topic.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{topic.percentage}% complete</span>
                        <span>{topic.attempted} attempted</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No topic progress yet</p>
                    <p className="text-sm text-gray-400">Start solving problems to see your progress!</p>
                  </div>
                )}
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
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(activity.status)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.problemTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.topic} • {activity.timeSpent > 0 ? `${activity.timeSpent} min` : 'No time recorded'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                  <p className="text-sm text-gray-400">Start solving problems to see your activity!</p>
                </div>
              )}
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
