import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  FireIcon, 
  ChartBarIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import CountUp from 'react-countup';

interface StatsOverviewProps {
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    streak: number;
    totalTimeSpent: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: 'Total Solved',
      value: stats.totalSolved,
      icon: TrophyIcon,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: 'Current Streak',
      value: stats.streak,
      suffix: ' days',
      icon: FireIcon,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
    {
      title: 'Success Rate',
      value: stats.totalSolved > 0 ? Math.round((stats.totalSolved / (stats.totalSolved + 10)) * 100) : 0,
      suffix: '%',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Time Spent',
      value: Math.round(stats.totalTimeSpent / 60),
      suffix: ' hrs',
      icon: ClockIcon,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {stat.title}
            </span>
          </div>
          
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            <CountUp
              end={stat.value}
              duration={2}
              separator=","
              suffix={stat.suffix || ''}
            />
          </div>
          
          <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-20`} />
        </motion.div>
      ))}
    </div>
  );
}