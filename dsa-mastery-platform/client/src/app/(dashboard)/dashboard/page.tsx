'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchTopics } from '@/store/slices/topicsSlice';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TopicGrid from '@/components/dashboard/TopicGrid';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import ProgressChart from '../../../components/dashboard/ProgressChart';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import { Loader } from '../../../components/common/Loader';
import { Progress } from '@/types';

// Mock data for recent activity
const mockRecentActivity: Progress[] = [
  {
    _id: '1',
    userId: 'user1',
    problemId: 'problem1',
    topicId: 'topic1',
    status: 'completed',
    notes: 'Solved using HashMap approach',
    code: '// Solution code here',
    language: 'JavaScript',
    timeSpent: 25,
    attempts: 1,
    lastAttemptDate: '2024-01-15T10:30:00Z',
    completedDate: '2024-01-15T10:30:00Z',
    confidence: 8,
    isBookmarked: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    userId: 'user1',
    problemId: 'problem2',
    topicId: 'topic2',
    status: 'completed',
    notes: 'Stack-based solution',
    code: '// Solution code here',
    language: 'JavaScript',
    timeSpent: 30,
    attempts: 2,
    lastAttemptDate: '2024-01-14T15:20:00Z',
    completedDate: '2024-01-14T15:20:00Z',
    confidence: 7,
    isBookmarked: false,
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z'
  },
  {
    _id: '3',
    userId: 'user1',
    problemId: 'problem3',
    topicId: 'topic3',
    status: 'attempted',
    notes: 'Need to review inorder traversal',
    code: '// Partial solution',
    language: 'JavaScript',
    timeSpent: 45,
    attempts: 3,
    lastAttemptDate: '2024-01-13T09:15:00Z',
    confidence: 4,
    isBookmarked: true,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  }
];

// Mock user progress for the chart
const mockUserProgress: Progress[] = [
  ...mockRecentActivity,
  // Add more mock data to make the chart more interesting
  {
    _id: '4',
    userId: 'user1',
    problemId: 'problem4',
    topicId: 'topic1',
    status: 'completed',
    notes: 'Two pointer approach',
    code: '// Solution code here',
    language: 'JavaScript',
    timeSpent: 20,
    attempts: 1,
    lastAttemptDate: '2024-01-12T14:00:00Z',
    completedDate: '2024-01-12T14:00:00Z',
    confidence: 9,
    isBookmarked: false,
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z'
  }
];

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
    
    // Fetch initial data
    dispatch(fetchTopics());
  }, [dispatch, mounted]);

  if (!mounted || topicsLoading) {
    return <Loader fullScreen />;
  }

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
            {getMotivationalMessage(user?.stats.totalSolved || 0)}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsOverview stats={user?.stats} />
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Progress & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProgressChart userProgress={mockUserProgress} />
            </motion.div>

            {/* Topic Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TopicGrid topics={topics} userProgress={mockUserProgress} loading={topicsLoading} />
            </motion.div>
          </div>

          {/* Right Column - Streak & Recent Activity */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RecentActivity activities={mockRecentActivity} />
            </motion.div>
          </div>
        </div>
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