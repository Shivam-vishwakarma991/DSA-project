import { motion } from 'framer-motion';
import Link from 'next/link';
import { Topic, Progress } from '@/types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
  CodeBracketIcon,
  CpuChipIcon,
  CircleStackIcon,
  ShareIcon,
  ChartBarIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline';

interface TopicGridProps {
  topics: Topic[];
  userProgress: Progress[];
  loading?: boolean;
  statistics?: any;
}

const topicIcons: { [key: string]: any } = {
  'arrays': CodeBracketIcon,
  'linked-lists': ShareIcon,
  'stacks-queues': CircleStackIcon,
  'trees': ShareIcon,
  'graphs': ShareIcon,
  'dynamic-programming': CpuChipIcon,
  'sorting': ChartBarIcon,
  'searching': PuzzlePieceIcon,
};

export default function TopicGrid({ topics, userProgress, loading = false, statistics }: TopicGridProps) {
  // Add null checks and default values
  const safeTopics = topics || [];
  const safeUserProgress = userProgress || [];
  const safeStatistics = statistics || {};

  const getTopicProgress = (topicId: string, topicSlug: string) => {
    // First try to get progress from statistics
    if (safeStatistics.topicProgress && Array.isArray(safeStatistics.topicProgress)) {
      const topicProgress = safeStatistics.topicProgress.find((tp: any) => tp.topicSlug === topicSlug);
      if (topicProgress) {
        return ((topicProgress.completed + topicProgress.attempted) / topicProgress.total) * 100;
      }
    }
    
    // Fallback to calculating from user progress
    const topicProblems = safeUserProgress.filter(p => p.topicId === topicId);
    const completed = topicProblems.filter(p => p.status === 'completed').length;
    const attempted = topicProblems.filter(p => p.status === 'attempted').length;
    const total = safeTopics.find(t => t._id === topicId)?.totalProblems || 1;
    
    // Return progress as percentage of attempted + completed problems
    return ((completed + attempted) / total) * 100;
  };

  const getCompletedCount = (topicId: string, topicSlug: string) => {
    // First try to get from statistics
    if (safeStatistics.topicProgress && Array.isArray(safeStatistics.topicProgress)) {
      const topicProgress = safeStatistics.topicProgress.find((tp: any) => tp.topicSlug === topicSlug);
      if (topicProgress) {
        return topicProgress.completed;
      }
    }
    
    // Fallback to user progress
    const topicProblems = safeUserProgress.filter(p => p.topicId === topicId);
    return topicProblems.filter(p => p.status === 'completed').length;
  };

  const getAttemptedCount = (topicId: string, topicSlug: string) => {
    // First try to get from statistics
    if (safeStatistics.topicProgress && Array.isArray(safeStatistics.topicProgress)) {
      const topicProgress = safeStatistics.topicProgress.find((tp: any) => tp.topicSlug === topicSlug);
      if (topicProgress) {
        return topicProgress.attempted;
      }
    }
    
    // Fallback to user progress
    const topicProblems = safeUserProgress.filter(p => p.topicId === topicId);
    return topicProblems.filter(p => p.status === 'attempted').length;
  };

  const getTotalProblems = (topicId: string, topicSlug: string) => {
    // First try to get from statistics
    if (safeStatistics.topicProgress && Array.isArray(safeStatistics.topicProgress)) {
      const topicProgress = safeStatistics.topicProgress.find((tp: any) => tp.topicSlug === topicSlug);
      if (topicProgress) {
        return topicProgress.total;
      }
    }
    
    // Fallback to topic data
    return safeTopics.find(t => t._id === topicId)?.totalProblems || 0;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-emerald-600';
      case 'Intermediate': return 'from-yellow-500 to-orange-600';
      case 'Advanced': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Learning Topics
        </h2>
        <Link
          href="/topics"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))
        ) : safeTopics.length === 0 ? (
          // Empty state
          <div className="col-span-2 text-center py-8">
            <CodeBracketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No topics available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Topics will appear here once they're loaded.
            </p>
          </div>
        ) : (
          safeTopics.slice(0, 6).map((topic, index) => {
          const progress = getTopicProgress(topic._id, topic.slug);
          const completed = getCompletedCount(topic._id, topic.slug);
          const attempted = getAttemptedCount(topic._id, topic.slug);
          const total = getTotalProblems(topic._id, topic.slug);
          const Icon = topicIcons[topic.slug] || CodeBracketIcon;
          
          return (
            <motion.div
              key={topic._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 hover:shadow-lg transition-all duration-200 group"
            >
              <Link href={`/topics/${topic.slug}`} className="block">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {topic.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(topic.difficulty)} text-white`}>
                          {topic.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {total} problems
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8">
                          <CircularProgressbar
                            value={progress}
                            strokeWidth={8}
                            styles={buildStyles({
                              strokeLinecap: 'round',
                              pathColor: progress > 0 ? '#10b981' : '#6b7280',
                              trailColor: '#e5e7eb',
                            })}
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            {Math.round(progress)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {completed + attempted}/{total}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        }))}
      </div>
    </div>
  );
}