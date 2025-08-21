import Link from 'next/link';
import { motion } from 'framer-motion';
import { Topic } from '@/types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {
  CodeBracketIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface TopicCardProps {
  topic: Topic;
  viewMode: 'grid' | 'list';
  progress?: number;
}

export default function TopicCard({ topic, viewMode, progress = 0 }: TopicCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/topics/${topic.slug}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <CodeBracketIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {topic.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {topic.totalProblems}
                </p>
                <p className="text-xs text-gray-500">Problems</p>
              </div>
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={progress}
                  text={`${Math.round(progress)}%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: '#7c3aed',
                    textColor: '#7c3aed',
                  })}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/topics/${topic.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer h-full"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <CodeBracketIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
            {topic.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {topic.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {topic.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <ChartBarIcon className="h-4 w-4" />
            <span>{topic.totalProblems} problems</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{topic.estimatedHours}h</span>
          </div>
        </div>

        {progress > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}