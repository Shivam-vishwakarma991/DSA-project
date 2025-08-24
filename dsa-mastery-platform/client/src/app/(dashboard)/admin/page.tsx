'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { adminAPI } from '@/lib/api/admin';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  CodeBracketIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  FireIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Loader } from '@/components/common/Loader';
import { toast } from 'react-hot-toast';

interface AdminDashboardData {
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
}

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getDashboard();
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
        toast.error('Failed to load dashboard data - API not available');
        // Set empty data to prevent errors
        setDashboardData({
          overview: {
            totalUsers: 0,
            activeUsers: 0,
            totalProblems: 0,
            totalTopics: 0,
            totalProgressRecords: 0,
            completedProblems: 0,
            attemptedProblems: 0
          },
          userMetrics: {
            avgProblemsSolved: 0,
            avgStreak: 0,
            avgTimeSpent: 0,
            totalTimeSpent: 0
          },
          recentUsers: [],
          mostActiveUsers: [],
          topicPopularity: [],
          dailyActivity: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [mounted, user]);

  if (!mounted || loading || !dashboardData) {
    return <Loader fullScreen />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.fullName || user?.username}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Administrator
          </span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardData.overview.totalUsers}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            {dashboardData.overview.activeUsers} active this week
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Problems
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardData.overview.totalProblems}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CodeBracketIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            {dashboardData.overview.completedProblems} completed
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Topics
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardData.overview.totalTopics}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600 dark:text-purple-400">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            {dashboardData.overview.totalProgressRecords} attempts
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Problems Solved
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(dashboardData.userMetrics.avgProblemsSolved)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <FireIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600 dark:text-orange-400">
            <ClockIcon className="h-4 w-4 mr-1" />
            {formatTime(dashboardData.userMetrics.avgTimeSpent)} avg time
          </div>
        </motion.div>
      </div>

      {/* Recent Users and Most Active Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Users
          </h3>
          <div className="space-y-3">
            {(dashboardData.recentUsers || []).map((user) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {user.fullName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {user.role}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Most Active Users
          </h3>
          <div className="space-y-3">
            {(dashboardData.mostActiveUsers || []).map((user, index) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.stats.totalSolved} solved
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    {user.stats.streak} day streak
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Topic Popularity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Topic Popularity
        </h3>
        <div className="space-y-4">
          {(dashboardData.topicPopularity || []).map((topic) => (
            <div key={topic._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {topic.topicName}
                </h4>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {topic.totalAttempts} attempts
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {topic.completedCount} completed
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(topic.completionRate)}%
                </div>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full mt-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${topic.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
            <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Manage Users
            </span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors">
            <BookOpenIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-600 dark:text-green-400">
              Manage Topics
            </span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">
            <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-purple-600 dark:text-purple-400">
              View Analytics
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
