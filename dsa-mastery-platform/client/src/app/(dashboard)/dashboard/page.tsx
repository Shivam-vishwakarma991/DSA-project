'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchTopics } from '@/store/slices/topicsSlice';
import { fetchUserProgress } from '@/store/slices/progressSlice';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TopicGrid from '@/components/dashboard/TopicGrid';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';
import ProgressChart from '../../../components/dashboard/ProgressChart';
import RecentActivity from '../../../components/dashboard/RecentActivity';
// import StreakTracker from '../../../components/dashboard/StreakTracker';
// import GuidedTour from '../../../components/features/GuidedTour';
import { Loader } from '../../../components/common/Loader';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { topics, loading: topicsLoading } = useSelector((state: RootState) => state.topics);
  const { userProgress, statistics, streak } = useSelector((state: RootState) => state.progress);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchTopics());
    if (user) {
      dispatch(fetchUserProgress(user.id));
      
      // Show tour for new users
      if (user.stats.totalSolved === 0) {
        setShowTour(true);
      }
    }
  }, [dispatch, user]);

  if (topicsLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Guided Tour for First-time Users */}
      {/* {showTour && <GuidedTour onComplete={() => setShowTour(false)} />} */}
      
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
              <ProgressChart userProgress={userProgress} />
            </motion.div>

            {/* Topic Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TopicGrid topics={topics} userProgress={userProgress} />
            </motion.div>
          </div>

          {/* Right Column - Streak & Recent Activity */}
          <div className="space-y-8">
            {/* Streak Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* <StreakTracker streak={streak} /> */}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RecentActivity activities={userProgress?.slice(0, 5)} />
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