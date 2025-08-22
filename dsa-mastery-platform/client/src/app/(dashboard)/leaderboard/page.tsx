'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  TrophyIcon, 
  FireIcon, 
  StarIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/common/Card';

interface LeaderboardEntry {
  _id: string;
  rank: number;
  username: string;
  avatar: string;
  role: string;
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    streak: number;
    longestStreak: number;
    totalTimeSpent: number;
    accuracy: number;
  };
  achievements: string[];
  isCurrentUser: boolean;
}

interface LeaderboardFilter {
  period: 'all-time' | 'monthly' | 'weekly';
  category: 'problems' | 'streak' | 'accuracy' | 'time';
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<LeaderboardFilter>({
    period: 'all-time',
    category: 'problems'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setLeaderboard([
      {
        _id: 'user1',
        rank: 1,
        username: 'dsa_master',
        avatar: 'https://ui-avatars.com/api/?name=DSA+Master&background=FFD700&color=000',
        role: 'moderator',
        stats: {
          totalSolved: 342,
          easySolved: 120,
          mediumSolved: 156,
          hardSolved: 66,
          streak: 45,
          longestStreak: 67,
          totalTimeSpent: 2840,
          accuracy: 92
        },
        achievements: ['First Place', '100 Problems', '30 Day Streak'],
        isCurrentUser: false
      },
      {
        _id: 'user2',
        rank: 2,
        username: 'alex_coder',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Coder&background=C0C0C0&color=000',
        role: 'student',
        stats: {
          totalSolved: 298,
          easySolved: 98,
          mediumSolved: 134,
          hardSolved: 66,
          streak: 23,
          longestStreak: 45,
          totalTimeSpent: 2156,
          accuracy: 89
        },
        achievements: ['Second Place', '50 Problems', '20 Day Streak'],
        isCurrentUser: false
      },
      {
        _id: 'user3',
        rank: 3,
        username: 'code_ninja',
        avatar: 'https://ui-avatars.com/api/?name=Code+Ninja&background=CD7F32&color=fff',
        role: 'student',
        stats: {
          totalSolved: 267,
          easySolved: 89,
          mediumSolved: 123,
          hardSolved: 55,
          streak: 18,
          longestStreak: 34,
          totalTimeSpent: 1890,
          accuracy: 87
        },
        achievements: ['Third Place', '25 Problems', '15 Day Streak'],
        isCurrentUser: false
      },
      {
        _id: 'user4',
        rank: 4,
        username: 'algorithm_whiz',
        avatar: 'https://ui-avatars.com/api/?name=Algorithm+Whiz&background=7C3AED&color=fff',
        role: 'student',
        stats: {
          totalSolved: 234,
          easySolved: 76,
          mediumSolved: 108,
          hardSolved: 50,
          streak: 12,
          longestStreak: 28,
          totalTimeSpent: 1654,
          accuracy: 85
        },
        achievements: ['10 Problems', '10 Day Streak'],
        isCurrentUser: false
      },
      {
        _id: 'user5',
        rank: 5,
        username: 'problem_solver',
        avatar: 'https://ui-avatars.com/api/?name=Problem+Solver&background=10B981&color=fff',
        role: 'student',
        stats: {
          totalSolved: 198,
          easySolved: 67,
          mediumSolved: 89,
          hardSolved: 42,
          streak: 8,
          longestStreak: 22,
          totalTimeSpent: 1432,
          accuracy: 83
        },
        achievements: ['5 Problems', '5 Day Streak'],
        isCurrentUser: false
      }
    ]);

    // Mark current user if they exist in the leaderboard
    if (user) {
      setLeaderboard(prev => prev.map(entry => ({
        ...entry,
        isCurrentUser: entry.username === user.username
      })));
    }

    setLoading(false);
  }, [user]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <TrophyIcon className="h-6 w-6 text-gray-400" />;
      case 3:
        return <TrophyIcon className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryValue = (entry: LeaderboardEntry, category: string) => {
    switch (category) {
      case 'problems':
        return entry.stats.totalSolved;
      case 'streak':
        return entry.stats.streak;
      case 'accuracy':
        return entry.stats.accuracy;
      case 'time':
        return Math.round(entry.stats.totalTimeSpent / 60);
      default:
        return entry.stats.totalSolved;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'problems':
        return 'Problems Solved';
      case 'streak':
        return 'Current Streak';
      case 'accuracy':
        return 'Accuracy %';
      case 'time':
        return 'Hours Spent';
      default:
        return 'Problems Solved';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

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
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            See how you rank among the top DSA learners
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <div className="flex flex-wrap gap-4">
              {/* Period Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={filter.period}
                  onChange={(e) => setFilter({ ...filter, period: e.target.value as any })}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all-time">All Time</option>
                  <option value="monthly">This Month</option>
                  <option value="weekly">This Week</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value as any })}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="problems">Problems Solved</option>
                  <option value="streak">Current Streak</option>
                  <option value="accuracy">Accuracy</option>
                  <option value="time">Time Spent</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Second Place */}
            {leaderboard[1] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <img
                    src={leaderboard[1].avatar}
                    alt={leaderboard[1].username}
                    className="w-20 h-20 rounded-full border-4 border-gray-300"
                  />
                  <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {leaderboard[1].username}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {getCategoryValue(leaderboard[1], filter.category)} {getCategoryLabel(filter.category)}
                </p>
              </motion.div>
            )}

            {/* First Place */}
            {leaderboard[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <img
                    src={leaderboard[0].avatar}
                    alt={leaderboard[0].username}
                    className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <TrophyIcon className="absolute -top-4 left-1/2 transform -translate-x-1/2 h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {leaderboard[0].username}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {getCategoryValue(leaderboard[0], filter.category)} {getCategoryLabel(filter.category)}
                </p>
              </motion.div>
            )}

            {/* Third Place */}
            {leaderboard[2] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <img
                    src={leaderboard[2].avatar}
                    alt={leaderboard[2].username}
                    className="w-20 h-20 rounded-full border-4 border-amber-600"
                  />
                  <div className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {leaderboard[2].username}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {getCategoryValue(leaderboard[2], filter.category)} {getCategoryLabel(filter.category)}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Full Rankings
            </h3>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-700'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadge(entry.rank)}`}>
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {entry.username}
                          </h4>
                          {entry.isCurrentUser && (
                            <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full">
                              You
                            </span>
                          )}
                          {entry.role === 'moderator' && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full">
                              Moderator
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{entry.stats.totalSolved} problems</span>
                          <span>•</span>
                          <span>{entry.stats.streak} day streak</span>
                          <span>•</span>
                          <span>{entry.stats.accuracy}% accuracy</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {getCategoryValue(entry, filter.category)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getCategoryLabel(filter.category)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboard.slice(0, 3).map((entry) => (
                <div key={entry._id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrophyIcon className="h-6 w-6 text-yellow-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {entry.username}
                    </h4>
                  </div>
                  <div className="space-y-1">
                    {entry.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
