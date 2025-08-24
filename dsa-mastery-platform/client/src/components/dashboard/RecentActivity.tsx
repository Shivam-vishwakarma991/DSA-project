import { motion } from 'framer-motion';
import { Progress } from '@/types';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowPathIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { Loader } from '@/components/common/Loader';

interface RecentActivityProps {
  activities: Progress[] | undefined;
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'attempted':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'revisit':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'attempted':
        return 'Attempted';
      case 'revisit':
        return 'Marked for revisit';
      default:
        return 'Started';
    }
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No recent activity
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Start solving problems to see your activity here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <Link
          href="/progress"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 5).map((activity, index) => (
          <motion.div
            key={activity._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(activity.status)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Problem #{activity.problemId.slice(-4)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getStatusText(activity.status)} • {getTimeAgo(activity.lastAttemptDate)}
                </p>
                {activity.timeSpent > 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Time spent: {activity.timeSpent} min
                  </p>
                )}
              </div>
            </div>
            <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}