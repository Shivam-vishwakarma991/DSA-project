'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchTopics } from '@/store/slices/topicsSlice';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TopicGrid from '@/components/dashboard/TopicGrid';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import { Loader } from '../../../components/common/Loader';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  FireIcon, 
  ClockIcon,
  BookOpenIcon,
  StarIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { topics, loading: topicsLoading } = useSelector((state: RootState) => state.topics);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Only fetch topics for the dashboard
    dispatch(fetchTopics());
  }, [dispatch, mounted]);

  if (!mounted || topicsLoading) {
    return <Loader fullScreen />;
  }

  // Hardcoded dashboard stats for demonstration
  const dashboardStats = {
    totalSolved: 15,
    easySolved: 8,
    mediumSolved: 5,
    hardSolved: 2,
    streak: 7,
    longestStreak: 12,
    totalTimeSpent: 45,
    lastActiveDate: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <DashboardHeader user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {getMotivationalMessage(dashboardStats.totalSolved)}
          </p>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Problems Solved */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Problems Solved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalSolved}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.streak} days</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <FireIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Time Spent */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalTimeSpent}h</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Topics Covered */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Topics Covered</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{topics.length}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Learning Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Your Learning Goals</h2>
                <p className="text-primary-100 mb-4">
                  Master DSA fundamentals and build a strong problem-solving foundation
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FlagIcon className="h-4 w-4" />
                    <span>Target: 100 problems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-4 w-4" />
                    <span>Current: {dashboardStats.totalSolved}/100</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{Math.round((dashboardStats.totalSolved / 100) * 100)}%</div>
                <div className="text-primary-100 text-sm">Goal Progress</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Topic Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TopicGrid 
            topics={topics} 
            userProgress={[]} 
            loading={topicsLoading} 
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
                    <BookOpenIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Start Learning</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pick a topic to begin</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                    <TrophyIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">View Progress</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">See your achievements</p>
                  </div>
                </div>
              </button>
              
              <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left">
                <div className="flex items-center gap-3">
                                     <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                     <FlagIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                   </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Set Goals</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track your targets</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getMotivationalMessage(solved: number): string {
  if (solved === 0) return "Start your journey today! Pick a topic and solve your first problem.";
  if (solved < 10) return "Great start! Keep the momentum going.";
  if (solved < 50) return "You're making excellent progress! Consistency is key.";
  if (solved < 100) return "Impressive dedication! You're well on your way to mastery.";
  if (solved < 200) return "Outstanding work! You're becoming a problem-solving expert.";
  return "You're a DSA champion! Keep pushing your limits.";
}