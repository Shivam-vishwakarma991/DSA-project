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

export default function TopicGrid({ topics, userProgress }: TopicGridProps) {
  const getTopicProgress = (topicId: string) => {
    const topicProblems = userProgress.filter(p => p.topicId === topicId);
    const completed = topicProblems.filter(p => p.status === 'completed').length;
    const total = topics.find(t => t._id === topicId)?.totalProblems || 1;
    return (completed / total) * 100;
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
        {topics.slice(0, 6).map((topic, index) => {
          const progress = getTopicProgress(topic._id);
          const Icon = topicIcons[topic.slug] || CodeBracketIcon;
          
          return (
            <motion.div
              key={topic._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Link href={`/topics/${topic.slug}`}>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all cursor-pointer group">
                  {/* Progress Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12">
                    <CircularProgressbar
                      value={progress}
                      text={`${Math.round(progress)}%`}
                      styles={buildStyles({
                        textSize: '28px',
                        pathColor: progress === 100 ? '#10b981' : '#7c3aed',
                        textColor: '#7c3aed',
                        trailColor: '#e5e7eb',
                      })}
                    />
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${getDifficultyColor(topic.difficulty)} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {topic.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {topic.totalProblems} problems
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            topic.difficulty === 'Beginner' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : topic.difficulty === 'Intermediate'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {topic.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}