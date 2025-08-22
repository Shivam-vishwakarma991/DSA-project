import { useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Tab } from '@headlessui/react';
import { ChartBarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ProgressChartProps {
  userProgress?: Progress[];
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
}

export default function ProgressChart({ 
  userProgress = [], 
  easySolved, 
  mediumSolved, 
  hardSolved 
}: ProgressChartProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  // Ensure userProgress is always an array
  const safeUserProgress = userProgress || [];

  // Use provided difficulty stats or calculate from userProgress
  const difficultyStats = {
    easy: easySolved ?? Math.floor((safeUserProgress.filter(p => p.status === 'completed').length * 0.6) || 5),
    medium: mediumSolved ?? Math.floor((safeUserProgress.filter(p => p.status === 'completed').length * 0.3) || 3),
    hard: hardSolved ?? Math.floor((safeUserProgress.filter(p => p.status === 'completed').length * 0.1) || 1),
  };

  // Process data for weekly progress
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map(day => ({
      day,
      problems: Math.floor(Math.random() * 5) + 1, // Mock data - replace with actual
      time: Math.floor(Math.random() * 120) + 30,
    }));
    return weekData;
  };

  // Process data for difficulty distribution
  const getDifficultyData = () => {
    return [
      { name: 'Easy', value: difficultyStats.easy, color: '#10b981' },
      { name: 'Medium', value: difficultyStats.medium, color: '#f59e0b' },
      { name: 'Hard', value: difficultyStats.hard, color: '#ef4444' },
    ];
  };

  // Process data for monthly trend
  const getMonthlyTrend = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      completed: Math.floor(Math.random() * 30) + 10,
      attempted: Math.floor(Math.random() * 20) + 5,
    }));
  };

  const weeklyData = getWeeklyData();
  const difficultyData = getDifficultyData();
  const monthlyData = getMonthlyTrend();

  // Calculate summary stats
  const completedThisWeek = safeUserProgress.filter(p => p.status === 'completed').length;
  const totalTimeSpent = safeUserProgress.reduce((acc, p) => acc + (p.timeSpent || 0), 0);
  const successRate = safeUserProgress.length > 0 
    ? Math.round((completedThisWeek / safeUserProgress.length) * 100)
    : 85; // Default success rate

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ChartBarIcon className="h-6 w-6 text-primary-500" />
          Progress Analytics
        </h2>
        
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            <Tab
              className={({ selected }) =>
                `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selected
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`
              }
            >
              Weekly
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selected
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`
              }
            >
              Difficulty
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selected
                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`
              }
            >
              Trend
            </Tab>
          </Tab.List>
        </Tab.Group>
      </div>

      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-64"
      >
        {selectedTab === 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="problems" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {selectedTab === 1 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}

        {selectedTab === 2 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
              <YAxis tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="attempted"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <CalendarIcon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {completedThisWeek}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
        </div>
        <div className="text-center">
          <ClockIcon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(totalTimeSpent / 60)}h
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Time Spent</p>
        </div>
        <div className="text-center">
          <ChartBarIcon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {successRate}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Success Rate</p>
        </div>
      </div>
    </div>
  );
}