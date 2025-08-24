'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { adminAPI } from '@/lib/api/admin';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  UsersIcon,
  CodeBracketIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Loader } from '@/components/common/Loader';
import { toast } from 'react-hot-toast';

interface AnalyticsData {
  userGrowth: Array<{
    _id: string;
    newUsers: number;
  }>;
  problemActivity: Array<{
    _id: string;
    problemsSolved: number;
    problemsAttempted: number;
    totalTimeSpent: number;
  }>;
  topicEngagement: Array<{
    _id: string;
    topicName: string;
    totalActivity: number;
    completedCount: number;
    avgTimeSpent: number;
    completionRate: number;
  }>;
  difficultyDistribution: Array<{
    _id: string;
    totalAttempts: number;
    completedCount: number;
    avgTimeSpent: number;
    completionRate: number;
  }>;
}

export default function Analytics() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;
    fetchAnalytics();
  }, [mounted, user, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics(period);
      setAnalyticsData(response.data.data || {
        userGrowth: [],
        problemActivity: [],
        topicEngagement: [],
        difficultyDistribution: []
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data - API not available');
      // Set empty data to prevent errors
      setAnalyticsData({
        userGrowth: [],
        problemActivity: [],
        topicEngagement: [],
        difficultyDistribution: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateGrowth = (data: any[]) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-7).reduce((sum, item) => sum + item.newUsers, 0);
    const previous = data.slice(-14, -7).reduce((sum, item) => sum + item.newUsers, 0);
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
  };

  if (!mounted || loading || !analyticsData) {
    return <Loader fullScreen />;
  }

  const userGrowthRate = calculateGrowth(analyticsData.userGrowth || []);
  const totalNewUsers = (analyticsData.userGrowth || []).reduce((sum, item) => sum + item.newUsers, 0);
  const totalProblemsSolved = (analyticsData.problemActivity || []).reduce((sum, item) => sum + item.problemsSolved, 0);
  const totalProblemsAttempted = (analyticsData.problemActivity || []).reduce((sum, item) => sum + item.problemsAttempted, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Platform Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive insights into platform usage and trends
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Administrator
            </span>
          </div>
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
                New Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalNewUsers}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UsersIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {userGrowthRate >= 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />
            )}
            <span className={userGrowthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              {Math.abs(userGrowthRate).toFixed(1)}% from previous period
            </span>
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
                Problems Solved
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalProblemsSolved}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <CodeBracketIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            {totalProblemsAttempted} total attempts
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
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalProblemsAttempted > 0 ? Math.round((totalProblemsSolved / totalProblemsAttempted) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600 dark:text-purple-400">
            <ClockIcon className="h-4 w-4 mr-1" />
            Average engagement
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
                Active Topics
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analyticsData.topicEngagement.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600 dark:text-orange-400">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            Most engaged topics
          </div>
        </motion.div>
      </div>

      {/* Topic Engagement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Topic Engagement
        </h3>
        <div className="space-y-4">
          {(analyticsData.topicEngagement || []).map((topic) => (
            <div key={topic._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {topic.topicName}
                </h4>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {topic.totalActivity} activities
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {topic.completedCount} completed
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {formatTime(topic.avgTimeSpent)} avg time
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

      {/* Difficulty Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Difficulty Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(analyticsData.difficultyDistribution || []).map((difficulty) => (
            <div key={difficulty._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                  {difficulty._id}
                </h4>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {difficulty.totalAttempts} attempts
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {difficulty.completedCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {Math.round(difficulty.completionRate)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Avg Time:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {formatTime(difficulty.avgTimeSpent)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${difficulty.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* User Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Growth Trend
        </h3>
        <div className="space-y-3">
          {(analyticsData.userGrowth || []).map((day) => (
            <div key={day._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(day._id)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{day.newUsers}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  new users
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
